import React, { useState } from 'react';
import { QAGate, Defect, PortfolioSquad } from '../utils/mockData';
import { Bug, ShieldCheck, Activity, Plus } from 'lucide-react';

interface TestingQualityProps {
  qaGates: QAGate[];
  setQaGates: React.Dispatch<React.SetStateAction<QAGate[]>>;
  defects: Defect[];
  setDefects: React.Dispatch<React.SetStateAction<Defect[]>>;
  squads: PortfolioSquad[];
}

export function TestingQuality({ qaGates, setQaGates, defects, setDefects, squads }: TestingQualityProps) {
  const [newDefectTitle, setNewDefectTitle] = useState('');
  const [newDefectSeverity, setNewDefectSeverity] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P3');
  const [newDefectPhase, setNewDefectPhase] = useState<'SIT' | 'UAT' | 'PAT' | 'OAT' | 'PEN' | 'CJT' | 'DVT' | 'Hypercare'>('SIT');
  const [newDefectSquad, setNewDefectSquad] = useState(squads.length > 0 ? squads[0].name : 'Unassigned');

  const handleAddDefect = () => {
    if (!newDefectTitle.trim()) return;
    setDefects([...defects, {
      id: `DEF-${Math.floor(Math.random() * 10000)}`,
      title: newDefectTitle,
      severity: newDefectSeverity,
      status: 'New',
      squad: newDefectSquad,
      phase: newDefectPhase,
      description: ''
    }]);
    setNewDefectTitle('');
  };
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
                            style={{ padding: '0.35rem 0.5rem' }}
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
                        <td className="text-right mono">
                          <input 
                            type="number"
                            className="cyber-input"
                            style={{ width: '70px', padding: '0.2rem', textAlign: 'right' }}
                            value={gate.totalTests}
                            onChange={(e) => {
                              const newGates = qaGates.map(g => g.name === gate.name ? { ...g, totalTests: parseInt(e.target.value) || 0 } : g);
                              setQaGates(newGates);
                            }}
                          />
                        </td>
                        <td className="text-right mono">
                          <input 
                            type="number"
                            className="cyber-input"
                            style={{ width: '70px', padding: '0.2rem', textAlign: 'right', color: 'var(--color-green)' }}
                            value={gate.passed}
                            onChange={(e) => {
                              const newGates = qaGates.map(g => g.name === gate.name ? { ...g, passed: parseInt(e.target.value) || 0 } : g);
                              setQaGates(newGates);
                            }}
                          />
                        </td>
                        <td className="text-right mono">
                          <input 
                            type="number"
                            className="cyber-input"
                            style={{ width: '70px', padding: '0.2rem', textAlign: 'right', color: gate.failed > 0 ? 'var(--color-red)' : 'inherit' }}
                            value={gate.failed}
                            onChange={(e) => {
                              const newGates = qaGates.map(g => g.name === gate.name ? { ...g, failed: parseInt(e.target.value) || 0 } : g);
                              setQaGates(newGates);
                            }}
                          />
                        </td>
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
                          style={{ padding: '0.35rem 0.5rem' }}
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
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <select 
                className="cyber-input" 
                value={newDefectPhase} 
                onChange={(e) => setNewDefectPhase(e.target.value as any)}
              >
                <option value="SIT">SIT</option>
                <option value="UAT">UAT</option>
                <option value="PAT">PAT</option>
                <option value="OAT">OAT</option>
                <option value="PEN">PEN</option>
                <option value="CJT">CJT</option>
                <option value="DVT">DVT</option>
              </select>
              <select 
                className="cyber-input" 
                value={newDefectSquad} 
                onChange={(e) => setNewDefectSquad(e.target.value)}
              >
                {squads.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                {squads.length === 0 && <option value="Unassigned">Unassigned</option>}
              </select>
              <select 
                className="cyber-input" 
                value={newDefectSeverity} 
                onChange={(e) => setNewDefectSeverity(e.target.value as any)}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
              <input 
                className="cyber-input" 
                style={{ flex: 1 }} 
                placeholder="New defect title..." 
                value={newDefectTitle}
                onChange={(e) => setNewDefectTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDefect()}
              />
              <button className="cyber-button" onClick={handleAddDefect} style={{ padding: '0 1rem' }}>
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
