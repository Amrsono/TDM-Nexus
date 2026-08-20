import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  getEndpointUrl,
  getRequestHeaders,
  buildRequestBody,
  extractTextFromResponse,
  getOfflineSuggestions,
} from './aiService';
import { ProjectState, AISettings } from '../context/AIAssistantContext';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialMilestones,
  initialAllocations,
  initialForecastMonths,
  initialTransfers,
  initialQAGates,
  initialDefects,
  initialRisks,
  initialChecklist,
  initialHypercare,
  initialPOAPData,
  initialGovernanceGates,
  initialPIWizardData,
  initialWalkthroughData,
} from './mockData';

const mockProjectState: ProjectState = {
  financials: initialFinancials,
  adoWorkItems: initialADOWorkItems,
  squads: initialSquads,
  milestones: initialMilestones,
  allocations: initialAllocations,
  forecastMonths: initialForecastMonths,
  transfers: initialTransfers,
  qaGates: initialQAGates,
  defects: initialDefects,
  risks: initialRisks,
  checklist: initialChecklist,
  hypercare: initialHypercare,
  poapData: initialPOAPData,
  governanceGates: initialGovernanceGates,
  piWizardData: initialPIWizardData,
  walkthroughData: initialWalkthroughData,
  ragStatus: { schedule: 'Green', budget: 'Amber', scope: 'Green', quality: 'Green', overall: 'Amber' },
  budgetProgressPercent: 62,
  sitProgressPercent: 75,
  checklistPercent: 33,
};

describe('aiService - Provider Logic and Prompt Construction', () => {
  describe('buildSystemPrompt', () => {
    it('creates system prompt including project health and active phase', () => {
      const prompt = buildSystemPrompt(mockProjectState, 'testing');
      expect(prompt).toContain('TDM Nexus AI Assistant');
      expect(prompt).toContain('testing');
      expect(prompt).toContain('Overall Health: Amber');
      expect(prompt).toContain('Budget Used: 62%');
      expect(prompt).toContain('QA SIT Pass Rate: 75%');
    });
  });

  describe('getOfflineSuggestions', () => {
    it('returns warning when SIT progress is under 80% on testing phase', () => {
      const suggestions = getOfflineSuggestions(mockProjectState, 'testing');
      const sitWarning = suggestions.find(s => s.id === 's1');
      expect(sitWarning).toBeDefined();
      expect(sitWarning?.type).toBe('warning');
      expect(sitWarning?.title).toContain('Low SIT Pass Rate');
    });

    it('returns P1 defect action when open P1 defects exist', () => {
      const suggestions = getOfflineSuggestions(mockProjectState, 'funnel');
      const p1Action = suggestions.find(s => s.id === 's3');
      expect(p1Action).toBeDefined();
      expect(p1Action?.title).toContain('P1 Defects Open');
    });
  });

  describe('getEndpointUrl', () => {
    it('formats Gemini endpoint with API key', () => {
      const settings: AISettings = {
        enabled: true,
        provider: 'gemini',
        apiKey: 'test-gemini-key',
        model: 'gemini-2.5-flash',
        baseUrl: '',
        temperature: 0.7,
        maxTokens: 2048,
      };
      const url = getEndpointUrl(settings);
      expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=test-gemini-key');
    });

    it('returns Anthropic messages endpoint', () => {
      const settings: AISettings = {
        enabled: true,
        provider: 'anthropic',
        apiKey: 'test-anthropic-key',
        model: 'claude-3-7-sonnet',
        baseUrl: '',
        temperature: 0.7,
        maxTokens: 2048,
      };
      expect(getEndpointUrl(settings)).toBe('https://api.anthropic.com/v1/messages');
    });

    it('returns OpenAI chat completions endpoint', () => {
      const settings: AISettings = {
        enabled: true,
        provider: 'openai',
        apiKey: 'test-openai-key',
        model: 'gpt-4o',
        baseUrl: '',
        temperature: 0.7,
        maxTokens: 2048,
      };
      expect(getEndpointUrl(settings)).toBe('https://api.openai.com/v1/chat/completions');
    });

    it('returns custom endpoint baseUrl when provider is custom', () => {
      const settings: AISettings = {
        enabled: true,
        provider: 'custom',
        apiKey: 'test-custom-key',
        model: 'custom-model',
        baseUrl: 'https://my-internal-llm.corp/v1/chat',
        temperature: 0.7,
        maxTokens: 2048,
      };
      expect(getEndpointUrl(settings)).toBe('https://my-internal-llm.corp/v1/chat');
    });
  });

  describe('getRequestHeaders', () => {
    it('sets x-api-key for Anthropic', () => {
      const headers = getRequestHeaders({
        enabled: true,
        provider: 'anthropic',
        apiKey: 'sk-ant-123',
        model: 'claude-3',
        baseUrl: '',
        temperature: 0.7,
        maxTokens: 2048,
      });
      expect(headers['x-api-key']).toBe('sk-ant-123');
      expect(headers['anthropic-version']).toBe('2023-06-01');
    });

    it('sets Bearer Authorization for OpenAI', () => {
      const headers = getRequestHeaders({
        enabled: true,
        provider: 'openai',
        apiKey: 'sk-open-456',
        model: 'gpt-4o',
        baseUrl: '',
        temperature: 0.7,
        maxTokens: 2048,
      });
      expect(headers['Authorization']).toBe('Bearer sk-open-456');
    });
  });

  describe('buildRequestBody', () => {
    const testMessages = [
      { role: 'system', content: 'System instruction' },
      { role: 'user', content: 'Hello AI' },
    ];

    it('builds Gemini payload structure with system_instruction and contents', () => {
      const payload = buildRequestBody(
        {
          enabled: true,
          provider: 'gemini',
          apiKey: 'key',
          model: 'gemini-2.5-flash',
          baseUrl: '',
          temperature: 0.5,
          maxTokens: 1000,
        },
        testMessages
      );

      expect(payload).toHaveProperty('system_instruction');
      expect(payload).toHaveProperty('contents');
      expect((payload as any).contents[0].parts[0].text).toBe('Hello AI');
    });

    it('builds Anthropic payload structure', () => {
      const payload = buildRequestBody(
        {
          enabled: true,
          provider: 'anthropic',
          apiKey: 'key',
          model: 'claude-3',
          baseUrl: '',
          temperature: 0.7,
          maxTokens: 2000,
        },
        testMessages
      );

      expect((payload as any).model).toBe('claude-3');
      expect((payload as any).system).toBe('System instruction');
      expect((payload as any).messages).toHaveLength(1);
    });

    it('builds OpenAI payload with json_object format when requested', () => {
      const payload = buildRequestBody(
        {
          enabled: true,
          provider: 'openai',
          apiKey: 'key',
          model: 'gpt-4o',
          baseUrl: '',
          temperature: 0.7,
          maxTokens: 2000,
        },
        testMessages,
        { jsonMode: true }
      );

      expect((payload as any).response_format).toEqual({ type: 'json_object' });
    });
  });

  describe('extractTextFromResponse', () => {
    it('extracts text from Gemini candidates', () => {
      const settings = { provider: 'gemini' } as AISettings;
      const res = extractTextFromResponse(settings, {
        candidates: [{ content: { parts: [{ text: 'Gemini says hi' }] } }],
      });
      expect(res).toBe('Gemini says hi');
    });

    it('extracts text from Anthropic content', () => {
      const settings = { provider: 'anthropic' } as AISettings;
      const res = extractTextFromResponse(settings, {
        content: [{ text: 'Claude says hi' }],
      });
      expect(res).toBe('Claude says hi');
    });

    it('extracts text from OpenAI choices', () => {
      const settings = { provider: 'openai' } as AISettings;
      const res = extractTextFromResponse(settings, {
        choices: [{ message: { content: 'GPT says hi' } }],
      });
      expect(res).toBe('GPT says hi');
    });
  });
});
