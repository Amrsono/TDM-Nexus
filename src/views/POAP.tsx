import React, { useState } from 'react';
import {
  POAPData,
  POAPStakeholder,
  POAPMilestone,
  POAPAction,
} from '../utils/mockData';
import {
  LayoutTemplate,
  Plus,
  Trash2,
  Presentation,
  ChevronRight,
  Target,
  Users,
  AlertTriangle,
  CheckCircle2,
  Link2,
  Zap,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { exportPOAPToPPT } from '../utils/pptxExporter';

interface POAPProps {
  poapData: POAPData;
  setPoapData: React.Dispatch<React.SetStateAction<POAPData>>;
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string };
}

// ─── Small reusable sub-components ──────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color?: string }> = ({
  icon, title, color = 'var(--color-cyan)'
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
    <span style={{ color }}>{icon}</span>
    <h3 className="mono" style={{ color, fontSize: '0.95rem', letterSpacing: '0.08em' }}>
      {title}
    </h3>
  </div>
);

const ListEditor: React.FC<{
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  maxItems?: number;
}> = ({ items, onChange, placeholder, maxItems = 6 }) => {
  const update = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };
  const add = () => { if (items.length < maxItems) onChange([...items, '']); };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChevronRight size={14} style={{ color: 'var(--color-cyan)', flexShrink: 0 }} />
          <input
            className="cyber-input"
            style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            value={item}
            placeholder={placeholder}
            onChange={e => update(idx, e.target.value)}
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-secondary)', padding: '0.2rem',
              display: 'flex', alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {items.length < maxItems && (
        <button
          type="button"
          onClick={add}
          className="cyber-button"
          style={{ alignSelf: 'flex-start', padding: '0.3rem 0.75rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
        >
          <Plus size={13} /> Add item
        </button>
      )}
    </div>
  );
};

const MilestoneStatus: React.FC<{ status: POAPMilestone['status'] }> = ({ status }) => {
  const color = status === 'Completed' ? 'var(--color-green)' : status === 'In Progress' ? 'var(--color-cyan)' : 'var(--color-text-secondary)';
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, color,
      border: `1px solid ${color}`, borderRadius: '4px',
      padding: '0.15rem 0.5rem', whiteSpace: 'nowrap',
      fontFamily: 'var(--font-mono)',
    }}>
      {status.toUpperCase()}
    </span>
  );
};

// ─── Main POAP View ──────────────────────────────────────────────────────────

export const POAP: React.FC<POAPProps> = ({ poapData, setPoapData, ragStatus }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const set = <K extends keyof POAPData>(key: K, value: POAPData[K]) => {
    setPoapData(prev => ({ ...prev, [key]: value }));
  };

  // Milestone helpers
  const updateMilestone = (id: string, patch: Partial<POAPMilestone>) => {
    set('milestones', poapData.milestones.map(m => m.id === id ? { ...m, ...patch } : m));
  };
  const addMilestone = () => {
    const newM: POAPMilestone = {
      id: `pm-${Date.now()}`,
      name: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Not Started',
    };
    set('milestones', [...poapData.milestones, newM]);
  };
  const removeMilestone = (id: string) => {
    set('milestones', poapData.milestones.filter(m => m.id !== id));
  };

  // Stakeholder helpers
  const updateStakeholder = (id: string, patch: Partial<POAPStakeholder>) => {
    set('stakeholders', poapData.stakeholders.map(s => s.id === id ? { ...s, ...patch } : s));
  };
  const addStakeholder = () => {
    const newS: POAPStakeholder = {
      id: `st-${Date.now()}`,
      name: '',
      role: '',
      engagement: 'Informed',
    };
    set('stakeholders', [...poapData.stakeholders, newS]);
  };
  const removeStakeholder = (id: string) => {
    set('stakeholders', poapData.stakeholders.filter(s => s.id !== id));
  };

  // Action helpers
  const updateAction = (id: string, patch: Partial<POAPAction>) => {
    set('nextActions', poapData.nextActions.map(a => a.id === id ? { ...a, ...patch } : a));
  };
  const addAction = () => {
    const newA: POAPAction = {
      id: `na-${Date.now()}`,
      description: '',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0],
    };
    set('nextActions', [...poapData.nextActions, newA]);
  };
  const removeAction = (id: string) => {
    set('nextActions', poapData.nextActions.filter(a => a.id !== id));
  };

  const handleExport = () => {
    exportPOAPToPPT(poapData, ragStatus);
  };

  const variance = poapData.totalBudget - poapData.forecastToComplete;
  const spentPct = poapData.totalBudget > 0
    ? Math.min(100, Math.round((poapData.spentToDate / poapData.totalBudget) * 100))
    : 0;

  return (
    <div className="poap-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Export Banner ────────────────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderColor: 'rgba(189,0,255,0.35)',
        background: 'linear-gradient(90deg, rgba(189,0,255,0.07) 0%, rgba(0,242,254,0.04) 100%)',
      }}>
        <div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-purple)', marginBottom: '0.25rem' }}>
            PLAN ON A PAGE — POAP BUILDER
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Fill in all sections below, then export a single-slide executive Plan on a Page to PowerPoint.
          </p>
        </div>
        <button
          className="cyber-button secondary"
          onClick={handleExport}
          style={{ flexShrink: 0, padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
        >
          <Presentation size={17} />
          Export to PPT
        </button>
      </div>

      {/* ── Row 1: Project Identity ──────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <SectionHeader icon={<FileText size={17} />} title="PROJECT IDENTITY" />
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="form-group">
            <label>Project Name</label>
            <input className="cyber-input" value={poapData.projectName}
              onChange={e => set('projectName', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Project Code</label>
            <input className="cyber-input" value={poapData.projectCode}
              onChange={e => set('projectCode', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Project Phase</label>
            <input className="cyber-input" value={poapData.projectPhase}
              onChange={e => set('projectPhase', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Project Manager</label>
            <input className="cyber-input" value={poapData.projectManager}
              onChange={e => set('projectManager', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Executive Sponsor</label>
            <input className="cyber-input" value={poapData.executiveSponsor}
              onChange={e => set('executiveSponsor', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Reporting Date</label>
            <input className="cyber-input" type="date" value={poapData.reportingDate}
              onChange={e => set('reportingDate', e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Vision + Scope ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Vision & Objectives */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<Target size={17} />} title="VISION & OBJECTIVES" color="var(--color-purple)" />
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Problem Statement</label>
            <textarea
              className="cyber-input"
              rows={3}
              style={{ resize: 'none', fontSize: '0.85rem' }}
              value={poapData.problemStatement}
              onChange={e => set('problemStatement', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Strategic Objectives</label>
            <ListEditor
              items={poapData.objectives}
              onChange={val => set('objectives', val)}
              placeholder="Enter strategic objective..."
              maxItems={4}
            />
          </div>
        </div>

        {/* Scope */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<ChevronRight size={17} />} title="PROJECT SCOPE" color="var(--color-green)" />
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'var(--color-green)' }}>✓ In Scope</label>
            <ListEditor
              items={poapData.inScope}
              onChange={val => set('inScope', val)}
              placeholder="In-scope item..."
              maxItems={7}
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--color-amber)' }}>✗ Out of Scope</label>
            <ListEditor
              items={poapData.outOfScope}
              onChange={val => set('outOfScope', val)}
              placeholder="Out-of-scope item..."
              maxItems={5}
            />
          </div>
        </div>
      </div>

      {/* ── Row 3: Milestones ────────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SectionHeader icon={<Calendar size={17} />} title="KEY MILESTONES / TIMELINE" color="var(--color-cyan)" />
          <button className="cyber-button" onClick={addMilestone}
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
            <Plus size={13} /> Add Milestone
          </button>
        </div>
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Milestone Name</th>
                <th style={{ width: '20%' }}>Target Date</th>
                <th style={{ width: '20%' }}>Status</th>
                <th style={{ width: '20%' }}>
                  {/* Timeline strip preview */}
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>TIMELINE</span>
                </th>
                <th style={{ width: '5%' }}></th>
              </tr>
            </thead>
            <tbody>
              {poapData.milestones.map((m, idx) => {
                const totalMs = poapData.milestones.length;
                const pct = ((idx + 1) / totalMs) * 100;
                return (
                  <tr key={m.id}>
                    <td>
                      <input
                        className="cyber-input"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem', width: '100%' }}
                        value={m.name}
                        placeholder="Milestone name..."
                        onChange={e => updateMilestone(m.id, { name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="cyber-input"
                        type="date"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                        value={m.date}
                        onChange={e => updateMilestone(m.id, { date: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="cyber-input"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        value={m.status}
                        onChange={e => updateMilestone(m.id, { status: e.target.value as any })}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      {/* Tiny inline timeline dot */}
                      <div style={{ position: 'relative', height: '8px', background: 'rgba(0,242,254,0.08)', borderRadius: '4px' }}>
                        <div style={{
                          position: 'absolute', left: 0, top: 0, height: '100%',
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, var(--color-cyan), var(--color-purple))',
                          borderRadius: '4px', transition: 'width 0.4s ease',
                        }} />
                        <div style={{
                          position: 'absolute', top: '50%', left: `${pct}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '12px', height: '12px', borderRadius: '50%',
                          background: m.status === 'Completed' ? 'var(--color-green)'
                            : m.status === 'In Progress' ? 'var(--color-cyan)' : '#334155',
                          border: '2px solid var(--color-bg)',
                          boxShadow: m.status === 'Completed'
                            ? '0 0 6px var(--color-green)' : m.status === 'In Progress'
                            ? '0 0 6px var(--color-cyan)' : 'none',
                        }} />
                      </div>
                      <MilestoneStatus status={m.status} />
                    </td>
                    <td>
                      <button
                        onClick={() => removeMilestone(m.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '0.2rem' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row 4: Budget + RAG ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Budget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<DollarSign size={17} />} title="BUDGET SUMMARY" color="var(--color-amber)" />
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Total Budget ($)</label>
              <input
                className="cyber-input"
                type="number"
                value={poapData.totalBudget}
                onChange={e => set('totalBudget', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Spent to Date ($)</label>
              <input
                className="cyber-input"
                type="number"
                value={poapData.spentToDate}
                onChange={e => set('spentToDate', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Forecast to Complete ($)</label>
              <input
                className="cyber-input"
                type="number"
                value={poapData.forecastToComplete}
                onChange={e => set('forecastToComplete', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Variance</label>
              <div className="cyber-input" style={{
                color: variance >= 0 ? 'var(--color-green)' : '#ef4444',
                fontWeight: 700, fontFamily: 'var(--font-mono)',
                display: 'flex', alignItems: 'center',
              }}>
                {variance >= 0 ? '+' : ''}{variance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Spend bar */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
              <span>Spend progress</span>
              <span className="mono" style={{ color: 'var(--color-amber)' }}>{spentPct}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${spentPct}%`,
                background: spentPct > 90
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : 'linear-gradient(90deg, var(--color-amber), var(--color-green))',
                borderRadius: '3px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>

        {/* RAG read-only display */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<Zap size={17} />} title="RAG STATUS (FROM GOVERNANCE)" color="var(--color-green)" />
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            RAG values are set in the Project Governance tab and reflected here automatically.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(['schedule', 'budget', 'scope', 'quality', 'overall'] as const).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', textTransform: 'capitalize', color: 'var(--color-text-secondary)' }}>
                  {key}
                </span>
                <span className={`rag-badge ${ragStatus[key].toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                  {ragStatus[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Risks + Stakeholders ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Key Risks */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<AlertTriangle size={17} />} title="KEY RISKS (TOP 3)" color="var(--color-amber)" />
          <ListEditor
            items={poapData.keyRisks}
            onChange={val => set('keyRisks', val)}
            placeholder="Describe key risk..."
            maxItems={3}
          />
        </div>

        {/* Stakeholders */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <SectionHeader icon={<Users size={17} />} title="KEY STAKEHOLDERS" color="var(--color-cyan)" />
            <button className="cyber-button" onClick={addStakeholder}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
              <Plus size={13} /> Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {poapData.stakeholders.map(s => (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className="cyber-input"
                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                  value={s.name}
                  placeholder="Name"
                  onChange={e => updateStakeholder(s.id, { name: e.target.value })}
                />
                <input
                  className="cyber-input"
                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                  value={s.role}
                  placeholder="Role"
                  onChange={e => updateStakeholder(s.id, { role: e.target.value })}
                />
                <select
                  className="cyber-input"
                  style={{ padding: '0.3rem 0.4rem', fontSize: '0.78rem' }}
                  value={s.engagement}
                  onChange={e => updateStakeholder(s.id, { engagement: e.target.value as any })}
                >
                  <option value="Accountable">Accountable</option>
                  <option value="Consulted">Consulted</option>
                  <option value="Informed">Informed</option>
                </select>
                <button
                  onClick={() => removeStakeholder(s.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 6: Success Criteria + Dependencies + Assumptions ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<CheckCircle2 size={17} />} title="SUCCESS CRITERIA" color="var(--color-green)" />
          <ListEditor
            items={poapData.successCriteria}
            onChange={val => set('successCriteria', val)}
            placeholder="Define success criterion..."
            maxItems={5}
          />
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<Link2 size={17} />} title="KEY DEPENDENCIES" color="var(--color-purple)" />
          <ListEditor
            items={poapData.dependencies}
            onChange={val => set('dependencies', val)}
            placeholder="External dependency..."
            maxItems={5}
          />
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionHeader icon={<FileText size={17} />} title="ASSUMPTIONS" color="var(--color-text-secondary)" />
          <ListEditor
            items={poapData.assumptions}
            onChange={val => set('assumptions', val)}
            placeholder="State assumption..."
            maxItems={5}
          />
        </div>
      </div>

      {/* ── Row 7: Next Steps / Actions ──────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SectionHeader icon={<Zap size={17} />} title="NEXT STEPS & ACTIONS" color="var(--color-cyan)" />
          <button className="cyber-button" onClick={addAction}
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
            <Plus size={13} /> Add Action
          </button>
        </div>
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '55%' }}>Action Description</th>
                <th style={{ width: '20%' }}>Owner</th>
                <th style={{ width: '18%' }}>Due Date</th>
                <th style={{ width: '7%' }}></th>
              </tr>
            </thead>
            <tbody>
              {poapData.nextActions.map(a => (
                <tr key={a.id}>
                  <td>
                    <input
                      className="cyber-input"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem', width: '100%' }}
                      value={a.description}
                      placeholder="Describe action..."
                      onChange={e => updateAction(a.id, { description: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="cyber-input"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem', width: '100%' }}
                      value={a.owner}
                      placeholder="Owner name"
                      onChange={e => updateAction(a.id, { owner: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="cyber-input"
                      type="date"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                      value={a.dueDate}
                      onChange={e => updateAction(a.id, { dueDate: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => removeAction(a.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer export repeat ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '1rem' }}>
        <button
          className="cyber-button secondary"
          onClick={handleExport}
          style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
        >
          <Presentation size={17} />
          Export Plan on a Page to PPT
        </button>
      </div>

    </div>
  );
};
