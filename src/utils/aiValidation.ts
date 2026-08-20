import { z } from 'zod';

export const AIProviderSchema = z.enum(['openai', 'anthropic', 'gemini', 'copilot', 'custom']);

export const AISettingsSchema = z.object({
  enabled: z.boolean().default(true),
  provider: AIProviderSchema.default('gemini'),
  apiKey: z.string().default(''),
  model: z.string().min(1, 'Model name is required').default('gemini-2.5-flash'),
  baseUrl: z.string().optional().default(''),
  proxyUrl: z.string().optional().default(''),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(100).max(32000).default(2048),
  autoSuggest: z.boolean().default(true),
});

export type ValidatedAISettings = z.infer<typeof AISettingsSchema>;

export const AIMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

export const AISuggestionSchema = z.object({
  id: z.string(),
  type: z.enum(['insight', 'warning', 'action', 'metric']),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  relatedTab: z.string().optional(),
  actionable: z.boolean().optional(),
});

export const validateAISettings = (settings: unknown): ValidatedAISettings => {
  return AISettingsSchema.parse(settings);
};

export const safeValidateAISettings = (settings: unknown) => {
  return AISettingsSchema.safeParse(settings);
};
