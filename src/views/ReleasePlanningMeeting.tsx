import React, { useState } from 'react';
import { GovernanceGateDetail, RPMParticipantRow, initialGovernanceGates } from '../utils/mockData';
import { exportGovernanceGatesToPPT } from '../utils/pptxExporter';
import { Presentation, Download, RefreshCw, FileText, Eye, LayoutGrid } from 'lucide-react';

interface ReleasePlanningMeetingProps {
  gates: GovernanceGateDetail[];
  setGates: React.Dispatch<React.SetStateAction<GovernanceGateDetail[]>>;
}

type ViewMode = 'split' | 'edit' | 'preview';

export function ReleasePlanningMeeting({ gates, setGates }: ReleasePlanningMeetingProps) {
  const [activeGateId, setActiveGateId] = useState<string>('rpm');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const activeGate = gates.find(g => g.id === activeGateId) || gates[0];

  const updateGateField = (field: keyof GovernanceGateDetail, value: any) => {
    setGates(prevGates => prevGates.map(g => {
      if (g.id === activeGateId) {
        return { ...g, [field]: value };
      }
      return g;
    }));
  };

  const updateParticipantField = (rowIndex: number, field: keyof RPMParticipantRow, value: any) => {
    setGates(prevGates => prevGates.map(g => {
      if (g.id === activeGateId) {
        const updatedParticipants = g.participants.map((p, idx) => {
          if (idx === rowIndex) {
            return { ...p, [field]: value };
          }
          return p;
        });
        return { ...g, participants: updatedParticipants };
      }
      return g;
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all governance gate data to defaults?')) {
      const defaultGate = initialGovernanceGates.find(g => g.id === activeGateId);
      if (defaultGate) {
        setGates(prevGates => prevGates.map(g => {
          if (g.id === activeGateId) {
            return JSON.parse(JSON.stringify(defaultGate)); // Deep copy
          }
          return g;
        }));
      }
    }
  };

  const handleExportSingle = () => {
    exportGovernanceGatesToPPT(gates, activeGateId);
  };

  const handleExportAll = () => {
    exportGovernanceGatesToPPT(gates);
  };

  return (
    <div className="governance-gates-view">
      <style>{`
        .governance-gates-view {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          color: var(--color-text-primary);
        }
        
        .gates-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .gate-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .gate-tab-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: 0.5rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          border-radius: 4px;
        }

        .gate-tab-btn:hover {
          border-color: var(--color-border-hover);
          color: var(--color-text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .gate-tab-btn.active {
          background: var(--color-border);
          border-color: var(--color-cyan);
          color: var(--color-cyan);
          box-shadow: var(--shadow-glow-cyan);
        }

        .view-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .view-mode-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-text-secondary);
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          cursor: pointer;
          border-radius: 4px;
          transition: all var(--transition-fast);
        }

        .view-mode-btn:hover {
          color: var(--color-text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .view-mode-btn.active {
          border-color: var(--color-border);
          background: rgba(0, 242, 254, 0.08);
          color: var(--color-cyan);
        }

        .view-action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .gate-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          align-items: start;
        }

        .gate-grid.split-mode {
          grid-template-columns: 1fr 1.2fr;
        }

        @media (max-width: 1200px) {
          .gate-grid.split-mode {
            grid-template-columns: 1fr;
          }
        }

        /* Editor Styles */
        .editor-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .editor-section {
          background: var(--bg-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1rem;
        }

        .editor-section-title {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--color-cyan);
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(0, 242, 254, 0.1);
          padding-bottom: 0.25rem;
        }

        .input-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }

        .input-row label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
        }

        .input-row textarea {
          min-height: 80px;
          resize: vertical;
        }

        .participant-editor-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .participant-editor-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .participant-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }

        .participant-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* Slide Preview Styles (Strict 16:9 layout) */
        .slide-preview-wrapper {
          position: sticky;
          top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }

        .slide-preview-container {
          container-type: inline-size;
          container-name: slide;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #ffffff;
          color: #000000;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
          padding: 2.5% 3.5%;
          display: flex;
          flex-direction: column;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
          box-sizing: border-box;
          user-select: none;
        }

        .slide-title {
          font-size: 3.5cqw;
          font-weight: 700;
          color: #E60000;
          margin: 0 0 1.5% 0;
          text-transform: uppercase;
          line-height: 1.1;
        }

        .slide-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          gap: 2%;
        }

        .slide-main-columns {
          display: grid;
          grid-template-columns: 1fr 1.45fr;
          gap: 3%;
          flex: 1;
          min-height: 0;
        }

        .slide-left {
          display: flex;
          flex-direction: column;
          gap: 2%;
          min-height: 0;
        }

        .slide-objective-box {
          border: 2px solid #E60000;
          padding: 2.5% 3.5%;
          font-size: 1.5cqw;
          line-height: 1.3;
          color: #E60000;
          font-weight: 500;
          border-radius: 2px;
          margin-bottom: 1.5%;
        }

        .slide-section-header {
          font-size: 1.4cqw;
          font-weight: 700;
          color: #000000;
          margin: 1.5% 0 0.5% 0;
          text-transform: capitalize;
        }

        .slide-bullets {
          list-style-type: disc;
          padding-left: 1.8cqw;
          margin: 0;
          font-size: 1.2cqw;
          line-height: 1.3;
          color: #333333;
        }

        .slide-bullets li {
          margin-bottom: 1.5%;
        }

        .slide-audience-section {
          margin-top: auto;
          font-size: 1.2cqw;
          line-height: 1.4;
          color: #000000;
          border-top: 1px solid #ddd;
          padding-top: 2%;
        }

        /* Right Column Table */
        .slide-right {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .slide-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .slide-table th {
          background: #E60000;
          color: #ffffff;
          font-size: 1.25cqw;
          font-weight: 700;
          text-align: left;
          padding: 1.2% 1.8%;
          border: 1.5px solid #ffffff;
        }

        .slide-table td {
          background: #FCE4E4;
          color: #333333;
          font-size: 1.1cqw;
          vertical-align: middle;
          padding: 1.2% 1.8%;
          border: 1.5px solid #ffffff;
          line-height: 1.3;
        }

        .slide-table tr:last-child td {
          border-bottom: 1.5px solid #ffffff;
        }

        .slide-table-participant {
          font-weight: 700;
          color: #000000;
        }

        /* CR bottom lists */
        .slide-cr-bottom {
          display: grid;
          grid-template-columns: 1fr 1.45fr;
          gap: 3%;
          padding-top: 1.5%;
          border-top: 1px solid #ddd;
          margin-top: auto;
        }

        .slide-cr-list-title {
          font-size: 1.3cqw;
          font-weight: 700;
          margin-bottom: 1%;
        }

        .slide-cr-list-title.considered {
          color: #008000;
        }

        .slide-cr-list-title.not-considered {
          color: #E60000;
        }
      `}</style>

      {/* Header and actions bar */}
      <div className="gates-header-actions">
        <div className="gate-tabs">
          {gates.map(g => (
            <button
              key={g.id}
              className={`gate-tab-btn ${activeGateId === g.id ? 'active' : ''}`}
              onClick={() => setActiveGateId(g.id)}
            >
              {g.id === 'rpm' ? 'RPM' : g.id === 'cp1' ? 'Checkpoint 1' : g.id === 'cp2' ? 'Checkpoint 2' : 'Change Requests'}
            </button>
          ))}
        </div>

        <div className="view-controls">
          <button 
            className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            <LayoutGrid size={14} />
            <span>Split Screen</span>
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => setViewMode('edit')}
          >
            <FileText size={14} />
            <span>Editor Only</span>
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            <Eye size={14} />
            <span>Slide Preview</span>
          </button>
        </div>

        <div className="view-action-buttons">
          <button className="cyber-button" onClick={handleExportSingle} title="Export current slide as PPTX">
            <Download size={14} />
            <span>Export Active Slide</span>
          </button>
          <button className="cyber-button secondary" onClick={handleExportAll} title="Export all 4 governance slides as a PPTX deck">
            <Presentation size={14} />
            <span>Export Gate Deck</span>
          </button>
          <button className="cyber-button secondary" style={{ minWidth: '40px', padding: '0.5rem' }} onClick={handleReset} title="Reset slide to template defaults">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className={`gate-grid ${viewMode === 'split' ? 'split-mode' : ''}`}>
        
        {/* Editor Column */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className="editor-container">
            {/* Section 1: Overview */}
            <div className="editor-section">
              <h4 className="editor-section-title">General Slide Settings</h4>
              
              <div className="input-row">
                <label>Slide Title</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={activeGate.title} 
                  onChange={(e) => updateGateField('title', e.target.value)}
                />
              </div>

              <div className="input-row">
                <label>Objective Statement</label>
                <textarea 
                  className="cyber-input" 
                  value={activeGate.objective} 
                  onChange={(e) => updateGateField('objective', e.target.value)}
                />
              </div>

              <div className="input-row">
                <label>Entry Criteria (One bullet per line)</label>
                <textarea 
                  className="cyber-input" 
                  value={activeGate.entryCriteria.join('\n')} 
                  onChange={(e) => updateGateField('entryCriteria', e.target.value.split('\n'))}
                  placeholder="Enter entry criteria, one per line..."
                />
              </div>

              <div className="input-row">
                <label>Output (One bullet per line)</label>
                <textarea 
                  className="cyber-input" 
                  value={activeGate.outputs.join('\n')} 
                  onChange={(e) => updateGateField('outputs', e.target.value.split('\n'))}
                  placeholder="Enter output actions, one per line..."
                />
              </div>
              
              <div className="input-row">
                <label>Mandatory Audience</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={activeGate.mandatoryAudience} 
                  onChange={(e) => updateGateField('mandatoryAudience', e.target.value)}
                />
              </div>

              <div className="input-row">
                <label>Optional Audience</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={activeGate.optionalAudience || ''} 
                  onChange={(e) => updateGateField('optionalAudience', e.target.value)}
                  placeholder="e.g. Domains"
                />
              </div>
            </div>

            {/* Section 2: CR specific lists */}
            {activeGate.id === 'cr' && (
              <div className="editor-section">
                <h4 className="editor-section-title" style={{ color: 'var(--color-purple)' }}>CR Validity Guidelines</h4>
                <div className="input-row">
                  <label style={{ color: '#00cc00' }}>Types of CRs Considered (One per line)</label>
                  <textarea 
                    className="cyber-input" 
                    value={activeGate.typesConsidered?.join('\n') || ''} 
                    onChange={(e) => updateGateField('typesConsidered', e.target.value.split('\n'))}
                  />
                </div>
                <div className="input-row">
                  <label style={{ color: 'var(--color-magenta)' }}>Types of CRs NOT Considered (One per line)</label>
                  <textarea 
                    className="cyber-input" 
                    value={activeGate.typesNotConsidered?.join('\n') || ''} 
                    onChange={(e) => updateGateField('typesNotConsidered', e.target.value.split('\n'))}
                  />
                </div>
              </div>
            )}

            {/* Section 3: Participants */}
            <div className="editor-section">
              <h4 className="editor-section-title">Participants Actions (Done vs To Do)</h4>
              {activeGate.participants.map((p, idx) => (
                <div key={idx} className="participant-editor-row">
                  <div className="participant-title">{p.participant}</div>
                  <div className="participant-fields">
                    <div className="input-row" style={{ marginBottom: 0 }}>
                      <label>Input (Actions Done) - one per line</label>
                      <textarea 
                        className="cyber-input" 
                        style={{ minHeight: '60px', fontSize: '0.8rem' }}
                        value={p.inputs.join('\n')} 
                        onChange={(e) => updateParticipantField(idx, 'inputs', e.target.value.split('\n'))}
                      />
                    </div>
                    <div className="input-row" style={{ marginBottom: 0 }}>
                      <label>Output (Actions to do) - one per line</label>
                      <textarea 
                        className="cyber-input" 
                        style={{ minHeight: '60px', fontSize: '0.8rem' }}
                        value={p.outputs.join('\n')} 
                        onChange={(e) => updateParticipantField(idx, 'outputs', e.target.value.split('\n'))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide Preview Column */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="slide-preview-wrapper">
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
              Slide Live Preview (16:9 Presentation Aspect Ratio)
            </div>
            
            <div className="slide-preview-container">
              {/* Slide Title */}
              <div className="slide-title">{activeGate.title}</div>
              
              {/* Slide Body */}
              <div className="slide-content">
                
                {/* Main 2-Column Content */}
                <div className="slide-main-columns">
                  
                  {/* Left Side Info */}
                  <div className="slide-left">
                    <div className="slide-objective-box">
                      <strong>Objective:</strong> {activeGate.objective}
                    </div>
                    
                    <div>
                      <div className="slide-section-header">Entry criteria:</div>
                      <ul className="slide-bullets">
                        {activeGate.entryCriteria.filter(item => item.trim() !== '').map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Outputs */}
                    <div>
                      <div className="slide-section-header">Output:</div>
                      <ul className="slide-bullets">
                        {activeGate.outputs.filter(item => item.trim() !== '').map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Audience */}
                    <div className="slide-audience-section">
                      <div><strong>Mandatory Audience:</strong> {activeGate.mandatoryAudience}</div>
                      {activeGate.optionalAudience && (
                        <div style={{ marginTop: '0.2cqw' }}><strong>Optional Audience:</strong> {activeGate.optionalAudience}</div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Table */}
                  <div className="slide-right">
                    <table className="slide-table">
                      <thead>
                        <tr>
                          <th style={{ width: '22%' }}>Participant</th>
                          <th style={{ width: '38%' }}>Input (Actions Done)</th>
                          <th style={{ width: '40%' }}>Output (Actions to do)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeGate.participants.map((p, idx) => (
                          <tr key={idx}>
                            <td className="slide-table-participant">{p.participant}</td>
                            <td>
                              {p.inputs.length === 0 || (p.inputs.length === 1 && p.inputs[0].trim() === 'N/A') ? (
                                'N/A'
                              ) : (
                                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5cqw', margin: 0 }}>
                                  {p.inputs.filter(item => item.trim() !== '').map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td>
                              {p.outputs.length === 0 || (p.outputs.length === 1 && p.outputs[0].trim() === 'N/A') ? (
                                'N/A'
                              ) : (
                                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5cqw', margin: 0 }}>
                                  {p.outputs.filter(item => item.trim() !== '').map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Bottom Considered/Not Considered section if Change Requests */}
                {activeGate.id === 'cr' && activeGate.typesConsidered && activeGate.typesNotConsidered && (
                  <div className="slide-cr-bottom">
                    <div>
                      <div className="slide-cr-list-title considered">The following types of CRs will be considered:</div>
                      <ul className="slide-bullets" style={{ paddingLeft: '1.5cqw' }}>
                        {activeGate.typesConsidered.filter(item => item.trim() !== '').map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="slide-cr-list-title not-considered">The following types of CRs will not be considered:</div>
                      <ul className="slide-bullets" style={{ paddingLeft: '1.5cqw' }}>
                        {activeGate.typesNotConsidered.filter(item => item.trim() !== '').map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
