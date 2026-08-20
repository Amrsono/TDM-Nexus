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
  WalkthroughData,
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

export interface RAGStatus {
  schedule: string;
  budget: string;
  scope: string;
  quality: string;
  overall: string;
}

export interface RootProjectState {
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
  ragStatus: RAGStatus;
}

export const initialRootProjectState: RootProjectState = {
  financials: initialFinancials,
  adoWorkItems: initialADOWorkItems,
  squads: initialSquads,
  milestones: initialMilestones,
  allocations: initialAllocations,
  transfers: initialTransfers,
  forecastMonths: initialForecastMonths,
  qaGates: initialQAGates,
  defects: initialDefects,
  risks: initialRisks,
  checklist: initialChecklist,
  hypercare: initialHypercare,
  poapData: initialPOAPData,
  governanceGates: initialGovernanceGates,
  piWizardData: initialPIWizardData,
  walkthroughData: initialWalkthroughData,
  ragStatus: {
    schedule: 'Green',
    budget: 'Amber',
    scope: 'Green',
    quality: 'Green',
    overall: 'Amber',
  },
};

export type ProjectAction =
  | { type: 'SET_FINANCIALS'; payload: ProjectFinancials | ((prev: ProjectFinancials) => ProjectFinancials) }
  | { type: 'SET_ADO_WORK_ITEMS'; payload: ADOWorkItem[] | ((prev: ADOWorkItem[]) => ADOWorkItem[]) }
  | { type: 'SET_SQUADS'; payload: PortfolioSquad[] | ((prev: PortfolioSquad[]) => PortfolioSquad[]) }
  | { type: 'SET_MILESTONES'; payload: Milestone[] | ((prev: Milestone[]) => Milestone[]) }
  | { type: 'SET_ALLOCATIONS'; payload: FinancialAllocation[] | ((prev: FinancialAllocation[]) => FinancialAllocation[]) }
  | { type: 'SET_TRANSFERS'; payload: FundTransfer[] | ((prev: FundTransfer[]) => FundTransfer[]) }
  | { type: 'SET_QA_GATES'; payload: QAGate[] | ((prev: QAGate[]) => QAGate[]) }
  | { type: 'SET_DEFECTS'; payload: Defect[] | ((prev: Defect[]) => Defect[]) }
  | { type: 'SET_RISKS'; payload: RiskIssue[] | ((prev: RiskIssue[]) => RiskIssue[]) }
  | { type: 'SET_CHECKLIST'; payload: ChecklistItem[] | ((prev: ChecklistItem[]) => ChecklistItem[]) }
  | { type: 'SET_HYPERCARE'; payload: HypercareTicket[] | ((prev: HypercareTicket[]) => HypercareTicket[]) }
  | { type: 'SET_POAP_DATA'; payload: POAPData | ((prev: POAPData) => POAPData) }
  | { type: 'SET_GOVERNANCE_GATES'; payload: GovernanceGateDetail[] | ((prev: GovernanceGateDetail[]) => GovernanceGateDetail[]) }
  | { type: 'SET_PI_WIZARD_DATA'; payload: PIWizardData | ((prev: PIWizardData) => PIWizardData) }
  | { type: 'SET_WALKTHROUGH_DATA'; payload: WalkthroughData | ((prev: WalkthroughData) => WalkthroughData) }
  | { type: 'SET_RAG_STATUS'; payload: RAGStatus | ((prev: RAGStatus) => RAGStatus) }
  | { type: 'UPDATE_SQUAD_NAME'; payload: { id: string; oldName: string; newName: string } }
  | { type: 'RECORD_FUND_TRANSFER'; payload: { fromSquad: string; toSquad: string; amount: number; category: 'CAPEX' | 'OPEX'; reason?: string } }
  | { type: 'RESET_STATE' };

function resolvePayload<T>(payload: T | ((prev: T) => T), prev: T): T {
  return typeof payload === 'function' ? (payload as (prev: T) => T)(prev) : payload;
}

export function projectReducer(state: RootProjectState, action: ProjectAction): RootProjectState {
  switch (action.type) {
    case 'SET_FINANCIALS':
      return { ...state, financials: resolvePayload(action.payload, state.financials) };

    case 'SET_ADO_WORK_ITEMS':
      return { ...state, adoWorkItems: resolvePayload(action.payload, state.adoWorkItems) };

    case 'SET_SQUADS':
      return { ...state, squads: resolvePayload(action.payload, state.squads) };

    case 'SET_MILESTONES':
      return { ...state, milestones: resolvePayload(action.payload, state.milestones) };

    case 'SET_ALLOCATIONS':
      return { ...state, allocations: resolvePayload(action.payload, state.allocations) };

    case 'SET_TRANSFERS':
      return { ...state, transfers: resolvePayload(action.payload, state.transfers) };

    case 'SET_QA_GATES':
      return { ...state, qaGates: resolvePayload(action.payload, state.qaGates) };

    case 'SET_DEFECTS':
      return { ...state, defects: resolvePayload(action.payload, state.defects) };

    case 'SET_RISKS':
      return { ...state, risks: resolvePayload(action.payload, state.risks) };

    case 'SET_CHECKLIST':
      return { ...state, checklist: resolvePayload(action.payload, state.checklist) };

    case 'SET_HYPERCARE':
      return { ...state, hypercare: resolvePayload(action.payload, state.hypercare) };

    case 'SET_POAP_DATA':
      return { ...state, poapData: resolvePayload(action.payload, state.poapData) };

    case 'SET_GOVERNANCE_GATES':
      return { ...state, governanceGates: resolvePayload(action.payload, state.governanceGates) };

    case 'SET_PI_WIZARD_DATA':
      return { ...state, piWizardData: resolvePayload(action.payload, state.piWizardData) };

    case 'SET_WALKTHROUGH_DATA':
      return { ...state, walkthroughData: resolvePayload(action.payload, state.walkthroughData) };

    case 'SET_RAG_STATUS':
      return { ...state, ragStatus: resolvePayload(action.payload, state.ragStatus) };

    case 'UPDATE_SQUAD_NAME': {
      const { id, oldName, newName } = action.payload;
      if (oldName === newName) return state;

      return {
        ...state,
        squads: state.squads.map(s => (s.id === id ? { ...s, name: newName } : s)),
        allocations: state.allocations.map(a => (a.squadId === id ? { ...a, squadName: newName } : a)),
        transfers: state.transfers.map(t => {
          const updated = { ...t };
          if (t.fromSquad === oldName) updated.fromSquad = newName;
          if (t.toSquad === oldName) updated.toSquad = newName;
          return updated;
        }),
        defects: state.defects.map(d => (d.squad === oldName ? { ...d, squad: newName } : d)),
        adoWorkItems: state.adoWorkItems.map(a => (a.portfolio === oldName ? { ...a, portfolio: newName } : a)),
      };
    }

    case 'RECORD_FUND_TRANSFER': {
      const { fromSquad, toSquad, amount, category, reason } = action.payload;
      const newTransfer: FundTransfer = {
        id: `TR-${Date.now().toString().slice(-4)}`,
        fromSquad,
        toSquad,
        amount,
        reason: reason || `${category} Rebalancing`,
        date: new Date().toISOString().split('T')[0],
        status: 'Approved',
      };

      const updatedAllocations = state.allocations.map(a => {
        if (a.squadName === fromSquad) {
          return category === 'CAPEX'
            ? { ...a, capexAllocated: Math.max(0, a.capexAllocated - amount) }
            : { ...a, opexAllocated: Math.max(0, a.opexAllocated - amount) };
        }
        if (a.squadName === toSquad) {
          return category === 'CAPEX'
            ? { ...a, capexAllocated: a.capexAllocated + amount }
            : { ...a, opexAllocated: a.opexAllocated + amount };
        }
        return a;
      });

      return {
        ...state,
        transfers: [newTransfer, ...state.transfers],
        allocations: updatedAllocations,
      };
    }

    case 'RESET_STATE':
      return initialRootProjectState;

    default:
      return state;
  }
}
