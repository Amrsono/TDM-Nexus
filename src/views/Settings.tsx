import React, { useState } from 'react';
import { Settings as SettingsIcon, Monitor, Sun, Moon, BrainCircuit, Key, Globe, Cpu, Hash } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';

export type ThemeMode = 'dark' | 'light' | 'medium';

interface SettingsProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export function Settings({ theme, setTheme }: SettingsProps) {
  const { settings, updateSettings } = useAIAssistant();
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const url = settings.provider === 'custom' ? (settings.baseUrl || '') : 'https://api.openai.com/v1/models';
      if (!url) throw new Error('No URL configured');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`
        }
      });
      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (error) {
      setTestStatus('error');
    }
  };

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
                <div className={`map-node ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                  <Moon size={32} style={{ color: theme === 'dark' ? 'var(--color-cyan)' : 'var(--color-text-secondary)', marginBottom: '0.75rem' }} />
                  <div className="map-node-title">Dark Mode</div>
                  <div className="map-node-lead">Cybernetic default</div>
                </div>

                <div className={`map-node ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                  <Sun size={32} style={{ color: theme === 'light' ? 'var(--color-cyan)' : 'var(--color-text-secondary)', marginBottom: '0.75rem' }} />
                  <div className="map-node-title">Light Mode</div>
                  <div className="map-node-lead">Vodafone White & Red</div>
                </div>

                <div className={`map-node ${theme === 'medium' ? 'active' : ''}`} onClick={() => setTheme('medium')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
                  <Monitor size={32} style={{ color: theme === 'medium' ? 'var(--color-cyan)' : 'var(--color-text-secondary)', marginBottom: '0.75rem' }} />
                  <div className="map-node-title">Medium Mode</div>
                  <div className="map-node-lead">Balanced Blue</div>
                </div>
              </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '2rem 0' }} />
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainCircuit size={18} />
                AI Assistant Configuration
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Configure the AI provider used for suggestions, chat, and report analytics. If disabled or no key is provided, the assistant will use offline heuristics.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <label style={{ color: 'var(--color-text-primary)' }}>Enable AI Assistant:</label>
                <input 
                  type="checkbox" 
                  checked={settings.enabled} 
                  onChange={(e) => updateSettings({ enabled: e.target.checked })} 
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-cyan)' }}
                />
              </div>

              {settings.enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(0,0,0,0.15)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {(['openai', 'gemini', 'anthropic', 'custom'] as const).map(provider => (
                      <div 
                        key={provider}
                        className={`map-node ${settings.provider === provider ? 'active' : ''}`}
                        onClick={() => updateSettings({ provider })}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}
                      >
                        <div className="map-node-title" style={{ textTransform: 'capitalize' }}>{provider}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <Key size={14} /> API Key
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type={showApiKey ? "text" : "password"} 
                          className="cyber-input" 
                          value={settings.apiKey} 
                          onChange={(e) => updateSettings({ apiKey: e.target.value })}
                          placeholder="sk-..."
                          style={{ flex: 1 }}
                        />
                        <button className="cyber-button secondary" onClick={() => setShowApiKey(!showApiKey)}>
                          {showApiKey ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <Cpu size={14} /> Model
                      </label>
                      <input 
                        type="text" 
                        className="cyber-input" 
                        value={settings.model} 
                        onChange={(e) => updateSettings({ model: e.target.value })}
                        placeholder="e.g., gpt-4o, gemini-2.5-pro"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {settings.provider === 'custom' && (
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <Globe size={14} /> Custom Base URL
                      </label>
                      <input 
                        type="text" 
                        className="cyber-input" 
                        value={settings.baseUrl || ''} 
                        onChange={(e) => updateSettings({ baseUrl: e.target.value })}
                        placeholder="https://api.your-provider.com/v1/chat/completions"
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        Temperature: {settings.temperature}
                      </label>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.1"
                        value={settings.temperature} 
                        onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--color-cyan)' }}
                      />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <Hash size={14} /> Max Tokens
                      </label>
                      <input 
                        type="number" 
                        className="cyber-input" 
                        value={settings.maxTokens} 
                        onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) || 2048 })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button className="cyber-button" onClick={handleTestConnection} disabled={testStatus === 'testing' || !settings.apiKey}>
                      {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                    </button>
                    {testStatus === 'success' && <span style={{ color: 'var(--color-green)' }}>Connection Successful!</span>}
                    {testStatus === 'error' && <span style={{ color: 'var(--color-red)' }}>Connection Failed. Check URL and Key.</span>}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
