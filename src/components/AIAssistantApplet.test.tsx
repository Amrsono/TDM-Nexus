import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIAssistantApplet } from './AIAssistantApplet';
import { AIAssistantProvider } from '../context/AIAssistantContext';

describe('AIAssistantApplet Component', () => {
  const mockOnNavigate = vi.fn();

  const renderApplet = () => {
    return render(
      <AIAssistantProvider>
        <AIAssistantApplet activePhase="testing" onNavigateToSettings={mockOnNavigate} />
      </AIAssistantProvider>
    );
  };

  it('renders floating AI copilot trigger or drawer', () => {
    renderApplet();
    const trigger = screen.queryByText('AI COPILOT') || screen.getByText('Nexus AI');
    expect(trigger).toBeInTheDocument();
  });

  it('renders drawer header when active', () => {
    renderApplet();
    const triggerBtn = screen.queryByText('AI COPILOT');
    if (triggerBtn) fireEvent.click(triggerBtn);

    expect(screen.getByText('Nexus AI')).toBeInTheDocument();
  });

  it('switches between Actions, Chat, Analytics, and Advanced tabs', () => {
    renderApplet();
    const triggerBtn = screen.queryByText('AI COPILOT');
    if (triggerBtn) fireEvent.click(triggerBtn);

    const chatTabBtn = screen.getByRole('button', { name: /Chat/i });
    fireEvent.click(chatTabBtn);
    expect(screen.getByPlaceholderText(/Ask about your project/i)).toBeInTheDocument();

    const analyticsTabBtn = screen.getByRole('button', { name: /Analytics/i });
    fireEvent.click(analyticsTabBtn);
    expect(screen.getByText('AI Report Generation')).toBeInTheDocument();

    const advancedTabBtn = screen.getByRole('button', { name: /Advanced/i });
    fireEvent.click(advancedTabBtn);
    expect(screen.getByText('Predictive Analytics & Risk')).toBeInTheDocument();
  });
});
