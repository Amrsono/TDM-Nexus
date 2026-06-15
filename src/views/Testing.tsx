import React, { useState } from 'react';
import { QAStatus, Defect, DomainBuild } from '../utils/mockData';
import { Bug, Plus, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TestingProps {
  qaStatus: QAStatus;
  setQaStatus: React.Dispatch<React.SetStateAction<QAStatus>>;
  defects: Defect[];
  setDefects: React.Dispatch<React.SetStateAction<Defect[]>>;
  domains: DomainBuild[];
}

export const Testing: React.FC<TestingProps> = ({ 
  qaStatus, 
  setQaStatus, 
  defects, 
  setDefects,
  domains
}) => {
  // New Defect State
  const [defTitle, setDefTitle] = useState('');
  const [defSeverity, setDefSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [defDomain, setDefDomain] = useState(domains[0]?.name || 'Billing & Rating Engine');
  const [defDesc, setDefDesc] = useState('');

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defTitle.trim()) return;

    const newDef: Defect = {
      id: `DEF-${String(defects.length + 1).padStart(3, '0')}`,
      title: defTitle,
      severity: defSeverity,
      status: 'New',
      domain: defDomain,
      description: defDesc
    };

    setDefects(prev => [newDef, ...prev]);
    
    // Increment total defects in QA status (which impacts failed test count conceptually)
    setQaStatus(prev => ({
      ...prev,
      totalTests: prev.totalTests + 1,
      failed: prev.failed + 1
    }));

    setDefTitle('');
    setDefDesc('');
  };

  const handleDefectStatusChange = (id: string, newStatus: Defect['status']) => {
    setDefects(prev => prev.map(d => {
      if (d.id === id) {
        // If closed, transfer from Failed to Passed in metrics
        if (newStatus === 'Closed' && d.status !== 'Closed') {
          setQaStatus(qs => ({
            ...qs,
            failed: Math.max(0, qs.failed - 1),
            passed: qs.passed + 1
          }));
        } else if (d.status === 'Closed' && newStatus !== 'Closed') {
          // If reopened
          setQaStatus(qs => ({
            ...qs,
            passed: Math.max(0, qs.passed - 1),
            failed: qs.failed + 1
          }));
        }
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const runRate = Math.round(((qaStatus.passed + qaStatus.failed + qaStatus.blocked) / qaStatus.totalTests) * 100);
  const passRate = Math.round((qaStatus.passed / (qaStatus.passed + qaStatus.failed)) * 100);

  return (
    <div className="testing-view">
      
      {/* Testing Metric Dashboard Cards */}
      <div className="cards-grid">
        <div className="glass-panel metric-card">
          <div className="metric-card-label">TOTAL PLANNED E2E TEST CASES</div>
          <div className="metric-card-value cyan">{qaStatus.totalTests}</div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-label">PASSED TEST RUNS</div>
          <div className="metric-card-value green">{qaStatus.passed}</div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-label">TEST EXECUTION RUN RATE</div>
          <div className="metric-card-value purple">{runRate}%</div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-label">CRITICAL QA PASS RATE</div>
          <div className="metric-card-value cyan" style={{ color: passRate >= 85 ? 'var(--color-green)' : 'var(--color-amber)' }}>
            {passRate}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Active Defects List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bug size={18} style={{ color: 'var(--color-magenta)' }} />
            <h3 className="mono" style={{ color: 'var(--color-cyan)', fontSize: '1.1rem' }}>
              ACTIVE DEFECTS TRACKING LOG
            </h3>
          </div>

          <div className="cyber-table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Defect Summary</th>
                  <th>Severity</th>
                  <th>Domain Owner</th>
                  <th>Status</th>
                  <th>Log Details</th>
                </tr>
              </thead>
              <tbody>
                {defects.map(d => (
                  <tr key={d.id}>
                    <td className="mono" style={{ color: 'var(--color-cyan)' }}>{d.id}</td>
                    <td style={{ fontWeight: 500 }}>{d.title}</td>
                    <td>
                      <span className={`rag-badge ${
                        d.severity === 'Critical' ? 'red' : d.severity === 'High' ? 'amber' : 'green'
                      }`} style={{ fontSize: '0.7rem' }}>
                        {d.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{d.domain}</td>
                    <td>
                      <select
                        className="cyber-input"
                        value={d.status}
                        onChange={(e) => handleDefectStatusChange(d.id, e.target.value as any)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Retesting">Retesting</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.description}>
                      {d.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log New Defect Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="mono" style={{ color: 'var(--color-cyan)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            LOG QUALITY DEFECT
          </h3>
          
          <form onSubmit={handleCreateDefect} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Defect Summary Header</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. Memory leak on payment validation..."
                value={defTitle}
                onChange={(e) => setDefTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Severity Level</label>
              <select
                className="cyber-input"
                value={defSeverity}
                onChange={(e) => setDefSeverity(e.target.value as any)}
              >
                <option value="Critical">Critical (Blocker)</option>
                <option value="High">High (Major Core Fail)</option>
                <option value="Medium">Medium (Functional Bug)</option>
                <option value="Low">Low (Cosmetic/Minor)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assigned Domain Owner</label>
              <select
                className="cyber-input"
                value={defDomain}
                onChange={(e) => setDefDomain(e.target.value)}
              >
                {domains.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Technical Description & Logs</label>
              <textarea
                className="cyber-input"
                rows={3}
                placeholder="Paste tracebacks, database logs, or API payloads here..."
                value={defDesc}
                onChange={(e) => setDefDesc(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            <button type="submit" className="cyber-button secondary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              <Plus size={16} /> LOG BLOCKING DEFECT
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
