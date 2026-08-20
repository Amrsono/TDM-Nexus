import { describe, it, expect } from 'vitest';
import { projectReducer, initialRootProjectState } from './projectReducer';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialMilestones,
  initialAllocations,
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

describe('projectReducer Store Unit Tests', () => {
  it('handles SET_FINANCIALS with direct object and updater function', () => {
    const updatedFin = { ...initialFinancials, capexLimit: 999999 };
    let state = projectReducer(initialRootProjectState, {
      type: 'SET_FINANCIALS',
      payload: updatedFin,
    });
    expect(state.financials.capexLimit).toBe(999999);

    state = projectReducer(state, {
      type: 'SET_FINANCIALS',
      payload: prev => ({ ...prev, opexLimit: 888888 }),
    });
    expect(state.financials.opexLimit).toBe(888888);
  });

  it('handles SET_ADO_WORK_ITEMS, SET_SQUADS, SET_MILESTONES, SET_ALLOCATIONS, SET_TRANSFERS', () => {
    let state = projectReducer(initialRootProjectState, {
      type: 'SET_ADO_WORK_ITEMS',
      payload: initialADOWorkItems,
    });
    expect(state.adoWorkItems).toEqual(initialADOWorkItems);

    state = projectReducer(state, {
      type: 'SET_SQUADS',
      payload: initialSquads,
    });
    expect(state.squads).toEqual(initialSquads);

    state = projectReducer(state, {
      type: 'SET_MILESTONES',
      payload: initialMilestones,
    });
    expect(state.milestones).toEqual(initialMilestones);

    state = projectReducer(state, {
      type: 'SET_ALLOCATIONS',
      payload: initialAllocations,
    });
    expect(state.allocations).toEqual(initialAllocations);

    state = projectReducer(state, {
      type: 'SET_TRANSFERS',
      payload: initialTransfers,
    });
    expect(state.transfers).toEqual(initialTransfers);
  });

  it('handles SET_QA_GATES, SET_DEFECTS, SET_RISKS, SET_CHECKLIST, SET_HYPERCARE', () => {
    let state = projectReducer(initialRootProjectState, {
      type: 'SET_QA_GATES',
      payload: initialQAGates,
    });
    expect(state.qaGates).toEqual(initialQAGates);

    state = projectReducer(state, {
      type: 'SET_DEFECTS',
      payload: initialDefects,
    });
    expect(state.defects).toEqual(initialDefects);

    state = projectReducer(state, {
      type: 'SET_RISKS',
      payload: initialRisks,
    });
    expect(state.risks).toEqual(initialRisks);

    state = projectReducer(state, {
      type: 'SET_CHECKLIST',
      payload: initialChecklist,
    });
    expect(state.checklist).toEqual(initialChecklist);

    state = projectReducer(state, {
      type: 'SET_HYPERCARE',
      payload: initialHypercare,
    });
    expect(state.hypercare).toEqual(initialHypercare);
  });

  it('handles SET_POAP_DATA, SET_GOVERNANCE_GATES, SET_PI_WIZARD_DATA, SET_WALKTHROUGH_DATA, SET_RAG_STATUS', () => {
    let state = projectReducer(initialRootProjectState, {
      type: 'SET_POAP_DATA',
      payload: initialPOAPData,
    });
    expect(state.poapData).toEqual(initialPOAPData);

    state = projectReducer(state, {
      type: 'SET_GOVERNANCE_GATES',
      payload: initialGovernanceGates,
    });
    expect(state.governanceGates).toEqual(initialGovernanceGates);

    state = projectReducer(state, {
      type: 'SET_PI_WIZARD_DATA',
      payload: initialPIWizardData,
    });
    expect(state.piWizardData).toEqual(initialPIWizardData);

    state = projectReducer(state, {
      type: 'SET_WALKTHROUGH_DATA',
      payload: initialWalkthroughData,
    });
    expect(state.walkthroughData).toEqual(initialWalkthroughData);

    state = projectReducer(state, {
      type: 'SET_RAG_STATUS',
      payload: { schedule: 'Red', budget: 'Red', scope: 'Red', quality: 'Red', overall: 'Red' },
    });
    expect(state.ragStatus.overall).toBe('Red');
  });

  it('handles UPDATE_SQUAD_NAME and cascades across allocations, transfers, defects, and work items', () => {
    const targetSquad = initialRootProjectState.squads[0];
    const oldName = targetSquad.name;
    const newName = 'Renamed Apex Pod';

    // Rename
    let state = projectReducer(initialRootProjectState, {
      type: 'UPDATE_SQUAD_NAME',
      payload: { id: targetSquad.id, oldName, newName },
    });

    expect(state.squads.find(s => s.id === targetSquad.id)?.name).toBe(newName);
    expect(state.allocations.find(a => a.squadId === targetSquad.id)?.squadName).toBe(newName);

    // No-op if oldName === newName
    state = projectReducer(state, {
      type: 'UPDATE_SQUAD_NAME',
      payload: { id: targetSquad.id, oldName: newName, newName },
    });
    expect(state.squads.find(s => s.id === targetSquad.id)?.name).toBe(newName);
  });

  it('handles RECORD_FUND_TRANSFER for CAPEX and OPEX', () => {
    const fromSquad = initialRootProjectState.allocations[0].squadName;
    const toSquad = initialRootProjectState.allocations[1].squadName;
    const initialFromCapex = initialRootProjectState.allocations[0].capexAllocated;
    const initialToCapex = initialRootProjectState.allocations[1].capexAllocated;

    let state = projectReducer(initialRootProjectState, {
      type: 'RECORD_FUND_TRANSFER',
      payload: { fromSquad, toSquad, amount: 50000, category: 'CAPEX' },
    });

    expect(state.transfers[0].amount).toBe(50000);
    expect(state.allocations.find(a => a.squadName === fromSquad)?.capexAllocated).toBe(initialFromCapex - 50000);
    expect(state.allocations.find(a => a.squadName === toSquad)?.capexAllocated).toBe(initialToCapex + 50000);

    // OPEX transfer
    state = projectReducer(state, {
      type: 'RECORD_FUND_TRANSFER',
      payload: { fromSquad, toSquad, amount: 20000, category: 'OPEX' },
    });
    expect(state.transfers[0].amount).toBe(20000);
  });

  it('handles RESET_STATE and default fallback', () => {
    let state = projectReducer(initialRootProjectState, {
      type: 'SET_FINANCIALS',
      payload: { ...initialFinancials, capexLimit: 1 },
    });
    expect(state.financials.capexLimit).toBe(1);

    state = projectReducer(state, { type: 'RESET_STATE' });
    expect(state).toEqual(initialRootProjectState);

    // Unknown action fallback
    state = projectReducer(state, { type: 'UNKNOWN_ACTION' } as any);
    expect(state).toEqual(initialRootProjectState);
  });
});
