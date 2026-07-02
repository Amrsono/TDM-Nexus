import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, X, MessageSquare, Lightbulb, BarChart2, Send, RefreshCw, AlertTriangle, CheckCircle, Info, Settings as SettingsIcon } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
import { PhaseId } from '../App';
import './AIAssistant.css';

interface AIAssistantAppletProps {
  activePhase: PhaseId;
  onNavigateToSettings: () => void;
}

export const AIAssistantApplet: React.FC<AIAssistantAppletProps> = ({ activePhase, onNavigateToSettings }) => {
  const { settings, messages, chat, suggestions, refreshSuggestions, isThinking } = useAIAssistant();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'chat' | 'analytics'>('suggestions');
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'suggestions' && suggestions.length === 0) {
      refreshSuggestions(activePhase);
    }
  }, [isOpen, activePhase]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  if (!settings.enabled) return null;

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isThinking) return;
    chat(chatInput.trim(), activePhase);
    setChatInput('');
  };

  const pendingCount = suggestions.length;

  return (
    <>
      <div className="ai-fab" onClick={() => setIsOpen(true)}>
        <BrainCircuit size={24} />
        {pendingCount > 0 && !isOpen && (
          <div className="ai-fab-badge">{pendingCount}</div>
        )}
      </div>

      <div className={`ai-panel-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}>
        <div className={`ai-panel ${isOpen ? 'open' : ''}`}>
          <div className="ai-header">
            <div className="ai-header-title">
              <BrainCircuit size={20} />
              Nexus AI
            </div>
            <div className="ai-header-actions">
              <button className="ai-icon-btn" onClick={() => { setIsOpen(false); onNavigateToSettings(); }} title="AI Settings">
                <SettingsIcon size={18} />
              </button>
              <button className="ai-icon-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="ai-tabs">
            <button className={`ai-tab ${activeTab === 'suggestions' ? 'active' : ''}`} onClick={() => setActiveTab('suggestions')}>
              <Lightbulb size={14} className="inline mr-1" /> Actions
            </button>
            <button className={`ai-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={14} className="inline mr-1" /> Chat
            </button>
            <button className={`ai-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <BarChart2 size={14} className="inline mr-1" /> Analytics
            </button>
          </div>

          <div className="ai-body">
            {activeTab === 'suggestions' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Suggestions for {activePhase}</span>
                  <button className="ai-icon-btn" onClick={() => refreshSuggestions(activePhase)} disabled={isThinking}>
                    <RefreshCw size={14} className={isThinking ? 'animate-spin' : ''} />
                  </button>
                </div>
                {suggestions.length === 0 && !isThinking && (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                    No pending actions. You're all caught up!
                  </div>
                )}
                {isThinking && suggestions.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--color-cyan)', padding: '20px' }}>
                    Analyzing project data...
                  </div>
                )}
                {suggestions.map(s => (
                  <div key={s.id} className={`ai-suggestion ${s.priority}`}>
                    <div className="ai-suggestion-header">
                      {s.type === 'warning' ? <AlertTriangle size={16} color="var(--color-amber)" /> :
                       s.type === 'action' ? <CheckCircle size={16} color="var(--color-cyan)" /> :
                       <Info size={16} color="var(--color-green)" />}
                      <span className="ai-suggestion-title">{s.title}</span>
                    </div>
                    <div className="ai-suggestion-desc">{s.description}</div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'chat' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '10px' }}>
                  {messages.map(m => (
                    <div key={m.id} className={`ai-chat-msg ${m.role}`}>
                      {m.content}
                    </div>
                  ))}
                  {isThinking && (
                    <div className="ai-chat-msg assistant" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                      Thinking...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form className="ai-chat-input-area" onSubmit={handleChatSubmit}>
                  <input 
                    type="text" 
                    className="ai-chat-input" 
                    placeholder="Ask about your project..." 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={isThinking}
                  />
                  <button type="submit" className="cyber-button" disabled={isThinking || !chatInput.trim()} style={{ padding: '8px 12px', minWidth: 'auto' }}>
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}

            {activeTab === 'analytics' && (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                <h4 style={{ color: 'var(--color-cyan)', marginBottom: '12px' }}>AI Report Generation</h4>
                <p>The AI Assistant can automatically analyze your project data when generating SteerCo presentations and Excel reports.</p>
                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <strong>Status:</strong> {settings.apiKey ? 'Connected to AI Provider' : 'Offline Mode (Rule-based)'}
                  <br/><br/>
                  Navigate to Settings to configure your AI provider for deep analytics.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
