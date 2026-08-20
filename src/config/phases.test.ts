import { describe, it, expect } from 'vitest';
import { PHASES, getPhaseMetadata } from './phases';

describe('Phase Navigation Configuration', () => {
  it('defines all 12 core delivery phases', () => {
    expect(PHASES.length).toBe(12);
    expect(PHASES.map((p) => p.id)).toContain('funnel');
    expect(PHASES.map((p) => p.id)).toContain('analysing');
    expect(PHASES.map((p) => p.id)).toContain('governance');
    expect(PHASES.map((p) => p.id)).toContain('settings');
  });

  it('retrieves phase metadata by id or falls back to funnel', () => {
    const testingPhase = getPhaseMetadata('testing');
    expect(testingPhase.name).toBe('Testing & Quality');

    const fallbackPhase = getPhaseMetadata('unknown' as any);
    expect(fallbackPhase.id).toBe('funnel');
  });
});
