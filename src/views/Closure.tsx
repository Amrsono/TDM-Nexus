import React, { useState } from 'react';
import { ChecklistItem, HypercareTicket } from '../utils/mockData';
import { CheckCircle2, Ticket, Play, Users, AlertTriangle } from 'lucide-react';

interface ClosureProps {
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  hypercare: HypercareTicket[];
  setHypercare: React.Dispatch<React.SetStateAction<HypercareTicket[]>>;
}

export const Closure: React.FC<ClosureProps> = ({
  checklist,
  setChecklist,
  hypercare,
  setHypercare
}) => {
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketSev, setNewTicketSev] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P3');

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    let sla = 240;
    if (newTicketSev === 'P1') sla = 30;
    else if (newTicketSev === 'P2') sla = 120;
    else if (newTicketSev === 'P3') sla = 240;
    else sla = 480;

    const newTicket: HypercareTicket = {
      id: `HYP-${String(hypercare.length + 1).padStart(2, '0')}`,
      title: newTicketTitle,
      severity: newTicketSev,
      status: 'Open',
      reportedAt: new Date().toISOString(),
      slaMinutes: sla
    };

    setHypercare(prev => [newTicket, ...prev]);
    setNewTicketTitle('');
  };

  const handleTicketStatusChange = (id: string, newStatus: HypercareTicket['status']) => {
    setHypercare(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Compute stats
  const totalItems = checklist.length;
  const completedItems = checklist.filter(c => c.checked).length;
  const readinessPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="closure-view">
      
      {/* Top readiness tracker */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
              GO-LIVE READINESS INDEX
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Overall deployment checklist verification progress. All items require technical/business sign-off.
            </p>
          </div>
          <div className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-cyan)' }}>
            {readinessPercent}%
          </div>
        </div>
        
        <div className="progress-bar-container" style={{ height: '10px' }}>
          <div className="progress-bar-fill" style={{ width: `${readinessPercent}%` }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Go-Live Checklist */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--color-green)' }} />
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
              PRE-DEPLOYMENT VERIFICATION CHECKLIST
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {checklist.map(c => (
              <div 
                key={c.id} 
                className="glass-panel glass-panel-hover" 
                style={{ 
                  padding: '0.75rem 1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleToggleChecklist(c.id)}
              >
                <input 
                  type="checkbox" 
                  checked={c.checked}
                  onChange={() => {}} // handled by div click
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-green)' }}
                />
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    color: c.checked ? 'var(--color-text-secondary)' : '#fff',
                    textDecoration: c.checked ? 'line-through' : 'none' 
                  }}>
                    {c.item}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    <span>Category: <strong style={{ color: 'var(--color-cyan)' }}>{c.category}</strong></span>
                    <span>Owner: <strong>{c.owner}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hypercare Issue Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Create ticket form */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
              LOG HYPERCARE TICKET
            </h3>
            
            <form onSubmit={handleAddTicket} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Issue Title</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  placeholder="e.g. API Gateway 502 Bad Gateway..."
                  value={newTicketTitle}
                  onChange={e => setNewTicketTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>SLA Priority Severity</label>
                <select className="cyber-input" value={newTicketSev} onChange={e => setNewTicketSev(e.target.value as any)}>
                  <option value="P1">P1 - Critical (30 min SLA)</option>
                  <option value="P2">P2 - Major (120 min SLA)</option>
                  <option value="P3">P3 - Medium (240 min SLA)</option>
                  <option value="P4">P4 - Minor (480 min SLA)</option>
                </select>
              </div>

              <button type="submit" className="cyber-button secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                <Ticket size={16} /> LOG SUPPORT TICKET
              </button>
            </form>
          </div>

          {/* Hypercare Ticket List */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Users size={16} style={{ color: 'var(--color-cyan)' }} />
              <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
                LIVE HYPERCARE INCIDENT QUEUE
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {hypercare.map(t => (
                <div 
                  key={t.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: t.status === 'Resolved' ? 'rgba(0, 245, 160, 0.02)' : 'rgba(239, 68, 68, 0.01)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem' }}>{t.id}</span>
                    <select
                      className="cyber-input"
                      value={t.status}
                      onChange={e => handleTicketStatusChange(t.id, e.target.value as any)}
                      style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem' }}>
                    {t.title}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                    <span className={`rag-badge badge-${t.severity.toLowerCase()}`}>
                      {t.severity}
                    </span>
                    
                    {t.status === 'Resolved' ? (
                      <span style={{ color: 'var(--color-green)' }}>Resolved SLA Met</span>
                    ) : (
                      <span className="sla-critical">
                        SLA Target: {t.slaMinutes} mins
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
