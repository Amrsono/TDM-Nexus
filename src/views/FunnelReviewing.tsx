import React from 'react';
import { ProjectFinancials } from '../utils/mockData';
import { FileSearch, Target, PlayCircle, ClipboardCheck } from 'lucide-react';

interface FunnelReviewingProps {
  financials: ProjectFinancials;
  setFinancials: React.Dispatch<React.SetStateAction<ProjectFinancials>>;
}

export function FunnelReviewing({ financials, setFinancials }: FunnelReviewingProps) {
  return (
    <div className="view-grid">
      <div className="grid-col span-8">
        <div className="cyber-card">
          <div className="card-header">
            <Target size={18} className="mono" />
            <h3 className="mono">Funnel & Mobilisation Phase</h3>
          </div>
          <div className="card-body">
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Capture ideas, scope epics, and prepare for portfolio consultation. Ensure early sizing is complete before the Stop/Go decision.
            </p>
            
            <div className="input-group">
              <label>Business Case NPV ($)</label>
              <input 
                type="number" 
                className="cyber-input" 
                value={financials.NPV} 
                onChange={(e) => setFinancials({...financials, NPV: Number(e.target.value)})}
              />
            </div>
            
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label>IRR (%)</label>
              <input 
                type="number" 
                className="cyber-input" 
                value={financials.IRR} 
                onChange={(e) => setFinancials({...financials, IRR: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid-col span-4">
        <div className="cyber-card">
          <div className="card-header">
            <ClipboardCheck size={18} className="mono" />
            <h3 className="mono">Early Readiness Checklist</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={financials.peDemandSized}
                onChange={(e) => setFinancials({...financials, peDemandSized: e.target.checked})}
                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-cyan)' }}
              />
              <span className="mono">PE Demand Sized</span>
            </label>

            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={financials.vromApproved}
                onChange={(e) => setFinancials({...financials, vromApproved: e.target.checked})}
                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-cyan)' }}
              />
              <span className="mono">VROM Approved</span>
            </label>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid var(--color-cyan)', borderRadius: '4px' }}>
              <h4 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlayCircle size={16} />
                Stop/Go Decision
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {financials.peDemandSized && financials.vromApproved 
                  ? "Mobilisation Approved. Ready for Analysing phase."
                  : "Pending VROM and PE Demand early sizing."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
