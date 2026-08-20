import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GateSlidePreview } from './GateSlidePreview';
import { initialGovernanceGates } from '../../utils/mockData';

describe('GateSlidePreview Component', () => {
  it('renders governance gate slide with objectives, entry criteria, outputs and participants', () => {
    const rpmGate = initialGovernanceGates.find(g => g.id === 'rpm') || initialGovernanceGates[0];

    render(<GateSlidePreview activeGate={rpmGate} />);

    expect(screen.getByText(rpmGate.title)).toBeInTheDocument();
    expect(screen.getByText(/Entry criteria:/i)).toBeInTheDocument();
    expect(screen.getByText(/Output:/i)).toBeInTheDocument();
    expect(screen.getByText(/Mandatory Audience:/i)).toBeInTheDocument();
    expect(screen.getByText('Participant')).toBeInTheDocument();
  });
});
