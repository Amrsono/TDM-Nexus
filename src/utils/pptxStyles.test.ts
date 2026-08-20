import { describe, it, expect } from 'vitest';
import pptxgen from 'pptxgenjs';
import {
  VF_RED,
  VF_WHITE,
  VF_BLACK,
  VF_AUBERGINE,
  COLOR_GREEN,
  COLOR_AMBER,
  COLOR_RED,
  getRagHex,
  addSlideHeader,
} from './pptxStyles';

describe('pptxStyles - Brand Colors and Layout Helpers', () => {
  it('defines correct Vodafone VOIS brand hex codes', () => {
    expect(VF_RED).toBe('E60000');
    expect(VF_WHITE).toBe('FFFFFF');
    expect(VF_BLACK).toBe('333333');
    expect(VF_AUBERGINE).toBe('5E2750');
    expect(COLOR_GREEN).toBe('428600');
    expect(COLOR_AMBER).toBe('EB9700');
    expect(COLOR_RED).toBe('E60000');
  });

  it('maps RAG status strings to proper hex colors', () => {
    expect(getRagHex('Green')).toBe('428600');
    expect(getRagHex('Amber')).toBe('EB9700');
    expect(getRagHex('Red')).toBe('E60000');
  });

  it('decorates slides with standard header and footer structures', () => {
    const pptx = new pptxgen();
    const slide = pptx.addSlide();

    addSlideHeader(slide, 'Executive Overview', 2);

    expect(slide.background).toEqual({ color: VF_WHITE });
  });
});
