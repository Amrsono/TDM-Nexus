import React from 'react';
import { ProjectFinancials, FinancialAllocation, FundTransfer, ForecastMonth } from '../utils/mockData';
import { Wallet, ArrowRightLeft, TrendingDown } from 'lucide-react';

interface FinancesApprovalsProps {
  financials: ProjectFinancials;
  setFinancials: React.Dispatch<React.SetStateAction<ProjectFinancials>>;
  allocations: FinancialAllocation[];
  setAllocations: React.Dispatch<React.SetStateAction<FinancialAllocation[]>>;
  transfers: FundTransfer[];
  setTransfers: React.Dispatch<React.SetStateAction<FundTransfer[]>>;
  forecastMonths: ForecastMonth[];
}

export function FinancesApprovals({ 
  financials, 
  setFinancials, 
  allocations, 
  transfers, 
  forecastMonths 
}: FinancesApprovalsProps) {
  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <Wallet size={18} className="mono" />
            <h3 className="mono">ICAR & ITRB Approvals</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={financials.itrbApproved}
                onChange={(e) => setFinancials({...financials, itrbApproved: e.target.checked})}
                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-amber)' }}
              />
              <span className="mono">ITRB Approved (WBS Setup Ready)</span>
            </label>

            <div className="input-group" style={{ flex: 1, maxWidth: '300px' }}>
              <label>ICAR Request Status</label>
              <select 
                className="cyber-input"
                value={financials.icarStatus}
                onChange={(e) => setFinancials({...financials, icarStatus: e.target.value as any})}
              >
                <option value="Not Required">Not Required</option>
                <option value="Pending">Pending (Uplift/Handback)</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <TrendingDown size={18} className="mono" />
            <h3 className="mono">CAPEX & OPEX Allocation</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Squad / Portfolio</th>
                    <th className="text-right">CAPEX Allocated</th>
                    <th className="text-right">CAPEX Spent</th>
                    <th className="text-right">OPEX Allocated</th>
                    <th className="text-right">OPEX Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(a => (
                    <tr key={a.squadId}>
                      <td>{a.squadName}</td>
                      <td className="text-right mono">${a.capexAllocated.toLocaleString()}</td>
                      <td className="text-right mono">${a.capexSpent.toLocaleString()}</td>
                      <td className="text-right mono">${a.opexAllocated.toLocaleString()}</td>
                      <td className="text-right mono">${a.opexSpent.toLocaleString()}</td>
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
            <ArrowRightLeft size={18} className="mono" />
            <h3 className="mono">Fund Transfers (Master Journal Prep)</h3>
          </div>
          <div className="card-body">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>From Squad</th>
                    <th>To Squad</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map(t => (
                    <tr key={t.id}>
                      <td className="mono">{t.id}</td>
                      <td className="mono">{t.date}</td>
                      <td>{t.fromSquad}</td>
                      <td>{t.toSquad}</td>
                      <td className="mono">${t.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${t.status === 'Approved' ? 'bg-green' : 'bg-amber'}`}>
                          {t.status}
                        </span>
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
