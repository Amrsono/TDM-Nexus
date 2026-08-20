import { Wrench } from 'lucide-react';
import { WalkthroughData } from '../../utils/mockData';

interface WizardStepImplementingProps {
  data: WalkthroughData;
  onChange: <K extends keyof WalkthroughData>(field: K, value: WalkthroughData[K]) => void;
}

export function WizardStepImplementing({ data, onChange }: WizardStepImplementingProps) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Wrench size={22} /> Phase 4: Implementing
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Build the solution and progress through quality assurance (SIT, UAT, PAT, PEN, CJT).</p>

      <div className="grid-2">
        <div className="form-group">
          <label>MVP Build Status</label>
          <select
            className="form-control"
            value={data.mvpBuildStatus}
            onChange={(e) => onChange('mvpBuildStatus', e.target.value as WalkthroughData['mvpBuildStatus'])}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div className="form-group">
          <label>Commercial Go/No-Go Decision</label>
          <select
            className="form-control"
            value={data.commercialGoNoGo}
            onChange={(e) => onChange('commercialGoNoGo', e.target.value as WalkthroughData['commercialGoNoGo'])}
            style={{
              borderColor: data.commercialGoNoGo === 'Go' ? 'var(--color-green)' :
                data.commercialGoNoGo === 'No-Go' ? '#e60000' : '',
            }}
          >
            <option value="Pending">Pending Validation</option>
            <option value="No-Go">No-Go (Issues remaining)</option>
            <option value="Go">Go (Ready for launch!)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <h4 style={{ color: 'var(--color-cyan)', fontSize: '0.95rem', marginBottom: '1rem' }}>Testing Checkpoints</h4>
        <div className="grid-2">
          <div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.sitTesting}
                onChange={(e) => onChange('sitTesting', e.target.checked)}
              />
              SIT Completed (System Integration)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.uatTesting}
                onChange={(e) => onChange('uatTesting', e.target.checked)}
              />
              UAT Completed (User Acceptance)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.patTesting}
                onChange={(e) => onChange('patTesting', e.target.checked)}
              />
              PAT Completed (Performance)
            </label>
          </div>
          <div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.cjtTesting}
                onChange={(e) => onChange('cjtTesting', e.target.checked)}
              />
              CJT Completed (Customer Journey)
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
              * Note: Any P1/P2 defects identified during CJT must be resolved before Commercial Launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
