import pptxgen from 'pptxgenjs';
import { MilestoneRow, POAPSlideData } from '../types/poap';
import {
  getTimelineMonths,
  getPhaseRanges,
  getMonthPhase,
  getMonthLabel,
  layoutTrackTasks,
} from './timelineLayout';

export function exportPOAPSlideDeck(form: POAPSlideData): void {
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

  /* ── SLIDE 1: Status Report ── */
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
  const msColWidths = [0.35, 2.7, 0.85, 1.0, 1.1, 1.1];
  let msX = 6.0;
  msHeaders.forEach((h, i) => {
    s1.addText(h, { x: msX, y: 1.1, w: msColWidths[i], h: 0.3, fontSize: 7, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
    msX += msColWidths[i];
  });

  const maxRows = 10;
  const tableData: MilestoneRow[] = [...form.milestones];
  while (tableData.length < maxRows) {
    tableData.push({ id: -1, name: '', status: '', targetedDate: '', releaseDate: '', actualDate: '' });
  }

  tableData.slice(0, maxRows).forEach((ms, rowIdx) => {
    let colX = 6.0;
    const yPos = 1.42 + rowIdx * 0.42;
    const rowFill = rowIdx % 2 === 0 ? LIGHT_GRAY : WHITE;
    const cellData = [ms.id === -1 ? '' : String(rowIdx + 1), ms.name || '', ms.status || '', ms.targetedDate || '', ms.releaseDate || '', ms.actualDate || ''];
    cellData.forEach((cellText, cIdx) => {
      s1.addShape(pptx.ShapeType.rect, { x: colX, y: yPos, w: msColWidths[cIdx], h: 0.42, fill: { color: rowFill }, line: { color: BORDER_GRAY, width: 0.5 } });
      let textColor = BLACK;
      let alignText: 'left' | 'center' | 'right' = 'center';
      let textX = colX;
      let textW = msColWidths[cIdx];

      if (cIdx === 1) {
        alignText = 'left';
        textX = colX + 0.05;
        textW = msColWidths[cIdx] - 0.1;
      }

      if (cIdx === 2) {
        const lower = (cellText || '').toLowerCase();
        if (lower === 'completed' || lower === 'done') textColor = '00B050';
        else if (lower.includes('progress')) textColor = 'FFC000';
        else if (lower.includes('not started')) textColor = 'FF0000';
      }

      s1.addText(cellText, { x: textX, y: yPos, w: textW, h: 0.42, fontSize: 7, color: textColor, fontFace: 'Arial', align: alignText, valign: 'middle', bold: cIdx === 2 });
      colX += msColWidths[cIdx];
    });
  });

  const obstacleY = 5.7;
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

  /* ── SLIDE 2: Milestones Plan ── */
  const MAX_PER_SLIDE = 4;
  const milestoneChunks: MilestoneRow[][] = [];
  for (let i = 0; i < form.milestones.length; i += MAX_PER_SLIDE) {
    milestoneChunks.push(form.milestones.slice(i, i + MAX_PER_SLIDE));
  }
  if (milestoneChunks.length === 0) milestoneChunks.push([]);

  milestoneChunks.forEach((chunk, chunkIdx) => {
    const s2 = pptx.addSlide();
    s2.background = { color: WHITE };
    const titleSuffix = milestoneChunks.length > 1 ? ` (Page ${chunkIdx + 1}/${milestoneChunks.length})` : '';
    s2.addText(`${form.projectName || 'Project Name'} | Milestones Plan${titleSuffix}`, { x: 0.2, y: 0.2, w: 10.0, h: 0.5, fontSize: 18, bold: true, color: BLACK, fontFace: 'Arial' });

    s2.addText('RAG Legend:', { x: 10.0, y: 0.2, w: 1.0, h: 0.2, fontSize: 7, bold: true, color: BLACK, fontFace: 'Arial' });
    [{ label: 'Critical Risk', color: RED }, { label: 'On Track', color: '00B050' }, { label: 'Behind/Risk', color: 'FFC000' }, { label: 'Off Track', color: 'A6A6A6' }]
      .forEach((item, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const startX = 10.0 + col * 1.5;
        const startY = 0.45 + row * 0.2;

        s2.addShape(pptx.ShapeType.rect, { x: startX, y: startY + 0.03, w: 0.15, h: 0.15, fill: { color: item.color } });
        s2.addText(item.label, { x: startX + 0.2, y: startY, w: 1.2, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });
      });

    chunk.forEach((ms, idx) => {
      const laneY = 1.2 + idx * 1.2;
      s2.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: laneY, w: 1.8, h: 0.55, fill: { color: DARK_RED }, rectRadius: 0.05 });
      s2.addText(`Milestone ${(chunkIdx * MAX_PER_SLIDE) + idx + 1}\n"${ms.name || '...'}"`, { x: 0.3, y: laneY, w: 1.8, h: 0.55, fontSize: 7, bold: true, color: WHITE, fontFace: 'Arial', align: 'center', valign: 'middle' });
      const bc = ms.status?.toLowerCase().includes('completed') || ms.status?.toLowerCase() === 'done' ? '00B050' : ms.status?.toLowerCase().includes('progress') ? 'FFC000' : 'A6A6A6';
      s2.addShape(pptx.ShapeType.rect, { x: 2.5, y: laneY + 0.15, w: 6.0, h: 0.25, fill: { color: bc } });
      s2.addShape(pptx.ShapeType.rect, { x: 8.2, y: laneY + 0.1, w: 0.15, h: 0.15, fill: { color: '0070C0' }, rotate: 45 });
      if (ms.targetedDate) s2.addText(ms.targetedDate, { x: 8.5, y: laneY + 0.05, w: 1.5, h: 0.25, fontSize: 7, color: BLACK, fontFace: 'Arial' });
    });

    if (chunkIdx === milestoneChunks.length - 1) {
      const assY = 1.2 + chunk.length * 1.2 + 0.3;
      s2.addText('Plan Assumptions:', { x: 0.3, y: assY, w: 12.0, h: 0.25, fontSize: 9, bold: true, underline: { style: 'sng' }, color: BLACK, fontFace: 'Arial' });
      const aLines = (form.planAssumptions || '').split('\n').filter(Boolean);
      const aRuns = aLines.map(line => ({ text: `• ${line}\n`, options: { fontSize: 7, color: '333333', fontFace: 'Arial' as const } }));
      if (aRuns.length > 0) s2.addText(aRuns, { x: 0.5, y: assY + 0.3, w: 11.5, h: 1.5, valign: 'top', lineSpacing: 13 });
    }
  });

  /* ── SLIDE 3: Delivery Plan Timeline ── */
  const s3 = pptx.addSlide();
  s3.background = { color: WHITE };

  s3.addText(`${form.projectName || 'Project'} – Indicative Plan on a Page`, {
    x: 0.3, y: 0.2, w: 9.0, h: 0.4, fontSize: 16, bold: true, color: '1F4E79', fontFace: 'Arial',
  });
  s3.addText(`DRAFT only – ${new Date().toLocaleDateString('en-GB')}`, {
    x: 9.5, y: 0.2, w: 3.5, h: 0.4, fontSize: 10, bold: true, color: '7F7F7F', fontFace: 'Arial', align: 'right',
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

    let pColor = '4A4D4E';
    let pBg = 'F2F2F2';
    if (phase === 'Inception') { pColor = 'EB9800'; pBg = 'FEF0CC'; }
    else if (phase === 'Elaboration') { pColor = '00B0CA'; pBg = 'CCF0F5'; }
    else if (phase === 'Construction') { pColor = '007C92'; pBg = 'CCE8ED'; }
    else if (phase === 'Transition') { pColor = '9C2AA0'; pBg = 'F0D9F1'; }

    s3.addShape(pptx.ShapeType.rect, {
      x: xPos, y: 0.8, w: colW, h: 5.4,
      fill: { color: pBg },
      line: { color: 'E6E6E6', width: 0.5 },
    });

    s3.addText(getMonthLabel(m, i, months.length), {
      x: xPos, y: 0.8, w: colW, h: 0.2,
      fontSize: 8, bold: true, align: 'center', color: '333333', fontFace: 'Arial',
    });
    s3.addText(phase, {
      x: xPos, y: 1.0, w: colW, h: 0.2,
      fontSize: 6, bold: true, align: 'center', color: pColor, fontFace: 'Arial',
    });

    if (i > 0) {
      s3.addShape(pptx.ShapeType.line, {
        x: xPos, y: 0.8, w: 0, h: 5.4,
        line: { color: 'BFBFBF', width: 0.5, dashType: 'dash' },
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
      fontSize: 8, bold: true, color: '1F4E79', align: 'right', fontFace: 'Arial', valign: 'middle',
    });

    s3.addShape(pptx.ShapeType.line, {
      x: 1.75, y: currentY, w: 0, h: trackHeight,
      line: { color: '1F4E79', width: 1.5 },
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

        let colorHex = '4A4D4E';
        if (ms.track === 'Governance') colorHex = 'E60000';
        else if (ms.track === 'Sprints' || ms.track === 'Support' || ms.name.toLowerCase().includes('sprint')) colorHex = '007C92';
        else if (ms.track === 'Testing') colorHex = '00B0CA';
        else if (ms.track === 'Transition') colorHex = '9C2AA0';
        else if (ms.phase === 'Inception') colorHex = 'EB9800';
        else if (ms.phase === 'Elaboration') colorHex = '00B0CA';

        const shapeH = rowH * 0.75;
        const shapeY = rowY + (rowH - shapeH) / 2;

        if (ms.type === 'Milestone') {
          s3.addShape(pptx.ShapeType.diamond, {
            x: taskX + taskW / 2 - 0.06, y: shapeY + shapeH / 2 - 0.06,
            w: 0.12, h: 0.12, fill: { color: 'E60000' },
          });
          s3.addText(ms.name, {
            x: taskX + taskW / 2 + 0.1, y: shapeY,
            w: 1.5, h: shapeH, fontSize: 6, bold: true, color: '333333', fontFace: 'Arial', valign: 'middle',
          });
        } else if (ms.type === 'SignOff') {
          const barW = Math.max(0.1, taskW - 0.2);
          s3.addShape(pptx.ShapeType.chevron, {
            x: taskX, y: shapeY, w: barW, h: shapeH,
            fill: { color: colorHex },
          });
          s3.addText(ms.name, {
            x: taskX + 0.05, y: shapeY, w: barW - 0.1, h: shapeH,
            fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial',
          });

          const diaX = taskX + barW + 0.02;
          s3.addShape(pptx.ShapeType.diamond, {
            x: diaX, y: shapeY + shapeH / 2 - 0.04,
            w: 0.08, h: 0.08, fill: { color: 'E60000' },
          });
          s3.addText('sign off', {
            x: diaX - 0.15, y: shapeY + shapeH - 0.05, w: 0.4, h: 0.1,
            fontSize: 4, italic: true, color: '666666', align: 'center', fontFace: 'Arial',
          });
        } else if (ms.type === 'Sprint') {
          s3.addShape(pptx.ShapeType.rect, {
            x: taskX, y: shapeY, w: taskW, h: shapeH,
            fill: { color: colorHex }, line: { color: '004a58', width: 0.5 },
          });
          s3.addText(ms.name, {
            x: taskX, y: shapeY, w: taskW, h: shapeH,
            fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial',
          });
        } else {
          const isChevron = ms.type === 'Chevron';
          s3.addShape(isChevron ? pptx.ShapeType.chevron : pptx.ShapeType.rect, {
            x: taskX, y: shapeY, w: taskW, h: shapeH,
            fill: { color: colorHex },
          });
          s3.addText(ms.name, {
            x: taskX + (isChevron ? 0.08 : 0.02), y: shapeY, w: taskW - (isChevron ? 0.1 : 0.04), h: shapeH,
            fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial',
          });
        }
      });
    });

    currentY += trackHeight + 0.05;
  });

  s3.addShape(pptx.ShapeType.line, { x: 0.3, y: 6.8, w: 12.7, h: 0, line: { color: 'BFBFBF', width: 0.5 } });

  s3.addText('NOTES:\n• Agile SCRUM delivery approach\n• Key gates align with SteerCo review dates', {
    x: 0.3, y: 6.9, w: 4.5, h: 0.5, fontSize: 7, color: '555555', fontFace: 'Arial',
  });

  const legX = 5.0;
  s3.addShape(pptx.ShapeType.rect, { x: legX, y: 7.0, w: 0.15, h: 0.1, fill: { color: 'EB9800' } });
  s3.addText('Inception', { x: legX + 0.2, y: 6.95, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

  s3.addShape(pptx.ShapeType.rect, { x: legX + 1.1, y: 7.0, w: 0.15, h: 0.1, fill: { color: '00B0CA' } });
  s3.addText('Elaboration', { x: legX + 1.3, y: 6.95, w: 1.0, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

  s3.addShape(pptx.ShapeType.rect, { x: legX + 2.4, y: 7.0, w: 0.15, h: 0.1, fill: { color: '007C92' } });
  s3.addText('Construction / Sprints', { x: legX + 2.6, y: 6.95, w: 1.2, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

  s3.addShape(pptx.ShapeType.rect, { x: legX + 3.9, y: 7.0, w: 0.15, h: 0.1, fill: { color: 'E60000' } });
  s3.addText('Governance', { x: legX + 4.1, y: 6.95, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

  s3.addShape(pptx.ShapeType.rect, { x: legX + 5.0, y: 7.0, w: 0.15, h: 0.1, fill: { color: '9C2AA0' } });
  s3.addText('Transition', { x: legX + 5.2, y: 6.95, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

  s3.addShape(pptx.ShapeType.diamond, { x: legX + 6.1, y: 7.0, w: 0.1, h: 0.1, fill: { color: 'E60000' } });
  s3.addText('Sign-Off', { x: legX + 6.25, y: 6.95, w: 0.8, h: 0.2, fontSize: 6, color: BLACK, fontFace: 'Arial' });

  s3.addText('VOIS', {
    x: 11.0, y: 6.8, w: 2.0, h: 0.4, fontSize: 20, bold: true, color: DARK_RED, fontFace: 'Arial', align: 'right',
  });

  pptx.writeFile({ fileName: `${form.projectName || 'POAP'}_StatusReport.pptx` });
}
