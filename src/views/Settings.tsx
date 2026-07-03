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
  const [localSettings, setLocalSettings] = useState(settings);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      let url: string;
      let headers: Record<string, string> = {};

      if (localSettings.provider === 'gemini') {
        // List models endpoint — lightweight ping to verify key validity
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${localSettings.apiKey}`;
      } else if (localSettings.provider === 'anthropic') {
        url = 'https://api.anthropic.com/v1/models';
        headers = { 'x-api-key': localSettings.apiKey, 'anthropic-version': '2023-06-01' };
      } else if (localSettings.provider === 'custom') {
        url = localSettings.baseUrl || '';
        headers = { 'Authorization': `Bearer ${localSettings.apiKey}` };
      } else {
        // openai
        url = 'https://api.openai.com/v1/models';
        headers = { 'Authorization': `Bearer ${localSettings.apiKey}` };
      }

      if (!url) throw new Error('No URL configured');

      const response = await fetch(url, { method: 'GET', headers });
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
                  checked={localSettings.enabled} 
                  onChange={(e) => setLocalSettings({ ...localSettings, enabled: e.target.checked })} 
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-cyan)' }}
                />
              </div>

              {localSettings.enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(0,0,0,0.15)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {(['openai', 'gemini', 'anthropic', 'custom'] as const).map(provider => (
                      <div 
                        key={provider}
                        className={`map-node ${localSettings.provider === provider ? 'active' : ''}`}
                        onClick={() => {
                          let newModel = localSettings.model;
                          if (provider === 'gemini') newModel = 'gemini-2.0-flash';
                          else if (provider === 'openai') newModel = 'gpt-4o';
                          else if (provider === 'anthropic') newModel = 'claude-3-5-sonnet-20240620';
                          setLocalSettings({ ...localSettings, provider, model: newModel });
                          setTestStatus('idle');
                        }}
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
                          value={localSettings.apiKey} 
                          onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
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
                      {localSettings.provider === 'gemini' ? (
                        <GeminiModelPicker
                          apiKey={localSettings.apiKey}
                          value={localSettings.model}
                          onChange={(model) => setLocalSettings({ ...localSettings, model })}
                        />
                      ) : (
                        <input 
                          type="text" 
                          className="cyber-input" 
                          value={localSettings.model} 
                          onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                          placeholder="e.g., gpt-4o, claude-3"
                          style={{ width: '100%' }}
                        />
                      )}
                    </div>
                  </div>

                  {localSettings.provider === 'custom' && (
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <Globe size={14} /> Custom Base URL
                      </label>
                      <input 
                        type="text" 
                        className="cyber-input" 
                        value={localSettings.baseUrl || ''} 
                        onChange={(e) => setLocalSettings({ ...localSettings, baseUrl: e.target.value })}
                        placeholder="https://api.your-provider.com/v1/chat/completions"
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontSize: '0.85rem' }}>
                        Temperature: {localSettings.temperature}
                      </label>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.1"
                        value={localSettings.temperature} 
                        onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
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
                        value={localSettings.maxTokens} 
                        onChange={(e) => setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) || 2048 })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <button className="cyber-button" onClick={handleSave} style={{ background: 'var(--color-purple)' }}>
                      Save Configuration
                    </button>
                    {saveStatus === 'saved' && <span style={{ color: 'var(--color-cyan)' }}>Saved!</span>}

                    <button
                      className="cyber-button secondary"
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing' || !localSettings.apiKey}
                      title="Save your configuration first, then test"
                    >
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

// ─── Gemini Model Picker ──────────────────────────────────────────────────────

interface GeminiModel { id: string; displayName: string; }

const DEFAULT_GEMINI_MODELS: GeminiModel[] = [
  { id: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-lite', displayName: 'Gemini 2.0 Flash-Lite' },
  { id: 'gemini-1.5-flash-latest', displayName: 'Gemini 1.5 Flash (Latest)' },
  { id: 'gemini-1.5-pro-latest', displayName: 'Gemini 1.5 Pro (Latest)' },
  { id: 'gemini-1.5-flash-8b-latest', displayName: 'Gemini 1.5 Flash-8B (Latest)' },
  { id: 'gemini-2.5-flash-preview-05-20', displayName: 'Gemini 2.5 Flash (Preview)' },
  { id: 'gemini-2.5-pro-preview-06-05', displayName: 'Gemini 2.5 Pro (Preview)' },
];

function GeminiModelPicker({
  apiKey,
  value,
  onChange,
}: {
  apiKey: string;
  value: string;
  onChange: (model: string) => void;
}) {
  const [models, setModels] = useState<GeminiModel[]>(DEFAULT_GEMINI_MODELS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usingCustomList, setUsingCustomList] = useState(false);

  const fetchModels = React.useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = (body?.error?.message as string) || res.statusText;
        throw new Error(msg);
      }
      const data = await res.json();
      const list: GeminiModel[] = (data.models || [])
        .filter((m: { supportedGenerationMethods?: string[] }) =>
          m.supportedGenerationMethods?.includes('generateContent')
        )
        .map((m: { name: string; displayName?: string }) => {
          const id = m.name.replace('models/', '');
          let displayName = m.displayName || id;

          // Make confusing Google names (like "Gemini Flash Latest") explicitly say 1.5
          if (id.includes('1.5-flash-8b') || displayName === 'Gemini Flash-Lite Latest') {
            displayName = `Gemini 1.5 Flash-8B (${displayName})`;
          } else if (id.includes('1.5-flash') || displayName === 'Gemini Flash Latest') {
            displayName = `Gemini 1.5 Flash (${displayName})`;
          } else if (id.includes('1.5-pro') || displayName === 'Gemini Pro Latest') {
            displayName = `Gemini 1.5 Pro (${displayName})`;
          }

          return { id, displayName };
        });
      if (list.length > 0) {
        setModels(list);
        setUsingCustomList(true);
        // Auto-select first model if current value is not in the list
        if (!list.find(m => m.id === value)) {
          onChange(list[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch Gemini models, using fallbacks:', e);
      setError('Could not fetch custom list (using default models).');
    } finally {
      setLoading(false);
    }
  }, [apiKey, value, onChange]);

  // Auto-fetch on mount/apiKey change
  React.useEffect(() => {
    if (apiKey) {
      fetchModels();
    } else {
      setModels(DEFAULT_GEMINI_MODELS);
      setUsingCustomList(false);
    }
  }, [apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          className="cyber-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1 }}
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.displayName}</option>
          ))}
        </select>
        <button
          className="cyber-button secondary"
          onClick={fetchModels}
          disabled={loading || !apiKey}
          title="Reload models list"
          style={{ padding: '0 0.8rem' }}
        >
          {loading ? '...' : '⟳'}
        </button>
      </div>
      {error ? (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
          {error}
        </span>
      ) : (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
          {usingCustomList ? `${models.length} models loaded from API key.` : 'Showing default Gemini models.'}
        </span>
      )}
    </div>
  );
}

