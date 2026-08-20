import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Copy, Check } from 'lucide-react';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    logger.error('ErrorBoundary', 'Uncaught component crash caught by React ErrorBoundary', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleCopyStack = (): void => {
    const text = `${this.state.error?.name}: ${this.state.error?.message}\n${this.state.errorInfo?.componentStack || this.state.error?.stack || ''}`;
    navigator.clipboard?.writeText(text);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-primary, #070b19)',
            color: 'var(--color-text-primary, #f8fafc)',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          }}
        >
          <div
            style={{
              maxWidth: '650px',
              width: '100%',
              background: 'var(--bg-card, rgba(13, 22, 47, 0.95))',
              border: '1px solid var(--color-red, #ef4444)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertOctagon size={28} style={{ color: 'var(--color-red, #ef4444)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Application Encountered a Crash
              </h2>
            </div>

            <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              An unexpected render error occurred. The application state has been preserved and logged to client telemetry.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'var(--color-red, #ef4444)',
                  marginBottom: '1.5rem',
                  overflowX: 'auto',
                  maxHeight: '180px',
                }}
              >
                <strong>{this.state.error.name}:</strong> {this.state.error.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="cyber-button"
                onClick={this.handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                }}
              >
                <RefreshCw size={15} /> Try Recovery
              </button>

              <button
                className="cyber-button secondary"
                onClick={this.handleReload}
                style={{
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                }}
              >
                Reload Application
              </button>

              <button
                className="cyber-button secondary"
                onClick={this.handleCopyStack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  marginLeft: 'auto',
                }}
              >
                {this.state.copied ? <Check size={15} /> : <Copy size={15} />}
                {this.state.copied ? 'Copied' : 'Copy Diagnostics'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
