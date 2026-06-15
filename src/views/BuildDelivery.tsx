import React from 'react';
import { DomainBuild, Milestone } from '../utils/mockData';
import { KanbanSquare, CheckSquare, AlertOctagon, User } from 'lucide-react';

interface BuildDeliveryProps {
  domains: DomainBuild[];
  setDomains: React.Dispatch<React.SetStateAction<DomainBuild[]>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}

export const BuildDelivery: React.FC<BuildDeliveryProps> = ({ 
  domains, 
  setDomains, 
  milestones, 
  setMilestones 
}) => {
  
  const handleProgressChange = (id: string, progress: number) => {
    setDomains(prev => prev.map(d => {
      if (d.id === id) {
        const status = progress === 100 ? 'Completed' : d.status === 'Completed' ? 'In Progress' : d.status;
        return { ...d, progress, status };
      }
      return d;
    }));
  };

  const handleStatusChange = (id: string, status: DomainBuild['status']) => {
    setDomains(prev => prev.map(d => {
      if (d.id === id) {
        const progress = status === 'Completed' ? 100 : d.progress === 100 ? 90 : d.progress;
        return { ...d, status, progress };
      }
      return d;
    }));
  };

  const handleMilestoneToggle = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const status = m.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...m, status };
      }
      return m;
    }));
  };

  return (
    <div className="build-delivery-view">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Domain Build Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            DOMAIN BUILD & TECHNICAL INTEGRATION BOARD
          </h3>
          
          {domains.map(d => (
            <div 
              key={d.id} 
              className="glass-panel" 
              style={{ 
                padding: '1.25rem', 
                borderLeft: `4px solid ${
                  d.status === 'Completed' 
                    ? 'var(--color-green)' 
                    : d.status === 'Blocked' 
                      ? 'var(--color-red)' 
                      : 'var(--color-amber)'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{d.name}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {d.description}
                  </p>
                </div>
                
                <select
                  className="cyber-input"
                  value={d.status}
                  onChange={(e) => handleStatusChange(d.id, e.target.value as any)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                {/* Lead Engineer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <User size={14} style={{ color: 'var(--color-cyan)' }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Lead:</span>
                  <span style={{ fontWeight: 500 }}>{d.lead}</span>
                </div>

                {/* Release Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <KanbanSquare size={14} style={{ color: 'var(--color-purple)' }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Release:</span>
                  <span className="mono" style={{ color: 'var(--color-cyan)' }}>{d.releaseVersion}</span>
                </div>

                {/* Progress bar and slider */}
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${d.progress}%` }}></div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={d.progress}
                    onChange={(e) => handleProgressChange(d.id, Number(e.target.value))}
                    style={{ width: '80px', accentColor: 'var(--color-cyan)' }}
                  />
                  <span className="mono" style={{ fontSize: '0.85rem', width: '35px', textAlign: 'right' }}>
                    {d.progress}%
                  </span>
                </div>
              </div>

              {d.status === 'Blocked' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.4rem 0.75rem', borderRadius: '4px', marginTop: '0.75rem', fontSize: '0.75rem' }}>
                  <AlertOctagon size={14} style={{ color: 'var(--color-red)' }} />
                  <span style={{ color: 'var(--color-red)', fontWeight: 500 }}>
                    Domain is BLOCKED. Check RAID log or testing defects queue.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Release Milestones */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            DELIVERY MILESTONES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {milestones.map(m => (
              <div 
                key={m.id} 
                className="glass-panel" 
                style={{ 
                  padding: '0.75rem 1rem', 
                  background: m.status === 'Completed' ? 'rgba(0, 245, 160, 0.03)' : 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleMilestoneToggle(m.id)}
              >
                <div 
                  className={`icon-button ${m.status === 'Completed' ? 'active' : ''}`}
                  style={{ 
                    padding: '0.2rem', 
                    borderRadius: '4px',
                    borderColor: m.status === 'Completed' ? 'var(--color-green)' : 'var(--color-border)'
                  }}
                >
                  <CheckSquare 
                    size={16} 
                    style={{ color: m.status === 'Completed' ? 'var(--color-green)' : 'transparent' }} 
                  />
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 500,
                    textDecoration: m.status === 'Completed' ? 'line-through' : 'none',
                    color: m.status === 'Completed' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'
                  }}>
                    {m.name}
                  </div>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                    Due: {m.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
