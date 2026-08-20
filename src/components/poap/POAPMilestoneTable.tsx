import { Plus, Trash2 } from 'lucide-react';
import { MilestoneRow } from '../../types/poap';
import { exampleMilestones } from '../../utils/timelineLayout';

interface POAPMilestoneTableProps {
  milestones: MilestoneRow[];
  onChange: (milestones: MilestoneRow[]) => void;
}

export function POAPMilestoneTable({ milestones, onChange }: POAPMilestoneTableProps) {
  const setMilestone = (idx: number, field: keyof MilestoneRow, val: string) => {
    const updated = [...milestones];
    updated[idx] = {
      ...updated[idx],
      [field]: val,
    };
    onChange(updated);
  };

  const addMilestone = () => {
    onChange([
      ...milestones,
      {
        id: milestones.length + 1,
        name: '',
        status: '',
        targetedDate: '',
        releaseDate: '',
        actualDate: '',
        startDate: '',
        phase: 'Inception',
        track: 'Core',
        type: 'Chevron',
      },
    ]);
  };

  const removeMilestone = (idx: number) => {
    if (milestones.length <= 1) return;
    onChange(milestones.filter((_, i) => i !== idx));
  };

  return (
    <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', minWidth: 0 }}>
      <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>
        Project Milestones
      </legend>
      <div className="cyber-table-container" style={{ overflowX: 'auto' }}>
        <table className="cyber-table" style={{ minWidth: '1100px' }}>
          <thead>
            <tr>
              <th style={{ width: '3%' }}>#</th>
              <th style={{ width: '22%' }}>Milestone / Task Name</th>
              <th style={{ width: '10%' }}>Status</th>
              <th style={{ width: '10%' }}>Start Date</th>
              <th style={{ width: '10%' }}>Target (End)</th>
              <th style={{ width: '10%' }}>Release</th>
              <th style={{ width: '10%' }}>Actual</th>
              <th style={{ width: '10%' }}>Phase</th>
              <th style={{ width: '10%' }}>Track</th>
              <th style={{ width: '10%' }}>Type</th>
              <th style={{ width: '3%' }}></th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((ms, idx) => (
              <tr key={ms.id}>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                <td>
                  <input
                    className="cyber-input"
                    style={{ width: '100%' }}
                    value={ms.name}
                    onChange={e => setMilestone(idx, 'name', e.target.value)}
                    placeholder="Task name..."
                  />
                </td>
                <td>
                  <select
                    className="cyber-input"
                    style={{ width: '100%' }}
                    value={ms.status}
                    onChange={e => setMilestone(idx, 'status', e.target.value)}
                  >
                    <option value="">...</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <input
                    className="cyber-input"
                    type="date"
                    style={{ width: '100%' }}
                    value={ms.startDate || ''}
                    onChange={e => setMilestone(idx, 'startDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="cyber-input"
                    type="date"
                    style={{ width: '100%' }}
                    value={ms.targetedDate}
                    onChange={e => setMilestone(idx, 'targetedDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="cyber-input"
                    type="date"
                    style={{ width: '100%' }}
                    value={ms.releaseDate}
                    onChange={e => setMilestone(idx, 'releaseDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="cyber-input"
                    type="date"
                    style={{ width: '100%' }}
                    value={ms.actualDate}
                    onChange={e => setMilestone(idx, 'actualDate', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="cyber-input"
                    style={{ width: '100%' }}
                    value={ms.phase || 'Construction'}
                    onChange={e => setMilestone(idx, 'phase', e.target.value as MilestoneRow['phase'] & string)}
                  >
                    <option value="Inception">Inception</option>
                    <option value="Elaboration">Elaboration</option>
                    <option value="Construction">Construction</option>
                    <option value="Transition">Transition</option>
                  </select>
                </td>
                <td>
                  <select
                    className="cyber-input"
                    style={{ width: '100%' }}
                    value={ms.track || 'Core'}
                    onChange={e => setMilestone(idx, 'track', e.target.value as MilestoneRow['track'] & string)}
                  >
                    <option value="Governance">Governance</option>
                    <option value="Core">Key Milestones</option>
                    <option value="Sprints">Sprints</option>
                    <option value="Testing">Testing</option>
                    <option value="Transition">Transition</option>
                    <option value="Support">Support</option>
                  </select>
                </td>
                <td>
                  <select
                    className="cyber-input"
                    style={{ width: '100%' }}
                    value={ms.type || 'Chevron'}
                    onChange={e => setMilestone(idx, 'type', e.target.value as MilestoneRow['type'] & string)}
                  >
                    <option value="Chevron">Chevron</option>
                    <option value="Block">Block</option>
                    <option value="Sprint">Sprint Bar</option>
                    <option value="SignOff">SignOff Diamond</option>
                    <option value="Milestone">Milestone Diamond</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="icon-button"
                    onClick={() => removeMilestone(idx)}
                    style={{ opacity: milestones.length <= 1 ? 0.3 : 1 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button className="cyber-button secondary" onClick={addMilestone} style={{ fontSize: '0.75rem' }}>
          <Plus size={12} /> Add Milestone
        </button>
        <button
          className="cyber-button secondary"
          onClick={() => onChange(exampleMilestones)}
          style={{ fontSize: '0.75rem', borderColor: 'var(--color-cyan)' }}
        >
          Load Example Timeline
        </button>
        <button
          className="cyber-button secondary"
          onClick={() =>
            onChange([
              {
                id: 1,
                name: '',
                status: '',
                targetedDate: '',
                releaseDate: '',
                actualDate: '',
                startDate: '',
                phase: 'Inception',
                track: 'Core',
                type: 'Chevron',
              },
            ])
          }
          style={{ fontSize: '0.75rem', color: '#ff4d4d' }}
        >
          Clear All
        </button>
      </div>
    </fieldset>
  );
}
