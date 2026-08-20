import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardStepFunnel } from './WizardStepFunnel';
import { WizardStepReviewing } from './WizardStepReviewing';
import { WizardStepAnalysing } from './WizardStepAnalysing';
import { WizardStepImplementing } from './WizardStepImplementing';
import { WizardStepPostLaunch } from './WizardStepPostLaunch';
import { initialWalkthroughData } from '../../utils/mockData';

describe('Walkthrough Wizard Step Components', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders WizardStepFunnel and updates fields on user input', () => {
    render(<WizardStepFunnel data={initialWalkthroughData} onChange={mockOnChange} />);
    expect(screen.getByText(/Phase 1: Funnel/i)).toBeInTheDocument();

    const epicInput = screen.getByDisplayValue(initialWalkthroughData.epicName);
    fireEvent.change(epicInput, { target: { value: 'New Epic Name' } });
    expect(mockOnChange).toHaveBeenCalledWith('epicName', 'New Epic Name');

    const descInput = screen.getByDisplayValue(initialWalkthroughData.ideaDescription);
    fireEvent.change(descInput, { target: { value: 'New Description' } });
    expect(mockOnChange).toHaveBeenCalledWith('ideaDescription', 'New Description');
  });

  it('renders WizardStepReviewing and toggles stop/go decisions', () => {
    render(<WizardStepReviewing data={initialWalkthroughData} onChange={mockOnChange} />);
    expect(screen.getByText(/Phase 2: Reviewing/i)).toBeInTheDocument();

    const bizCaseInput = screen.getByDisplayValue(initialWalkthroughData.highLevelBusinessCase);
    fireEvent.change(bizCaseInput, { target: { value: 'Updated Business Case' } });
    expect(mockOnChange).toHaveBeenCalledWith('highLevelBusinessCase', 'Updated Business Case');

    const vvromCheckbox = screen.getByLabelText(/VVROM Created/i);
    fireEvent.click(vvromCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('vvromCreated', true);
  });

  it('renders WizardStepAnalysing and displays architecture signoffs', () => {
    render(<WizardStepAnalysing data={initialWalkthroughData} onChange={mockOnChange} />);
    expect(screen.getByText(/Phase 3: Analysing/i)).toBeInTheDocument();

    const brsCheckbox = screen.getByLabelText(/Business Requirement Spec/i);
    fireEvent.click(brsCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('brsSignedOff', true);

    const hldCheckbox = screen.getByLabelText(/High Level Design/i);
    fireEvent.click(hldCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('hldStarted', true);
  });

  it('renders WizardStepImplementing and displays test verification checkmarks', () => {
    render(<WizardStepImplementing data={initialWalkthroughData} onChange={mockOnChange} />);
    expect(screen.getByText(/Phase 4: Implementing/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing Checkpoints/i)).toBeInTheDocument();

    const sitCheckbox = screen.getByLabelText(/SIT Completed/i);
    fireEvent.click(sitCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('sitTesting', true);

    const uatCheckbox = screen.getByLabelText(/UAT Completed/i);
    fireEvent.click(uatCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('uatTesting', true);
  });

  it('renders WizardStepPostLaunch and displays Early Life Support parameters', () => {
    render(<WizardStepPostLaunch data={initialWalkthroughData} onChange={mockOnChange} />);
    expect(screen.getByText(/Phase 5: Post Launch/i)).toBeInTheDocument();
    expect(screen.getByText('Early Life Support (ELS) Currently Active')).toBeInTheDocument();

    const elsCheckbox = screen.getByLabelText('Early Life Support (ELS) Currently Active');
    fireEvent.click(elsCheckbox);
    expect(mockOnChange).toHaveBeenCalledWith('elsActive', true);
  });
});
