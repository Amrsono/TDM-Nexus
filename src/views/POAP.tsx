import React from 'react';
import { POAPData } from '../utils/mockData';
import { LayoutTemplate, Target, AlertTriangle, Users } from 'lucide-react';

interface POAPProps {
  poapData: POAPData;
  setPoapData: React.Dispatch<React.SetStateAction<POAPData>>;
  ragStatus: any;
}

export function POAP({ poapData, setPoapData, ragStatus }: POAPProps) {
  return (
    <div className="poap-container">
      <div className="poap-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="poap-title">{poapData.projectName}</h1>
            <p className="poap-subtitle mono">
              Project Code: {poapData.projectCode} | Increment: {poapData.piIncrement} | Reporting Date: {poapData.reportingDate}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="poap-rag-summary">
              <span className={`rag-badge ${ragStatus.overall.toLowerCase()}`}>{ragStatus.overall}</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>Overall RAG</span>
            </div>
          </div>
        </div>
      </div>

      <div className="poap-grid">
        <div className="poap-panel">
          <div className="poap-panel-title"><Target size={16} /> Vision & Problem Statement</div>
          <p className="poap-text">{poapData.problemStatement}</p>
          <div className="poap-section-title" style={{ marginTop: '1rem' }}>Key Objectives</div>
          <ul className="poap-list">
            {poapData.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
          </ul>
        </div>

        <div className="poap-panel">
          <div className="poap-panel-title"><LayoutTemplate size={16} /> Scope & Budget</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div className="poap-section-title">In Scope</div>
              <ul className="poap-list">
                {poapData.inScope.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <div className="poap-section-title">Out of Scope</div>
              <ul className="poap-list" style={{ color: 'var(--color-text-secondary)' }}>
                {poapData.outOfScope.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="poap-section-title" style={{ marginTop: '1rem' }}>Financial Summary</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="hud-stat-value mono">Total: ${(poapData.totalBudget / 1000000).toFixed(2)}M</div>
            <div className="hud-stat-value mono">Spent: ${(poapData.spentToDate / 1000000).toFixed(2)}M</div>
          </div>
        </div>

        <div className="poap-panel">
          <div className="poap-panel-title"><Users size={16} /> Stakeholders & Roles</div>
          <table className="poap-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {poapData.stakeholders.map(st => (
                <tr key={st.id}>
                  <td>{st.name}</td>
                  <td>{st.role}</td>
                  <td>{st.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="poap-panel">
          <div className="poap-panel-title"><AlertTriangle size={16} /> Key Risks & Next Steps</div>
          <div className="poap-section-title">Top Risks</div>
          <ul className="poap-list">
            {poapData.keyRisks.map((risk, i) => <li key={i}>{risk}</li>)}
          </ul>
          <div className="poap-section-title" style={{ marginTop: '1rem' }}>Next Actions</div>
          <ul className="poap-list">
            {poapData.nextActions.map(na => (
              <li key={na.id}><strong>{na.owner}:</strong> {na.description} (Due: {na.dueDate})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
