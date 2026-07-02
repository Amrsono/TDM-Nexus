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
    const url = settings.provider === 'custom' ? (settings.baseUrl || '') : 'https://api.openai.com/v1/chat/completions';
    
    // Fallback if URL is missing
    if (!url) return getOfflineSuggestions(projectState, activePhase);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate 3 next best actions based on the current project state. Return ONLY a JSON array of objects with keys: id, type (action/warning/insight/optimization), title, description, priority (high/medium/low), relatedTab.' }
        ],
        temperature: settings.temperature,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      console.warn('API error, falling back to offline suggestions');
      return getOfflineSuggestions(projectState, activePhase);
    }

    const data = await response.json();
    const resultContent = data.choices[0].message.content;
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
    const url = settings.provider === 'custom' ? (settings.baseUrl || '') : 'https://api.openai.com/v1/chat/completions';
    
    if (!url) throw new Error('Missing API URL');

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: apiMessages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: data.choices[0].message.content,
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
