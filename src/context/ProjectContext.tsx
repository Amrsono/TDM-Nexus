import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import {
  RootProjectState,
  ProjectAction,
  projectReducer,
  initialRootProjectState,
  RAGStatus,
} from '../store/projectReducer';
import { ProjectState } from './AIAssistantContext';

interface ProjectContextValue {
  state: RootProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  ragStatus: RAGStatus;
  budgetProgressPercent: number;
  sitProgressPercent: number;
  checklistPercent: number;
  projectState: ProjectState;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode; initialState?: RootProjectState }> = ({
  children,
  initialState,
}) => {
  const [state, dispatch] = useReducer(projectReducer, initialState || initialRootProjectState);

  const totalBudgetLimit = useMemo(
    () => state.financials.capexLimit + state.financials.opexLimit,
    [state.financials.capexLimit, state.financials.opexLimit]
  );

  const budgetProgressPercent = useMemo(
    () => (totalBudgetLimit > 0 ? Math.round((state.financials.totalSpent / totalBudgetLimit) * 100) : 0),
    [state.financials.totalSpent, totalBudgetLimit]
  );

  const sitGate = useMemo(
    () => state.qaGates.find((g) => g.name.toLowerCase().includes('sit')),
    [state.qaGates]
  );

  const sitProgressPercent = useMemo(
    () => (sitGate ? Math.round((sitGate.passed / (sitGate.total || 1)) * 100) : 85),
    [sitGate]
  );

  const checklistPercent = useMemo(() => {
    if (state.checklist.length === 0) return 0;
    const completed = state.checklist.filter((c) => c.status === 'Completed' || c.status === 'Signed-Off').length;
    return Math.round((completed / state.checklist.length) * 100);
  }, [state.checklist]);

  const ragStatus = state.ragStatus;

  const projectState: ProjectState = useMemo(
    () => ({
      financials: state.financials,
      adoWorkItems: state.adoWorkItems,
      squads: state.squads,
      milestones: state.milestones,
      allocations: state.allocations,
      transfers: state.transfers,
      forecastMonths: state.forecastMonths,
      qaGates: state.qaGates,
      defects: state.defects,
      risks: state.risks,
      checklist: state.checklist,
      hypercare: state.hypercare,
      budgetProgressPercent,
      sitProgressPercent,
      ragStatus,
    }),
    [state, budgetProgressPercent, sitProgressPercent, ragStatus]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      ragStatus,
      budgetProgressPercent,
      sitProgressPercent,
      checklistPercent,
      projectState,
    }),
    [state, dispatch, ragStatus, budgetProgressPercent, sitProgressPercent, checklistPercent, projectState]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = (): ProjectContextValue => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
