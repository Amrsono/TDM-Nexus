import React, { useState } from 'react';
import { ADOWorkItem, PortfolioSquad } from '../utils/mockData';
import { GitPullRequest, Search, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface AnalysingProps {
  adoWorkItems: ADOWorkItem[];
  setAdoWorkItems: React.Dispatch<React.SetStateAction<ADOWorkItem[]>>;
  squads: PortfolioSquad[];
  setSquads: React.Dispatch<React.SetStateAction<PortfolioSquad[]>>;
  renameSquad: (id: string, newName: string) => void;
  deleteSquad: (id: string) => void;
  clearAllSquads: () => void;
}

export function Analysing({ adoWorkItems, setAdoWorkItems, squads, setSquads, renameSquad, deleteSquad, clearAllSquads }: AnalysingProps) {
  // ADO state
  const [editingAdo, setEditingAdo] = useState<string | null>(null);
  const [adoForm, setAdoForm] = useState<Partial<ADOWorkItem>>({});
  
  const [newAdoType, setNewAdoType] = useState<'Epic' | 'Feature' | 'User Story'>('Feature');
  const [newAdoTitle, setNewAdoTitle] = useState('');
  const [newAdoPortfolio, setNewAdoPortfolio] = useState(squads.length > 0 ? squads[0].name : 'Unassigned');

  // Squad state
  const [editingSquad, setEditingSquad] = useState<string | null>(null);
  const [squadForm, setSquadForm] = useState<Partial<PortfolioSquad>>({});

  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadLead, setNewSquadLead] = useState('');
  const [newSquadRelease, setNewSquadRelease] = useState('');
  const [newSquadDesc, setNewSquadDesc] = useState('');

  // Handlers for ADO
  const handleEditAdo = (item: ADOWorkItem) => {
    setEditingAdo(item.id);
    setAdoForm(item);
  };

  const handleSaveAdo = () => {
    if (editingAdo && adoForm.title) {
      setAdoWorkItems(prev => prev.map(i => i.id === editingAdo ? { ...i, ...adoForm } as ADOWorkItem : i));
    }
    setEditingAdo(null);
  };

  const handleDeleteAdo = (id: string) => {
    if (window.confirm("Are you sure you want to delete this ADO Work Item?")) {
      setAdoWorkItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleAddAdo = () => {
    if (!newAdoTitle.trim()) return;
    setAdoWorkItems([...adoWorkItems, {
      id: Math.floor(Math.random() * 100000).toString(),
      type: newAdoType,
      title: newAdoTitle,
      portfolio: newAdoPortfolio,
      status: 'Draft'
    }]);
    setNewAdoTitle('');
  };

  const handleClearAdos = () => {
    if (window.confirm("Are you sure you want to clear all ADO Work Items?")) {
      setAdoWorkItems([]);
    }
  };

  // Handlers for Squads
  const handleEditSquad = (squad: PortfolioSquad) => {
    setEditingSquad(squad.id);
    setSquadForm(squad);
  };

  const handleSaveSquad = () => {
    if (editingSquad && squadForm.name) {
      const oldSquad = squads.find(s => s.id === editingSquad);
      if (oldSquad && oldSquad.name !== squadForm.name) {
        renameSquad(oldSquad.id, squadForm.name);
      }
      setSquads(prev => prev.map(s => s.id === editingSquad ? { ...s, ...squadForm } as PortfolioSquad : s));
    }
    setEditingSquad(null);
  };

  const handleDeleteSquad = (id: string) => {
    if (window.confirm("Are you sure you want to delete this squad? This will unassign related work items and defects, and clear financial allocations.")) {
      deleteSquad(id);
    }
  };

  const handleAddSquad = () => {
    if (!newSquadName.trim()) return;
    setSquads([...squads, {
      id: `sq-${Math.floor(Math.random() * 10000)}`,
      name: newSquadName,
      lead: newSquadLead,
      targetRelease: newSquadRelease,
      description: newSquadDesc
    }]);
    setNewSquadName('');
    setNewSquadLead('');
    setNewSquadRelease('');
    setNewSquadDesc('');
  };

  const handleClearSquads = () => {
    if (window.confirm("Are you sure you want to clear all Portfolio Squads? This will also unassign related work items and defects, and clear financial allocations.")) {
      clearAllSquads();
    }
  };

  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitPullRequest size={18} className="mono" />
              <h3 className="mono">ADO Work Items & HLD Readiness</h3>
            </div>
            <button className="cyber-button" onClick={handleClearAdos} style={{ padding: '0.2rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-red)' }}>
              <Trash2 size={14} style={{ marginRight: '4px' }} /> Clear All
            </button>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Portfolio/Squad</th>
                    <th>State</th>
                    <th style={{ width: '80px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adoWorkItems.map(item => (
                    <tr key={item.id}>
                      {editingAdo === item.id ? (
                        <>
                          <td className="mono">{item.id}</td>
                          <td>
                            <select className="cyber-input" value={adoForm.type} onChange={(e) => setAdoForm({...adoForm, type: e.target.value as any})}>
                              <option value="Epic">Epic</option>
                              <option value="Feature">Feature</option>
                              <option value="User Story">User Story</option>
                            </select>
                          </td>
                          <td><input className="cyber-input" value={adoForm.title || ''} onChange={(e) => setAdoForm({...adoForm, title: e.target.value})} /></td>
                          <td><input className="cyber-input" value={adoForm.portfolio || ''} onChange={(e) => setAdoForm({...adoForm, portfolio: e.target.value})} /></td>
                          <td>
                            <select className="cyber-input" value={adoForm.status} onChange={(e) => setAdoForm({...adoForm, status: e.target.value as any})}>
                              <option value="Draft">Draft</option>
                              <option value="In Review">In Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Committed">Committed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Ready to Deploy">Ready to Deploy</option>
                              <option value="Deployed">Deployed</option>
                            </select>
                          </td>
                          <td style={{ display: 'flex', gap: '4px' }}>
                            <button className="icon-button" onClick={handleSaveAdo} style={{ color: 'var(--color-green)' }}><Save size={16} /></button>
                            <button className="icon-button" onClick={() => setEditingAdo(null)} style={{ color: 'var(--color-red)' }}><X size={16} /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="mono">{item.id}</td>
                          <td><span className="status-badge" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>{item.type}</span></td>
                          <td>{item.title}</td>
                          <td>{item.portfolio}</td>
                          <td>
                            <select 
                              className="cyber-input" 
                              style={{ padding: '0.35rem 0.5rem' }}
                              value={item.status}
                              onChange={(e) => setAdoWorkItems(adoWorkItems.map(i => i.id === item.id ? { ...i, status: e.target.value as any } : i))}
                            >
                              <option value="Draft">Draft</option>
                              <option value="In Review">In Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Committed">Committed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Ready to Deploy">Ready to Deploy</option>
                              <option value="Deployed">Deployed</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="icon-button" onClick={() => handleEditAdo(item)} title="Edit"><Edit2 size={16} /></button>
                              <button className="icon-button" onClick={() => handleDeleteAdo(item.id)} style={{ color: 'var(--color-red)' }} title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <select className="cyber-input" value={newAdoType} onChange={(e) => setNewAdoType(e.target.value as any)}>
                <option value="Epic">Epic</option>
                <option value="Feature">Feature</option>
                <option value="User Story">User Story</option>
              </select>
              <select className="cyber-input" value={newAdoPortfolio} onChange={(e) => setNewAdoPortfolio(e.target.value)}>
                {squads.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                {squads.length === 0 && <option value="Unassigned">Unassigned</option>}
              </select>
              <input className="cyber-input" style={{ flex: 1 }} placeholder="New ADO item title..." value={newAdoTitle} onChange={(e) => setNewAdoTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddAdo()} />
              <button className="cyber-button" onClick={handleAddAdo} style={{ padding: '0 1rem' }}><Plus size={16} /> Add</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-col span-12">
        <div className="cyber-card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} className="mono" />
              <h3 className="mono">Portfolio Squads Analysis</h3>
            </div>
            <button className="cyber-button" onClick={handleClearSquads} style={{ padding: '0.2rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-red)' }}>
              <Trash2 size={14} style={{ marginRight: '4px' }} /> Clear All
            </button>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Squad Name (Domain)</th>
                    <th>Lead</th>
                    <th>Target Release</th>
                    <th>Description</th>
                    <th style={{ width: '80px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {squads.map(squad => (
                    <tr key={squad.id}>
                      {editingSquad === squad.id ? (
                        <>
                          <td><input className="cyber-input inline-edit" value={squadForm.name || ''} onChange={(e) => setSquadForm({...squadForm, name: e.target.value})} /></td>
                          <td><input className="cyber-input inline-edit" value={squadForm.lead || ''} onChange={(e) => setSquadForm({...squadForm, lead: e.target.value})} /></td>
                          <td><input className="cyber-input inline-edit" value={squadForm.targetRelease || ''} onChange={(e) => setSquadForm({...squadForm, targetRelease: e.target.value})} /></td>
                          <td><input className="cyber-input inline-edit" value={squadForm.description || ''} onChange={(e) => setSquadForm({...squadForm, description: e.target.value})} /></td>
                          <td style={{ display: 'flex', gap: '4px' }}>
                            <button className="icon-button" onClick={handleSaveSquad} style={{ color: 'var(--color-green)' }}><Save size={16} /></button>
                            <button className="icon-button" onClick={() => setEditingSquad(null)} style={{ color: 'var(--color-red)' }}><X size={16} /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <input 
                              type="text" 
                              className="cyber-input inline-edit" 
                              value={squad.name}
                              onChange={(e) => renameSquad(squad.id, e.target.value)}
                            />
                          </td>
                          <td>{squad.lead}</td>
                          <td className="mono">{squad.targetRelease}</td>
                          <td>{squad.description}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="icon-button" onClick={() => handleEditSquad(squad)} title="Edit"><Edit2 size={16} /></button>
                              <button className="icon-button" onClick={() => handleDeleteSquad(squad.id)} style={{ color: 'var(--color-red)' }} title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <input className="cyber-input" style={{ width: '20%' }} placeholder="Squad Name" value={newSquadName} onChange={(e) => setNewSquadName(e.target.value)} />
              <input className="cyber-input" style={{ width: '20%' }} placeholder="Lead Name" value={newSquadLead} onChange={(e) => setNewSquadLead(e.target.value)} />
              <input className="cyber-input" style={{ width: '20%' }} placeholder="Target Release" value={newSquadRelease} onChange={(e) => setNewSquadRelease(e.target.value)} />
              <input className="cyber-input" style={{ flex: 1 }} placeholder="Description..." value={newSquadDesc} onChange={(e) => setNewSquadDesc(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSquad()} />
              <button className="cyber-button" onClick={handleAddSquad} style={{ padding: '0 1rem' }}><Plus size={16} /> Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
