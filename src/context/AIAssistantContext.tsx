import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PhaseId } from '../App';
import {
  ProjectFinancials,
  ADOWorkItem,
  PortfolioSquad,
  Milestone,
  FinancialAllocation,
  ForecastMonth,
  FundTransfer,
  QAGate,
  Defect,
  RiskIssue,
  ChecklistItem,
  HypercareTicket,
  POAPData,
  GovernanceGateDetail,
  PIWizardData,
  WalkthroughData
} from '../utils/mockData';
import { getNextBestActions, chat as aiChat, generatePredictiveAnalytics, generateSmartSchedule, generateDocumentation } from '../utils/aiService';

export interface AISettings {
  provider: 'openai' | 'gemini' | 'anthropic' | 'copilot' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
  proxyUrl?: string;
  autoSuggest?: boolean;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tab?: PhaseId;
  suggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'warning' | 'insight' | 'optimization';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  relatedTab?: PhaseId;
  actionable?: boolean;
}

export interface ProjectState {
  financials: ProjectFinancials;
  adoWorkItems: ADOWorkItem[];
  squads: PortfolioSquad[];
  milestones: Milestone[];
  allocations: FinancialAllocation[];
  transfers: FundTransfer[];
  forecastMonths: ForecastMonth[];
  qaGates: QAGate[];
  defects: Defect[];
  risks: RiskIssue[];
  checklist: ChecklistItem[];
  hypercare: HypercareTicket[];
  poapData: POAPData;
  governanceGates: GovernanceGateDetail[];
  piWizardData: PIWizardData;
  walkthroughData: WalkthroughData;
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string };
  budgetProgressPercent: number;
  sitProgressPercent: number;
  checklistPercent: number;
}

interface AIAssistantContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  messages: AIMessage[];
  addMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  chat: (content: string, activePhase: PhaseId) => Promise<void>;
  suggestions: AISuggestion[];
  refreshSuggestions: (activePhase: PhaseId) => Promise<void>;
  isThinking: boolean;
  projectState: ProjectState | null;
  setProjectState: (state: ProjectState) => void;
  runPredictiveAnalytics: () => Promise<void>;
  runSmartScheduling: () => Promise<void>;
  runDocumentation: (docType: string, customPrompt: string) => Promise<void>;
}

const defaultSettings: AISettings = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.3,
  maxTokens: 2048,
  enabled: true,
};

/** Default model per provider — used to auto-correct stale localStorage values */
const defaultModelForProvider: Record<AISettings['provider'], string> = {
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  anthropic: 'claude-3-5-sonnet-20240620',
  copilot: 'gpt-4o',
  custom: '',
};

/** Provider prefixes that indicate a model belongs to a specific provider */
const modelPrefixMap: Array<{ prefix: string; provider: AISettings['provider'] }> = [
  { prefix: 'gpt-', provider: 'openai' },
  { prefix: 'o1', provider: 'openai' },
  { prefix: 'gemini-', provider: 'gemini' },
  { prefix: 'claude-', provider: 'anthropic' },
  { prefix: 'copilot-', provider: 'copilot' },
];

/** Bare Gemini IDs that are deprecated on v1beta — map them to their -latest alias */
const deprecatedGeminiModels: Record<string, string> = {
  'gemini-1.5-flash': 'gemini-1.5-flash-latest',
  'gemini-1.5-pro': 'gemini-1.5-pro-latest',
  'gemini-1.5-flash-8b': 'gemini-1.5-flash-8b-latest',
  'gemini-2.5-pro': 'gemini-2.5-pro-preview-06-05',
  'gemini-2.5-flash': 'gemini-2.5-flash-preview-05-20',
};

/**
 * Ensures the saved model is compatible with the saved provider.
 * - Replaces cross-provider model names with the provider's default.
 * - Upgrades bare deprecated Gemini model IDs to their versioned aliases.
 */
const sanitizeSettings = (s: AISettings): AISettings => {
  // Fix cross-provider model mismatch (e.g. gpt-4o saved while provider is gemini)
  const mismatch = modelPrefixMap.find(
    ({ prefix, provider }) => s.model.startsWith(prefix) && provider !== s.provider
  );
  if (mismatch) {
    return { ...s, model: defaultModelForProvider[s.provider] || s.model };
  }
  // Upgrade stale/deprecated Gemini model IDs
  if (s.provider === 'gemini' && deprecatedGeminiModels[s.model]) {
    return { ...s, model: deprecatedGeminiModels[s.model] };
  }
  return s;
};

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AISettings>(() => {
    const saved = localStorage.getItem('tdm-ai-settings');
    const loaded = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    return sanitizeSettings(loaded);
  });

  const [messages, setMessages] = useState<AIMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I am your TDM Nexus AI Assistant. I can help analyze project health, suggest next actions, or answer questions about your data.',
    timestamp: new Date()
  }]);
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [projectState, setProjectState] = useState<ProjectState | null>(null);

  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettingsState(prev => {
      const updated = sanitizeSettings({ ...prev, ...newSettings });
      localStorage.setItem('tdm-ai-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const addMessage = (msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date()
    }]);
  };

  const chat = async (content: string, activePhase: PhaseId) => {
    if (!projectState) return;
    
    addMessage({ role: 'user', content, tab: activePhase });
    setIsThinking(true);
    
    try {
      const response = await aiChat(messages.concat({ id: 'temp', role: 'user', content, timestamp: new Date() }), projectState, activePhase, settings);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      addMessage({ role: 'system', content: `Error: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setIsThinking(false);
    }
  };

  const refreshSuggestions = async (activePhase: PhaseId) => {
    if (!projectState || !settings.enabled) return;
    setIsThinking(true);
    try {
      const newSuggestions = await getNextBestActions(projectState, activePhase, settings);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const runPredictiveAnalytics = async () => {
    if (!projectState) return;
    addMessage({ role: 'user', content: 'Run Predictive Analytics & Risk Assessment' });
    setIsThinking(true);
    try {
      const report = await generatePredictiveAnalytics(projectState, settings);
      addMessage({ role: 'assistant', content: report });
    } catch (error) {
      addMessage({ role: 'system', content: `Error: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setIsThinking(false);
    }
  };

  const runSmartScheduling = async () => {
    if (!projectState) return;
    addMessage({ role: 'user', content: 'Generate Smart Schedule Proposal' });
    setIsThinking(true);
    try {
      const report = await generateSmartSchedule(projectState, settings);
      addMessage({ role: 'assistant', content: report });
    } catch (error) {
      addMessage({ role: 'system', content: `Error: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setIsThinking(false);
    }
  };

  const runDocumentation = async (docType: string, customPrompt: string) => {
    if (!projectState) return;
    addMessage({ role: 'user', content: `Generate Documentation: ${docType}\nPrompt: ${customPrompt}` });
    setIsThinking(true);
    try {
      const report = await generateDocumentation(projectState, docType, customPrompt, settings);
      addMessage({ role: 'assistant', content: report });
    } catch (error) {
      addMessage({ role: 'system', content: `Error: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AIAssistantContext.Provider value={{
      settings,
      updateSettings,
      messages,
      addMessage,
      chat,
      suggestions,
      refreshSuggestions,
      isThinking,
      projectState,
      setProjectState,
      runPredictiveAnalytics,
      runSmartScheduling,
      runDocumentation
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
};
