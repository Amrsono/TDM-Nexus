import React, { useState } from 'react';
import { FileSliders, Plus, Trash2, FileDown, Eye } from 'lucide-react';
import pptxgen from 'pptxgenjs';

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface MilestoneRow {
  id: number;
  name: string;
  status: string;
  targetedDate: string; // Used as End Date in timeline
  releaseDate: string;
  actualDate: string;
  startDate?: string;
  phase?: 'Inception' | 'Elaboration' | 'Construction' | 'Transition';
  track?: 'Governance' | 'Core' | 'Sprints' | 'Testing' | 'Transition' | 'Support';
  type?: 'Block' | 'Chevron' | 'Sprint' | 'SignOff' | 'Milestone';
}

interface POAPSlideData {
  projectName: string;
  reqId: string;
  projectManager: string;
  expectedClosure: string;
  portfolio: string;
  transition: string;
  ragOverall: 'Green' | 'Amber' | 'Red';
  mpGate: string;
  build: string;
  projectGate: string;
  projectScope: string;
  currentStatus: string;
  milestones: MilestoneRow[];
  obstacles: string;
  planAssumptions: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const ragHex = (v: string) => {
  if (v === 'Green') return '#00B050';
  if (v === 'Amber') return '#FFC000';
  return '#FF0000';
};

const statusColor = (s: string) => {
  const l = (s || '').toLowerCase();
  if (l === 'completed' || l === 'done') return '#00B050';
  if (l.includes('progress')) return '#FFC000';
  if (l.includes('not started')) return '#FF0000';
  return '#000';
};

const barColor = (s: string) => {
  const l = (s || '').toLowerCase();
  if (l === 'completed' || l === 'done') return '#00B050';
  if (l.includes('progress')) return '#FFC000';
  return '#A6A6A6';
};

/* ─── Timeline Math & Shading Helpers ─────────────────────────────────────── */
const getTimelineMonths = (milestones: MilestoneRow[]) => {
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  milestones.forEach(ms => {
    if (ms.startDate) {
      const d = new Date(ms.startDate);
      if (!isNaN(d.getTime())) {
        if (!minDate || d < minDate) minDate = d;
      }
    }
    if (ms.targetedDate) {
      const d = new Date(ms.targetedDate);
      if (!isNaN(d.getTime())) {
        if (!maxDate || d > maxDate) maxDate = d;
      }
    }
  });

  if (!minDate) {
    minDate = new Date('2026-03-01');
  }
  if (!maxDate) {
    maxDate = new Date('2027-02-28');
  }

  const timelineStart = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const timelineEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0, 23, 59, 59);

  const months: { label: string; dateStart: Date; dateEnd: Date }[] = [];
  const curr = new Date(timelineStart);
  
  let count = 0;
  while (curr <= timelineEnd && count < 24) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dStart = new Date(curr.getFullYear(), curr.getMonth(), 1);
    const dEnd = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 23, 59, 59);
    months.push({
      label: `${monthNames[curr.getMonth()]} ${curr.getFullYear()}`,
      dateStart: dStart,
      dateEnd: dEnd
    });
    curr.setMonth(curr.getMonth() + 1);
    count++;
  }

  return { months, timelineStart, timelineEnd };
};

const getPhaseRanges = (milestones: MilestoneRow[]) => {
  const ranges: Record<string, { start: number; end: number }> = {};
  
  milestones.forEach(ms => {
    if (!ms.phase || ms.track === 'Governance') return;
    const start = ms.startDate ? new Date(ms.startDate).getTime() : 0;
    const end = ms.targetedDate ? new Date(ms.targetedDate).getTime() : 0;
    if (start && end) {
      if (!ranges[ms.phase]) {
        ranges[ms.phase] = { start, end };
      } else {
        ranges[ms.phase].start = Math.min(ranges[ms.phase].start, start);
        ranges[ms.phase].end = Math.max(ranges[ms.phase].end, end);
      }
    }
  });

  return ranges;
};

const getMonthPhase = (monthDate: Date, phaseRanges: Record<string, { start: number; end: number }>) => {
  const t = monthDate.getTime();
  for (const phase of ['Inception', 'Elaboration', 'Construction', 'Transition'] as const) {
    const range = phaseRanges[phase];
    if (range && t >= range.start && t <= range.end) {
      return phase;
    }
  }

  let minDiff = Infinity;
  let closestPhase: 'Inception' | 'Elaboration' | 'Construction' | 'Transition' = 'Construction';
  for (const phase of ['Inception', 'Elaboration', 'Construction', 'Transition'] as const) {
    const range = phaseRanges[phase];
    if (range) {
      const mid = (range.start + range.end) / 2;
      const diff = Math.abs(t - mid);
      if (diff < minDiff) {
        minDiff = diff;
        closestPhase = phase;
      }
    }
  }
  return closestPhase;
};

const layoutTrackTasks = (tasks: MilestoneRow[]) => {
  const sorted = [...tasks].sort((a, b) => {
    const da = a.startDate ? new Date(a.startDate).getTime() : 0;
    const db = b.startDate ? new Date(b.startDate).getTime() : 0;
    return da - db;
  });

  const rows: MilestoneRow[][] = [];
  const rowEndTimes: number[] = [];

  sorted.forEach(task => {
    const taskStart = task.startDate ? new Date(task.startDate).getTime() : 0;
    const taskEnd = task.targetedDate ? new Date(task.targetedDate).getTime() : 0;

    let placed = false;
    for (let r = 0; r < rows.length; r++) {
      const gap = 24 * 3600 * 1000; 
      if (taskStart >= rowEndTimes[r] + gap) {
        rows[r].push(task);
        rowEndTimes[r] = taskEnd;
        placed = true;
        break;
      }
    }

    if (!placed) {
      rows.push([task]);
      rowEndTimes.push(taskEnd);
    }
  });

  return rows;
};

const exampleMilestones: MilestoneRow[] = [
  { id: 1, name: 'Governance / Programme & Project Management', status: 'In Progress', startDate: '2026-03-01', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Inception', track: 'Governance', type: 'Chevron' },
  { id: 2, name: 'Kick-Off', status: 'Completed', startDate: '2026-03-01', targetedDate: '2026-03-15', releaseDate: '', actualDate: '', phase: 'Inception', track: 'Core', type: 'Block' },
  { id: 3, name: 'AX Work Shops', status: 'Completed', startDate: '2026-03-05', targetedDate: '2026-03-25', releaseDate: '', actualDate: '', phase: 'Inception', track: 'Core', type: 'Chevron' },
  { id: 4, name: 'Finalise Build Scope', status: 'Completed', startDate: '2026-03-15', targetedDate: '2026-03-31', releaseDate: '', actualDate: '', phase: 'Inception', track: 'Core', type: 'Block' },
  { id: 5, name: 'Agree NFRs & MS Support', status: 'Completed', startDate: '2026-04-01', targetedDate: '2026-04-20', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Chevron' },
  { id: 6, name: 'Azure Licenses + SSL Certs', status: 'Completed', startDate: '2026-04-15', targetedDate: '2026-05-10', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Block' },
  { id: 7, name: 'Azure Set-up + Profiling', status: 'Completed', startDate: '2026-05-05', targetedDate: '2026-05-25', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Block' },
  { id: 8, name: 'High Level Architecture', status: 'Completed', startDate: '2026-04-01', targetedDate: '2026-05-05', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'SignOff' },
  { id: 9, name: 'HLD Doc + AX Version 2017/18 Re-factor', status: 'Completed', startDate: '2026-04-05', targetedDate: '2026-05-15', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'SignOff' },
  { id: 10, name: 'Security Plan', status: 'Completed', startDate: '2026-04-15', targetedDate: '2026-05-20', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'SignOff' },
  { id: 11, name: 'DevOps Detailed Design', status: 'Completed', startDate: '2026-04-20', targetedDate: '2026-05-25', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Chevron' },
  { id: 12, name: 'MS AX - Detailed Designs / Interface Field Mappings', status: 'Completed', startDate: '2026-04-20', targetedDate: '2026-05-30', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Chevron' },
  { id: 13, name: 'Align Plan Dates', status: 'Completed', startDate: '2026-05-20', targetedDate: '2026-05-30', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Chevron' },
  { id: 14, name: 'Automated Test & CI Approach', status: 'Completed', startDate: '2026-05-10', targetedDate: '2026-05-25', releaseDate: '', actualDate: '', phase: 'Elaboration', track: 'Core', type: 'Chevron' },
  { id: 15, name: 'Agile SCRUM - DevOps Build Sprints', status: 'In Progress', startDate: '2026-05-26', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Sprints', type: 'Sprint' },
  { id: 16, name: 'AX SCRUM Team 1 - AX Build Sprints', status: 'In Progress', startDate: '2026-05-26', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Sprints', type: 'Sprint' },
  { id: 17, name: 'AX SCRUM Team 2 - AX Build Sprints', status: 'In Progress', startDate: '2026-05-26', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Sprints', type: 'Sprint' },
  { id: 18, name: 'Integration SCRUM Team Sprints', status: 'In Progress', startDate: '2026-06-15', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Sprints', type: 'Sprint' },
  { id: 19, name: 'Test Strategy', status: 'Completed', startDate: '2026-05-26', targetedDate: '2026-07-10', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Testing', type: 'SignOff' },
  { id: 20, name: 'System Integration Testing (SIT) + Revisions + Test Exit Report', status: 'In Progress', startDate: '2026-07-15', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Testing', type: 'SignOff' },
  { id: 21, name: 'User Acceptance Testing (UAT) Cycles', status: 'In Progress', startDate: '2026-08-15', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Testing', type: 'SignOff' },
  { id: 22, name: 'PEN / Security + Performance Testing', status: 'Not Started', startDate: '2026-10-01', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Testing', type: 'SignOff' },
  { id: 23, name: 'Operational Acceptance Testing (OAT)', status: 'Not Started', startDate: '2026-10-01', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Testing', type: 'SignOff' },
  { id: 24, name: 'Training / Transition Strategy', status: 'In Progress', startDate: '2026-06-20', targetedDate: '2026-12-15', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Transition', type: 'SignOff' },
  { id: 25, name: 'KT Training and Handover Documentation', status: 'In Progress', startDate: '2026-08-20', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Construction', track: 'Transition', type: 'SignOff' },
  { id: 26, name: 'Support', status: 'In Progress', startDate: '2027-02-01', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Transition', track: 'Support', type: 'Block' }
];

const getMonthLabel = (m: { label: string }, index: number, total: number) => {
  const parts = m.label.split(' ');
  const monthShort = parts[0];
  const year = parts[1];
  
  const fullMonths: Record<string, string> = {
    Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May',
    Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October',
    Nov: 'November', Dec: 'December'
  };
  
  const monthFull = fullMonths[monthShort] || monthShort;
  
  if (index === 0 || index === total - 1) {
    return `${monthShort} ${year}`;
  }
  return monthFull;
};

/* ─── Live Preview Component ──────────────────────────────────────────────── */
function SlidePreview({ form, activeSlide }: { form: POAPSlideData; activeSlide: 1 | 2 | 3 }) {
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
          {/* Header fields */}
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
          {/* RAG */}
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

        {/* Content area: left scope/status, right milestones table */}
        <div style={{ display: 'flex', padding: '0.8% 1.5%', gap: '2%', height: '60%' }}>
          {/* Left */}
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

          {/* Right – milestones table */}
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
                {/* empty rows to fill to ~11 */}
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

  // Slide 3: Delivery Plan Timeline (Indicative Plan on a Page)
  if (activeSlide === 3) {
    const { months, timelineStart, timelineEnd } = getTimelineMonths(form.milestones);
    const phaseRanges = getPhaseRanges(form.milestones);
    const tracksList = ['Governance', 'Core', 'Sprints', 'Testing', 'Transition', 'Support'] as const;

    const tStart = timelineStart.getTime();
    const tEnd   = timelineEnd.getTime();
    const total  = tEnd - tStart;

    const getTaskStyle = (ms: MilestoneRow) => {
      const startStr = ms.startDate || ms.targetedDate || timelineStart.toISOString().split('T')[0];
      const endStr   = ms.targetedDate || ms.startDate  || timelineEnd.toISOString().split('T')[0];
      let left  = ((new Date(startStr).getTime() - tStart) / total) * 100;
      let width = ((new Date(endStr).getTime()   - new Date(startStr).getTime()) / total) * 100;
      if (left  < 0)   left  = 0;
      if (left  > 100) left  = 100;
      if (left + width > 100) width = 100 - left;
      if (width < 1.5) width = 1.5;
      return { left: `${left}%`, width: `${width}%` };
    };

    // ── Official Vodafone brand palette mapped to POAP phases ─────────────
    const phaseColorMap: Record<string, { border: string; text: string; bg: string; bgLight: string }> = {
      Inception:    { border: '#EB9800', text: '#EB9800', bg: '#FEF0CC', bgLight: '#FEF7E4' }, // Vodafone Orange
      Elaboration:  { border: '#00B0CA', text: '#007C92', bg: '#CCF0F5', bgLight: '#E5F8FB' }, // Vodafone Cerulean
      Construction: { border: '#007C92', text: '#007C92', bg: '#CCE8ED', bgLight: '#E0F4F7' }, // Vodafone Blue Lagoon
      Transition:   { border: '#9C2AA0', text: '#9C2AA0', bg: '#F0D9F1', bgLight: '#F8EEF8' }, // Vodafone Seance
    };
    const getPhaseColor = (phase: string) =>
      phaseColorMap[phase] ?? { border: '#4A4D4E', text: '#4A4D4E', bg: '#F2F2F2', bgLight: '#F9F9F9' }; // Vodafone Abbey

    const getTaskColor = (ms: MilestoneRow): string => {
      if (ms.track === 'Governance') return '#E60000';       // Vodafone Red
      if (ms.track === 'Sprints' || ms.track === 'Support') return '#007C92'; // Vodafone Blue Lagoon
      if (ms.track === 'Testing') return '#00B0CA';           // Vodafone Cerulean
      if (ms.track === 'Transition') return '#9C2AA0';        // Vodafone Seance
      if (ms.phase === 'Inception') return '#EB9800';         // Vodafone Orange
      if (ms.phase === 'Elaboration') return '#00B0CA';       // Vodafone Cerulean
      return '#4A4D4E';                                       // Vodafone Abbey
    };

    // Compute phase overlay positions (% of chart width)
    const phaseOverlays = Object.entries(phaseRanges).map(([phase, range]) => {
      let left  = ((range.start - tStart) / total) * 100;
      let width = ((range.end   - range.start) / total) * 100;
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
        boxSizing: 'border-box', display: 'flex', flexDirection: 'column'
      }}>

        {/* ── Title Row ──────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.3em',
          marginBottom: '0.7%', paddingBottom: '0.4%',
          borderBottom: '2px solid #E60000', flexShrink: 0
        }}>
          <span style={{ fontWeight: 700, fontSize: '1.2em', color: '#4A4D4E' }}>Example :</span>
          <span style={{ fontWeight: 700, fontSize: '1.2em', color: '#E60000' }}>
            {form.projectName || 'MS Dynamics AX'}
          </span>
          <span style={{ fontSize: '1.1em', color: '#4A4D4E' }}>
            {'– Indicative Plan on a Page –'}
          </span>
          <span style={{ fontSize: '1em', color: '#7F7F7F', fontStyle: 'italic' }}>
            {'DRAFT only –'} {new Date().toLocaleDateString('en-GB')}
          </span>
        </div>

        {/* ── Month Header Row ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', width: '100%', flexShrink: 0 }}>
          {/* Left track-label column spacer */}
          <div style={{ width: '13%', flexShrink: 0, background: '#F2F2F2', borderBottom: '1px solid #CCC' }} />
          {/* Month cells */}
          <div style={{ display: 'flex', flexGrow: 1 }}>
            {months.map((m, i) => {
              const phase  = getMonthPhase(m.dateStart, phaseRanges);
              const colors = getPhaseColor(phase);
              const label  = getMonthLabel(m, i, months.length);
              return (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  borderTop: `3px solid ${colors.border}`,
                  background: colors.bg,
                  borderLeft: i > 0 ? '1px dashed rgba(150,150,150,0.5)' : 'none',
                  padding: '2px 0', boxSizing: 'border-box', minWidth: 0,
                }}>
                  <span style={{
                    fontWeight: 700, fontSize: '0.95em', color: '#1F1F1F',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip',
                    maxWidth: '100%', textAlign: 'center', display: 'block',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize: '0.7em', color: colors.text, fontWeight: 700,
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>
                    {phase}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main Chart Body ─────────────────────────────────────────────────── */}
        <div style={{ flexGrow: 1, display: 'flex', minHeight: 0, position: 'relative' }}>

          {/* Track label column */}
          <div style={{
            width: '13%', flexShrink: 0, display: 'flex', flexDirection: 'column',
            borderRight: '2px solid #1F4E79', background: '#FAFAFA', zIndex: 4,
          }}>
            {tracksList.map((trackName) => {
              const trackMs = form.milestones.filter(m => (m.track || 'Core') === trackName);
              if (trackMs.length === 0) return null;
              const rowCount = layoutTrackTasks(trackMs).length;
              return (
                <div key={trackName} style={{
                  height: `${rowCount * 21}px`,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: '5px', boxSizing: 'border-box',
                  borderBottom: '1px solid #E0E0E0',
                }}>
                  <span style={{
                    fontWeight: 700, color: '#1F4E79', fontSize: '0.82em',
                    textAlign: 'right', wordBreak: 'break-word', lineHeight: 1.15,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {trackName === 'Core' ? 'Key\nMilestones' : trackName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Gantt area */}
          <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>

            {/* Phase column backgrounds */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', zIndex: 0, pointerEvents: 'none' }}>
              {months.map((m, i) => {
                const phase  = getMonthPhase(m.dateStart, phaseRanges);
                const colors = getPhaseColor(phase);
                return (
                  <div key={i} style={{
                    flex: 1, height: '100%', background: colors.bgLight,
                    borderLeft: i > 0 ? '1px solid rgba(180,180,180,0.25)' : 'none',
                  }} />
                );
              })}
            </div>

            {/* Phase banner labels (Elaboration >>, Construction >> etc.) */}
            {phaseOverlays.map(({ phase, left, width }) => {
              const colors = getPhaseColor(phase);
              return (
                <div key={phase} style={{
                  position: 'absolute', top: '1px', left: `${left}%`, width: `${width}%`,
                  zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
                }}>
                  <span style={{
                    display: 'inline-block', paddingLeft: '4px',
                    fontSize: '1.05em', fontWeight: 700, color: colors.border, whiteSpace: 'nowrap',
                  }}>
                    {phase} &gt;&gt;
                  </span>
                </div>
              );
            })}

            {/* Track rows */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
              {tracksList.map((trackName) => {
                const trackMs = form.milestones.filter(m => (m.track || 'Core') === trackName);
                if (trackMs.length === 0) return null;
                const rows = layoutTrackTasks(trackMs);

                return (
                  <div key={trackName} style={{
                    display: 'flex', flexDirection: 'column',
                    borderBottom: '1px solid rgba(191,191,191,0.4)',
                  }}>
                    {rows.map((rowTasks, rowIdx) => (
                      <div key={rowIdx} style={{ position: 'relative', height: '21px', width: '100%' }}>
                        {rowTasks.map((ms) => {
                          const sty   = getTaskStyle(ms);
                          const color = getTaskColor(ms);

                          /* ── Governance: full-width chevron arrow ── */
                          if (ms.track === 'Governance') {
                            return (
                              <div key={ms.id} style={{
                                position: 'absolute', left: sty.left, width: sty.width, top: '10%', height: '80%',
                                background: '#4472C4', color: '#fff',
                                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)',
                                display: 'flex', alignItems: 'center', paddingLeft: '8px',
                                fontSize: '0.8em', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden',
                              }}>
                                {ms.name}
                              </div>
                            );
                          }

                          /* ── Milestone diamond ── */
                          if (ms.type === 'Milestone') {
                            return (
                              <div key={ms.id} style={{
                                position: 'absolute', left: sty.left, height: '100%',
                                display: 'flex', alignItems: 'center',
                              }}>
                                <div style={{ width: '7px', height: '7px', background: '#0070C0', transform: 'rotate(45deg)', flexShrink: 0 }} />
                                <span style={{ marginLeft: '4px', fontSize: '0.72em', fontWeight: 700, color: '#222', whiteSpace: 'nowrap' }}>
                                  {ms.name}
                                </span>
                              </div>
                            );
                          }

                          /* ── Sprint: "SPRINTS >>" prefix + striped green bar ── */
                          if (ms.type === 'Sprint') {
                            return (
                              <div key={ms.id} style={{
                                position: 'absolute', left: sty.left, width: sty.width,
                                top: '10%', height: '80%', display: 'flex', alignItems: 'stretch',
                              }}>
                                <div style={{
                                  background: '#007C92', color: '#fff', padding: '0 4px',
                                  fontSize: '0.68em', fontWeight: 700, whiteSpace: 'nowrap',
                                  display: 'flex', alignItems: 'center', flexShrink: 0,
                                  borderRadius: '2px 0 0 2px',
                                }}>
                                  SPRINTS &gt;&gt;
                                </div>
                                <div style={{
                                  flexGrow: 1,
                                  background: 'repeating-linear-gradient(90deg,#007C92,#007C92 13px,#005f70 13px,#005f70 14px)',
                                  border: '1px solid #004a58', borderLeft: 'none',
                                  display: 'flex', alignItems: 'center', paddingLeft: '5px',
                                  borderRadius: '0 2px 2px 0', overflow: 'hidden',
                                }}>
                                  <span style={{ fontSize: '0.68em', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {ms.name}
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          /* ── SignOff: chevron + diamond ── */
                          if (ms.type === 'SignOff') {
                            return (
                              <div key={ms.id} style={{
                                position: 'absolute', left: sty.left, width: sty.width, height: '100%',
                                display: 'flex', alignItems: 'center',
                              }}>
                                <div style={{
                                  flexGrow: 1, height: '78%',
                                  background: color, color: '#fff',
                                  clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)',
                                  display: 'flex', alignItems: 'center',
                                  paddingLeft: '6px', paddingRight: '12px',
                                  fontSize: '0.68em', fontWeight: 700,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {ms.name}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '2px', position: 'relative', flexShrink: 0 }}>
                                  <div style={{ width: '6px', height: '6px', background: '#0070C0', transform: 'rotate(45deg)' }} />
                                  <span style={{ position: 'absolute', top: '8px', fontSize: '0.45em', color: '#555', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                                    sign off
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          /* ── Default block or chevron ── */
                          const isChevron = ms.type === 'Chevron';
                          return (
                            <div key={ms.id} style={{
                              position: 'absolute', left: sty.left, width: sty.width,
                              top: '10%', height: '80%',
                              background: color, color: '#fff',
                              clipPath: isChevron
                                ? 'polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)'
                                : 'none',
                              borderRadius: isChevron ? '0' : '2px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: isChevron ? '0 12px 0 6px' : '0 4px',
                              fontSize: '0.68em', fontWeight: 700,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              boxShadow: isChevron ? 'none' : '0 1px 2px rgba(0,0,0,0.12)',
                            }}>
                              {ms.name}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
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
        {form.projectName || 'Project Name'}| Milestones Plan
      </div>

      {/* RAG mini legend */}
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

      {/* Swim lanes */}
      <div style={{ marginTop: '4%' }}>
        {form.milestones.map((ms, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5%', gap: '2%' }}>
            {/* Red milestone label */}
            <div style={{
              background: '#E60000', color: '#fff', borderRadius: 4, padding: '1% 2%',
              fontWeight: 700, fontSize: '0.8em', textAlign: 'center', flex: '0 0 16%',
              lineHeight: 1.3,
            }}>
              Milestone{idx + 1}<br />"{ms.name || '...'}"
            </div>
            {/* Timeline bar */}
            <div style={{ flex: 1, position: 'relative', height: 12 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: barColor(ms.status), width: '75%',
              }} />
              {/* Diamond */}
              <div style={{
                position: 'absolute', right: '10%', top: -1,
                width: 8, height: 8, background: '#0070C0',
                transform: 'rotate(45deg)',
              }} />
            </div>
            {/* Date */}
            <span style={{ fontSize: '0.75em', flex: '0 0 12%' }}>{ms.targetedDate || ''}</span>
          </div>
        ))}
      </div>

      {/* Plan Assumptions */}
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

const thStyle: React.CSSProperties = {
  padding: '2px 4px', fontSize: '0.85em', fontWeight: 700, textAlign: 'center',
  borderBottom: '1px solid #BFBFBF',
};
const tdStyle: React.CSSProperties = {
  padding: '2px 4px', textAlign: 'center', borderBottom: '1px solid #e0e0e0',
  fontSize: '0.85em',
};

/* ─── Scaled Slide Preview Wrapper for Mobile ─── */
function ScaledSlidePreview({ form, activeSlide }: { form: POAPSlideData; activeSlide: 1 | 2 | 3 }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
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
        borderRadius: '4px'
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
          left: 0
        }}
      >
        <SlidePreview form={form} activeSlide={activeSlide} />
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export function POAPSlideBuilder() {
  const [form, setForm] = useState<POAPSlideData>({
    projectName: 'MS Dynamics AX',
    reqId: '100473',
    projectManager: 'Amr Sono',
    expectedClosure: '2027-02-28',
    portfolio: 'Dynamics AX',
    transition: 'Active',
    ragOverall: 'Green',
    mpGate: 'Pass',
    build: 'Completed',
    projectGate: 'Active',
    projectScope: 'Deliver AX Solution\nIntegrate POS systems\nDevelop DevOps pipeline',
    currentStatus: 'On track with build sprints\nSIT preparation starting\nTraining materials drafting',
    milestones: exampleMilestones,
    obstacles: 'Resource availability for legacy systems during transition',
    planAssumptions: 'Azure licenses will be approved on time\nEnvironments are stable',
  });

  const [previewSlide, setPreviewSlide] = useState<1 | 2 | 3>(3);

  /* ── helpers ── */
  const set = <K extends keyof POAPSlideData>(key: K, val: POAPSlideData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const setMilestone = (idx: number, field: keyof MilestoneRow, val: string) => {
    const updated = [...form.milestones];
    (updated[idx] as any)[field] = val;
    set('milestones', updated);
  };

  const addMilestone = () => {
    set('milestones', [
      ...form.milestones,
      {
        id: form.milestones.length + 1, name: '', status: '', targetedDate: '', releaseDate: '', actualDate: '',
        startDate: '', phase: 'Inception', track: 'Core', type: 'Chevron'
      },
    ]);
  };

  const removeMilestone = (idx: number) => {
    if (form.milestones.length <= 1) return;
    set('milestones', form.milestones.filter((_, i) => i !== idx));
  };

  /* ── slide generation (same as before) ── */
  const generateSlide = () => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';

    const WHITE = 'FFFFFF';
    const BLACK = '000000';
    const DARK_RED = 'E60000';
    const RED = 'FF0000';
    const LIGHT_GRAY = 'F2F2F2';
    const BORDER_GRAY = 'BFBFBF';

    const ragColor = (val: string) => {
      if (val === 'Green') return '00B050';
      if (val === 'Amber') return 'FFC000';
      return 'FF0000';
    };

    /* ── SLIDE 1 ── */
    const s1 = pptx.addSlide();
    s1.background = { color: WHITE };
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.55, fill: { color: DARK_RED } });
    s1.addText(`IITC – ${form.projectName}`, { x: 0.2, y: 0.05, w: 4.5, h: 0.45, fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial' });

    const headerFields = [
      { label: 'REQ ID', value: form.reqId, x: 5.0 },
      { label: 'Expected Closure', value: form.expectedClosure, x: 7.0 },
      { label: 'Portfolio', value: form.portfolio, x: 9.0 },
      { label: 'Transition', value: form.transition, x: 10.2 },
    ];
    headerFields.forEach(f => {
      s1.addText(f.label, { x: f.x, y: 0.05, w: 1.8, h: 0.2, fontSize: 7, color: LIGHT_GRAY, fontFace: 'Arial' });
      s1.addText(f.value || '—', { x: f.x, y: 0.25, w: 1.8, h: 0.25, fontSize: 9, bold: true, color: WHITE, fontFace: 'Arial' });
    });

    s1.addText('RAG', { x: 11.4, y: 0.05, w: 0.6, h: 0.2, fontSize: 7, color: LIGHT_GRAY, fontFace: 'Arial' });
    s1.addShape(pptx.ShapeType.rect, { x: 11.4, y: 0.25, w: 0.7, h: 0.25, fill: { color: ragColor(form.ragOverall) } });

    s1.addText(`Project Manager: ${form.projectManager}`, { x: 0.2, y: 0.65, w: 4.0, h: 0.25, fontSize: 9, bold: true, color: BLACK, fontFace: 'Arial' });

    const gateFields = [
      { label: 'MP Gate', value: form.mpGate, x: 7.0 },
      { label: 'Build', value: form.build, x: 8.5 },
      { label: 'Project Gate', value: form.projectGate, x: 10.0 },
    ];
    gateFields.forEach(f => {
      s1.addText(f.label, { x: f.x, y: 0.6, w: 1.3, h: 0.15, fontSize: 7, color: '666666', fontFace: 'Arial' });
      s1.addText(f.value || '—', { x: f.x, y: 0.75, w: 1.3, h: 0.2, fontSize: 9, bold: true, color: BLACK, fontFace: 'Arial' });
    });

    s1.addShape(pptx.ShapeType.rect, { x: 0.2, y: 1.0, w: 12.9, h: 0.02, fill: { color: BORDER_GRAY } });

    s1.addText('Project Scope', { x: 0.2, y: 1.1, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: BLACK, fontFace: 'Arial', underline: { style: 'sng' } });
    const scopeLines = (form.projectScope || '').split('\n').filter(Boolean);
    const scopeTextRuns = scopeLines.map((line, i) => ({ text: `${i + 1}. ${line}\n`, options: { fontSize: 8, color: BLACK, fontFace: 'Arial' as const } }));
    if (scopeTextRuns.length > 0) s1.addText(scopeTextRuns, { x: 0.3, y: 1.45, w: 5.2, h: 2.2, valign: 'top', lineSpacing: 14 });

    s1.addText('Current Status', { x: 0.2, y: 3.7, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: BLACK, fontFace: 'Arial', underline: { style: 'sng' } });
    const stLines = (form.currentStatus || '').split('\n').filter(Boolean);
    const stRuns = stLines.map(line => ({ text: `• ${line}\n`, options: { fontSize: 8, color: BLACK, fontFace: 'Arial' as const } }));
    if (stRuns.length > 0) s1.addText(stRuns, { x: 0.3, y: 4.05, w: 5.2, h: 1.5, valign: 'top', lineSpacing: 14 });

    // Milestones table
    s1.addShape(pptx.ShapeType.rect, { x: 6.0, y: 1.1, w: 7.1, h: 0.3, fill: { color: DARK_RED } });
    const msHeaders = ['', 'Project Milestones', 'Status', 'Targeted\nDate', 'Release\nDate', 'Actual\nDate'];
    const msColWidths = [0.35, 2.2, 1.0, 1.0, 1.0, 1.0];
    let msX = 6.0;
    msHeaders.forEach((h, i) => {
      s1.addText(h, { x: msX, y: 1.1, w: msColWidths[i], h: 0.3, fontSize: 7, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
      msX += msColWidths[i];
    });

    form.milestones.forEach((ms, rowIdx) => {
      let colX = 6.0;
      const yPos = 1.42 + rowIdx * 0.42;
      const rowFill = rowIdx % 2 === 0 ? LIGHT_GRAY : WHITE;
      const cellData = [String(rowIdx + 1), ms.name || '', ms.status || '', ms.targetedDate || '', ms.releaseDate || '', ms.actualDate || ''];
      cellData.forEach((cellText, cIdx) => {
        s1.addShape(pptx.ShapeType.rect, { x: colX, y: yPos, w: msColWidths[cIdx], h: 0.42, fill: { color: rowFill }, line: { color: BORDER_GRAY, width: 0.5 } });
        let textColor = BLACK;
        if (cIdx === 2) { const lower = (cellText || '').toLowerCase(); if (lower === 'completed' || lower === 'done') textColor = '00B050'; else if (lower.includes('progress')) textColor = 'FFC000'; else if (lower.includes('not started')) textColor = 'FF0000'; }
        s1.addText(cellText, { x: colX, y: yPos, w: msColWidths[cIdx], h: 0.42, fontSize: 7, color: textColor, fontFace: 'Arial', align: 'center', valign: 'middle', bold: cIdx === 2 });
        colX += msColWidths[cIdx];
      });
    });

    const obstacleY = 5.6;
    s1.addText('What are the obstacles that SteerCo/ExCo need to help overcome to execute successfully?', { x: 0.2, y: obstacleY, w: 12.9, h: 0.25, fontSize: 8, bold: true, color: BLACK, fontFace: 'Arial' });
    s1.addText(form.obstacles || '', { x: 0.3, y: obstacleY + 0.3, w: 12.7, h: 0.6, fontSize: 8, color: '333333', fontFace: 'Arial', valign: 'top' });

    const legendY = 6.6;
    s1.addText('RAG Legend:', { x: 0.2, y: legendY, w: 1.0, h: 0.25, fontSize: 7, bold: true, color: BLACK, fontFace: 'Arial' });
    [
      { label: 'Off Track/High Risk', color: RED, x: 1.5 },
      { label: 'Behind Schedule/Low Medium Risk', color: 'FFC000', x: 3.8 },
      { label: 'On Track/Low Risk', color: '00B050', x: 7.0 },
      { label: 'Completed', color: '0070C0', x: 9.0 },
      { label: 'Not started', color: 'A6A6A6', x: 10.7 },
    ].forEach(l => {
      s1.addShape(pptx.ShapeType.rect, { x: l.x, y: legendY + 0.05, w: 0.2, h: 0.15, fill: { color: l.color } });
      s1.addText(l.label, { x: l.x + 0.25, y: legendY, w: 2.0, h: 0.25, fontSize: 6, color: BLACK, fontFace: 'Arial' });
    });
    s1.addText('VOIS', { x: 11.0, y: 6.9, w: 2.0, h: 0.4, fontSize: 22, bold: true, color: DARK_RED, fontFace: 'Arial', align: 'right' });

    /* ── SLIDE 2 ── */
    const s2 = pptx.addSlide();
    s2.background = { color: WHITE };
    s2.addText(`${form.projectName || 'Project Name'}| Milestones Plan`, { x: 0.2, y: 0.2, w: 8.0, h: 0.5, fontSize: 18, bold: true, color: BLACK, fontFace: 'Arial' });

    s2.addText('RAG Legend:', { x: 10.0, y: 0.2, w: 1.0, h: 0.2, fontSize: 7, bold: true, color: BLACK, fontFace: 'Arial' });
    [{ label: 'Critical Risk', color: RED }, { label: 'On Track', color: '00B050' }, { label: 'Behind/Risk', color: 'FFC000' }, { label: 'Off Track', color: 'A6A6A6' }]
      .forEach((item, i) => {
        s2.addShape(pptx.ShapeType.rect, { x: 11.0 + (i > 1 ? -1.0 : 0), y: 0.45 + (i > 1 ? 0.2 : 0) + (i % 2 === 1 ? 0.2 : 0), w: 0.15, h: 0.15, fill: { color: item.color } });
        s2.addText(item.label, { x: 11.2 + (i > 1 ? -1.0 : 0), y: 0.42 + (i > 1 ? 0.2 : 0) + (i % 2 === 1 ? 0.2 : 0), w: 1.5, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });
      });

    form.milestones.forEach((ms, idx) => {
      const laneY = 1.2 + idx * 1.1;
      s2.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: laneY, w: 1.8, h: 0.55, fill: { color: DARK_RED }, rectRadius: 0.05 });
      s2.addText(`Milestone${idx + 1}\n"${ms.name || '...'}"`, { x: 0.3, y: laneY, w: 1.8, h: 0.55, fontSize: 7, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
      const bc = ms.status?.toLowerCase().includes('completed') || ms.status?.toLowerCase() === 'done' ? '00B050' : ms.status?.toLowerCase().includes('progress') ? 'FFC000' : 'A6A6A6';
      s2.addShape(pptx.ShapeType.rect, { x: 2.5, y: laneY + 0.15, w: 6.0, h: 0.25, fill: { color: bc } });
      s2.addShape(pptx.ShapeType.rect, { x: 8.2, y: laneY + 0.1, w: 0.15, h: 0.15, fill: { color: '0070C0' }, rotate: 45 });
      if (ms.targetedDate) s2.addText(ms.targetedDate, { x: 8.5, y: laneY + 0.05, w: 1.5, h: 0.25, fontSize: 7, color: BLACK, fontFace: 'Arial' });
    });

    const assY = 1.2 + form.milestones.length * 1.1 + 0.3;
    s2.addText('Plan Assumptions:', { x: 0.3, y: assY, w: 12.0, h: 0.25, fontSize: 9, bold: true, underline: { style: 'sng' }, color: BLACK, fontFace: 'Arial' });
    const aLines = (form.planAssumptions || '').split('\n').filter(Boolean);
    const aRuns = aLines.map(line => ({ text: `• ${line}\n`, options: { fontSize: 7, color: '333333' as string, fontFace: 'Arial' as const } }));
    if (aRuns.length > 0) s2.addText(aRuns, { x: 0.5, y: assY + 0.3, w: 11.5, h: 1.5, valign: 'top', lineSpacing: 13 });

    /* ── SLIDE 3: Delivery Plan Timeline ── */
    const s3 = pptx.addSlide();
    s3.background = { color: WHITE };

    s3.addText(`${form.projectName || 'Project'} – Indicative Plan on a Page`, {
      x: 0.3, y: 0.2, w: 9.0, h: 0.4, fontSize: 16, bold: true, color: '1F4E79', fontFace: 'Arial'
    });
    s3.addText(`DRAFT only – ${new Date().toLocaleDateString('en-GB')}`, {
      x: 9.5, y: 0.2, w: 3.5, h: 0.4, fontSize: 10, bold: true, color: '7F7F7F', fontFace: 'Arial', align: 'right'
    });
    s3.addShape(pptx.ShapeType.line, { x: 0.3, y: 0.65, w: 12.7, h: 0, line: { color: DARK_RED, width: 1.5 } });

    const { months, timelineStart, timelineEnd } = getTimelineMonths(form.milestones);
    const phaseRanges = getPhaseRanges(form.milestones);
    const tStart = timelineStart.getTime();
    const tEnd = timelineEnd.getTime();
    const totalTime = tEnd - tStart;

    const colStartX = 1.8;
    const colAreaWidth = 11.2;
    const colW = colAreaWidth / months.length;

    months.forEach((m, i) => {
      const xPos = colStartX + i * colW;
      const phase = getMonthPhase(m.dateStart, phaseRanges);
      
      let pColor = '4A4D4E'; // Vodafone Abbey
      let pBg = 'F2F2F2';
      if (phase === 'Inception')    { pColor = 'EB9800'; pBg = 'FEF0CC'; } // Vodafone Orange
      else if (phase === 'Elaboration')  { pColor = '00B0CA'; pBg = 'CCF0F5'; } // Vodafone Cerulean
      else if (phase === 'Construction') { pColor = '007C92'; pBg = 'CCE8ED'; } // Vodafone Blue Lagoon
      else if (phase === 'Transition')   { pColor = '9C2AA0'; pBg = 'F0D9F1'; } // Vodafone Seance

      s3.addShape(pptx.ShapeType.rect, {
        x: xPos, y: 0.8, w: colW, h: 5.4,
        fill: { color: pBg },
        line: { color: 'E6E6E6', width: 0.5 }
      });

      s3.addText(getMonthLabel(m, i, months.length), {
        x: xPos, y: 0.8, w: colW, h: 0.2,
        fontSize: 8, bold: true, align: 'center', color: '333333', fontFace: 'Arial'
      });
      s3.addText(phase, {
        x: xPos, y: 1.0, w: colW, h: 0.2,
        fontSize: 6, bold: true, align: 'center', color: pColor, fontFace: 'Arial'
      });

      if (i > 0) {
        s3.addShape(pptx.ShapeType.line, {
          x: xPos, y: 0.8, w: 0, h: 5.4,
          line: { color: 'BFBFBF', width: 0.5, dashType: 'dash' }
        });
      }
    });

    const activeTracks = (['Governance', 'Core', 'Sprints', 'Testing', 'Transition', 'Support'] as const)
      .filter(trackName => form.milestones.some(m => (m.track || 'Core') === trackName));

    let totalLanesCount = 0;
    const trackLayouts: Record<string, MilestoneRow[][]> = {};
    activeTracks.forEach(trackName => {
      const trackMs = form.milestones.filter(m => (m.track || 'Core') === trackName);
      const rows = layoutTrackTasks(trackMs);
      trackLayouts[trackName] = rows;
      totalLanesCount += rows.length;
    });

    const heightAvailable = 4.8;
    const rowH = Math.min(0.28, heightAvailable / Math.max(1, totalLanesCount));
    
    let currentY = 1.35;

    activeTracks.forEach(trackName => {
      const rows = trackLayouts[trackName];
      const trackHeight = rows.length * rowH;

      s3.addText(trackName === 'Core' ? 'Key Milestones' : trackName, {
        x: 0.2, y: currentY, w: 1.5, h: trackHeight,
        fontSize: 8, bold: true, color: '1F4E79', align: 'right', fontFace: 'Arial', valign: 'middle'
      });

      s3.addShape(pptx.ShapeType.line, {
        x: 1.75, y: currentY, w: 0, h: trackHeight,
        line: { color: '1F4E79', width: 1.5 }
      });

      rows.forEach((rowTasks, rowIdx) => {
        const rowY = currentY + rowIdx * rowH;

        rowTasks.forEach(ms => {
          const startStr = ms.startDate || ms.targetedDate || timelineStart.toISOString().split('T')[0];
          const endStr = ms.targetedDate || ms.startDate || timelineEnd.toISOString().split('T')[0];
          const start = new Date(startStr).getTime();
          const end = new Date(endStr).getTime();

          const pctLeft = (start - tStart) / totalTime;
          const pctWidth = (end - start) / totalTime;

          let taskX = colStartX + pctLeft * colAreaWidth;
          let taskW = pctWidth * colAreaWidth;

          if (taskX < colStartX) taskX = colStartX;
          if (taskX > colStartX + colAreaWidth) taskX = colStartX + colAreaWidth;
          if (taskX + taskW > colStartX + colAreaWidth) taskW = colStartX + colAreaWidth - taskX;
          if (taskW < 0.15) taskW = 0.15;

          let colorHex = '4A4D4E'; // Vodafone Abbey (default)
          if (ms.track === 'Governance') colorHex = 'E60000'; // Vodafone Red
          else if (ms.track === 'Sprints' || ms.track === 'Support' || ms.name.toLowerCase().includes('sprint')) colorHex = '007C92'; // Vodafone Blue Lagoon
          else if (ms.track === 'Testing') colorHex = '00B0CA'; // Vodafone Cerulean
          else if (ms.track === 'Transition') colorHex = '9C2AA0'; // Vodafone Seance
          else if (ms.phase === 'Inception') colorHex = 'EB9800'; // Vodafone Orange
          else if (ms.phase === 'Elaboration') colorHex = '00B0CA'; // Vodafone Cerulean

          const shapeH = rowH * 0.75;
          const shapeY = rowY + (rowH - shapeH) / 2;

          if (ms.type === 'Milestone') {
            s3.addShape(pptx.ShapeType.diamond, {
              x: taskX + taskW / 2 - 0.06, y: shapeY + shapeH / 2 - 0.06,
              w: 0.12, h: 0.12, fill: { color: 'E60000' }
            });
            s3.addText(ms.name, {
              x: taskX + taskW / 2 + 0.1, y: shapeY,
              w: 1.5, h: shapeH, fontSize: 6, bold: true, color: '333333', fontFace: 'Arial', valign: 'middle'
            });
          }
          else if (ms.type === 'SignOff') {
            const barW = Math.max(0.1, taskW - 0.2);
            s3.addShape(pptx.ShapeType.chevron, {
              x: taskX, y: shapeY, w: barW, h: shapeH,
              fill: { color: colorHex }
            });
            s3.addText(ms.name, {
              x: taskX + 0.05, y: shapeY, w: barW - 0.1, h: shapeH,
              fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial'
            });

            const diaX = taskX + barW + 0.02;
            s3.addShape(pptx.ShapeType.diamond, {
              x: diaX, y: shapeY + shapeH / 2 - 0.04,
              w: 0.08, h: 0.08, fill: { color: 'E60000' }
            });
            s3.addText('sign off', {
              x: diaX - 0.15, y: shapeY + shapeH - 0.05, w: 0.4, h: 0.1,
              fontSize: 4, italic: true, color: '666666', align: 'center', fontFace: 'Arial'
            });
          }
          else if (ms.type === 'Sprint') {
            s3.addShape(pptx.ShapeType.rect, {
              x: taskX, y: shapeY, w: taskW, h: shapeH,
              fill: { color: colorHex }, line: { color: '004a58', width: 0.5 }
            });
            s3.addText(ms.name, {
              x: taskX, y: shapeY, w: taskW, h: shapeH,
              fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial'
            });
          }
          else {
            const isChevron = ms.type === 'Chevron';
            s3.addShape(isChevron ? pptx.ShapeType.chevron : pptx.ShapeType.rect, {
              x: taskX, y: shapeY, w: taskW, h: shapeH,
              fill: { color: colorHex }
            });
            s3.addText(ms.name, {
              x: taskX + (isChevron ? 0.08 : 0.02), y: shapeY, w: taskW - (isChevron ? 0.1 : 0.04), h: shapeH,
              fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial'
            });
          }
        });
      });

      currentY += trackHeight + 0.05;
    });

    s3.addText('NOTES:\n• Agile SCRUM delivery approach\n• Key gates align with SteerCo review dates', {
      x: 0.3, y: 6.3, w: 4.5, h: 0.5, fontSize: 7, color: '555555', fontFace: 'Arial'
    });

    const legX = 5.0;
    s3.addShape(pptx.ShapeType.rect, { x: legX, y: 6.4, w: 0.15, h: 0.1, fill: { color: 'EB9800' } }); // VF Orange
    s3.addText('Inception', { x: legX + 0.2, y: 6.35, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

    s3.addShape(pptx.ShapeType.rect, { x: legX + 1.1, y: 6.4, w: 0.15, h: 0.1, fill: { color: '00B0CA' } }); // VF Cerulean
    s3.addText('Elaboration', { x: legX + 1.3, y: 6.35, w: 1.0, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

    s3.addShape(pptx.ShapeType.rect, { x: legX + 2.4, y: 6.4, w: 0.15, h: 0.1, fill: { color: '007C92' } }); // VF Blue Lagoon
    s3.addText('Construction / Sprints', { x: legX + 2.6, y: 6.35, w: 1.2, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

    s3.addShape(pptx.ShapeType.rect, { x: legX + 3.9, y: 6.4, w: 0.15, h: 0.1, fill: { color: 'E60000' } }); // VF Red
    s3.addText('Governance', { x: legX + 4.1, y: 6.35, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

    s3.addShape(pptx.ShapeType.rect, { x: legX + 5.0, y: 6.4, w: 0.15, h: 0.1, fill: { color: '9C2AA0' } }); // VF Seance
    s3.addText('Transition', { x: legX + 5.2, y: 6.35, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

    s3.addShape(pptx.ShapeType.diamond, { x: legX + 6.1, y: 6.4, w: 0.1, h: 0.1, fill: { color: 'E60000' } }); // VF Red
    s3.addText('Sign-Off', { x: legX + 6.25, y: 6.35, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

    s3.addText('VOIS', {
      x: 11.0, y: 6.2, w: 2.0, h: 0.4, fontSize: 20, bold: true, color: DARK_RED, fontFace: 'Arial', align: 'right'
    });

    pptx.writeFile({ fileName: `${form.projectName || 'POAP'}_StatusReport.pptx` });
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="poap-slide-builder-layout">
      {/* ═══ LEFT: Form ═══ */}
      <div className="poap-slide-builder-form-pane">
        {/* Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSliders size={18} style={{ color: 'var(--color-cyan)' }} />
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Fill in and preview live →
            </span>
          </div>
          <button className="cyber-button" onClick={generateSlide} style={{ fontSize: '0.8rem' }}>
            <FileDown size={14} /> <span className="cyber-btn-text">Make as Slide</span>
          </button>
        </div>

        {/* Section 1: Header */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem' }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>Project Header</legend>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group"><label>Project Name</label><input className="cyber-input" value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="e.g. VOIS Support" /></div>
            <div className="form-group"><label>REQ ID</label><input className="cyber-input" value={form.reqId} onChange={e => set('reqId', e.target.value)} placeholder="883471" /></div>
            <div className="form-group"><label>Project Manager</label><input className="cyber-input" value={form.projectManager} onChange={e => set('projectManager', e.target.value)} placeholder="Amr Sono" /></div>
            <div className="form-group"><label>Expected Closure</label><input className="cyber-input" type="date" value={form.expectedClosure} onChange={e => set('expectedClosure', e.target.value)} /></div>
            <div className="form-group"><label>Portfolio</label><input className="cyber-input" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="Transition" /></div>
            <div className="form-group"><label>Transition</label><input className="cyber-input" value={form.transition} onChange={e => set('transition', e.target.value)} /></div>
            <div className="form-group"><label>Overall RAG</label>
              <select className="cyber-input" value={form.ragOverall} onChange={e => set('ragOverall', e.target.value as any)}>
                <option value="Green">Green</option><option value="Amber">Amber</option><option value="Red">Red</option>
              </select>
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: '0.75rem', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="form-group"><label>MP Gate</label><input className="cyber-input" value={form.mpGate} onChange={e => set('mpGate', e.target.value)} /></div>
            <div className="form-group"><label>Build</label><input className="cyber-input" value={form.build} onChange={e => set('build', e.target.value)} /></div>
            <div className="form-group"><label>Project Gate</label><input className="cyber-input" value={form.projectGate} onChange={e => set('projectGate', e.target.value)} /></div>
          </div>
        </fieldset>

        {/* Section 2: Scope & Status */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem' }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>Scope & Status</legend>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Project Scope (one per line)</label>
              <textarea className="cyber-input" rows={5} value={form.projectScope} onChange={e => set('projectScope', e.target.value)} placeholder="Define and authorize the project kick-off...&#10;Establish the scope..." style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
            </div>
            <div className="form-group">
              <label>Current Status (one bullet per line)</label>
              <textarea className="cyber-input" rows={5} value={form.currentStatus} onChange={e => set('currentStatus', e.target.value)} placeholder="Building the mall...&#10;Finalize areas..." style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
            </div>
          </div>
        </fieldset>

        {/* Section 3: Milestones */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem' }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>Project Milestones</legend>
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
                {form.milestones.map((ms, idx) => (
                  <tr key={ms.id}>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                    <td><input className="cyber-input" style={{ width: '100%' }} value={ms.name} onChange={e => setMilestone(idx, 'name', e.target.value)} placeholder="Task name..." /></td>
                    <td>
                      <select className="cyber-input" style={{ width: '100%' }} value={ms.status} onChange={e => setMilestone(idx, 'status', e.target.value)}>
                        <option value="">...</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td><input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.startDate || ''} onChange={e => setMilestone(idx, 'startDate', e.target.value)} /></td>
                    <td><input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.targetedDate} onChange={e => setMilestone(idx, 'targetedDate', e.target.value)} /></td>
                    <td><input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.releaseDate} onChange={e => setMilestone(idx, 'releaseDate', e.target.value)} /></td>
                    <td><input className="cyber-input" type="date" style={{ width: '100%' }} value={ms.actualDate} onChange={e => setMilestone(idx, 'actualDate', e.target.value)} /></td>
                    <td>
                      <select className="cyber-input" style={{ width: '100%' }} value={ms.phase || 'Construction'} onChange={e => setMilestone(idx, 'phase', e.target.value as any)}>
                        <option value="Inception">Inception</option>
                        <option value="Elaboration">Elaboration</option>
                        <option value="Construction">Construction</option>
                        <option value="Transition">Transition</option>
                      </select>
                    </td>
                    <td>
                      <select className="cyber-input" style={{ width: '100%' }} value={ms.track || 'Core'} onChange={e => setMilestone(idx, 'track', e.target.value as any)}>
                        <option value="Governance">Governance</option>
                        <option value="Core">Key Milestones</option>
                        <option value="Sprints">Sprints</option>
                        <option value="Testing">Testing</option>
                        <option value="Transition">Transition</option>
                        <option value="Support">Support</option>
                      </select>
                    </td>
                    <td>
                      <select className="cyber-input" style={{ width: '100%' }} value={ms.type || 'Chevron'} onChange={e => setMilestone(idx, 'type', e.target.value as any)}>
                        <option value="Chevron">Chevron</option>
                        <option value="Block">Block</option>
                        <option value="Sprint">Sprint Bar</option>
                        <option value="SignOff">SignOff Diamond</option>
                        <option value="Milestone">Milestone Diamond</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="icon-button" onClick={() => removeMilestone(idx)} style={{ opacity: form.milestones.length <= 1 ? 0.3 : 1 }}>
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
            <button className="cyber-button secondary" onClick={() => set('milestones', exampleMilestones)} style={{ fontSize: '0.75rem', borderColor: 'var(--color-cyan)' }}>
              Load Example Timeline
            </button>
            <button className="cyber-button secondary" onClick={() => set('milestones', [{ id: 1, name: '', status: '', targetedDate: '', releaseDate: '', actualDate: '', startDate: '', phase: 'Inception', track: 'Core', type: 'Chevron' }])} style={{ fontSize: '0.75rem', color: '#ff4d4d' }}>
              Clear All
            </button>
          </div>
        </fieldset>

        {/* Section 4: Obstacles & Assumptions */}
        <fieldset style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem' }}>
          <legend className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '0 0.5rem', fontWeight: 700 }}>Obstacles & Assumptions</legend>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>SteerCo/ExCo Obstacles</label>
              <textarea className="cyber-input" rows={3} value={form.obstacles} onChange={e => set('obstacles', e.target.value)} placeholder="What obstacles need help?" style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
            </div>
            <div className="form-group">
              <label>Plan Assumptions (one per line)</label>
              <textarea className="cyber-input" rows={3} value={form.planAssumptions} onChange={e => set('planAssumptions', e.target.value)} placeholder="Continuous sales guarantees...&#10;Setting up deadline..." style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
            </div>
          </div>
        </fieldset>
      </div>

      {/* ═══ RIGHT: Live Preview ═══ */}
      <div className="poap-slide-builder-preview-pane">
        {/* Preview header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} style={{ color: 'var(--color-cyan)' }} />
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>LIVE PREVIEW</span>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className={`cyber-button ${previewSlide === 1 ? '' : 'secondary'}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}
              onClick={() => setPreviewSlide(1)}
            >
              Slide 1 – Status
            </button>
            <button
              className={`cyber-button ${previewSlide === 2 ? '' : 'secondary'}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}
              onClick={() => setPreviewSlide(2)}
            >
              Slide 2 – Plan
            </button>
            <button
              className={`cyber-button ${previewSlide === 3 ? '' : 'secondary'}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}
              onClick={() => setPreviewSlide(3)}
            >
              Slide 3 – Delivery Plan
            </button>
          </div>
        </div>

        {/* Preview pane */}
        <div style={{
          flex: 1, border: '1px solid var(--color-border)', borderRadius: '8px',
          padding: '0.75rem', overflow: 'auto', background: 'var(--bg-secondary)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}>
          <div style={{ width: '100%', maxWidth: 700 }}>
            <ScaledSlidePreview form={form} activeSlide={previewSlide} />
          </div>
        </div>

        {/* Bottom CTA */}
        <button className="cyber-button" onClick={generateSlide} style={{ alignSelf: 'center', padding: '0.6rem 2rem', fontSize: '0.9rem' }}>
          <FileDown size={16} /> Make as Slide
        </button>
      </div>
    </div>
  );
}
