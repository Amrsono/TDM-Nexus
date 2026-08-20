import { PhaseId } from '../App';
import { ProjectState, AISettings, AISuggestion, AIMessage } from '../context/AIAssistantContext';
import { safeValidateAISettings } from './aiValidation';
import { logger } from './logger';

// ─── Result Pattern & Types ───────────────────────────────────────────────────

export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export interface AIError {
  code: string;
  message: string;
  statusCode?: number;
  friendlyMessage: string;
}

export type AIResult<T> = Result<T, AIError>;

import { AI_PROVIDERS, AIProviderAdapter, OpenAIMessage } from './aiProviders';

export type { AIProviderAdapter, OpenAIMessage };
export { AI_PROVIDERS };

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const buildSystemPrompt = (projectState: ProjectState, activePhase: PhaseId): string => {
  return `You are the TDM Nexus AI Assistant, an expert project manager and digital delivery expert for VOIS.
The current date is ${new Date().toLocaleDateString()}.
You are currently helping the user on the "${activePhase}" tab.
Here is the current state of the project:
- Overall Health: ${projectState.ragStatus.overall} (Schedule: ${projectState.ragStatus.schedule}, Budget: ${projectState.ragStatus.budget})
- Financials: NPV: ${projectState.financials.NPV}, Total Spent: ${projectState.financials.totalSpent}
- Budget Used: ${projectState.budgetProgressPercent}%
- QA SIT Pass Rate: ${projectState.sitProgressPercent}%
- Open High-Priority Defects: ${projectState.defects.filter(d => d.severity === 'P1' || d.severity === 'P2').length}
- Open Risks: ${projectState.risks.filter(r => r.status === 'Open').length}

Provide concise, actionable advice.`;
};

export const getOfflineSuggestions = (projectState: ProjectState, activePhase: PhaseId): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  if (projectState.sitProgressPercent < 80 && activePhase === 'testing') {
    suggestions.push({
      id: 's1',
      type: 'warning',
      title: 'Low SIT Pass Rate',
      description: `SIT Pass rate is currently ${projectState.sitProgressPercent}%. Focus on resolving blocked test cases.`,
      priority: 'high',
      relatedTab: 'testing',
      actionable: true,
    });
  }

  if (projectState.budgetProgressPercent > 90) {
    suggestions.push({
      id: 's2',
      type: 'warning',
      title: 'Budget Warning',
      description: `Budget consumption is at ${projectState.budgetProgressPercent}%. Consider reviewing CAPEX/OPEX allocations.`,
      priority: 'high',
      relatedTab: 'finances',
    });
  }

  const p1Defects = projectState.defects.filter((d) => d.severity === 'P1' && d.status !== 'Closed');
  if (p1Defects.length > 0) {
    suggestions.push({
      id: 's3',
      type: 'action',
      title: 'P1 Defects Open',
      description: `There are ${p1Defects.length} open P1 defects. Immediate attention required before release planning.`,
      priority: 'high',
      relatedTab: 'testing',
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: 's4',
      type: 'insight',
      title: 'Project on Track',
      description: 'Key metrics are healthy. Review upcoming milestones in the Build tab.',
      priority: 'low',
      relatedTab: 'build',
    });
  }

  return suggestions;
};

export function getEndpointUrl(settings: AISettings): string {
  const adapter = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.openai;
  return adapter.getEndpoint(settings);
}

export function getRequestHeaders(settings: AISettings): Record<string, string> {
  const adapter = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.openai;
  return adapter.getHeaders(settings);
}

export function buildRequestBody(
  settings: AISettings,
  messages: OpenAIMessage[],
  opts: { jsonMode?: boolean } = {}
): Record<string, unknown> {
  const adapter = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.openai;
  return adapter.formatRequestBody(settings, messages, opts);
}

export function extractTextFromResponse(settings: AISettings, data: Record<string, unknown>): string {
  const adapter = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.openai;
  return adapter.extractText(data);
}

async function parseFriendlyError(response: Response, provider: AISettings['provider']): Promise<AIError> {
  let body: Record<string, unknown> = {};
  try {
    body = await response.json();
  } catch {
    /* ignore parse errors */
  }

  const status = response.status;
  const rawMessage: string =
    ((body?.error as Record<string, unknown>)?.message as string) ||
    (body?.message as string) ||
    response.statusText ||
    'Unknown error';

  let friendlyMessage = `API Error ${status}: ${rawMessage}`;
  let code = `HTTP_${status}`;

  if (status === 429) {
    code = 'RATE_LIMITED';
    const retryMatch = rawMessage.match(/(\d+(\.\d+)?)s/);
    const retryHint = retryMatch ? ` Retry in ~${Math.ceil(Number(retryMatch[1]))} seconds.` : '';

    if (rawMessage.includes('free_tier') || rawMessage.includes('FreeTier') || rawMessage.includes('limit: 0')) {
      friendlyMessage = `⚠️ Gemini free-tier quota exhausted.${retryHint} To fix this: enable billing at https://aistudio.google.com/ or switch to a different model in Settings.`;
    } else {
      friendlyMessage = `⚠️ Rate limit reached.${retryHint} Please wait before sending another message.`;
    }
  } else if (status === 401 || status === 403) {
    code = 'AUTH_ERROR';
    friendlyMessage = `🔑 Authentication failed (${status}). Please check your API key in Settings — it may be invalid or expired.`;
  } else if (status === 404) {
    code = 'NOT_FOUND';
    const modelHint = provider === 'gemini' ? ' Try selecting a different Gemini model in Settings.' : '';
    friendlyMessage = `❌ Model or endpoint not found (404).${modelHint}`;
  } else if (status >= 500) {
    code = 'SERVER_ERROR';
    friendlyMessage = `🔥 The ${provider} API returned a server error (${status}). This is likely temporary — please try again shortly.`;
  }

  return {
    code,
    message: rawMessage,
    statusCode: status,
    friendlyMessage,
  };
}

// ─── Centralized Request Executor ─────────────────────────────────────────────

export async function executeAIRequest(
  settings: AISettings,
  messages: OpenAIMessage[],
  opts: { jsonMode?: boolean } = {}
): Promise<AIResult<string>> {
  const validated = safeValidateAISettings(settings);
  if (!validated.success || !settings.apiKey) {
    return {
      ok: false,
      error: {
        code: 'MISSING_CONFIG',
        message: 'AI Provider is not configured with a valid API key.',
        friendlyMessage: 'Offline Mode: Please configure an API key in Settings.',
      },
    };
  }

  const adapter = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.openai;
  const url = adapter.getEndpoint(settings);
  if (!url) {
    return {
      ok: false,
      error: {
        code: 'MISSING_URL',
        message: 'Endpoint URL could not be resolved.',
        friendlyMessage: 'Configuration Error: Missing endpoint URL.',
      },
    };
  }

  try {
    logger.debug('AIService', `Executing AI request via ${settings.provider}`, { model: settings.model });
    const response = await fetch(url, {
      method: 'POST',
      headers: adapter.getHeaders(settings),
      body: JSON.stringify(adapter.formatRequestBody(settings, messages, opts)),
    });

    if (!response.ok) {
      const err = await parseFriendlyError(response, settings.provider);
      logger.warn('AIService', `AI Request failed with status ${response.status}`, err);
      return { ok: false, error: err };
    }

    const data = await response.json();
    const text = adapter.extractText(data);
    return { ok: true, data: text };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error('AIService', 'Network or runtime error during AI call', errorObj);
    return {
      ok: false,
      error: {
        code: 'NETWORK_ERROR',
        message: errorObj.message,
        friendlyMessage: `Failed to connect to ${settings.provider}: ${errorObj.message}`,
      },
    };
  }
}

// ─── Public Workflows ─────────────────────────────────────────────────────────

export const getNextBestActions = async (
  projectState: ProjectState,
  activePhase: PhaseId,
  settings: AISettings
): Promise<AISuggestion[]> => {
  const result = await executeAIRequest(
    settings,
    [
      { role: 'system', content: buildSystemPrompt(projectState, activePhase) },
      {
        role: 'user',
        content:
          'Generate 3 next best actions based on the current project state. Return ONLY a JSON array of objects with keys: id, type (action/warning/insight/optimization), title, description, priority (high/medium/low), relatedTab.',
      },
    ],
    { jsonMode: true }
  );

  if (!result.ok) {
    return getOfflineSuggestions(projectState, activePhase);
  }

  try {
    const cleanText = result.data.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText) as AISuggestion[];
  } catch (err) {
    logger.warn('AIService', 'JSON parse failure for next best actions, falling back to offline suggestions', err);
    return getOfflineSuggestions(projectState, activePhase);
  }
};

export const chat = async (
  messages: AIMessage[],
  projectState: ProjectState,
  activePhase: PhaseId,
  settings: AISettings
): Promise<string> => {
  const systemPrompt = buildSystemPrompt(projectState, activePhase);
  const apiMessages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
  ];

  const result = await executeAIRequest(settings, apiMessages);
  if (result.ok) {
    return result.data;
  }

  if (result.error.code === 'MISSING_CONFIG') {
    return `Offline Mode: You asked "${messages[messages.length - 1]?.content}". Overall Health is ${projectState.ragStatus.overall}. (${projectState.budgetProgressPercent}% budget used, ${projectState.sitProgressPercent}% SIT pass rate). Configure an API key in Settings for AI responses.`;
  }

  return result.error.friendlyMessage;
};

export const generateReportAnalytics = async (
  projectState: ProjectState,
  reportType: 'ppt' | 'excel',
  settings?: AISettings
): Promise<string> => {
  if (!settings || !settings.apiKey) {
    return 'Offline Analysis: Project is tracking to overall RAG status. Please configure an AI provider for deep analytics.';
  }

  const openDefects = projectState.defects.filter((d) => d.status !== 'Closed');
  const openRisks = projectState.risks.filter((r) => r.status === 'Open');

  const prompt = `You are a project management executive at VOIS. Provide a detailed, professional AI analysis and executive recommendation summary:
- Overall Health RAG: ${projectState.ragStatus.overall} (Schedule: ${projectState.ragStatus.schedule}, Budget: ${projectState.ragStatus.budget})
- Budget Progress: ${projectState.budgetProgressPercent}% of CAPEX: $${projectState.financials.capexLimit} / OPEX: $${projectState.financials.opexLimit}
- QA SIT Pass Rate: ${projectState.sitProgressPercent}%
- Open Defects: ${openDefects.length}
- Open Risks: ${openRisks.length}

Format for a ${reportType === 'excel' ? 'spreadsheet report tab' : 'SteerCo deck slide'}.`;

  const result = await executeAIRequest(settings, [
    { role: 'system', content: `You are an executive project management assistant. Current date: ${new Date().toLocaleDateString()}.` },
    { role: 'user', content: prompt },
  ]);

  return result.ok ? result.data : `Failed to generate AI Analysis: ${result.error.friendlyMessage}`;
};

export const generatePredictiveAnalytics = async (
  projectState: ProjectState,
  settings: AISettings
): Promise<string> => {
  if (!settings.apiKey) {
    return `Offline Mode: Predictive Analytics requires an active AI provider. Based on current data, your project budget is ${projectState.budgetProgressPercent}% consumed, and SIT pass rate is ${projectState.sitProgressPercent}%.`;
  }

  const prompt = `You are a specialized AI Project Management Risk Assessor for VOIS:
- RAG: ${projectState.ragStatus.overall}
- Financials: Spent $${projectState.financials.totalSpent}
- Quality: SIT Pass Rate ${projectState.sitProgressPercent}%`;

  const result = await executeAIRequest(settings, [
    { role: 'system', content: 'You are an AI predictive risk analysis system.' },
    { role: 'user', content: prompt },
  ]);

  return result.ok ? result.data : `Failed to run Predictive Analytics: ${result.error.friendlyMessage}`;
};

export const generateSmartSchedule = async (
  projectState: ProjectState,
  settings: AISettings
): Promise<string> => {
  if (!settings.apiKey) {
    return 'Offline Mode: Smart Scheduling requires an active AI provider. Please assign unallocated squad members manually.';
  }

  const prompt = `Smart Scheduling AI for VOIS: Squads: ${projectState.squads.map((s) => s.name).join(', ')}`;
  const result = await executeAIRequest(settings, [
    { role: 'system', content: 'You are an AI resource allocator.' },
    { role: 'user', content: prompt },
  ]);

  return result.ok ? result.data : `Failed to run Smart Scheduling: ${result.error.friendlyMessage}`;
};

export const generateDocumentation = async (
  projectState: ProjectState,
  docType: string,
  customPrompt: string,
  settings: AISettings
): Promise<string> => {
  if (!settings.apiKey) {
    return 'Offline Mode: Documentation generation requires an active AI provider.';
  }

  const prompt = `Generate a ${docType} based on current project data and prompt: "${customPrompt}"`;
  const result = await executeAIRequest(settings, [
    { role: 'system', content: 'You are an AI documentation generator.' },
    { role: 'user', content: prompt },
  ]);

  return result.ok ? result.data : `Failed to generate Documentation: ${result.error.friendlyMessage}`;
};
