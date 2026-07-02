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
import { getNextBestActions, chat as aiChat } from '../utils/aiService';

export interface AISettings {
  provider: 'openai' | 'gemini' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
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
}

const defaultSettings: AISettings = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.3,
  maxTokens: 2048,
  enabled: true,
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
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
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
      const updated = { ...prev, ...newSettings };
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
      setProjectState
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
};
