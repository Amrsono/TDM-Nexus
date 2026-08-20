import { MilestoneRow } from '../types/poap';

export const ragHex = (v: string): string => {
  if (v === 'Green') return '#00B050';
  if (v === 'Amber') return '#FFC000';
  return '#FF0000';
};

export const statusColor = (s: string): string => {
  const l = (s || '').toLowerCase();
  if (l === 'completed' || l === 'done') return '#00B050';
  if (l.includes('progress')) return '#FFC000';
  if (l.includes('not started')) return '#FF0000';
  return '#000000';
};

export const barColor = (s: string): string => {
  const l = (s || '').toLowerCase();
  if (l === 'completed' || l === 'done') return '#00B050';
  if (l.includes('progress')) return '#FFC000';
  return '#A6A6A6';
};

export interface TimelineMonth {
  label: string;
  dateStart: Date;
  dateEnd: Date;
}

export const getTimelineMonths = (milestones: MilestoneRow[]): { months: TimelineMonth[]; timelineStart: Date; timelineEnd: Date } => {
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

  const months: TimelineMonth[] = [];
  const curr = new Date(timelineStart);

  let count = 0;
  while (curr <= timelineEnd && count < 24) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dStart = new Date(curr.getFullYear(), curr.getMonth(), 1);
    const dEnd = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 23, 59, 59);
    months.push({
      label: `${monthNames[curr.getMonth()]} ${curr.getFullYear()}`,
      dateStart: dStart,
      dateEnd: dEnd,
    });
    curr.setMonth(curr.getMonth() + 1);
    count++;
  }

  return { months, timelineStart, timelineEnd };
};

export const getPhaseRanges = (milestones: MilestoneRow[]): Record<string, { start: number; end: number }> => {
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

export type PhaseType = 'Inception' | 'Elaboration' | 'Construction' | 'Transition';

export const getMonthPhase = (
  monthDate: Date,
  phaseRanges: Record<string, { start: number; end: number }>
): PhaseType => {
  const t = monthDate.getTime();
  const phases: PhaseType[] = ['Inception', 'Elaboration', 'Construction', 'Transition'];

  for (const phase of phases) {
    const range = phaseRanges[phase];
    if (range && t >= range.start && t <= range.end) {
      return phase;
    }
  }

  let minDiff = Infinity;
  let closestPhase: PhaseType = 'Construction';
  for (const phase of phases) {
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

export const layoutTrackTasks = (tasks: MilestoneRow[]): MilestoneRow[][] => {
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

export const getMonthLabel = (m: { label: string }, index: number, total: number): string => {
  const parts = m.label.split(' ');
  const monthShort = parts[0];
  const year = parts[1];

  const fullMonths: Record<string, string> = {
    Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May',
    Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October',
    Nov: 'November', Dec: 'December',
  };

  const monthFull = fullMonths[monthShort] || monthShort;

  if (index === 0 || index === total - 1) {
    return `${monthShort} ${year}`;
  }
  return monthFull;
};

export const exampleMilestones: MilestoneRow[] = [
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
  { id: 26, name: 'Support', status: 'In Progress', startDate: '2027-02-01', targetedDate: '2027-02-28', releaseDate: '', actualDate: '', phase: 'Transition', track: 'Support', type: 'Block' },
];
