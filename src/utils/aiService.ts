import { PhaseId } from '../App';
import { ProjectState, AISettings, AISuggestion, AIMessage } from '../context/AIAssistantContext';

export const buildSystemPrompt = (projectState: ProjectState, activePhase: PhaseId): string => {
  return `You are the TDM Nexus AI Assistant, an expert project manager and digital delivery expert for Vodafone.
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

const getOfflineSuggestions = (projectState: ProjectState, activePhase: PhaseId): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  
  if (projectState.sitProgressPercent < 80 && activePhase === 'testing') {
    suggestions.push({
      id: 's1',
      type: 'warning',
      title: 'Low SIT Pass Rate',
      description: `SIT Pass rate is currently ${projectState.sitProgressPercent}%. Focus on resolving blocked test cases.`,
      priority: 'high',
      relatedTab: 'testing',
      actionable: true
    });
  }
  
  if (projectState.budgetProgressPercent > 90) {
    suggestions.push({
      id: 's2',
      type: 'warning',
      title: 'Budget Warning',
      description: `Budget consumption is at ${projectState.budgetProgressPercent}%. Consider reviewing CAPEX/OPEX allocations.`,
      priority: 'high',
      relatedTab: 'finances'
    });
  }

  const p1Defects = projectState.defects.filter(d => d.severity === 'P1' && d.status !== 'Closed');
  if (p1Defects.length > 0) {
    suggestions.push({
      id: 's3',
      type: 'action',
      title: 'P1 Defects Open',
      description: `There are ${p1Defects.length} open P1 defects. Immediate attention required before release planning.`,
      priority: 'high',
      relatedTab: 'testing'
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: 's4',
      type: 'insight',
      title: 'Project on Track',
      description: 'Key metrics are healthy. Review upcoming milestones in the Build tab.',
      priority: 'low',
      relatedTab: 'build'
    });
  }

  return suggestions;
};

// ─── Provider-specific helpers ───────────────────────────────────────────────

function getEndpointUrl(settings: AISettings): string {
  switch (settings.provider) {
    case 'gemini':
      return `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`;
    case 'anthropic':
      return 'https://api.anthropic.com/v1/messages';
    case 'custom':
      return settings.baseUrl || '';
    case 'openai':
    default:
      return 'https://api.openai.com/v1/chat/completions';
  }
}

function getRequestHeaders(settings: AISettings): Record<string, string> {
  const base: Record<string, string> = { 'Content-Type': 'application/json' };
  switch (settings.provider) {
    case 'gemini':
      return base; // key is in the URL
    case 'anthropic':
      return { ...base, 'x-api-key': settings.apiKey, 'anthropic-version': '2023-06-01' };
    case 'openai':
    case 'custom':
    default:
      return { ...base, 'Authorization': `Bearer ${settings.apiKey}` };
  }
}

interface OpenAIMessage { role: string; content: string; }

function buildRequestBody(
  settings: AISettings,
  messages: OpenAIMessage[],
  opts: { jsonMode?: boolean } = {}
): object {
  switch (settings.provider) {
    case 'gemini': {
      // Gemini uses a different schema
      const systemMsg = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');
      return {
        system_instruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
        contents: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: settings.temperature,
          maxOutputTokens: settings.maxTokens,
          ...(opts.jsonMode ? { responseMimeType: 'application/json' } : {})
        }
      };
    }
    case 'anthropic': {
      const systemMsg = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');
      return {
        model: settings.model,
        max_tokens: settings.maxTokens,
        ...(systemMsg ? { system: systemMsg.content } : {}),
        messages: userMessages.map(m => ({ role: m.role, content: m.content }))
      };
    }
    case 'openai':
    case 'custom':
    default:
      return {
        model: settings.model,
        messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        ...(opts.jsonMode ? { response_format: { type: 'json_object' } } : {})
      };
  }
}

function extractTextFromResponse(settings: AISettings, data: Record<string, unknown>): string {
  switch (settings.provider) {
    case 'gemini': {
      const candidates = data.candidates as Array<{ content: { parts: Array<{ text: string }> } }>;
      return candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }
    case 'anthropic': {
      const content = data.content as Array<{ text: string }>;
      return content?.[0]?.text ?? '';
    }
    case 'openai':
    case 'custom':
    default: {
      const choices = data.choices as Array<{ message: { content: string } }>;
      return choices?.[0]?.message?.content ?? '';
    }
  }
}

// ─── Error helpers ────────────────────────────────────────────────────────────

/**
 * Converts raw API error responses into concise, human-readable messages.
 * Handles quota exhaustion, auth errors, model-not-found, and generic failures.
 */
async function parseFriendlyError(response: Response, provider: AISettings['provider']): Promise<string> {
  let body: Record<string, unknown> = {};
  try { body = await response.json(); } catch { /* ignore parse errors */ }

  const status = response.status;

  // Extract the core message from the provider's error schema
  const rawMessage: string =
    (body?.error as Record<string, unknown>)?.message as string ||
    (body?.message as string) ||
    response.statusText ||
    'Unknown error';

  if (status === 429) {
    // Extract retry delay if present
    const retryMatch = rawMessage.match(/(\d+(\.\d+)?)s/);
    const retryHint = retryMatch ? ` Retry in ~${Math.ceil(Number(retryMatch[1]))} seconds.` : '';

    if (rawMessage.includes('free_tier') || rawMessage.includes('FreeTier') || rawMessage.includes('limit: 0')) {
      return `⚠️ Gemini free-tier quota exhausted.${retryHint} To fix this: enable billing at https://ai.dev/rate-limit, or switch to a different model (e.g. Gemini 1.5 Flash) in Settings.`;
    }
    return `⚠️ Rate limit reached.${retryHint} Please wait before sending another message.`;
  }

  if (status === 401 || status === 403) {
    return `🔑 Authentication failed (${status}). Please check your API key in Settings — it may be invalid or expired.`;
  }

  if (status === 404) {
    const modelHint = provider === 'gemini' ? ' Try selecting a different Gemini model in Settings.' : '';
    return `❌ Model or endpoint not found (404).${modelHint}`;
  }

  if (status >= 500) {
    return `🔥 The ${provider} API returned a server error (${status}). This is likely temporary — please try again shortly.`;
  }

  // Trim the raw message to avoid giant JSON dumps in the chat
  const trimmed = rawMessage.length > 200 ? rawMessage.slice(0, 200) + '…' : rawMessage;
  return `API Error ${status}: ${trimmed}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const getNextBestActions = async (
  projectState: ProjectState, 
  activePhase: PhaseId,
  settings: AISettings
): Promise<AISuggestion[]> => {
  if (!settings.apiKey) {
    return getOfflineSuggestions(projectState, activePhase);
  }

  try {
    const systemPrompt = buildSystemPrompt(projectState, activePhase);
    const url = getEndpointUrl(settings);
    if (!url) return getOfflineSuggestions(projectState, activePhase);

    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate 3 next best actions based on the current project state. Return ONLY a JSON array of objects with keys: id, type (action/warning/insight/optimization), title, description, priority (high/medium/low), relatedTab.' }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: getRequestHeaders(settings),
      body: JSON.stringify(buildRequestBody(settings, messages, { jsonMode: true }))
    });

    if (!response.ok) {
      console.warn('API error, falling back to offline suggestions', await response.text());
      return getOfflineSuggestions(projectState, activePhase);
    }

    const data = await response.json();
    const resultContent = extractTextFromResponse(settings, data);
    const parsed = JSON.parse(resultContent);
    return Array.isArray(parsed) ? parsed : (parsed.suggestions || getOfflineSuggestions(projectState, activePhase));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return getOfflineSuggestions(projectState, activePhase);
  }
};

export const chat = async (
  messages: AIMessage[], 
  projectState: ProjectState, 
  activePhase: PhaseId,
  settings: AISettings
): Promise<AIMessage> => {
  if (!settings.apiKey) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: 'I am currently in offline mode. Please configure an API key in the Settings tab to enable full chat functionality. In the meantime, I can still provide rule-based suggestions!',
      timestamp: new Date()
    };
  }

  try {
    const systemPrompt = buildSystemPrompt(projectState, activePhase);
    const url = getEndpointUrl(settings);
    if (!url) throw new Error('Missing API URL');

    const apiMessages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: getRequestHeaders(settings),
      body: JSON.stringify(buildRequestBody(settings, apiMessages))
    });

    if (!response.ok) {
      const friendlyError = await parseFriendlyError(response, settings.provider);
      throw new Error(friendlyError);
    }

    const data = await response.json();
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: extractTextFromResponse(settings, data),
      timestamp: new Date()
    };
  } catch (error) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'system',
      content: `Failed to connect to AI: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date()
    };
  }
};

export const getProjectHealthSummary = async (projectState: ProjectState, settings: AISettings): Promise<string> => {
  if (!settings.apiKey) {
    return `Project Health is ${projectState.ragStatus.overall}. Schedule is ${projectState.ragStatus.schedule} and Budget is ${projectState.ragStatus.budget}. You have used ${projectState.budgetProgressPercent}% of your budget and SIT pass rate is ${projectState.sitProgressPercent}%.`;
  }
  
  // Implementation for calling LLM to summarize health could go here.
  // For now, returning a basic offline-like summary as a placeholder to save calls.
  return `Project Health is ${projectState.ragStatus.overall}. Schedule is ${projectState.ragStatus.schedule} and Budget is ${projectState.ragStatus.budget}. You have used ${projectState.budgetProgressPercent}% of your budget and SIT pass rate is ${projectState.sitProgressPercent}%.`;
};

export const generateReportAnalytics = async (projectState: ProjectState, reportType: 'ppt' | 'excel', settings?: AISettings): Promise<string> => {
  if (!settings || !settings.apiKey) {
    return "Offline Analysis: Project is tracking to overall RAG status. Please configure an AI provider for deep analytics.";
  }
  
  return "AI-generated executive summary for the report. (Configure actual LLM call here).";
};
