import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const BadComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Simulated component crash');
  }
  return <div>Healthy Component Content</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <BadComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Healthy Component Content')).toBeInTheDocument();
  });

  it('catches render errors and renders fallback UI with error details', () => {
    render(
      <ErrorBoundary>
        <BadComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Application Encountered a Crash')).toBeInTheDocument();
    expect(screen.getByText(/Simulated component crash/)).toBeInTheDocument();
  });

  it('supports custom fallback prop', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Screen</div>}>
        <BadComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Screen')).toBeInTheDocument();
  });

  it('resets error state when clicking Try Recovery button', () => {
    let shouldThrow = true;
    const DynamicComponent = () => {
      if (shouldThrow) throw new Error('Dynamic failure');
      return <div>Healthy Component Content</div>;
    };

    render(
      <ErrorBoundary>
        <DynamicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Application Encountered a Crash')).toBeInTheDocument();

    shouldThrow = false;
    const recoverBtn = screen.getByText(/Try Recovery/i);
    fireEvent.click(recoverBtn);

    expect(screen.getByText('Healthy Component Content')).toBeInTheDocument();
  });
});
