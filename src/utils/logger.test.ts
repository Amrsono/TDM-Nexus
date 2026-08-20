import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logger } from './logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    logger.clearLogs();
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  it('records info, warn, debug, and error messages with metadata', () => {
    logger.info('AuthService', 'User signed in', { userId: '123' });
    logger.warn('StateStore', 'High memory consumption');
    logger.debug('Vite', 'HMR triggered');
    logger.error('AIService', 'Failed to call endpoint', new Error('Network Timeout'));

    const logs = logger.getRecentLogs();
    expect(logs.length).toBe(4);
    expect(logs[0].level).toBe('info');
    expect(logs[0].context).toBe('AuthService');
    expect(logs[3].level).toBe('error');
    expect(logs[3].error?.message).toBe('Network Timeout');
  });

  it('handles non-error objects gracefully in error log', () => {
    logger.error('API', 'String error', 'Custom Error String');
    const logs = logger.getRecentLogs();
    expect(logs[0].error?.message).toBe('Custom Error String');
  });

  it('caps buffer to maxBufferSize', () => {
    for (let i = 0; i < 110; i++) {
      logger.info('Test', `Message ${i}`);
    }
    const logs = logger.getRecentLogs();
    expect(logs.length).toBe(100);
    expect(logs[logs.length - 1].message).toBe('Message 109');
  });
});
