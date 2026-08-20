import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FunnelReviewing } from './FunnelReviewing';
import { initialFinancials } from '../utils/mockData';

describe('FunnelReviewing View Component', () => {
  it('renders business case financials and input fields', () => {
    const mockSetFinancials = vi.fn();
    render(
      <FunnelReviewing
        financials={initialFinancials}
        setFinancials={mockSetFinancials}
      />
    );

    expect(screen.getByText('Funnel & Mobilisation Phase')).toBeInTheDocument();
    expect(screen.getByText(/Business Case NPV/i)).toBeInTheDocument();
    expect(screen.getByText(/IRR/i)).toBeInTheDocument();
    expect(screen.getByText('Early Readiness Checklist')).toBeInTheDocument();
    expect(screen.getByText('PE Demand Sized')).toBeInTheDocument();
    expect(screen.getByText('VROM Approved')).toBeInTheDocument();
  });

  it('updates financial numbers when inputs change', () => {
    const mockSetFinancials = vi.fn();
    render(
      <FunnelReviewing
        financials={initialFinancials}
        setFinancials={mockSetFinancials}
      />
    );

    const npvInput = screen.getByDisplayValue(initialFinancials.NPV.toString());
    fireEvent.change(npvInput, { target: { value: '7500000' } });

    expect(mockSetFinancials).toHaveBeenCalled();
  });
});
