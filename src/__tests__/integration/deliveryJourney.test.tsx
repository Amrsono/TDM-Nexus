import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../../App';
import { ProjectProvider } from '../../context/ProjectContext';
import { AIAssistantProvider } from '../../context/AIAssistantContext';

vi.mock('../../components/ThreeCanvas', () => ({
  ThreeCanvas: () => <div data-testid="mock-three-canvas">Interactive Stage</div>,
}));

describe('Delivery Journey Integration Flow', () => {
  const renderApp = () => {
    return render(
      <ProjectProvider>
        <AIAssistantProvider>
          <App />
        </AIAssistantProvider>
      </ProjectProvider>
    );
  };

  it('orchestrates complete project lifecycle from funnel to governance', () => {
    renderApp();

    // 1. Initial Funnel View
    expect(screen.getByText('Funnel & Reviewing Phase')).toBeInTheDocument();
    expect(screen.getByText('PRJ-VELOCITY (PI40)')).toBeInTheDocument();

    // 2. Navigate to Analysing & PI Readiness
    const analysingBtn = screen.getByText('Analysing & PI Readiness');
    fireEvent.click(analysingBtn);
    expect(screen.getByText('Analysing & PI Readiness Phase')).toBeInTheDocument();

    // 3. Navigate to Finances & Approvals
    const financesBtn = screen.getByText('Finances & Approvals');
    fireEvent.click(financesBtn);
    expect(screen.getByText('Finances & Approvals Phase')).toBeInTheDocument();

    // 4. Navigate to Implementing & Build
    const buildBtn = screen.getByText('Implementing & Build');
    fireEvent.click(buildBtn);
    expect(screen.getByText('Implementing & Build Phase')).toBeInTheDocument();

    // 5. Navigate to Testing & Quality
    const testingBtn = screen.getByText('Testing & Quality');
    fireEvent.click(testingBtn);
    expect(screen.getByText('Testing Gates Overview')).toBeInTheDocument();

    // 6. Navigate to Release & Governance
    const govBtn = screen.getByText('Release & Governance');
    fireEvent.click(govBtn);
    expect(screen.getByText('Release & Governance Overview')).toBeInTheDocument();

    // 7. Verify HUD Metrics & Export buttons
    expect(screen.getByText('Export Excel')).toBeInTheDocument();
    expect(screen.getByText('Export PPT')).toBeInTheDocument();
  });
});
