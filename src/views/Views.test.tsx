import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FunnelReviewing } from './FunnelReviewing';
import { Analysing } from './Analysing';
import { FinancesApprovals } from './FinancesApprovals';
import { ImplementingBuild } from './ImplementingBuild';
import { TestingQuality } from './TestingQuality';
import { ReleaseGovernance } from './ReleaseGovernance';
import { PostLaunchELS } from './PostLaunchELS';
import { POAP } from './POAP';
import { POAPSlideBuilder } from './POAPSlideBuilder';
import { ReleasePlanningMeeting } from './ReleasePlanningMeeting';
import { WalkthroughWizard } from './WalkthroughWizard';
import { AIAssistantProvider } from '../context/AIAssistantContext';
import {
  initialFinancials,
  initialADOWorkItems,
  initialSquads,
  initialMilestones,
  initialAllocations,
  initialTransfers,
  initialForecastMonths,
  initialQAGates,
  initialDefects,
  initialRisks,
  initialChecklist,
  initialHypercare,
  initialPOAPData,
  initialGovernanceGates,
  initialWalkthroughData,
} from '../utils/mockData';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AIAssistantProvider>{ui}</AIAssistantProvider>);
};

describe('Core Views Suite', () => {
  it('renders FunnelReviewing view with financial indicators', () => {
    renderWithContext(
      <FunnelReviewing financials={initialFinancials} setFinancials={vi.fn()} />
    );
    expect(screen.getByText('Stop/Go Decision')).toBeInTheDocument();
  });

  it('renders Analysing view with squad breakdown and handles adding items', () => {
    const mockSetAdo = vi.fn();
    const mockSetSquads = vi.fn();
    renderWithContext(
      <Analysing
        adoWorkItems={initialADOWorkItems}
        setAdoWorkItems={mockSetAdo}
        squads={initialSquads}
        setSquads={mockSetSquads}
        renameSquad={vi.fn()}
        deleteSquad={vi.fn()}
        clearAllSquads={vi.fn()}
      />
    );
    expect(screen.getByText('ADO Work Items & HLD Readiness')).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText('New ADO item title...');
    fireEvent.change(titleInput, { target: { value: 'New Feature: Automated CI/CD' } });
    const addBtn = screen.getAllByRole('button', { name: /Add/i })[0];
    fireEvent.click(addBtn);
    expect(mockSetAdo).toHaveBeenCalled();
  });

  it('renders FinancesApprovals view with allocations and transfers', () => {
    renderWithContext(
      <FinancesApprovals
        financials={initialFinancials}
        setFinancials={vi.fn()}
        allocations={initialAllocations}
        setAllocations={vi.fn()}
        transfers={initialTransfers}
        setTransfers={vi.fn()}
        forecastMonths={initialForecastMonths}
      />
    );
    expect(screen.getByText('CAPEX & OPEX Allocation')).toBeInTheDocument();
  });

  it('renders ImplementingBuild view with milestone track', () => {
    renderWithContext(
      <ImplementingBuild
        squads={initialSquads}
        setSquads={vi.fn()}
        milestones={initialMilestones}
        setMilestones={vi.fn()}
      />
    );
    expect(screen.getByText(/Implementing & Build Phase/i)).toBeInTheDocument();
  });

  it('renders TestingQuality view with test matrix and handles defect creation', () => {
    const mockSetDefects = vi.fn();
    renderWithContext(
      <TestingQuality
        qaGates={initialQAGates}
        setQaGates={vi.fn()}
        defects={initialDefects}
        setDefects={mockSetDefects}
        squads={initialSquads}
      />
    );
    expect(screen.getByText(/Testing Gates Overview/i)).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText('New defect title...');
    fireEvent.change(titleInput, { target: { value: 'Regression in API authentication' } });
    const logBtn = screen.getAllByRole('button', { name: /Add/i })[0];
    fireEvent.click(logBtn);
    expect(mockSetDefects).toHaveBeenCalled();
  });

  it('renders ReleaseGovernance view and handles checklist / risk additions', () => {
    const mockSetChecklist = vi.fn();
    const mockSetRisks = vi.fn();
    renderWithContext(
      <ReleaseGovernance
        risks={initialRisks}
        setRisks={mockSetRisks}
        ragStatus={{ schedule: 'Green', budget: 'Amber', scope: 'Green', quality: 'Green', overall: 'Amber' }}
        setRagStatus={vi.fn()}
        financials={initialFinancials}
        squads={initialSquads}
        defects={initialDefects}
        checklist={initialChecklist}
        setChecklist={mockSetChecklist}
      />
    );
    expect(screen.getByText(/Release Governance & RAGs/i)).toBeInTheDocument();

    const checklistInput = screen.getByPlaceholderText('New checkpoint description...');
    fireEvent.change(checklistInput, { target: { value: 'Complete Disaster Recovery Run' } });
    const addChecklistBtn = screen.getAllByRole('button', { name: /Add/i })[0];
    fireEvent.click(addChecklistBtn);
    expect(mockSetChecklist).toHaveBeenCalled();
  });

  it('renders PostLaunchELS view and handles ticket logging', () => {
    const mockSetHypercare = vi.fn();
    renderWithContext(
      <PostLaunchELS hypercare={initialHypercare} setHypercare={mockSetHypercare} />
    );
    expect(screen.getByText(/Early Life Support/i)).toBeInTheDocument();

    const ticketInput = screen.getByPlaceholderText('New hypercare ticket title...');
    fireEvent.change(ticketInput, { target: { value: 'High CPU in payment gateway' } });
    const addBtn = screen.getAllByRole('button', { name: /Add/i })[0];
    fireEvent.click(addBtn);
    expect(mockSetHypercare).toHaveBeenCalled();
  });

  it('renders POAP digital view', () => {
    renderWithContext(
      <POAP
        poapData={initialPOAPData}
        setPoapData={vi.fn()}
        ragStatus={{ schedule: 'Green', budget: 'Amber', scope: 'Green', quality: 'Green', overall: 'Amber' }}
      />
    );
    expect(screen.getByText(initialPOAPData.projectName)).toBeInTheDocument();
  });

  it('renders POAPSlideBuilder view and toggles between slide preview tabs', () => {
    renderWithContext(<POAPSlideBuilder />);
    expect(screen.getByText('Project Header')).toBeInTheDocument();
    expect(screen.getAllByText('Make as Slide').length).toBeGreaterThan(0);

    const slide1Btn = screen.getByText(/Slide 1 – Status/i);
    fireEvent.click(slide1Btn);
    expect(slide1Btn).toBeInTheDocument();

    const slide2Btn = screen.getByText(/Slide 2 – Plan/i);
    fireEvent.click(slide2Btn);
    expect(slide2Btn).toBeInTheDocument();
  });

  it('renders ReleasePlanningMeeting and toggles view modes and gate tabs', () => {
    const mockSetGates = vi.fn();
    renderWithContext(
      <ReleasePlanningMeeting
        gates={initialGovernanceGates}
        setGates={mockSetGates}
      />
    );
    expect(screen.getByText(/Release Planning Meeting/i)).toBeInTheDocument();

    const cp1Btn = screen.getByText('Checkpoint 1');
    fireEvent.click(cp1Btn);
    expect(cp1Btn).toBeInTheDocument();

    const cp2Btn = screen.getByText('Checkpoint 2');
    fireEvent.click(cp2Btn);
    expect(cp2Btn).toBeInTheDocument();

    const crBtn = screen.getByText('Change Requests');
    fireEvent.click(crBtn);
    expect(crBtn).toBeInTheDocument();

    const editorOnlyBtn = screen.getByText('Editor Only');
    fireEvent.click(editorOnlyBtn);
    expect(editorOnlyBtn).toBeInTheDocument();

    const previewOnlyBtn = screen.getByText('Slide Preview');
    fireEvent.click(previewOnlyBtn);
    expect(previewOnlyBtn).toBeInTheDocument();
  });

  it('renders WalkthroughWizard and steps through all phases', () => {
    const mockSetData = vi.fn();
    renderWithContext(
      <WalkthroughWizard
        data={initialWalkthroughData}
        setData={mockSetData}
      />
    );
    expect(screen.getByText(/Phase 1: Funnel/i)).toBeInTheDocument();

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Phase 2: Reviewing/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText(/Phase 3: Analysing/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText(/Phase 4: Implementing/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText(/Phase 5: Post Launch/i)).toBeInTheDocument();

    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(screen.getByText(/Phase 4: Implementing/i)).toBeInTheDocument();
  });
});
