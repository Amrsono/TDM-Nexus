import { GovernanceGateDetail, RPMParticipantRow } from '../../utils/mockData';

interface GateEditorFormProps {
  activeGate: GovernanceGateDetail;
  onUpdateField: (field: keyof GovernanceGateDetail, value: string | string[] | RPMParticipantRow[]) => void;
  onUpdateParticipant: (rowIndex: number, field: keyof RPMParticipantRow, value: string | string[]) => void;
}

export function GateEditorForm({ activeGate, onUpdateField, onUpdateParticipant }: GateEditorFormProps) {
  return (
    <div className="editor-container">
      {/* Section 1: Overview */}
      <div className="editor-section">
        <h4 className="editor-section-title">General Slide Settings</h4>

        <div className="input-row">
          <label>Slide Title</label>
          <input
            type="text"
            className="cyber-input"
            value={activeGate.title}
            onChange={(e) => onUpdateField('title', e.target.value)}
          />
        </div>

        <div className="input-row">
          <label>Objective Statement</label>
          <textarea
            className="cyber-input"
            value={activeGate.objective}
            onChange={(e) => onUpdateField('objective', e.target.value)}
          />
        </div>

        <div className="input-row">
          <label>Entry Criteria (One bullet per line)</label>
          <textarea
            className="cyber-input"
            value={activeGate.entryCriteria.join('\n')}
            onChange={(e) => onUpdateField('entryCriteria', e.target.value.split('\n'))}
            placeholder="Enter entry criteria, one per line..."
          />
        </div>

        <div className="input-row">
          <label>Output (One bullet per line)</label>
          <textarea
            className="cyber-input"
            value={activeGate.outputs.join('\n')}
            onChange={(e) => onUpdateField('outputs', e.target.value.split('\n'))}
            placeholder="Enter output actions, one per line..."
          />
        </div>

        <div className="input-row">
          <label>Mandatory Audience</label>
          <input
            type="text"
            className="cyber-input"
            value={activeGate.mandatoryAudience}
            onChange={(e) => onUpdateField('mandatoryAudience', e.target.value)}
          />
        </div>

        <div className="input-row">
          <label>Optional Audience</label>
          <input
            type="text"
            className="cyber-input"
            value={activeGate.optionalAudience || ''}
            onChange={(e) => onUpdateField('optionalAudience', e.target.value)}
            placeholder="e.g. Domains"
          />
        </div>
      </div>

      {/* Section 2: CR specific lists */}
      {activeGate.id === 'cr' && (
        <div className="editor-section">
          <h4 className="editor-section-title" style={{ color: 'var(--color-purple)' }}>CR Validity Guidelines</h4>
          <div className="input-row">
            <label style={{ color: '#00cc00' }}>Types of CRs Considered (One per line)</label>
            <textarea
              className="cyber-input"
              value={activeGate.typesConsidered?.join('\n') || ''}
              onChange={(e) => onUpdateField('typesConsidered', e.target.value.split('\n'))}
            />
          </div>
          <div className="input-row">
            <label style={{ color: 'var(--color-magenta)' }}>Types of CRs NOT Considered (One per line)</label>
            <textarea
              className="cyber-input"
              value={activeGate.typesNotConsidered?.join('\n') || ''}
              onChange={(e) => onUpdateField('typesNotConsidered', e.target.value.split('\n'))}
            />
          </div>
        </div>
      )}

      {/* Section 3: Participants */}
      <div className="editor-section">
        <h4 className="editor-section-title">Participants Actions (Done vs To Do)</h4>
        {activeGate.participants.map((p, idx) => (
          <div key={idx} className="participant-editor-row">
            <div className="participant-title">{p.participant}</div>
            <div className="participant-fields">
              <div className="input-row" style={{ marginBottom: 0 }}>
                <label>Input (Actions Done) - one per line</label>
                <textarea
                  className="cyber-input"
                  style={{ minHeight: '60px', fontSize: '0.8rem' }}
                  value={p.inputs.join('\n')}
                  onChange={(e) => onUpdateParticipant(idx, 'inputs', e.target.value.split('\n'))}
                />
              </div>
              <div className="input-row" style={{ marginBottom: 0 }}>
                <label>Output (Actions to do) - one per line</label>
                <textarea
                  className="cyber-input"
                  style={{ minHeight: '60px', fontSize: '0.8rem' }}
                  value={p.outputs.join('\n')}
                  onChange={(e) => onUpdateParticipant(idx, 'outputs', e.target.value.split('\n'))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
