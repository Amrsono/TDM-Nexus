import React, { useState, useEffect, useRef } from 'react';
import { MilestoneRow, POAPSlideData } from '../../types/poap';
import {
  ragHex,
  statusColor,
  barColor,
  getTimelineMonths,
  getPhaseRanges,
  getMonthPhase,
  layoutTrackTasks,
  getMonthLabel,
} from '../../utils/timelineLayout';

const thStyle: React.CSSProperties = {
  padding: '2px 4px',
  fontSize: '0.85em',
  fontWeight: 700,
  textAlign: 'center',
  borderBottom: '1px solid #BFBFBF',
};

const tdStyle: React.CSSProperties = {
  padding: '2px 4px',
  textAlign: 'center',
  borderBottom: '1px solid #e0e0e0',
  fontSize: '0.85em',
};

export function SlidePreview({ form, activeSlide }: { form: POAPSlideData; activeSlide: 1 | 2 | 3 }) {
  const scopeLines = (form.projectScope || '').split('\n').filter(Boolean);
  const statusLines = (form.currentStatus || '').split('\n').filter(Boolean);
  const assLines = (form.planAssumptions || '').split('\n').filter(Boolean);

  // Slide 1: Status Report
  if (activeSlide === 1) {
    return (
      <div style={{
        width: '100%', aspectRatio: '13.33/7.5', background: '#fff',
        fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden',
        borderRadius: '4px', fontSize: '0.55em', color: '#000',
      }}>
        {/* Red header bar */}
        <div style={{
          background: '#E60000', height: '7.3%', display: 'flex', alignItems: 'center',
          padding: '0 1.5%', gap: '1%',
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.2em', flex: '0 0 35%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            IITC – {form.projectName || '...'}
          </span>
          {[
            { l: 'REQ ID', v: form.reqId },
            { l: 'Expected Closure', v: form.expectedClosure },
            { l: 'Portfolio', v: form.portfolio },
            { l: 'Transition', v: form.transition },
          ].map((f, i) => (
            <div key={i} style={{ flex: '0 0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65em', color: '#F2F2F2', lineHeight: 1 }}>{f.l}</div>
              <div style={{ fontSize: '0.85em', color: '#fff', fontWeight: 700 }}>{f.v || '—'}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65em', color: '#F2F2F2', lineHeight: 1 }}>RAG</div>
            <div style={{ width: 22, height: 10, background: ragHex(form.ragOverall), borderRadius: 1, marginTop: 1 }} />
          </div>
        </div>

        {/* PM Row */}
        <div style={{ padding: '0.6% 1.5%', fontSize: '0.8em' }}>
          <b>Project Manager: {form.projectManager || '...'}</b>
          <span style={{ float: 'right', display: 'flex', gap: '3%' }}>
            {[
              { l: 'MP Gate', v: form.mpGate },
              { l: 'Build', v: form.build },
              { l: 'Project Gate', v: form.projectGate },
            ].map((g, i) => (
              <span key={i} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7em', color: '#666' }}>{g.l} </span>
                <b>{g.v || '—'}</b>
              </span>
            ))}
          </span>
        </div>

        <div style={{ height: 1, background: '#BFBFBF', margin: '0 1.5%' }} />

        {/* Content area */}
        <div style={{ display: 'flex', padding: '0.8% 1.5%', gap: '2%', height: '60%' }}>
          <div style={{ flex: '0 0 44%', overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9em', textDecoration: 'underline', marginBottom: '0.5%' }}>Project Scope</div>
            <div style={{ fontSize: '0.72em', lineHeight: 1.5, overflow: 'hidden' }}>
              {scopeLines.map((line, i) => <div key={i}>{i + 1}. {line}</div>)}
              {scopeLines.length === 0 && <span style={{ color: '#aaa', fontStyle: 'italic' }}>Enter scope items...</span>}
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.9em', textDecoration: 'underline', marginTop: '4%', marginBottom: '0.5%' }}>Current Status</div>
            <div style={{ fontSize: '0.72em', lineHeight: 1.5, overflow: 'hidden' }}>
              {statusLines.map((line, i) => <div key={i}>• {line}</div>)}
              {statusLines.length === 0 && <span style={{ color: '#aaa', fontStyle: 'italic' }}>Enter status bullets...</span>}
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72em' }}>
              <thead>
                <tr style={{ background: '#E60000', color: '#fff' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Project Milestones</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Targeted Date</th>
                  <th style={thStyle}>Release Date</th>
                  <th style={thStyle}>Actual Date</th>
                </tr>
              </thead>
              <tbody>
                {form.milestones.map((ms, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#F2F2F2' : '#fff' }}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: 'left' }}>{ms.name || ''}</td>
                    <td style={{ ...tdStyle, color: statusColor(ms.status), fontWeight: 700 }}>{ms.status || ''}</td>
                    <td style={tdStyle}>{ms.targetedDate || ''}</td>
                    <td style={tdStyle}>{ms.releaseDate || ''}</td>
                    <td style={tdStyle}>{ms.actualDate || ''}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 11 - form.milestones.length) }).map((_, i) => (
                  <tr key={`e-${i}`} style={{ background: (form.milestones.length + i) % 2 === 0 ? '#F2F2F2' : '#fff' }}>
                    <td style={tdStyle}>{form.milestones.length + i + 1}</td>
                    <td style={tdStyle}></td><td style={tdStyle}></td>
                    <td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Obstacles */}
        <div style={{ padding: '0 1.5%', fontSize: '0.72em' }}>
          <b>What are the obstacles that SteerCo/ExCo need to help overcome to execute successfully?</b>
          <div style={{ marginTop: 2, color: '#333' }}>{form.obstacles || ''}</div>
        </div>

        {/* RAG Legend */}
        <div style={{
          position: 'absolute', bottom: '3%', left: '1.5%', right: '1.5%',
          display: 'flex', alignItems: 'center', gap: '3%', fontSize: '0.6em',
        }}>
          <b>RAG Legend:</b>
          {[
            { l: 'Off Track/High Risk', c: '#FF0000' },
            { l: 'Behind Schedule/Medium Risk', c: '#FFC000' },
            { l: 'On Track/Low Risk', c: '#00B050' },
            { l: 'Completed', c: '#0070C0' },
            { l: 'Not started', c: '#A6A6A6' },
          ].map((lg, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: lg.c, borderRadius: 1 }} />
              {lg.l}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', fontWeight: 700, fontSize: '2em', color: '#E60000' }}>VOIS</span>
        </div>
      </div>
    );
  }

  // Slide 3: Delivery Plan Timeline
  if (activeSlide === 3) {
    const { months, timelineStart, timelineEnd } = getTimelineMonths(form.milestones);
    const phaseRanges = getPhaseRanges(form.milestones);
    const tracksList = ['Governance', 'Core', 'Sprints', 'Testing', 'Transition', 'Support'] as const;

    const tStart = timelineStart.getTime();
    const tEnd = timelineEnd.getTime();
    const total = tEnd - tStart;

    const getTaskStyle = (ms: MilestoneRow) => {
      const startStr = ms.startDate || ms.targetedDate || timelineStart.toISOString().split('T')[0];
      const endStr = ms.targetedDate || ms.startDate || timelineEnd.toISOString().split('T')[0];
      let left = ((new Date(startStr).getTime() - tStart) / total) * 100;
      let width = ((new Date(endStr).getTime() - new Date(startStr).getTime()) / total) * 100;
      if (left < 0) left = 0;
      if (left > 100) left = 100;
      if (left + width > 100) width = 100 - left;
      if (width < 1.5) width = 1.5;
      return { left: `${left}%`, width: `${width}%` };
    };

    const phaseColorMap: Record<string, { border: string; text: string; bg: string; bgLight: string }> = {
      Inception: { border: '#EB9800', text: '#EB9800', bg: '#FEF0CC', bgLight: '#FEF7E4' },
      Elaboration: { border: '#00B0CA', text: '#007C92', bg: '#CCF0F5', bgLight: '#E5F8FB' },
      Construction: { border: '#007C92', text: '#007C92', bg: '#CCE8ED', bgLight: '#E0F4F7' },
      Transition: { border: '#9C2AA0', text: '#9C2AA0', bg: '#F0D9F1', bgLight: '#F8EEF8' },
    };
    const getPhaseColor = (phase: string) =>
      phaseColorMap[phase] ?? { border: '#4A4D4E', text: '#4A4D4E', bg: '#F2F2F2', bgLight: '#F9F9F9' };

    const getTaskColor = (ms: MilestoneRow): string => {
      if (ms.track === 'Governance') return '#E60000';
      if (ms.track === 'Sprints' || ms.track === 'Support') return '#007C92';
      if (ms.track === 'Testing') return '#00B0CA';
      if (ms.track === 'Transition') return '#9C2AA0';
      if (ms.phase === 'Inception') return '#EB9800';
      if (ms.phase === 'Elaboration') return '#00B0CA';
      return '#4A4D4E';
    };

    const phaseOverlays = Object.entries(phaseRanges).map(([phase, range]) => {
      let left = ((range.start - tStart) / total) * 100;
      let width = ((range.end - range.start) / total) * 100;
      if (left < 0) { width += left; left = 0; }
      if (left + width > 100) width = 100 - left;
      return { phase, left, width };
    });

    return (
      <div style={{
        width: '100%', aspectRatio: '13.33/7.5', background: '#fff',
        fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden',
        borderRadius: '4px', fontSize: '0.42em', color: '#000',
        padding: '1.2% 1.5% 1.5% 1.5%',
        boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      }}>
        {/* Title Row */}
        <div style={{
          display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.3em',
          marginBottom: '0.7%', paddingBottom: '0.4%',
          borderBottom: '2px solid #E60000', flexShrink: 0,
        }}>
          <span style={{ fontWeight: 700, fontSize: '1.2em', color: '#4A4D4E' }}>Example :</span>
          <span style={{ fontWeight: 700, fontSize: '1.2em', color: '#E60000' }}>
            {form.projectName || 'MS Dynamics AX'}
          </span>
          <span style={{ fontSize: '1.1em', color: '#4A4D4E' }}>
            – Indicative Plan on a Page (POAP)
          </span>
        </div>

        {/* Phase Overlays */}
        <div style={{ display: 'flex', position: 'relative', height: '4%', marginBottom: '0.4%', flexShrink: 0 }}>
          <div style={{ width: '10%', flexShrink: 0 }} />
          <div style={{ flex: 1, position: 'relative', height: '100%' }}>
            {phaseOverlays.map(({ phase, left, width }) => {
              const pc = getPhaseColor(phase);
              return (
                <div key={phase} style={{
                  position: 'absolute', left: `${left}%`, width: `${width}%`, top: 0, bottom: 0,
                  background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: '2px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '0.85em', color: pc.text,
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}>
                  {phase}
                </div>
              );
            })}
          </div>
        </div>

        {/* Months Bar */}
        <div style={{ display: 'flex', height: '4%', marginBottom: '0.6%', flexShrink: 0 }}>
          <div style={{ width: '10%', flexShrink: 0, display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '0.85em', color: '#666' }}>
            Track / Month
          </div>
          <div style={{ flex: 1, display: 'flex', border: '1px solid #BFBFBF', background: '#F2F2F2' }}>
            {months.map((m, idx) => {
              const ph = getMonthPhase(m.dateStart, phaseRanges);
              const pc = getPhaseColor(ph);
              return (
                <div key={idx} style={{
                  flex: 1, borderRight: idx < months.length - 1 ? '1px solid #BFBFBF' : 'none',
                  background: pc.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75em', fontWeight: 600, color: '#333',
                  overflow: 'hidden', whiteSpace: 'nowrap',
                }}>
                  {getMonthLabel(m, idx, months.length)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Track Rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4%', position: 'relative' }}>
          {tracksList.map(track => {
            const trackTasks = form.milestones.filter(m => m.track === track);
            const taskRows = layoutTrackTasks(trackTasks);

            return (
              <div key={track} style={{
                display: 'flex', flex: 1, minHeight: '18px',
                border: '1px solid #e0e0e0', background: '#FAFAFA', borderRadius: '2px',
              }}>
                <div style={{
                  width: '10%', flexShrink: 0, background: '#ECECEC', borderRight: '1px solid #BFBFBF',
                  padding: '2px 4px', fontWeight: 700, fontSize: '0.8em', color: '#333',
                  display: 'flex', alignItems: 'center',
                }}>
                  {track}
                </div>

                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                  {months.map((_, idx) => (
                    <div key={idx} style={{
                      position: 'absolute', left: `${(idx / months.length) * 100}%`, top: 0, bottom: 0,
                      width: '1px', background: '#e8e8e8', pointerEvents: 'none',
                    }} />
                  ))}

                  {taskRows.map((rowTasks, rIdx) => (
                    <div key={rIdx} style={{ position: 'relative', width: '100%', height: '14px' }}>
                      {rowTasks.map(ms => {
                        const style = getTaskStyle(ms);
                        const bg = getTaskColor(ms);
                        return (
                          <div key={ms.id} style={{
                            position: 'absolute',
                            ...style,
                            top: '1px', height: '12px',
                            background: bg,
                            borderRadius: ms.type === 'Chevron' ? '3px' : '2px',
                            color: '#fff', fontSize: '0.65em', fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                            padding: '0 4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          }} title={`${ms.name} (${ms.startDate} - ${ms.targetedDate})`}>
                            {ms.name}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Notes & Legend */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginTop: '0.5%', borderTop: '1px solid #BFBFBF',
          paddingTop: '0.3%', flexShrink: 0,
        }}>
          <div style={{ fontSize: '0.72em', color: '#444', lineHeight: 1.3 }}>
            <b>NOTES:</b><br />
            • Agile SCRUM delivery approach<br />
            • Key gates align with SteerCo review dates
          </div>
          <div style={{ display: 'flex', gap: '5px', fontSize: '0.65em', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[
              { l: 'Inception', c: '#EB9800' },
              { l: 'Elaboration', c: '#00B0CA' },
              { l: 'Construction / Sprints', c: '#007C92' },
              { l: 'Governance', c: '#E60000' },
              { l: 'Transition', c: '#9C2AA0' },
              { l: 'Sign-Off', c: '#E60000', icon: '♦' },
            ].map((lg, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#F2F2F2', padding: '1px 5px', borderRadius: '3px' }}>
                {lg.icon
                  ? <span style={{ color: lg.c, fontWeight: 'bold', fontSize: '1.2em' }}>{lg.icon}</span>
                  : <span style={{ display: 'inline-block', width: '7px', height: '7px', background: lg.c }} />}
                {lg.l}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '1.6em', fontWeight: 900, color: '#E60000', letterSpacing: '1px' }}>VOIS</span>
        </div>
      </div>
    );
  }

  // Slide 2: Milestones Plan
  return (
    <div style={{
      width: '100%', aspectRatio: '13.33/7.5', background: '#fff',
      fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden',
      borderRadius: '4px', fontSize: '0.55em', color: '#000', padding: '2%',
    }}>
      <div style={{ fontSize: '1.5em', fontWeight: 700, marginBottom: '2%' }}>
        {form.projectName || 'Project Name'} | Milestones Plan
      </div>

      <div style={{ position: 'absolute', top: '3%', right: '3%', fontSize: '0.65em' }}>
        <b>RAG Legend:</b>
        <div style={{ display: 'flex', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
          {[
            { l: 'Critical Risk', c: '#FF0000' },
            { l: 'On Track', c: '#00B050' },
            { l: 'Behind/Risk', c: '#FFC000' },
            { l: 'Off Track', c: '#A6A6A6' },
          ].map((r, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <span style={{ width: 6, height: 6, background: r.c, display: 'inline-block', borderRadius: 1 }} />
              {r.l}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '4%' }}>
        {form.milestones.map((ms, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5%', gap: '2%' }}>
            <div style={{
              background: '#E60000', color: '#fff', borderRadius: 4, padding: '1% 2%',
              fontWeight: 700, fontSize: '0.8em', textAlign: 'center', flex: '0 0 16%',
              lineHeight: 1.3,
            }}>
              Milestone {idx + 1}<br />"{ms.name || '...'}"
            </div>
            <div style={{ flex: 1, position: 'relative', height: 12 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: barColor(ms.status), width: '75%',
              }} />
              <div style={{
                position: 'absolute', right: '10%', top: -1,
                width: 8, height: 8, background: '#0070C0',
                transform: 'rotate(45deg)',
              }} />
            </div>
            <span style={{ fontSize: '0.75em', flex: '0 0 12%' }}>{ms.targetedDate || ''}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '4%', left: '2%', right: '2%', fontSize: '0.72em' }}>
        <b style={{ textDecoration: 'underline' }}>Plan Assumptions:</b>
        <div style={{ marginTop: 3, color: '#333', lineHeight: 1.5 }}>
          {assLines.map((line, i) => <div key={i}>• {line}</div>)}
          {assLines.length === 0 && <span style={{ color: '#aaa', fontStyle: 'italic' }}>Enter assumptions...</span>}
        </div>
      </div>
    </div>
  );
}

export function ScaledSlidePreview({ form, activeSlide }: { form: POAPSlideData; activeSlide: 1 | 2 | 3 }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const newScale = Math.min(1, width / 700);
        setScale(newScale);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const scaledHeight = 394 * scale;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: scaledHeight,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          width: 700,
          height: 394,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <SlidePreview form={form} activeSlide={activeSlide} />
      </div>
    </div>
  );
}
