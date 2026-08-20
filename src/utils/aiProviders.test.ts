import { describe, it, expect } from 'vitest';
import { AI_PROVIDERS } from './aiProviders';
import { AISettings } from '../context/AIAssistantContext';

describe('AI Providers Registry', () => {
  const baseSettings: AISettings = {
    enabled: true,
    provider: 'openai',
    apiKey: 'sk-test-123',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2000,
  };

  it('contains adapters for gemini, openai, anthropic, copilot, and custom', () => {
    expect(Object.keys(AI_PROVIDERS)).toEqual(
      expect.arrayContaining(['gemini', 'openai', 'anthropic', 'copilot', 'custom'])
    );
  });

  it('formats gemini request body correctly with system instructions', () => {
    const geminiAdapter = AI_PROVIDERS.gemini;
    const body = geminiAdapter.formatRequestBody(
      { ...baseSettings, provider: 'gemini', model: 'gemini-2.0-flash' },
      [
        { role: 'system', content: 'Act as PM' },
        { role: 'user', content: 'What is our status?' },
        { role: 'assistant', content: 'Status is green' },
      ]
    );

    expect((body.system_instruction as any).parts[0].text).toBe('Act as PM');
    expect((body.contents as any).length).toBe(2);
    expect((body.contents as any)[1].role).toBe('model');
  });

  it('extracts text from OpenAI, Claude, and Gemini payload formats', () => {
    expect(
      AI_PROVIDERS.openai.extractText({ choices: [{ message: { content: 'GPT Response' } }] })
    ).toBe('GPT Response');

    expect(
      AI_PROVIDERS.anthropic.extractText({ content: [{ text: 'Claude Response' }] })
    ).toBe('Claude Response');

    expect(
      AI_PROVIDERS.gemini.extractText({
        candidates: [{ content: { parts: [{ text: 'Gemini Response' }] } }],
      })
    ).toBe('Gemini Response');
  });
});
