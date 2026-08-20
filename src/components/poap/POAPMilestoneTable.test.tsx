import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { POAPMilestoneTable } from './POAPMilestoneTable';
import { exampleMilestones } from '../../utils/timelineLayout';

describe('POAPMilestoneTable Component', () => {
  const mockOnChange = vi.fn();

  it('renders table headers and milestone rows', () => {
    render(
      <POAPMilestoneTable
        milestones={exampleMilestones}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Project Milestones')).toBeInTheDocument();
    expect(screen.getByText(/Add Milestone/i)).toBeInTheDocument();
    expect(screen.getByText('Load Example Timeline')).toBeInTheDocument();
  });

  it('adds a new milestone row when clicking Add Milestone', () => {
    render(
      <POAPMilestoneTable
        milestones={exampleMilestones}
        onChange={mockOnChange}
      />
    );

    const addRowBtn = screen.getByText(/Add Milestone/i);
    fireEvent.click(addRowBtn);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('loads example timeline when clicking Load Example Timeline', () => {
    render(
      <POAPMilestoneTable
        milestones={[]}
        onChange={mockOnChange}
      />
    );

    const loadBtn = screen.getByText('Load Example Timeline');
    fireEvent.click(loadBtn);

    expect(mockOnChange).toHaveBeenCalledWith(exampleMilestones);
  });

  it('updates milestone name on input change', () => {
    render(
      <POAPMilestoneTable
        milestones={exampleMilestones}
        onChange={mockOnChange}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'New Epic Name' } });
      expect(mockOnChange).toHaveBeenCalled();
    }
  });

  it('removes a milestone row when clicking delete button', () => {
    render(
      <POAPMilestoneTable
        milestones={exampleMilestones}
        onChange={mockOnChange}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Delete milestone');
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      expect(mockOnChange).toHaveBeenCalled();
    }
  });
});
