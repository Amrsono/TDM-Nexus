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
});
