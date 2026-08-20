import { Rocket, CheckCircle2 } from 'lucide-react';
import { WalkthroughData } from '../../utils/mockData';

interface WizardStepPostLaunchProps {
  data: WalkthroughData;
  onChange: <K extends keyof WalkthroughData>(field: K, value: WalkthroughData[K]) => void;
}

export function WizardStepPostLaunch({ data, onChange }: WizardStepPostLaunchProps) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Rocket size={22} /> Phase 5: Post Launch
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Monitor performance, resolve issues in Early Life Support (ELS), and document learnings.</p>

      <div className="grid-2">
        <div className="form-group">
          <label>P1/P2 Defects Remaining</label>
          <input
            type="number"
            className="form-control"
            value={data.p1p2DefectsRemaining}
            onChange={(e) => onChange('p1p2DefectsRemaining', parseInt(e.target.value, 10) || 0)}
          />
        </div>

        <div>
          <label className="checkbox-label" style={{ marginTop: '1.4rem' }}>
            <input
              type="checkbox"
              checked={data.elsActive}
              onChange={(e) => onChange('elsActive', e.target.checked)}
            />
            Early Life Support (ELS) Currently Active
          </label>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Retrospective Notes & Lessons Learned</label>
        <textarea
          className="form-control"
          value={data.retrospectiveNotes}
          onChange={(e) => onChange('retrospectiveNotes', e.target.value)}
          placeholder="Document what went well and what could be improved for next time."
        />
      </div>

      {data.p1p2DefectsRemaining === 0 && !data.elsActive && data.commercialGoNoGo === 'Go' && (
        <div className="pi-highlight-box" style={{ borderColor: 'var(--color-green)', background: 'rgba(0,245,160,0.05)', padding: '1rem', border: '1px solid var(--color-green)', borderRadius: '8px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-green)' }}>
            <CheckCircle2 size={24} />
            <span style={{ fontWeight: 600 }}>Project Complete & Handed Over to BAU</span>
          </div>
        </div>
      )}
    </div>
  );
}
