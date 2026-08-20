import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ThreeCanvas } from './ThreeCanvas';

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three');
  class MockRenderer {
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    domElement = document.createElement('canvas');
    render = vi.fn();
    dispose = vi.fn();
  }
  return {
    ...actual,
    WebGLRenderer: MockRenderer,
  };
});

describe('ThreeCanvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders canvas container and mounts Three.js WebGL viewport', () => {
    const mockOnPhaseSelect = vi.fn();
    const { container, unmount } = render(
      <ThreeCanvas activePhase="funnel" onPhaseSelect={mockOnPhaseSelect} />
    );

    expect(container.querySelector('.three-canvas-container')).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeInTheDocument();

    unmount();
  });
});
