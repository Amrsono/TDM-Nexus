import React, { useState } from 'react';
import { HypercareTicket } from '../utils/mockData';
import { Activity, Ticket, CheckCircle2, Plus } from 'lucide-react';

interface PostLaunchELSProps {
  hypercare: HypercareTicket[];
  setHypercare: React.Dispatch<React.SetStateAction<HypercareTicket[]>>;
}

export function PostLaunchELS({ hypercare, setHypercare }: PostLaunchELSProps) {
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketSeverity, setNewTicketSeverity] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P3');

  const handleAddTicket = () => {
    if (!newTicketTitle.trim()) return;
    setHypercare([...hypercare, {
      id: `INC-${Math.floor(Math.random() * 10000)}`,
      title: newTicketTitle,
      severity: newTicketSeverity,
      status: 'Open',
      reportedAt: new Date().toISOString().slice(0, 16),
      slaMinutes: newTicketSeverity === 'P1' || newTicketSeverity === 'P2' ? 60 : 240
    }]);
    setNewTicketTitle('');
  };

  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <Activity size={18} className="mono" />
            <h3 className="mono">Early Life Support (ELS) & Hypercare</h3>
          </div>
          <div className="card-body">
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Track post-launch technical and commercial stability. ELS exits when no P1/P2 defects remain and metrics meet baselines.
            </p>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Issue Title</th>
                    <th>Severity</th>
                    <th>Reported</th>
                    <th>SLA (mins)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hypercare.map(ticket => (
                    <tr key={ticket.id}>
                      <td className="mono">{ticket.id}</td>
                      <td>{ticket.title}</td>
                      <td>
                        <span className={`status-badge ${ticket.severity === 'P1' || ticket.severity === 'P2' ? 'bg-red' : 'bg-amber'}`}>
                          {ticket.severity}
                        </span>
                      </td>
                      <td className="mono">{ticket.reportedAt.replace('T', ' ')}</td>
                      <td className="mono">{ticket.slaMinutes}</td>
                      <td>
                        <select 
                          className="cyber-input" 
                          style={{ padding: '0.35rem 0.5rem' }}
                          value={ticket.status}
                          onChange={(e) => {
                            const newHyp = hypercare.map(x => x.id === ticket.id ? { ...x, status: e.target.value as any } : x);
                            setHypercare(newHyp);
                          }}
                        >
                          <option value="Open">Open</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <select 
                className="cyber-input" 
                value={newTicketSeverity} 
                onChange={(e) => setNewTicketSeverity(e.target.value as any)}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
              <input 
                className="cyber-input" 
                style={{ flex: 1 }} 
                placeholder="New hypercare ticket title..." 
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTicket()}
              />
              <button className="cyber-button" onClick={handleAddTicket} style={{ padding: '0 1rem' }}>
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <CheckCircle2 size={18} className="mono" />
            <h3 className="mono">Closure Handover</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem' }}>Technical Launch</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Code deployed to production, features switched off/restricted for internal testing (FUT).
                </p>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem' }}>Commercial Launch</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  CJT complete. Features toggled on for all customers.
                </p>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem' }}>Retrospective</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Lessons learned logged, final portfolio sync complete. Epic closed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
