import React from 'react';
import { HypercareTicket } from '../utils/mockData';
import { Activity, Ticket, CheckCircle2 } from 'lucide-react';

interface PostLaunchELSProps {
  hypercare: HypercareTicket[];
  setHypercare: React.Dispatch<React.SetStateAction<HypercareTicket[]>>;
}

export function PostLaunchELS({ hypercare, setHypercare }: PostLaunchELSProps) {
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
