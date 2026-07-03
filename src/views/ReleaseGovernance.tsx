import React, { useState } from 'react';
import { RiskIssue, ProjectFinancials, PortfolioSquad, Defect, ChecklistItem } from '../utils/mockData';
import { Scale, AlertTriangle, CheckSquare, Plus } from 'lucide-react';

interface ReleaseGovernanceProps {
  risks: RiskIssue[];
  setRisks: React.Dispatch<React.SetStateAction<RiskIssue[]>>;
  ragStatus: any;
  setRagStatus: any;
  financials: ProjectFinancials;
  squads: PortfolioSquad[];
  defects: Defect[];
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
}

export function ReleaseGovernance({ 
  risks, setRisks, ragStatus, setRagStatus, checklist, setChecklist 
}: ReleaseGovernanceProps) {
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newRiskTitle, setNewRiskTitle] = useState('');
  const [newRiskType, setNewRiskType] = useState<'Risk' | 'Issue' | 'Dependency'>('Risk');

  const handleAddChecklist = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist([...checklist, {
      id: `chk-${Date.now()}`,
      category: 'CP0',
      item: newChecklistItem,
      checked: false,
      owner: 'Unassigned'
    }]);
    setNewChecklistItem('');
  };

  const handleAddRisk = () => {
    if (!newRiskTitle.trim()) return;
    setRisks([...risks, {
      id: `RSK-${Math.floor(Math.random() * 10000)}`,
      type: newRiskType,
      title: newRiskTitle,
      impact: 'Medium',
      mitigation: '',
      status: 'Open'
    }]);
    setNewRiskTitle('');
  };

  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <Scale size={18} className="mono" />
            <h3 className="mono">Release Governance & RAGs</h3>
          </div>
          <div className="card-body responsive-flex" style={{ alignItems: 'stretch' }}>
            {Object.keys(ragStatus).map((key) => (
              <div key={key} className="input-group" style={{ flex: 1 }}>
                <label style={{ textTransform: 'capitalize' }}>{key} RAG</label>
                <select 
                  className="cyber-input"
                  value={ragStatus[key]}
                  onChange={(e) => setRagStatus({ ...ragStatus, [key]: e.target.value })}
                >
                  <option value="Green">Green</option>
                  <option value="Amber">Amber</option>
                  <option value="Red">Red</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-col span-6">
        <div className="cyber-card">
          <div className="card-header">
            <CheckSquare size={18} className="mono" />
            <h3 className="mono">Release Checkpoints</h3>
          </div>
          <div className="card-body">
            {checklist.map(item => (
              <label key={item.id} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
                <input 
                  type="checkbox" 
                  checked={item.checked}
                  onChange={(e) => {
                    const newChecklist = checklist.map(c => c.id === item.id ? { ...c, checked: e.target.checked } : c);
                    setChecklist(newChecklist);
                  }}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-cyan)' }}
                />
                <div>
                  <span className="mono" style={{ color: 'var(--color-cyan)', marginRight: '0.5rem' }}>[{item.category}]</span>
                  {item.item}
                </div>
              </label>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <input 
                className="cyber-input" 
                style={{ flex: 1 }} 
                placeholder="New checkpoint description..." 
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
              />
              <button className="cyber-button" onClick={handleAddChecklist} style={{ padding: '0 1rem' }}>
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-col span-6">
        <div className="cyber-card">
          <div className="card-header">
            <AlertTriangle size={18} className="mono" />
            <h3 className="mono">RAIDs (Risks & Issues)</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map(r => (
                    <tr key={r.id}>
                      <td className="mono">{r.id}</td>
                      <td>{r.type}</td>
                      <td>{r.title}</td>
                      <td>
                        <select 
                          className="cyber-input" 
                          style={{ padding: '0.35rem 0.5rem' }}
                          value={r.status}
                          onChange={(e) => {
                            const newRisks = risks.map(x => x.id === r.id ? { ...x, status: e.target.value as any } : x);
                            setRisks(newRisks);
                          }}
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
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <select 
                className="cyber-input" 
                value={newRiskType} 
                onChange={(e) => setNewRiskType(e.target.value as any)}
              >
                <option value="Risk">Risk</option>
                <option value="Issue">Issue</option>
                <option value="Dependency">Dependency</option>
              </select>
              <input 
                className="cyber-input" 
                style={{ flex: 1 }} 
                placeholder="New risk or issue..." 
                value={newRiskTitle}
                onChange={(e) => setNewRiskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRisk()}
              />
              <button className="cyber-button" onClick={handleAddRisk} style={{ padding: '0 1rem' }}>
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
