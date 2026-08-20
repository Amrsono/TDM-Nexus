import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Settings } from './Settings';
import { AIAssistantProvider } from '../context/AIAssistantContext';

describe('Settings View Component', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderWithContext = (ui: React.ReactElement) => {
    return render(<AIAssistantProvider>{ui}</AIAssistantProvider>);
  };

  it('renders theme selector and application settings card', () => {
    renderWithContext(<Settings theme="dark" setTheme={mockSetTheme} />);
    expect(screen.getByText('Application Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme Selection')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
    expect(screen.getByText('Medium Mode')).toBeInTheDocument();
  });

  it('calls setTheme when selecting a different visual mode', () => {
    renderWithContext(<Settings theme="dark" setTheme={mockSetTheme} />);
    const lightModeNode = screen.getByText('Light Mode');
    fireEvent.click(lightModeNode);
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    const mediumModeNode = screen.getByText('Medium Mode');
    fireEvent.click(mediumModeNode);
    expect(mockSetTheme).toHaveBeenCalledWith('medium');
  });

  it('handles provider selection across Gemini, Anthropic, Copilot, Custom and saves settings', () => {
    renderWithContext(<Settings theme="dark" setTheme={mockSetTheme} />);

    // Select Gemini
    fireEvent.click(screen.getByText(/gemini/i));
    // Select Anthropic
    fireEvent.click(screen.getByText(/anthropic/i));
    // Select Copilot
    fireEvent.click(screen.getByText(/copilot/i));
    // Select Custom
    fireEvent.click(screen.getByText(/custom/i));

    // Save button
    const saveBtn = screen.getByText('Save Configuration');
    fireEvent.click(saveBtn);
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('handles connection test failures and renders descriptive error message in UI', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: { message: 'Invalid API key provided' } }),
    } as unknown as Response);

    renderWithContext(<Settings theme="dark" setTheme={mockSetTheme} />);

    // Click OpenAI provider card
    const openaiCard = screen.getByText(/openai/i);
    fireEvent.click(openaiCard);

    // Enter API key
    const keyInput = screen.getByPlaceholderText('sk-...');
    fireEvent.change(keyInput, { target: { value: 'sk-invalid-key-test' } });

    const testButton = screen.getByText('Test Connection');
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(screen.getByTestId('test-error-message')).toBeInTheDocument();
      expect(screen.getByTestId('test-error-message')).toHaveTextContent('Invalid API key provided');
    });
  });
});
