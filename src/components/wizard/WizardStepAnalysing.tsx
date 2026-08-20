import { Search } from 'lucide-react';
import { WalkthroughData } from '../../utils/mockData';

interface WizardStepAnalysingProps {
  data: WalkthroughData;
  onChange: <K extends keyof WalkthroughData>(field: K, value: WalkthroughData[K]) => void;
}

export function WizardStepAnalysing({ data, onChange }: WizardStepAnalysingProps) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Search size={22} /> Phase 3: Analysing
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Refine the scope, blueprint designs, and sign-off on detailed specifications prior to build.</p>

      <div className="grid-2">
        <div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.brsSignedOff}
              onChange={(e) => onChange('brsSignedOff', e.target.checked)}
            />
            Business Requirement Spec (BRS) Signed Off
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.hldStarted}
              onChange={(e) => onChange('hldStarted', e.target.checked)}
            />
            High Level Design (HLD) Started
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.tilSpecsComplete}
              onChange={(e) => onChange('tilSpecsComplete', e.target.checked)}
            />
            TIL SOA Specs Complete
          </label>
        </div>

        <div className="form-group">
          <label>Estimated Timeline (Weeks)</label>
          <input
            type="number"
            className="form-control"
            value={data.timelineWeeks}
            onChange={(e) => onChange('timelineWeeks', parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </div>
    </div>
  );
}
