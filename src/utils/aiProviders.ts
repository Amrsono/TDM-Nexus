import { AISettings } from '../context/AIAssistantContext';

export interface OpenAIMessage {
  role: string;
  content: string;
}

export interface AIProviderAdapter {
  id: AISettings['provider'];
  name: string;
  defaultModel: string;
  getEndpoint: (settings: AISettings) => string;
  getHeaders: (settings: AISettings) => Record<string, string>;
  formatRequestBody: (
    settings: AISettings,
    messages: OpenAIMessage[],
    opts?: { jsonMode?: boolean }
  ) => Record<string, unknown>;
  extractText: (data: Record<string, unknown>) => string;
}

export const AI_PROVIDERS: Record<AISettings['provider'], AIProviderAdapter> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    defaultModel: 'gemini-2.0-flash',
    getEndpoint: (settings) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`,
    getHeaders: () => ({ 'Content-Type': 'application/json' }),
    formatRequestBody: (settings, messages, opts) => {
      const systemMsg = messages.find((m) => m.role === 'system');
      const userMessages = messages.filter((m) => m.role !== 'system');
      return {
        system_instruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
        contents: userMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: settings.temperature,
          maxOutputTokens: settings.maxTokens,
          ...(opts?.jsonMode ? { responseMimeType: 'application/json' } : {}),
        },
      };
    },
    extractText: (data) => {
      const candidates = data.candidates as Array<{ content: { parts: Array<{ text: string }> } }> | undefined;
      return candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    },
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-4o',
    getEndpoint: (settings) => settings.baseUrl || 'https://api.openai.com/v1/chat/completions',
    getHeaders: (settings) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    }),
    formatRequestBody: (settings, messages, opts) => ({
      model: settings.model,
      messages,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      ...(opts?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
    extractText: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      return choices?.[0]?.message?.content ?? '';
    },
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    defaultModel: 'claude-3-5-sonnet-20240620',
    getEndpoint: (settings) => settings.baseUrl || 'https://api.anthropic.com/v1/messages',
    getHeaders: (settings) => ({
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
    }),
    formatRequestBody: (settings, messages) => {
      const systemMsg = messages.find((m) => m.role === 'system');
      const userMessages = messages.filter((m) => m.role !== 'system');
      return {
        model: settings.model,
        max_tokens: settings.maxTokens,
        ...(systemMsg ? { system: systemMsg.content } : {}),
        messages: userMessages.map((m) => ({ role: m.role, content: m.content })),
      };
    },
    extractText: (data) => {
      const content = data.content as Array<{ text: string }> | undefined;
      return content?.[0]?.text ?? '';
    },
  },
  copilot: {
    id: 'copilot',
    name: 'GitHub Copilot',
    defaultModel: 'gpt-4o',
    getEndpoint: (settings) => settings.baseUrl || 'https://api.githubcopilot.com/chat/completions',
    getHeaders: (settings) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    }),
    formatRequestBody: (settings, messages, opts) => ({
      model: settings.model,
      messages,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      ...(opts?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
    extractText: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      return choices?.[0]?.message?.content ?? '';
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom Endpoint',
    defaultModel: 'gpt-4o',
    getEndpoint: (settings) => settings.baseUrl || '',
    getHeaders: (settings) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    }),
    formatRequestBody: (settings, messages, opts) => ({
      model: settings.model,
      messages,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      ...(opts?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
    extractText: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      return choices?.[0]?.message?.content ?? '';
    },
  },
};
