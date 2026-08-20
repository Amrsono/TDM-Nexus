import { describe, it, expect, vi } from 'vitest';
import { exportToPPT } from './pptxExporter';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialAllocations,
  initialQAGates,
  initialDefects,
  initialRisks,
} from './mockData';

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
      return Promise.resolve('tdm_deck.pptx');
    }
  }
  return {
    default: MockPptxGen,
    ShapeType: shapeMock,
  };
});

describe('pptxExporter End-to-End Suite', () => {
  it('generates a full SteerCo slide presentation without errors', () => {
    const ragStatus = {
      schedule: 'Green',
      budget: 'Amber',
      scope: 'Green',
      quality: 'Green',
      overall: 'Amber',
    };

    expect(() => {
      exportToPPT(
        initialFinancials,
        initialADOWorkItems,
        initialSquads,
        initialAllocations,
        initialQAGates,
        initialDefects,
        initialRisks,
        ragStatus,
        'Executive SteerCo AI analysis and recommendations.'
      );
    }).not.toThrow();
  });
});
