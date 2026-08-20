import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AIAssistantProvider, useAIAssistant, ProjectState } from './AIAssistantContext';
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
} from '../utils/mockData';

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

describe('AIAssistantContext Unit Tests', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AIAssistantProvider>{children}</AIAssistantProvider>
  );

  it('provides default settings and allows updating settings', () => {
    const { result } = renderHook(() => useAIAssistant(), { wrapper });

    expect(result.current.settings.provider).toBe('openai');

    act(() => {
      result.current.updateSettings({
        enabled: true,
        provider: 'gemini',
        apiKey: 'test-gemini-key',
        model: 'gemini-2.0-flash',
        temperature: 0.5,
        maxTokens: 1024,
      });
    });

    expect(result.current.settings.provider).toBe('gemini');
    expect(result.current.settings.apiKey).toBe('test-gemini-key');
  });

  it('manages addMessage and refreshSuggestions', async () => {
    const { result } = renderHook(() => useAIAssistant(), { wrapper });

    act(() => {
      result.current.setProjectState(mockProjectState);
      result.current.addMessage({
        role: 'user',
        content: 'Custom user note',
      });
    });

    expect(result.current.messages.some(m => m.content === 'Custom user note')).toBe(true);

    await act(async () => {
      await result.current.refreshSuggestions('testing');
    });

    expect(Array.isArray(result.current.suggestions)).toBe(true);
  });

  it('runs offline chat, smart scheduling, predictive analytics and documentation', async () => {
    const { result } = renderHook(() => useAIAssistant(), { wrapper });

    act(() => {
      result.current.setProjectState(mockProjectState);
    });

    await act(async () => {
      await result.current.chat('How is the budget?', 'finances');
    });
    expect(result.current.messages.length).toBeGreaterThan(1);

    await act(async () => {
      await result.current.runPredictiveAnalytics();
    });
    expect(result.current.messages.some(m => m.content.includes('Predictive'))).toBe(true);

    await act(async () => {
      await result.current.runSmartScheduling();
    });
    expect(result.current.messages.some(m => m.content.includes('Smart Scheduling') || m.content.includes('Schedule'))).toBe(true);

    await act(async () => {
      await result.current.runDocumentation('Charter', 'Draft project charter');
    });
    expect(result.current.messages.some(m => m.content.includes('Charter') || m.content.includes('Documentation'))).toBe(true);
  });
});
