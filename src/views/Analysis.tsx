import React, { useState } from 'react';
import { Requirement, DomainBuild } from '../utils/mockData';
import { Plus, Check, Edit, Info, Compass } from 'lucide-react';

interface AnalysisProps {
  requirements: Requirement[];
  setRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>;
  domains: DomainBuild[];
  renameDomain: (id: string, newName: string) => void;
}

export const Analysis: React.FC<AnalysisProps> = ({ requirements, setRequirements, domains, renameDomain }) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  
  // Local rename states
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // New requirement form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Functional' | 'Non-Functional'>('Functional');
  const [newPriority, setNewPriority] = useState<'P1' | 'P2' | 'P3'>('P2');
  const [newDomain, setNewDomain] = useState(domains[0]?.name || 'Billing & Rating Engine');

  const handleSaveRename = (domainId: string, oldName: string, newName: string) => {
    const cleanNewName = newName.trim();
    if (cleanNewName && oldName !== cleanNewName) {
      renameDomain(domainId, cleanNewName);
      if (selectedDomain === oldName) {
        setSelectedDomain(cleanNewName);
      }
      if (newDomain === oldName) {
        setNewDomain(cleanNewName);
      }
    }
    setEditingDomainId(null);
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReq: Requirement = {
      id: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
      title: newTitle,
      type: newType,
      priority: newPriority,
      status: 'Draft',
      domain: newDomain
    };

    setRequirements(prev => [...prev, newReq]);
    setNewTitle('');
  };

  const handleStatusChange = (id: string, newStatus: 'Draft' | 'In Review' | 'Approved') => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filteredRequirements = selectedDomain 
    ? requirements.filter(r => r.domain === selectedDomain)
    : requirements;

  return (
    <div className="analysis-view">
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Compass size={18} style={{ color: 'var(--color-cyan)' }} />
          <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
            SYSTEM DOMAINS & ARCHITECTURE MAPPING
          </h3>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Select an architectural domain node to filter the requirements backlog linked to it. Double-click or click the edit icon to rename nodes.
        </p>

        <div className="domain-map-nodes">
          <div 
            className={`map-node ${selectedDomain === null ? 'active' : ''}`}
            onClick={() => setSelectedDomain(null)}
          >
            <div className="map-node-title">ALL DOMAINS</div>
            <div className="map-node-lead" style={{ color: 'var(--color-cyan)' }}>Show Full Backlog</div>
          </div>

          {domains.map(d => {
            const isEditing = editingDomainId === d.id;
            return (
              <div 
                key={d.id}
                className={`map-node ${selectedDomain === d.name ? 'active' : ''}`}
                onClick={() => {
                  if (!isEditing) {
                    setSelectedDomain(d.name);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingDomainId(d.id);
                  setEditingName(d.name);
                }}
                style={{ position: 'relative', minWidth: '160px' }}
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveRename(d.id, d.name, editingName);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}
                  >
                    <input
                      type="text"
                      className="cyber-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                      onBlur={() => handleSaveRename(d.id, d.name, editingName)}
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.2rem 0.4rem',
                        width: '130px',
                        textAlign: 'center',
                        background: 'rgba(7, 11, 25, 0.95)',
                        border: '1px solid var(--color-cyan)',
                        color: '#fff'
                      }}
                    />
                    <div style={{ fontSize: '0.55rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      PRESS ENTER TO SAVE
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div className="map-node-title">{d.name}</div>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: 'var(--color-text-secondary)',
                          opacity: 0.6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'opacity 0.2s'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDomainId(d.id);
                          setEditingName(d.name);
                        }}
                        title="Edit Domain Name"
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                      >
                        <Edit size={12} style={{ color: 'var(--color-cyan)' }} />
                      </button>
                    </div>
                    <div className="map-node-lead">{d.lead}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Backlog Grid */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
              REQUIREMENTS TRACEABILITY BACKLOG {selectedDomain && `(${selectedDomain})`}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Showing {filteredRequirements.length} entries
            </span>
          </div>

          <div className="cyber-table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Domain</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequirements.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ color: 'var(--color-cyan)' }}>{r.id}</td>
                    <td>{r.title}</td>
                    <td>
                      <span style={{ color: r.type === 'Non-Functional' ? 'var(--color-purple)' : 'var(--color-text-primary)' }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>{r.priority}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{r.domain}</td>
                    <td>
                      <select
                        className="cyber-input"
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as any)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Requirement Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            ADD NEW REQUIREMENT
          </h3>
          <form onSubmit={handleAddRequirement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Requirement Description</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. JWT rotation policy..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Requirement Type</label>
              <select
                className="cyber-input"
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
              >
                <option value="Functional">Functional (Behavior)</option>
                <option value="Non-Functional">Non-Functional (NFR)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority Tier</label>
              <select
                className="cyber-input"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
              >
                <option value="P1">P1 - Critical Path</option>
                <option value="P2">P2 - Core Scope</option>
                <option value="P3">P3 - Nice to Have</option>
              </select>
            </div>

            <div className="form-group">
              <label>Impacted Domain Node</label>
              <select
                className="cyber-input"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              >
                {domains.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="cyber-button" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              <Plus size={16} /> ADD TO BACKLOG
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
