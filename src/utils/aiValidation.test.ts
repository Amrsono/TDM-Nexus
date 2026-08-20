import { describe, it, expect } from 'vitest';
import {
  AISettingsSchema,
  validateAISettings,
  safeValidateAISettings,
  AIMessageSchema,
  AISuggestionSchema,
} from './aiValidation';

describe('aiValidation - Zod Schema Validation', () => {
  it('validates a correct AISettings configuration', () => {
    const valid = {
      enabled: true,
      provider: 'gemini',
      apiKey: 'AIzaSyExampleKey',
      model: 'gemini-2.5-flash',
      baseUrl: '',
      proxyUrl: '',
      temperature: 0.7,
      maxTokens: 2048,
      autoSuggest: true,
    };

    const parsed = validateAISettings(valid);
    expect(parsed.provider).toBe('gemini');
    expect(parsed.model).toBe('gemini-2.5-flash');
    expect(parsed.temperature).toBe(0.7);
  });

  it('rejects invalid temperature values out of bounds', () => {
    const invalid = {
      enabled: true,
      provider: 'openai',
      apiKey: 'sk-123',
      model: 'gpt-4o',
      temperature: 4.5, // max is 2
    };

    const res = safeValidateAISettings(invalid);
    expect(res.success).toBe(false);
  });

  it('validates AIMessage with correct role and content', () => {
    const validMessage = {
      role: 'user',
      content: 'What is the project status?',
    };
    expect(AIMessageSchema.safeParse(validMessage).success).toBe(true);

    const invalidRole = {
      role: 'superuser',
      content: 'Invalid',
    };
    expect(AIMessageSchema.safeParse(invalidRole).success).toBe(false);
  });

  it('validates AISuggestion with priority and type constraints', () => {
    const validSuggestion = {
      id: 'sug-1',
      type: 'warning',
      title: 'Budget Alert',
      description: 'Burn rate is high.',
      priority: 'high',
      relatedTab: 'finances',
    };
    expect(AISuggestionSchema.safeParse(validSuggestion).success).toBe(true);
  });
});
