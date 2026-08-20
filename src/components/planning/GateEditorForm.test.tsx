import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GateEditorForm } from './GateEditorForm';
import { initialGovernanceGates } from '../../utils/mockData';

describe('GateEditorForm Component', () => {
  const mockOnUpdateField = vi.fn();
  const mockOnUpdateParticipant = vi.fn();
  const rpmGate = initialGovernanceGates.find(g => g.id === 'rpm') || initialGovernanceGates[0];

  it('renders gate editor fields and participant table', () => {
    render(
      <GateEditorForm
        activeGate={rpmGate}
        onUpdateField={mockOnUpdateField}
        onUpdateParticipant={mockOnUpdateParticipant}
      />
    );

    expect(screen.getByText('General Slide Settings')).toBeInTheDocument();
    expect(screen.getByText('Slide Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue(rpmGate.title)).toBeInTheDocument();
  });

  it('updates objective text on change', () => {
    render(
      <GateEditorForm
        activeGate={rpmGate}
        onUpdateField={mockOnUpdateField}
        onUpdateParticipant={mockOnUpdateParticipant}
      />
    );

    const objectiveInput = screen.getByDisplayValue(rpmGate.objective);
    fireEvent.change(objectiveInput, { target: { value: 'Updated Objective Statement' } });

    expect(mockOnUpdateField).toHaveBeenCalledWith('objective', 'Updated Objective Statement');
  });
});
