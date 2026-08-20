import { describe, it, expect, vi } from 'vitest';
import { exportToPPT } from './pptxExporter';
import { exportPOAPSlideDeck } from './poapPptxExporter';
import { exportGovernanceGatesToPPT, exportAIInsightToPPT } from './governancePptxExporter';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialAllocations,
  initialQAGates,
  initialDefects,
  initialRisks,
  initialGovernanceGates,
} from './mockData';
import { exampleMilestones } from './timelineLayout';
import { POAPSlideData } from '../types/poap';

vi.mock('pptxgenjs', () => {
  const mockShapeType = { rect: 'rect', line: 'line', roundRect: 'roundRect' };
  const MockPPTX = class {
    layout = 'LAYOUT_WIDE';
    author = '';
    ShapeType = mockShapeType;
    static ShapeType = mockShapeType;
    addSlide() {
      return {
        background: null,
        addShape: vi.fn(),
        addText: vi.fn(),
        addTable: vi.fn(),
      };
    }
    writeFile = vi.fn().mockResolvedValue('ok');
  };
  (MockPPTX as any).ShapeType = mockShapeType;
  return {
    default: MockPPTX,
    ShapeType: mockShapeType,
  };
});

const mockPOAPSlideData: POAPSlideData = {
  projectName: 'Core Modernization',
  reqId: 'REQ-9921',
  projectManager: 'Amr Sono',
  expectedClosure: '2026-12-31',
  portfolio: 'Digital Core',
  transition: 'DevOps Pod 1',
  ragOverall: 'Green',
  mpGate: 'Pass',
  build: 'In Progress',
  projectGate: 'Active',
  projectScope: 'Modernize database and APIs',
  currentStatus: 'SIT active',
  milestones: exampleMilestones,
  obstacles: 'Resource availability',
  planAssumptions: 'Infrastructure ready',
};

describe('PPTX Exporters Suite', () => {
  it('executes exportToPPT and generates full SteerCo presentation', () => {
    expect(() => {
      exportToPPT(
        initialFinancials,
        initialADOWorkItems,
        initialSquads,
        initialAllocations,
        initialQAGates,
        initialDefects,
        initialRisks,
        { schedule: 'Green', budget: 'Amber', scope: 'Green', quality: 'Green', overall: 'Amber' },
        '1. Executive Summary\n\nProject on track.\n\n2. Financial Health\n\nBudget in bounds.\n\n3. Quality & Testing\n\nSIT pass rate high.\n\n4. Key Recommendations\n\nProceed to CP1.'
      );
    }).not.toThrow();
  });

  it('executes exportPOAPSlideDeck for digital POAP decks', () => {
    expect(() => {
      exportPOAPSlideDeck(mockPOAPSlideData);
    }).not.toThrow();
  });

  it('executes exportGovernanceGatesToPPT for all and single gate modes', () => {
    expect(() => {
      exportGovernanceGatesToPPT(initialGovernanceGates);
      exportGovernanceGatesToPPT(initialGovernanceGates, 'rpm');
    }).not.toThrow();
  });

  it('executes exportAIInsightToPPT for AI generated insight slides', () => {
    expect(() => {
      exportAIInsightToPPT('Predictive Delivery Sweep', '## Key Findings\n\nNo blocking anomalies detected.');
    }).not.toThrow();
  });
});
