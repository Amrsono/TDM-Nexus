import { Eye } from 'lucide-react';
import { WalkthroughData } from '../../utils/mockData';

interface WizardStepReviewingProps {
  data: WalkthroughData;
  onChange: <K extends keyof WalkthroughData>(field: K, value: WalkthroughData[K]) => void;
}

export function WizardStepReviewing({ data, onChange }: WizardStepReviewingProps) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Eye size={22} /> Phase 2: Reviewing
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Validate the concept, create a high-level business case, and make the Stop/Go decision for mobilization.</p>

      <div className="grid-2">
        <div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.impactAssessmentDone}
              onChange={(e) => onChange('impactAssessmentDone', e.target.checked)}
            />
            Impact Assessment Completed
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.vvromCreated}
              onChange={(e) => onChange('vvromCreated', e.target.checked)}
            />
            VVROM Created
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.lrpUpdated}
              onChange={(e) => onChange('lrpUpdated', e.target.checked)}
            />
            LRP Updated
          </label>
        </div>

        <div className="form-group">
          <label>Stop/Go Decision for Mobilization</label>
          <select
            className="form-control"
            value={data.stopGoDecision}
            onChange={(e) => onChange('stopGoDecision', e.target.value as WalkthroughData['stopGoDecision'])}
            style={{
              borderColor: data.stopGoDecision === 'Go' ? 'var(--color-green)' :
                data.stopGoDecision === 'Stop' ? 'var(--color-amber)' : '',
            }}
          >
            <option value="Pending">Pending Review</option>
            <option value="Stop">Stop (Do not mobilize)</option>
            <option value="Go">Go (Approved for Analysing)</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>High-Level Business Case</label>
        <textarea
          className="form-control"
          value={data.highLevelBusinessCase}
          onChange={(e) => onChange('highLevelBusinessCase', e.target.value)}
          placeholder="Provide high-level ROI or customer impact metrics."
        />
      </div>

      <div className="form-group">
        <label>Mobilization Plan</label>
        <textarea
          className="form-control"
          value={data.mobilizationPlan}
          onChange={(e) => onChange('mobilizationPlan', e.target.value)}
          placeholder="Detail which teams/squads are mobilizing."
        />
      </div>
    </div>
  );
}
