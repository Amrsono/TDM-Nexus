import { GovernanceGateDetail } from '../../utils/mockData';

interface GateSlidePreviewProps {
  activeGate: GovernanceGateDetail;
}

export function GateSlidePreview({ activeGate }: GateSlidePreviewProps) {
  return (
    <div className="slide-preview-wrapper">
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
        Slide Live Preview (16:9 Presentation Aspect Ratio)
      </div>

      <div className="slide-preview-container">
        <div className="slide-title">{activeGate.title}</div>

        <div className="slide-content">
          <div className="slide-main-columns">
            {/* Left Column */}
            <div className="slide-left">
              <div className="slide-objective-box">
                <strong>Objective:</strong> {activeGate.objective}
              </div>

              <div>
                <div className="slide-section-header">Entry criteria:</div>
                <ul className="slide-bullets">
                  {activeGate.entryCriteria.filter(item => item.trim() !== '').map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="slide-section-header">Output:</div>
                <ul className="slide-bullets">
                  {activeGate.outputs.filter(item => item.trim() !== '').map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="slide-audience-section">
                <div><strong>Mandatory Audience:</strong> {activeGate.mandatoryAudience}</div>
                {activeGate.optionalAudience && (
                  <div style={{ marginTop: '0.2cqw' }}><strong>Optional Audience:</strong> {activeGate.optionalAudience}</div>
                )}
              </div>
            </div>

            {/* Right Column Table */}
            <div className="slide-right">
              <table className="slide-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Participant</th>
                    <th style={{ width: '38%' }}>Input (Actions Done)</th>
                    <th style={{ width: '40%' }}>Output (Actions to do)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeGate.participants.map((p, idx) => (
                    <tr key={idx}>
                      <td className="slide-table-participant">{p.participant}</td>
                      <td>
                        {p.inputs.length === 0 || (p.inputs.length === 1 && p.inputs[0].trim() === 'N/A') ? (
                          'N/A'
                        ) : (
                          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5cqw', margin: 0 }}>
                            {p.inputs.filter(item => item.trim() !== '').map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td>
                        {p.outputs.length === 0 || (p.outputs.length === 1 && p.outputs[0].trim() === 'N/A') ? (
                          'N/A'
                        ) : (
                          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5cqw', margin: 0 }}>
                            {p.outputs.filter(item => item.trim() !== '').map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CR Guidelines */}
          {activeGate.id === 'cr' && activeGate.typesConsidered && activeGate.typesNotConsidered && (
            <div className="slide-cr-bottom">
              <div>
                <div className="slide-cr-list-title considered">The following types of CRs will be considered:</div>
                <ul className="slide-bullets" style={{ paddingLeft: '1.5cqw' }}>
                  {activeGate.typesConsidered.filter(item => item.trim() !== '').map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="slide-cr-list-title not-considered">The following types of CRs will not be considered:</div>
                <ul className="slide-bullets" style={{ paddingLeft: '1.5cqw' }}>
                  {activeGate.typesNotConsidered.filter(item => item.trim() !== '').map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
