import React from 'react';
import { Settings as SettingsIcon, Monitor, Sun, Moon } from 'lucide-react';

export type ThemeMode = 'dark' | 'light' | 'medium';

interface SettingsProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export function Settings({ theme, setTheme }: SettingsProps) {
  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <SettingsIcon size={18} className="mono" />
            <h3 className="mono">Application Settings</h3>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                Theme Selection
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Select your preferred visual style. The interface will instantly update.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Dark Theme Card */}
                <div 
                  className={`map-node ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}
                >
                  <Moon size={32} style={{ color: theme === 'dark' ? 'var(--color-cyan)' : 'var(--color-text-secondary)', marginBottom: '0.75rem' }} />
                  <div className="map-node-title">Dark Mode</div>
                  <div className="map-node-lead">Cybernetic default</div>
                </div>

                {/* Light Theme Card */}
                <div 
                  className={`map-node ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}
                >
                  <Sun size={32} style={{ color: theme === 'light' ? 'var(--color-cyan)' : 'var(--color-text-secondary)', marginBottom: '0.75rem' }} />
                  <div className="map-node-title">Light Mode</div>
                  <div className="map-node-lead">Vodafone White & Red</div>
                </div>

                {/* Medium Theme Card */}
                <div 
                  className={`map-node ${theme === 'medium' ? 'active' : ''}`}
                  onClick={() => setTheme('medium')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}
                >
                  <Monitor size={32} style={{ color: theme === 'medium' ? 'var(--color-cyan)' : 'var(--color-text-secondary)', marginBottom: '0.75rem' }} />
                  <div className="map-node-title">Medium Mode</div>
                  <div className="map-node-lead">Balanced Blue</div>
                </div>
              </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '2rem 0' }} />
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                System Preferences
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                Additional preferences and integrations can be configured here in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
