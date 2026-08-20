import { Filter } from 'lucide-react';
import { WalkthroughData } from '../../utils/mockData';

interface WizardStepFunnelProps {
  data: WalkthroughData;
  onChange: <K extends keyof WalkthroughData>(field: K, value: WalkthroughData[K]) => void;
}

export function WizardStepFunnel({ data, onChange }: WizardStepFunnelProps) {
  return (
    <div className="pi-panel">
      <div className="pi-panel-title">
        <Filter size={22} /> Phase 1: Funnel
      </div>
      <p style={{ marginBottom: '1.5rem' }}>Capture ideas, scope demands, and evaluate high-level resourcing before investing heavily into design.</p>

      <div className="form-group">
        <label>Epic / Initiative Name</label>
        <input
          type="text"
          className="form-control"
          value={data.epicName}
          onChange={(e) => onChange('epicName', e.target.value)}
          placeholder="e.g., MVO iPhone Upgrade Journey"
        />
      </div>

      <div className="form-group">
        <label>Idea Description</label>
        <textarea
          className="form-control"
          value={data.ideaDescription}
          onChange={(e) => onChange('ideaDescription', e.target.value)}
          placeholder="Briefly describe the demand and business value."
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Target Portfolio / Channel</label>
          <select
            className="form-control"
            value={data.portfolio}
            onChange={(e) => onChange('portfolio', e.target.value)}
          >
            <option value="">Select a Portfolio...</option>
            <option value="MVO (eShop)">MVO (eShop)</option>
            <option value="eCare">eCare</option>
            <option value="My VOIS App (MVA)">My VOIS App (MVA)</option>
            <option value="TOBi">TOBi</option>
            <option value="Platform">Platform / Shared</option>
          </select>
        </div>
        <div className="form-group">
          <label>Resource Assessment</label>
          <select
            className="form-control"
            value={data.resourceAssessment}
            onChange={(e) => onChange('resourceAssessment', e.target.value as WalkthroughData['resourceAssessment'])}
          >
            <option value="">Select...</option>
            <option value="Low">Low Effort</option>
            <option value="Medium">Medium Effort</option>
            <option value="High">High Effort</option>
          </select>
        </div>
      </div>
    </div>
  );
}
