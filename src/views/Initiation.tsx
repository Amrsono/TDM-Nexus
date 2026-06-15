import React, { useState } from 'react';
import { ProjectFinancials } from '../utils/mockData';
import { Landmark, TrendingUp, Calendar, ShieldAlert } from 'lucide-react';

interface InitiationProps {
  financials: ProjectFinancials;
  setFinancials: React.Dispatch<React.SetStateAction<ProjectFinancials>>;
}

export const Initiation: React.FC<InitiationProps> = ({ financials, setFinancials }) => {
  const [businessCase, setBusinessCase] = useState(
    'Launch the new Unified Mobile & Digital Proposition platform, enabling instant eSIM activation and carrier-billing integration for third-party streaming partners. Replaces manual SIM processes and legacy billing interfaces, yielding an expected revenue benefit of $12.5M over 5 years.'
  );

  const handleInputChange = (field: keyof ProjectFinancials, value: number) => {
    setFinancials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const remainingBudget = (financials.capexLimit + financials.opexLimit) - financials.totalSpent;

  return (
    <div className="initiation-view">
      <div className="cards-grid">
        <div className="glass-panel metric-card">
          <div className="metric-card-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} className="mono" style={{ color: 'var(--color-green)' }} /> Net Present Value (NPV)
          </div>
          <div className="metric-card-value green">${financials.NPV.toLocaleString()}</div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark size={16} style={{ color: 'var(--color-cyan)' }} /> Internal Rate of Return (IRR)
          </div>
          <div className="metric-card-value cyan">{financials.IRR}%</div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} style={{ color: 'var(--color-purple)' }} /> Payback Period
          </div>
          <div className="metric-card-value purple">{financials.paybackPeriod} Years</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
          PROJECT CHARTER & BUSINESS CASE (BC)
        </h3>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Executive Business Case Value Proposition</label>
          <textarea
            className="cyber-input"
            rows={4}
            value={businessCase}
            onChange={(e) => setBusinessCase(e.target.value)}
            style={{ resize: 'none', width: '100%' }}
          />
        </div>
      </div>

      <div className="cards-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            BUDGET & ALLOCATION CEILINGS
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>CAPEX Funding Limit ($)</label>
              <input
                type="number"
                className="cyber-input"
                value={financials.capexLimit}
                onChange={(e) => handleInputChange('capexLimit', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>OPEX Funding Limit ($)</label>
              <input
                type="number"
                className="cyber-input"
                value={financials.opexLimit}
                onChange={(e) => handleInputChange('opexLimit', Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="form-grid" style={{ marginTop: '1.25rem' }}>
            <div className="form-group">
              <label>IRR Target (%)</label>
              <input
                type="number"
                step="0.1"
                className="cyber-input"
                value={financials.IRR}
                onChange={(e) => handleInputChange('IRR', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>NPV Projected ($)</label>
              <input
                type="number"
                className="cyber-input"
                value={financials.NPV}
                onChange={(e) => handleInputChange('NPV', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
              BUDGET SPENDING SUMMARY
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Combined Funding:</span>
                <span className="mono" style={{ fontWeight: 600 }}>
                  ${(financials.capexLimit + financials.opexLimit).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Funds Committed:</span>
                <span className="mono" style={{ color: 'var(--color-purple)', fontWeight: 600 }}>
                  ${financials.totalSpent.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Remaining Margin:</span>
                <span className="mono" style={{ color: remainingBudget >= 0 ? 'var(--color-green)' : 'var(--color-red)', fontWeight: 700 }}>
                  ${remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {remainingBudget < 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-red)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', marginTop: '1rem' }}>
              <ShieldAlert size={16} style={{ color: 'var(--color-red)' }} />
              <span style={{ color: 'var(--color-red)' }}>Warning: Budget overspent. Review Domain Allocations.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
