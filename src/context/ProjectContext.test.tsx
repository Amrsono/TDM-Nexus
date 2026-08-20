import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProjectProvider, useProject } from './ProjectContext';

describe('ProjectContext Unit Tests', () => {
  it('throws error when useProject is called outside ProjectProvider', () => {
    expect(() => {
      renderHook(() => useProject());
    }).toThrow('useProject must be used within a ProjectProvider');
  });

  it('provides full state, dispatch, derived metrics, and projectState', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ProjectProvider>{children}</ProjectProvider>
    );

    const { result } = renderHook(() => useProject(), { wrapper });

    expect(result.current.state.financials).toBeDefined();
    expect(typeof result.current.budgetProgressPercent).toBe('number');
    expect(typeof result.current.sitProgressPercent).toBe('number');
    expect(typeof result.current.checklistPercent).toBe('number');
    expect(result.current.ragStatus.overall).toBeDefined();
    expect(result.current.projectState.financials).toBe(result.current.state.financials);

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_FINANCIALS',
        payload: { ...result.current.state.financials, NPV: 9999999 },
      });
    });

    expect(result.current.state.financials.NPV).toBe(9999999);
  });
});
