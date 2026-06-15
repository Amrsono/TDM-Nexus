import React, { useState } from 'react';
import { RiskIssue, ProjectFinancials, DomainBuild, Defect } from '../utils/mockData';
import { AlertTriangle, Plus, Eye, HelpCircle, FileText } from 'lucide-react';

interface GovernanceProps {
  risks: RiskIssue[];
  setRisks: React.Dispatch<React.SetStateAction<RiskIssue[]>>;
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string };
  setRagStatus: React.Dispatch<React.SetStateAction<{ schedule: string; budget: string; scope: string; quality: string; overall: string }>>;
  financials: ProjectFinancials;
  domains: DomainBuild[];
  defects: Defect[];
}

export const Governance: React.FC<GovernanceProps> = ({
  risks,
  setRisks,
  ragStatus,
  setRagStatus,
  financials,
  domains,
  defects
}) => {
  // New RAID Item State
  const [raidTitle, setRaidTitle] = useState('');
  const [raidType, setRaidType] = useState<'Risk' | 'Issue' | 'Dependency'>('Risk');
  const [raidImpact, setRaidImpact] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [raidMitigation, setRaidMitigation] = useState('');

  const [showSteerCoPreview, setShowSteerCoPreview] = useState(false);

  const handleAddRaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raidTitle.trim()) return;

    const newRaid: RiskIssue = {
      id: `RAID-${String(risks.length + 1).padStart(2, '0')}`,
      type: raidType,
      title: raidTitle,
      impact: raidImpact,
      mitigation: raidMitigation,
      status: 'Open'
    };

    setRisks(prev => [...prev, newRaid]);
    setRaidTitle('');
    setRaidMitigation('');
  };

  const handleRaidStatusChange = (id: string, newStatus: RiskIssue['status']) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleRagChange = (key: keyof typeof ragStatus, val: string) => {
    setRagStatus(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const openDefectCount = defects.filter(d => d.status !== 'Closed').length;
  const overallProgress = Math.round(domains.reduce((sum, d) => sum + d.progress, 0) / domains.length);

  return (
    <div className="governance-view">
      
      {/* RAG Status Configuration panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
          PROJECT WEEKLY STATUS RAG CONTROL
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Schedule Status</label>
            <select className="cyber-input" value={ragStatus.schedule} onChange={e => handleRagChange('schedule', e.target.value)}>
              <option value="Green">Green (On Track)</option>
              <option value="Amber">Amber (Minor Risks)</option>
              <option value="Red">Red (Critical Blocked)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Budget Status</label>
            <select className="cyber-input" value={ragStatus.budget} onChange={e => handleRagChange('budget', e.target.value)}>
              <option value="Green">Green (On Track)</option>
              <option value="Amber">Amber (Minor Risks)</option>
              <option value="Red">Red (Critical Blocked)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Scope Status</label>
            <select className="cyber-input" value={ragStatus.scope} onChange={e => handleRagChange('scope', e.target.value)}>
              <option value="Green">Green (On Track)</option>
              <option value="Amber">Amber (Minor Risks)</option>
              <option value="Red">Red (Critical Blocked)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Quality Status</label>
            <select className="cyber-input" value={ragStatus.quality} onChange={e => handleRagChange('quality', e.target.value)}>
              <option value="Green">Green (On Track)</option>
              <option value="Amber">Amber (Minor Risks)</option>
              <option value="Red">Red (Critical Blocked)</option>
            </select>
          </div>
          <div className="form-group" style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1.25rem' }}>
            <label style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>OVERALL Status</label>
            <select className="cyber-input" value={ragStatus.overall} onChange={e => handleRagChange('overall', e.target.value)} style={{ borderColor: 'var(--color-cyan)' }}>
              <option value="Green">Green (All Clear)</option>
              <option value="Amber">Amber (Caution)</option>
              <option value="Red">Red (Escalation)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'start' }}>
        
        {/* RAID Register */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-amber)' }} />
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
              RAID REGISTER (RISKS, ACTIONS, ISSUES, DEPENDENCIES)
            </h3>
          </div>

          <div className="cyber-table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Title / Risk</th>
                  <th>Impact</th>
                  <th>Mitigation Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {risks.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ color: 'var(--color-cyan)' }}>{r.id}</td>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--color-purple)' }}>{r.type}</td>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td>
                      <span className={`rag-badge ${
                        r.impact === 'Critical' ? 'red' : r.impact === 'High' ? 'amber' : 'green'
                      }`} style={{ fontSize: '0.7rem' }}>
                        {r.impact}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{r.mitigation}</td>
                    <td>
                      <select
                        className="cyber-input"
                        value={r.status}
                        onChange={(e) => handleRaidStatusChange(r.id, e.target.value as any)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="Open">Open</option>
                        <option value="Mitigated">Mitigated</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add RAID Item Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            LOG RAID LOG ENTRY
          </h3>
          <form onSubmit={handleAddRaid} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Title Description</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. Host server connection fail..."
                value={raidTitle}
                onChange={e => setRaidTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>RAID Classification</label>
              <select className="cyber-input" value={raidType} onChange={e => setRaidType(e.target.value as any)}>
                <option value="Risk">Risk (Future Threat)</option>
                <option value="Issue">Issue (Current Problem)</option>
                <option value="Dependency">Dependency (External Lock)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Project Impact</label>
              <select className="cyber-input" value={raidImpact} onChange={e => setRaidImpact(e.target.value as any)}>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mitigation / Resolution Strategy</label>
              <textarea
                className="cyber-input"
                rows={3}
                placeholder="Describe how this risk is mitigated, bypassed, or managed..."
                value={raidMitigation}
                onChange={e => setRaidMitigation(e.target.value)}
                style={{ resize: 'none' }}
                required
              />
            </div>

            <button type="submit" className="cyber-button" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              <Plus size={16} /> LOG ENTRY
            </button>
          </form>
        </div>
      </div>

      {/* SteerCo Slide Deck Preview Trigger */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              STEERING COMMITTEE REPORT CARD SLIDE PREVIEW
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Preview how the status report slides look based on current project statistics before exporting to PowerPoint.
            </p>
          </div>
          <button className="cyber-button" onClick={() => setShowSteerCoPreview(!showSteerCoPreview)}>
            <Eye size={16} /> {showSteerCoPreview ? 'HIDE PREVIEW' : 'VIEW SLIDE PREVIEW'}
          </button>
        </div>

        {showSteerCoPreview && (
          <div style={{ marginTop: '1.5rem', border: '1px solid rgba(0,242,254,0.3)', borderRadius: '8px', overflow: 'hidden', background: '#050812' }}>
            <div style={{ background: '#070b19', borderBottom: '1px solid rgba(0,242,254,0.15)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              <span className="mono">SLIDE PREVIEW MODE [16:9 SCREEN LAYOUT]</span>
              <span className="mono" style={{ color: 'var(--color-cyan)' }}>TDM_SteerCo_Report.pptx (Slide 2)</span>
            </div>
            
            <div style={{ padding: '2rem', minHeight: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {/* Steerco header inside mockup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff' }}>EXECUTIVE SUMMARY & RAG HEALTH</h4>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                    PROJECT VELOCITY | DELIVERABLE PIPELINE STATUS
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Overall RAG:</span>
                  <span className={`rag-badge ${ragStatus.overall.toLowerCase()}`}>{ragStatus.overall}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Schedule</div>
                  <div className={`rag-badge ${ragStatus.schedule.toLowerCase()}`} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{ragStatus.schedule}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>E2E integration targeting Q3 release window.</div>
                </div>

                <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Budget</div>
                  <div className={`rag-badge ${ragStatus.budget.toLowerCase()}`} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{ragStatus.budget}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Total Spent: ${(financials.totalSpent / 1000000).toFixed(2)}M. Forecast aligned.</div>
                </div>

                <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Scope</div>
                  <div className={`rag-badge ${ragStatus.scope.toLowerCase()}`} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{ragStatus.scope}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Requirements approved. Core API schema signed.</div>
                </div>

                <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Quality</div>
                  <div className={`rag-badge ${ragStatus.quality.toLowerCase()}`} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{ragStatus.quality}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{openDefectCount} active defects in queues. Pass rate at {Math.round((overallProgress / 100) * 100)}%.</div>
                </div>
              </div>

              {/* Technical summary footer panel in slide */}
              <div style={{ border: '1px solid rgba(0,242,254,0.15)', borderRadius: '6px', padding: '0.75rem 1rem', background: 'rgba(0,242,254,0.01)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Overall Build Progress:</span>{' '}
                  <span className="mono" style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>{overallProgress}%</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Financial Payback Period:</span>{' '}
                  <span className="mono" style={{ color: 'var(--color-purple)', fontWeight: 600 }}>{financials.paybackPeriod} Years</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Risk items registered:</span>{' '}
                  <span className="mono" style={{ color: 'var(--color-amber)', fontWeight: 600 }}>{risks.filter(r => r.status === 'Open').length} Open</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
