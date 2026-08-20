import { describe, it, expect } from 'vitest';
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
  initialPOAPData,
  initialGovernanceGates,
  initialPIWizardData,
  initialWalkthroughData,
} from './mockData';

describe('Mock Data Integrity & Domain Exports', () => {
  it('loads valid initial financials with positive limits', () => {
    expect(initialFinancials.NPV).toBeGreaterThan(0);
    expect(initialFinancials.capexLimit).toBeGreaterThan(0);
    expect(initialFinancials.opexLimit).toBeGreaterThan(0);
    expect(initialFinancials.totalSpent).toBeLessThanOrEqual(
      initialFinancials.capexLimit + initialFinancials.opexLimit
    );
  });

  it('contains properly categorized ADO work items', () => {
    expect(initialADOWorkItems.length).toBeGreaterThan(0);
    initialADOWorkItems.forEach(item => {
      expect(item.id).toBeTruthy();
      expect(['Epic', 'Feature', 'Delivery', 'Function']).toContain(item.type);
      expect(item.portfolio).toBeTruthy();
    });
  });

  it('contains valid portfolio squads with progress in 0..100 range', () => {
    expect(initialSquads.length).toBeGreaterThan(0);
    initialSquads.forEach(squad => {
      expect(squad.progress).toBeGreaterThanOrEqual(0);
      expect(squad.progress).toBeLessThanOrEqual(100);
      expect(['Not Started', 'In Progress', 'Blocked', 'Completed']).toContain(squad.status);
    });
  });

  it('contains all essential governance stage gates', () => {
    const gateIds = initialGovernanceGates.map(g => g.id);
    expect(gateIds).toContain('rpm');
    expect(gateIds).toContain('cp1');
    expect(gateIds).toContain('cp2');
    expect(gateIds).toContain('cr');

    const rpmGate = initialGovernanceGates.find(g => g.id === 'rpm');
    expect(rpmGate?.participants.length).toBeGreaterThan(0);
    expect(rpmGate?.entryCriteria.length).toBeGreaterThan(0);
  });

  it('contains QA gates with consistent test counts', () => {
    initialQAGates.forEach(gate => {
      expect(gate.totalTests).toBeGreaterThanOrEqual(
        gate.passed + gate.failed + gate.blocked
      );
    });
  });

  it('contains POAP and Walkthrough default structures', () => {
    expect(initialPOAPData.projectName).toBeTruthy();
    expect(initialPOAPData.milestones.length).toBeGreaterThan(0);
    expect(initialPIWizardData.reviewChecklist.length).toBeGreaterThan(0);
    expect(initialWalkthroughData.epicName).toBeTruthy();
  });
});
