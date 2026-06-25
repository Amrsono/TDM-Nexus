import React from 'react';
import { QAGate, Defect, PortfolioSquad } from '../utils/mockData';
import { Bug, ShieldCheck, Activity } from 'lucide-react';

interface TestingQualityProps {
  qaGates: QAGate[];
  setQaGates: React.Dispatch<React.SetStateAction<QAGate[]>>;
  defects: Defect[];
  setDefects: React.Dispatch<React.SetStateAction<Defect[]>>;
  squads: PortfolioSquad[];
}

export function TestingQuality({ qaGates, setQaGates, defects, setDefects, squads }: TestingQualityProps) {
  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <ShieldCheck size={18} className="mono" />
            <h3 className="mono">Testing Gates Overview</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Gate</th>
                    <th>Status</th>
                    <th className="text-right">Total Tests</th>
                    <th className="text-right">Passed</th>
                    <th className="text-right">Failed</th>
                    <th className="text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {qaGates.map(gate => {
                    const passRate = gate.totalTests > 0 ? Math.round((gate.passed / gate.totalTests) * 100) : 0;
                    return (
                      <tr key={gate.name}>
                        <td className="mono" style={{ fontWeight: 'bold' }}>{gate.name}</td>
                        <td>
                          <select 
                            className="cyber-input" 
                            style={{ padding: '0.25rem' }}
                            value={gate.status}
                            onChange={(e) => {
                              const newGates = qaGates.map(g => g.name === gate.name ? { ...g, status: e.target.value as any } : g);
                              setQaGates(newGates);
                            }}
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td className="text-right mono">{gate.totalTests}</td>
                        <td className="text-right mono" style={{ color: 'var(--color-green)' }}>{gate.passed}</td>
                        <td className="text-right mono" style={{ color: gate.failed > 0 ? 'var(--color-red)' : 'inherit' }}>{gate.failed}</td>
                        <td className="text-right mono">
                          <span style={{ color: passRate > 80 ? 'var(--color-green)' : passRate > 50 ? 'var(--color-amber)' : 'var(--color-red)' }}>
                            {passRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              * Ensure VATS/VES test environments are provisioned before SIT/PAT kick-offs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-col span-12">
        <div className="cyber-card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <Bug size={18} className="mono" />
            <h3 className="mono">Active Defects</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Phase</th>
                    <th>Squad / Portfolio</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map(d => (
                    <tr key={d.id}>
                      <td className="mono">{d.id}</td>
                      <td>{d.title}</td>
                      <td className="mono">{d.phase}</td>
                      <td>{d.squad}</td>
                      <td>
                        <span className={`status-badge ${d.severity === 'P1' || d.severity === 'P2' ? 'bg-red' : 'bg-amber'}`}>
                          {d.severity}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="cyber-input" 
                          style={{ padding: '0.25rem' }}
                          value={d.status}
                          onChange={(e) => {
                            const newDef = defects.map(x => x.id === d.id ? { ...x, status: e.target.value as any } : x);
                            setDefects(newDef);
                          }}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Retesting">Retesting</option>
                          <option value="Closed">Closed</option>
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
