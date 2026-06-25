import React from 'react';
import { PortfolioSquad, Milestone } from '../utils/mockData';
import { Code2, Flag } from 'lucide-react';

interface ImplementingBuildProps {
  squads: PortfolioSquad[];
  setSquads: React.Dispatch<React.SetStateAction<PortfolioSquad[]>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}

export function ImplementingBuild({ squads, setSquads, milestones, setMilestones }: ImplementingBuildProps) {
  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <Code2 size={18} className="mono" />
            <h3 className="mono">Implementing & Build Phase</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Squad / Portfolio</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Target Release</th>
                  </tr>
                </thead>
                <tbody>
                  {squads.map(squad => (
                    <tr key={squad.id}>
                      <td>{squad.name}</td>
                      <td>
                        <span className={`status-badge ${squad.status === 'Completed' ? 'bg-green' : squad.status === 'In Progress' ? 'bg-cyan' : 'bg-amber'}`}>
                          {squad.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="progress-bar-bg" style={{ flex: 1, height: '6px', background: 'var(--color-bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div 
                              className="progress-bar-fill" 
                              style={{ 
                                width: `${squad.progress}%`, 
                                height: '100%', 
                                background: squad.progress === 100 ? 'var(--color-green)' : 'var(--color-purple)' 
                              }}
                            ></div>
                          </div>
                          <span className="mono" style={{ fontSize: '0.8rem' }}>{squad.progress}%</span>
                        </div>
                      </td>
                      <td className="mono">{squad.targetRelease}</td>
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
            <Flag size={18} className="mono" />
            <h3 className="mono">Key PI Milestones</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map(m => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td className="mono">{m.date}</td>
                      <td>
                        <select 
                          className="cyber-input" 
                          style={{ padding: '0.25rem' }}
                          value={m.status}
                          onChange={(e) => {
                            const newMs = milestones.map(x => x.id === m.id ? { ...x, status: e.target.value as any } : x);
                            setMilestones(newMs);
                          }}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
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
    </div>
  );
}
