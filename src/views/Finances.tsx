import React, { useState } from 'react';
import { FinancialAllocation, FundTransfer, ForecastMonth } from '../utils/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Landmark, ArrowLeftRight, Check, X, RefreshCw } from 'lucide-react';

interface FinancesProps {
  allocations: FinancialAllocation[];
  setAllocations: React.Dispatch<React.SetStateAction<FinancialAllocation[]>>;
  transfers: FundTransfer[];
  setTransfers: React.Dispatch<React.SetStateAction<FundTransfer[]>>;
  forecastMonths: ForecastMonth[];
}

export const Finances: React.FC<FinancesProps> = ({ 
  allocations, 
  setAllocations, 
  transfers, 
  setTransfers,
  forecastMonths
}) => {
  
  // Form states
  const [fromDomain, setFromDomain] = useState('');
  const [toDomain, setToDomain] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleTransferRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDomain || !toDomain || !amount || fromDomain === toDomain) return;

    const newTransfer: FundTransfer = {
      id: `TX-${100 + transfers.length + 1}`,
      fromDomain,
      toDomain,
      amount: Number(amount),
      reason,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setTransfers(prev => [newTransfer, ...prev]);
    setAmount('');
    setReason('');
  };

  const handleApprove = (id: string) => {
    // 1. Find the transfer details
    const tx = transfers.find(t => t.id === id);
    if (!tx || tx.status !== 'Pending') return;

    // 2. Deduct from source and add to destination
    setAllocations(prev => prev.map(a => {
      // Deduct Capex from source domain
      if (a.domainName === tx.fromDomain) {
        return {
          ...a,
          capexAllocated: a.capexAllocated - tx.amount,
          capexForecast: a.capexForecast - tx.amount
        };
      }
      // Add Capex to destination domain
      if (a.domainName === tx.toDomain) {
        return {
          ...a,
          capexAllocated: a.capexAllocated + tx.amount,
          capexForecast: a.capexForecast + tx.amount
        };
      }
      return a;
    }));

    // 3. Mark transfer approved
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
  };

  const handleReject = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
  };

  // Compute overall financial summaries
  const totalAllocated = allocations.reduce((sum, a) => sum + a.capexAllocated + a.opexAllocated, 0);
  const totalSpent = allocations.reduce((sum, a) => sum + a.capexSpent + a.opexSpent, 0);
  const totalForecast = allocations.reduce((sum, a) => sum + a.capexForecast + a.opexForecast, 0);

  // Prepare chart data format
  const chartData = forecastMonths.map(f => ({
    name: f.month,
    Forecast: f.capexForecast + f.opexForecast,
    Actual: f.capexActual + f.opexActual > 0 ? f.capexActual + f.opexActual : null
  }));

  return (
    <div className="finances-view">
      
      {/* Top mini-summaries */}
      <div className="cards-grid">
        <div className="glass-panel metric-card">
          <div className="metric-card-label">TOTAL CAPITAL BUDGET ALLOCATED</div>
          <div className="metric-card-value cyan">${totalAllocated.toLocaleString()}</div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-card-label">TOTAL ACTUAL EXPENDITURE (ACT)</div>
          <div className="metric-card-value purple">${totalSpent.toLocaleString()}</div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-card-label">REMAINING VARIANCE CONTINGENCY</div>
          <div className="metric-card-value green">${(totalAllocated - totalSpent).toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'start' }}>
        
        {/* Monthly Burn Area Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '380px' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            PROJECT BURN FORECAST & ACTUAL SPEND OVERVIEW (S-CURVE)
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-cyan)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-cyan)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-purple)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={11} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(7, 11, 25, 0.9)', borderColor: 'var(--color-cyan)' }}
                  labelStyle={{ color: 'var(--color-cyan)', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="Forecast" stroke="var(--color-cyan)" fillOpacity={1} fill="url(#colorForecast)" />
                <Area type="monotone" dataKey="Actual" stroke="var(--color-purple)" fillOpacity={1} fill="url(#colorActual)" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fund Transfer HUD */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '380px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ArrowLeftRight size={18} style={{ color: 'var(--color-cyan)' }} />
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
              FUND TRANSFER REQUESTS
            </h3>
          </div>
          
          <form onSubmit={handleTransferRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-grid">
              <div className="form-group">
                <label>From Domain</label>
                <select className="cyber-input" value={fromDomain} onChange={e => setFromDomain(e.target.value)} required>
                  <option value="">Select Domain</option>
                  {allocations.map(a => (
                    <option key={a.domainId} value={a.domainName}>{a.domainName}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>To Domain</label>
                <select className="cyber-input" value={toDomain} onChange={e => setToDomain(e.target.value)} required>
                  <option value="">Select Domain</option>
                  {allocations.map(a => (
                    <option key={a.domainId} value={a.domainName}>{a.domainName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  className="cyber-input" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  placeholder="e.g. 25000"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Reason / Audit Note</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                  placeholder="e.g. Scope adjustment..."
                  required 
                />
              </div>
            </div>

            <button type="submit" className="cyber-button" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              SUBMIT TRANSFER INVOICE
            </button>
          </form>
        </div>
      </div>

      {/* Domain Finances details table */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
          DOMAIN BUDGET EXPENDITURE BREAKDOWN
        </h3>
        
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Domain Name</th>
                <th>CAPEX Allocated</th>
                <th>CAPEX Spent</th>
                <th>CAPEX Forecast</th>
                <th>OPEX Allocated</th>
                <th>OPEX Spent</th>
                <th>OPEX Forecast</th>
                <th>Total Variance</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => {
                const totalAlloc = a.capexAllocated + a.opexAllocated;
                const totalSpent = a.capexSpent + a.opexSpent;
                const variance = totalAlloc - totalSpent;
                return (
                  <tr key={a.domainId}>
                    <td style={{ fontWeight: 600 }}>{a.domainName}</td>
                    <td className="mono">${a.capexAllocated.toLocaleString()}</td>
                    <td className="mono" style={{ color: 'var(--color-text-secondary)' }}>${a.capexSpent.toLocaleString()}</td>
                    <td className="mono" style={{ color: 'var(--color-cyan)' }}>${a.capexForecast.toLocaleString()}</td>
                    <td className="mono">${a.opexAllocated.toLocaleString()}</td>
                    <td className="mono" style={{ color: 'var(--color-text-secondary)' }}>${a.opexSpent.toLocaleString()}</td>
                    <td className="mono" style={{ color: 'var(--color-purple)' }}>${a.opexForecast.toLocaleString()}</td>
                    <td className="mono" style={{ fontWeight: 600, color: variance >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                      ${variance.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fund transfers logs */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1rem', fontSize: '1.1rem' }}>
          BUDGET AUDIT TRANSFER TRANSACTION LOG
        </h3>
        
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Source Domain</th>
                <th>Destination Domain</th>
                <th>Amount</th>
                <th>Audit Reason</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t.id}>
                  <td className="mono" style={{ color: 'var(--color-cyan)' }}>{t.id}</td>
                  <td>{t.fromDomain}</td>
                  <td>{t.toDomain}</td>
                  <td className="mono" style={{ fontWeight: 600, color: 'var(--color-cyan)' }}>
                    ${t.amount.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{t.reason}</td>
                  <td className="mono">{t.date}</td>
                  <td>
                    <span className={`rag-badge ${
                      t.status === 'Approved' ? 'green' : t.status === 'Pending' ? 'amber' : 'red'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          className="icon-button" 
                          onClick={() => handleApprove(t.id)} 
                          title="Approve"
                          style={{ borderColor: 'var(--color-green)', color: 'var(--color-green)' }}
                        >
                          <Check size={12} />
                        </button>
                        <button 
                          className="icon-button" 
                          onClick={() => handleReject(t.id)} 
                          title="Reject"
                          style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Audited</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
