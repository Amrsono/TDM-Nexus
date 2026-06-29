import React from 'react';
import { ADOWorkItem, PortfolioSquad } from '../utils/mockData';
import { GitPullRequest, Search, FileCode2 } from 'lucide-react';

interface AnalysingProps {
  adoWorkItems: ADOWorkItem[];
  setAdoWorkItems: React.Dispatch<React.SetStateAction<ADOWorkItem[]>>;
  squads: PortfolioSquad[];
  renameSquad: (id: string, newName: string) => void;
}

export function Analysing({ adoWorkItems, setAdoWorkItems, squads, renameSquad }: AnalysingProps) {
  return (
    <div className="view-grid">
      <div className="grid-col span-12">
        <div className="cyber-card">
          <div className="card-header">
            <GitPullRequest size={18} className="mono" />
            <h3 className="mono">ADO Work Items & HLD Readiness</h3>
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
                  </tr>
                </thead>
                <tbody>
                  {adoWorkItems.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td>
                      <td>
                        <span className="status-badge" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>
                          {item.type}
                        </span>
                      </td>
                      <td>{item.title}</td>
                      <td>{item.portfolio}</td>
                      <td>
                        <select 
                          className="cyber-input" 
                          style={{ padding: '0.35rem 0.5rem' }}
                          value={item.status}
                          onChange={(e) => {
                            const newItems = adoWorkItems.map(i => i.id === item.id ? { ...i, status: e.target.value as ADOWorkItem['status'] } : i);
                            setAdoWorkItems(newItems);
                          }}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-col span-12">
        <div className="cyber-card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <Search size={18} className="mono" />
            <h3 className="mono">Portfolio Squads Analysis</h3>
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
                  </tr>
                </thead>
                <tbody>
                  {squads.map(squad => (
                    <tr key={squad.id}>
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
