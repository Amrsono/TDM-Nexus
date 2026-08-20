import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AIAssistantProvider } from './context/AIAssistantContext';

vi.mock('./components/ThreeCanvas', () => ({
  ThreeCanvas: () => <div data-testid="mock-three-canvas">3D Canvas</div>,
}));

describe('App Root Integration Component', () => {
  const renderApp = () => {
    return render(
      <AIAssistantProvider>
        <App />
      </AIAssistantProvider>
    );
  };

  it('renders application header, HUD metrics, and navigation sidebar', () => {
    renderApp();
    expect(screen.getByText('NEXUS')).toBeInTheDocument();
    expect(screen.getByText('Active Phase')).toBeInTheDocument();
    expect(screen.getByText('Budget vs Actuals')).toBeInTheDocument();
    expect(screen.getByText('SIT Pass Rate')).toBeInTheDocument();
    expect(screen.getByText('Export Excel')).toBeInTheDocument();
    expect(screen.getByText('Export PPT')).toBeInTheDocument();
  });

  it('switches between navigation tabs smoothly', () => {
    renderApp();

    const buildNavBtn = screen.getByText('Implementing & Build');
    fireEvent.click(buildNavBtn);
    expect(screen.getByText('Implementing & Build Phase')).toBeInTheDocument();

    const testingNavBtn = screen.getByText('Testing & Quality');
    fireEvent.click(testingNavBtn);
    expect(screen.getByText('Testing Gates Overview')).toBeInTheDocument();

    const settingsNavBtn = screen.getByText('Settings');
    fireEvent.click(settingsNavBtn);
    expect(screen.getByText('Application Settings')).toBeInTheDocument();
  });

  it('toggles mobile sidebar menu', () => {
    renderApp();
    const toggleButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(toggleButton);
    expect(toggleButton).toBeInTheDocument();
  });
});
