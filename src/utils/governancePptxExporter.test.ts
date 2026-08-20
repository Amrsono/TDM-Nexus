import { describe, it, expect, vi } from 'vitest';
import { exportGovernanceGatesToPPT, exportAIInsightToPPT } from './governancePptxExporter';
import { initialGovernanceGates } from './mockData';

vi.mock('pptxgenjs', () => {
  const shapeMock = { rect: 'rect', line: 'line', roundRect: 'roundRect' };
  class MockPptxGen {
    static ShapeType = shapeMock;
    ShapeType = shapeMock;
    layout = '';
    slides: any[] = [];
    addSlide() {
      const slide = {
        background: null,
        addText: vi.fn(),
        addShape: vi.fn(),
        addTable: vi.fn(),
      };
      this.slides.push(slide);
      return slide;
    }
    writeFile() {
      return Promise.resolve('governance_test.pptx');
    }
  }
  return {
    default: MockPptxGen,
    ShapeType: shapeMock,
  };
});

describe('governancePptxExporter Unit Tests', () => {
  it('exports all governance gates to multi-slide deck', () => {
    expect(() => {
      exportGovernanceGatesToPPT(initialGovernanceGates);
    }).not.toThrow();
  });

  it('exports single governance gate when singleGateId is specified', () => {
    expect(() => {
      exportGovernanceGatesToPPT(initialGovernanceGates, 'rpm');
    }).not.toThrow();
  });

  it('exports AI insight to branded slide presentation', () => {
    const markdownInsight = `### Executive Summary
- Overall RAG is Amber
- High delivery velocity in sprint 4
### Recommendations
1. Close high-priority defects
2. Approve VROM scope freeze`;

    expect(() => {
      exportAIInsightToPPT('SteerCo AI Advisory', markdownInsight, 'testing');
    }).not.toThrow();
  });
});
