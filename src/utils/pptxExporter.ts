import pptxgen from 'pptxgenjs';
import {
  ProjectFinancials,
  ADOWorkItem,
  PortfolioSquad,
  FinancialAllocation,
  QAGate,
  Defect,
  RiskIssue,
  POAPData,
} from './mockData';
import {
  VF_RED,
  VF_WHITE,
  VF_BLACK,
  VF_AUBERGINE,
  VF_ABBEY,
  VF_GRAY_MID,
  VF_GRAY_LITE,
  VF_RED_LITE,
  COLOR_GREEN,
  COLOR_AMBER,
  COLOR_RED,
  VF_FONT,
  getRagHex,
  addSlideHeader,
} from './pptxStyles';

export { exportGovernanceGatesToPPT, exportAIInsightToPPT } from './governancePptxExporter';

export const exportToPPT = (
  financials: ProjectFinancials,
  _adoWorkItems: ADOWorkItem[],
  squads: PortfolioSquad[],
  allocations: FinancialAllocation[],
  qaGates: QAGate[],
  defects: Defect[],
  risks: RiskIssue[],
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string },
  aiAnalysis: string
) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  // ── SLIDE 1: Title ──
  const slide1 = pptx.addSlide();
  slide1.background = { color: VF_WHITE };
  slide1.addShape(pptxgen.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: VF_RED } });
  slide1.addShape(pptxgen.ShapeType.rect, { x: 0, y: 7.3, w: '100%', h: 0.2, fill: { color: VF_AUBERGINE } });
  slide1.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: 1.4, w: 0.12, h: 3.8, fill: { color: VF_AUBERGINE } });
  slide1.addText('TDM NEXUS', { x: 0.8, y: 1.5, w: 11.0, h: 1.0, fontSize: 52, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT });
  slide1.addText('STEERING COMMITTEE REPORT', { x: 0.8, y: 2.7, w: 10.0, h: 0.5, fontSize: 16, bold: true, color: VF_RED, fontFace: VF_FONT });
  slide1.addShape(pptxgen.ShapeType.rect, { x: 0.8, y: 3.4, w: 6.0, h: 1.6, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 1 } });
  slide1.addText([
    { text: 'Reporting Date: ', options: { bold: true, color: VF_BLACK } },
    { text: new Date().toLocaleDateString('en-GB') + '\n', options: { color: VF_ABBEY } },
    { text: 'Overall Status: ', options: { bold: true, color: VF_BLACK } },
    { text: ragStatus.overall.toUpperCase(), options: { color: getRagHex(ragStatus.overall), bold: true } },
  ], { x: 1.0, y: 3.55, w: 5.5, h: 1.3, fontSize: 13, fontFace: VF_FONT, lineSpacing: 24 });
  slide1.addShape(pptxgen.ShapeType.rect, { x: 11.8, y: 6.8, w: 1.5, h: 0.6, fill: { color: VF_RED } });
  slide1.addText('VOIS', { x: 11.8, y: 6.8, w: 1.5, h: 0.6, fontSize: 11, bold: true, color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle' });

  // ── SLIDE 2: RAG Status ──
  const slide2 = pptx.addSlide();
  addSlideHeader(slide2, 'Executive Summary & RAG Status', 2);
  const rags = [
    { label: 'Schedule', val: ragStatus.schedule, desc: 'Progress on track for next PI.' },
    { label: 'Budget', val: ragStatus.budget, desc: 'Spending aligned with VROM bounds.' },
    { label: 'Scope', val: ragStatus.scope, desc: 'HLD locked.' },
    { label: 'Quality', val: ragStatus.quality, desc: 'Tracking defects across SIT/UAT.' },
  ];
  rags.forEach((r, idx) => {
    const xOff = 0.4 + idx * 3.2;
    const ragHex = getRagHex(r.val);
    slide2.addShape(pptxgen.ShapeType.rect, { x: xOff, y: 1.3, w: 3.0, h: 4.5, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide2.addShape(pptxgen.ShapeType.rect, { x: xOff, y: 1.3, w: 3.0, h: 0.08, fill: { color: ragHex } });
    slide2.addText(r.label.toUpperCase(), { x: xOff + 0.15, y: 1.45, w: 2.7, h: 0.4, fontSize: 15, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT });
    slide2.addShape(pptxgen.ShapeType.rect, { x: xOff + 0.15, y: 2.0, w: 1.4, h: 0.45, fill: { color: ragHex }, line: { color: ragHex, width: 1 } });
    slide2.addText(r.val.toUpperCase(), { x: xOff + 0.15, y: 2.0, w: 1.4, h: 0.45, fontSize: 13, bold: true, color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle' });
    slide2.addText(r.desc, { x: xOff + 0.15, y: 2.65, w: 2.7, h: 2.8, fontSize: 12, color: VF_ABBEY, fontFace: VF_FONT, lineSpacing: 18 });
  });

  // ── SLIDE 3: Financial Health ──
  const slide3 = pptx.addSlide();
  addSlideHeader(slide3, 'Financial Health & Forecast Allocations', 3);
  const finTableRows: pptxgen.TableRow[] = [[
    { text: 'Squad / Portfolio', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'CAPEX Alloc', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' as const } },
    { text: 'CAPEX Spent', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' as const } },
    { text: 'OPEX Alloc', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' as const } },
    { text: 'OPEX Spent', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' as const } },
  ]];
  allocations.forEach((a, i) => {
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    finTableRows.push([
      { text: a.squadName, options: { color: VF_BLACK, fill: { color: rowFill }, align: 'left' as const, bold: true } },
      { text: `$${(a.capexAllocated / 1000).toFixed(0)}k`, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' as const } },
      { text: `$${(a.capexSpent / 1000).toFixed(0)}k`, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' as const } },
      { text: `$${(a.opexAllocated / 1000).toFixed(0)}k`, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' as const } },
      { text: `$${(a.opexSpent / 1000).toFixed(0)}k`, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' as const } },
    ]);
  });
  slide3.addTable(finTableRows, { x: 0.5, y: 1.3, w: 12.3, h: 5.5, border: { type: 'solid', color: VF_GRAY_MID, pt: 1 }, fontSize: 11, fontFace: VF_FONT, valign: 'middle' });

  // ── SLIDE 4: Squad Delivery ──
  const slide4 = pptx.addSlide();
  addSlideHeader(slide4, 'Squad Delivery Pipeline', 4);
  squads.forEach((s, idx) => {
    const yOff = 1.3 + idx * 0.95;
    const isBlocked = s.status === 'Blocked';
    slide4.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: yOff, w: 12.3, h: 0.82, fill: { color: VF_GRAY_LITE }, line: { color: isBlocked ? VF_RED : VF_GRAY_MID, width: isBlocked ? 1.5 : 0.75 } });
    slide4.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: yOff, w: 0.08, h: 0.82, fill: { color: isBlocked ? VF_RED : COLOR_GREEN } });
    slide4.addText(s.name, { x: 0.75, y: yOff + 0.1, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: VF_BLACK, fontFace: VF_FONT });
    slide4.addText(`Lead: ${s.lead} | Target: ${s.targetRelease}`, { x: 0.75, y: yOff + 0.44, w: 3.5, h: 0.28, fontSize: 9, color: VF_ABBEY, fontFace: VF_FONT });
    slide4.addShape(pptxgen.ShapeType.rect, { x: 4.5, y: yOff + 0.3, w: 5.5, h: 0.22, fill: { color: VF_GRAY_MID } });
    if (s.progress > 0) {
      slide4.addShape(pptxgen.ShapeType.rect, { x: 4.5, y: yOff + 0.3, w: (s.progress / 100) * 5.5, h: 0.22, fill: { color: isBlocked ? COLOR_AMBER : VF_RED } });
    }
    slide4.addText(`${s.progress}%`, { x: 10.1, y: yOff + 0.22, w: 0.8, h: 0.3, fontSize: 12, bold: true, color: VF_RED, fontFace: VF_FONT });
    const stCol = s.status === 'Blocked' ? COLOR_RED : s.status === 'Completed' ? COLOR_GREEN : VF_ABBEY;
    slide4.addText(s.status, { x: 11.0, y: yOff + 0.24, w: 1.7, h: 0.28, fontSize: 11, bold: true, color: stCol, fontFace: VF_FONT, align: 'right' });
  });

  // ── SLIDE 5: QA Gates ──
  const slide5 = pptx.addSlide();
  addSlideHeader(slide5, 'Testing & Quality Gates', 5);

  const totalTests = qaGates.reduce((s, g) => s + g.totalTests, 0);
  const totalPassed = qaGates.reduce((s, g) => s + g.passed, 0);
  const totalFailed = qaGates.reduce((s, g) => s + g.failed, 0);
  const overallPassRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  const kpis = [
    { label: 'Total Tests', val: totalTests.toString(), color: VF_RED },
    { label: 'Passed', val: totalPassed.toString(), color: COLOR_GREEN },
    { label: 'Failed', val: totalFailed.toString(), color: COLOR_RED },
    { label: 'Pass Rate', val: `${overallPassRate}%`, color: overallPassRate >= 80 ? COLOR_GREEN : overallPassRate >= 50 ? COLOR_AMBER : COLOR_RED },
  ];
  kpis.forEach((kpi, i) => {
    const kx = 0.4 + i * 3.2;
    slide5.addShape(pptxgen.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 1.0, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide5.addShape(pptxgen.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 0.07, fill: { color: kpi.color } });
    slide5.addText(kpi.label, { x: kx + 0.15, y: 1.3, w: 2.7, h: 0.3, fontSize: 10, color: VF_ABBEY, fontFace: VF_FONT });
    slide5.addText(kpi.val, { x: kx + 0.15, y: 1.6, w: 2.7, h: 0.45, fontSize: 22, bold: true, color: kpi.color, fontFace: VF_FONT });
  });

  const qaTableHeader = [
    { text: 'Gate', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Status', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Total', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Passed', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Failed', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Blocked', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Pass Rate', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
  ];
  const qaTableRows: pptxgen.TableRow[] = [qaTableHeader];
  qaGates.forEach((g, i) => {
    const pr = g.totalTests > 0 ? Math.round((g.passed / g.totalTests) * 100) : 0;
    const prColor = pr >= 80 ? COLOR_GREEN : pr >= 50 ? COLOR_AMBER : COLOR_RED;
    const stColor = g.status === 'Passed' ? COLOR_GREEN : g.status === 'Failed' ? COLOR_RED : g.status === 'In Progress' ? COLOR_AMBER : VF_ABBEY;
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    qaTableRows.push([
      { text: g.name, options: { color: VF_BLACK, fill: { color: rowFill }, bold: true, align: 'left' as const } },
      { text: g.status, options: { color: stColor, fill: { color: rowFill }, bold: true, align: 'center' as const } },
      { text: g.totalTests.toString(), options: { color: VF_BLACK, fill: { color: rowFill }, align: 'center' as const } },
      { text: g.passed.toString(), options: { color: COLOR_GREEN, fill: { color: rowFill }, bold: true, align: 'center' as const } },
      { text: g.failed.toString(), options: { color: g.failed > 0 ? COLOR_RED : VF_ABBEY, fill: { color: rowFill }, bold: g.failed > 0, align: 'center' as const } },
      { text: (g.blocked || 0).toString(), options: { color: g.blocked ? COLOR_AMBER : VF_ABBEY, fill: { color: rowFill }, align: 'center' as const } },
      { text: `${pr}%`, options: { color: prColor, fill: { color: rowFill }, bold: true, align: 'center' as const } },
    ]);
  });
  slide5.addTable(qaTableRows, {
    x: 0.5, y: 2.4, w: 12.3, h: Math.min(4.5, 0.45 + qaGates.length * 0.45),
    border: { type: 'solid', color: VF_GRAY_MID, pt: 1 },
    fontSize: 11, fontFace: VF_FONT, valign: 'middle',
    colW: [1.6, 1.6, 1.2, 1.2, 1.2, 1.2, 1.3],
  });

  // ── SLIDE 5b: Defects ──
  const slide5b = pptx.addSlide();
  addSlideHeader(slide5b, 'Defects Log & Breakdown', 6);

  const openDefs = defects.filter(d => d.status !== 'Closed');
  const p1p2 = defects.filter(d => d.severity === 'P1' || d.severity === 'P2');
  const closedDefs = defects.filter(d => d.status === 'Closed');

  const defKpis = [
    { label: 'Total Defects', val: defects.length.toString(), color: VF_RED },
    { label: 'Open', val: openDefs.length.toString(), color: openDefs.length > 0 ? COLOR_RED : COLOR_GREEN },
    { label: 'P1/P2 Critical', val: p1p2.length.toString(), color: p1p2.length > 0 ? COLOR_RED : COLOR_GREEN },
    { label: 'Closed', val: closedDefs.length.toString(), color: COLOR_GREEN },
  ];
  defKpis.forEach((kpi, i) => {
    const kx = 0.4 + i * 3.2;
    slide5b.addShape(pptxgen.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 1.0, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide5b.addShape(pptxgen.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 0.07, fill: { color: kpi.color } });
    slide5b.addText(kpi.label, { x: kx + 0.15, y: 1.3, w: 2.7, h: 0.3, fontSize: 10, color: VF_ABBEY, fontFace: VF_FONT });
    slide5b.addText(kpi.val, { x: kx + 0.15, y: 1.6, w: 2.7, h: 0.45, fontSize: 22, bold: true, color: kpi.color, fontFace: VF_FONT });
  });

  const defTableHeader = [
    { text: 'ID', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Title', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Phase', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Squad', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Severity', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Status', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
  ];
  const defTableRows: pptxgen.TableRow[] = [defTableHeader];
  defects.slice(0, 18).forEach((d, i) => {
    const sevColor = d.severity === 'P1' ? COLOR_RED : d.severity === 'P2' ? COLOR_AMBER : VF_ABBEY;
    const stColor = d.status === 'Closed' ? COLOR_GREEN : d.status === 'In Progress' || d.status === 'Retesting' ? COLOR_AMBER : COLOR_RED;
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    defTableRows.push([
      { text: d.id, options: { color: VF_RED, fill: { color: rowFill }, bold: true, align: 'center' as const } },
      { text: d.title, options: { color: VF_BLACK, fill: { color: rowFill }, align: 'left' as const } },
      { text: d.phase || '-', options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'center' as const } },
      { text: d.squad, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'left' as const } },
      { text: d.severity, options: { color: sevColor, fill: { color: rowFill }, bold: true, align: 'center' as const } },
      { text: d.status, options: { color: stColor, fill: { color: rowFill }, bold: true, align: 'center' as const } },
    ]);
  });
  if (defTableRows.length > 1) {
    slide5b.addTable(defTableRows, {
      x: 0.5, y: 2.4, w: 12.3, h: Math.min(4.5, 0.45 + (defTableRows.length - 1) * 0.35),
      border: { type: 'solid', color: VF_GRAY_MID, pt: 1 },
      fontSize: 10, fontFace: VF_FONT, valign: 'middle',
      colW: [1.2, 3.8, 1.0, 2.3, 1.2, 1.5],
    });
  }

  // ── SLIDE 6: RAID Log ──
  const slide6 = pptx.addSlide();
  addSlideHeader(slide6, 'RAID Log', 7);
  const riskTableRows: pptxgen.TableRow[] = [[
    { text: 'Ref ID', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Type', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Risk Description / Trigger', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Impact', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
    { text: 'Mitigation Plan', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' as const } },
    { text: 'Status', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' as const } },
  ]];
  risks.forEach((r, i) => {
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    riskTableRows.push([
      { text: r.id, options: { color: VF_RED, fill: { color: rowFill }, bold: true, align: 'left' as const } },
      { text: r.type, options: { color: VF_BLACK, fill: { color: rowFill }, bold: true, align: 'left' as const } },
      { text: r.title, options: { color: VF_BLACK, fill: { color: rowFill }, align: 'left' as const } },
      { text: r.impact, options: { color: r.impact === 'Critical' || r.impact === 'High' ? COLOR_RED : COLOR_AMBER, fill: { color: rowFill }, bold: true, align: 'center' as const } },
      { text: r.mitigation, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'left' as const } },
      { text: r.status.toUpperCase(), options: { color: r.status === 'Open' ? COLOR_RED : COLOR_GREEN, fill: { color: rowFill }, bold: true, align: 'center' as const } },
    ]);
  });
  slide6.addTable(riskTableRows, {
    x: 0.5, y: 1.3, w: 12.3, h: 5.8,
    border: { type: 'solid', color: VF_GRAY_MID, pt: 1 },
    fontSize: 10, fontFace: VF_FONT, align: 'left', valign: 'middle',
  });

  // ── SLIDES 7–10: AI Analytics ──
  const cleanAiAnalysis = aiAnalysis
    .replace(/\*\*/g, '')
    .replace(/#/g, '')
    .replace(/\\ge\b/g, '>=')
    .replace(/\\le\b/g, '<=')
    .replace(/\\%/g, '%')
    .replace(/\$/g, '');

  const splitIndex1 = cleanAiAnalysis.search(/(?:\r?\n)(?:2\.|2\s+FINANCIAL|FINANCIAL\s+HEALTH)/i);
  let part1 = cleanAiAnalysis;
  let part2 = '';
  let part3 = '';
  let part4 = '';

  if (splitIndex1 !== -1) {
    part1 = cleanAiAnalysis.substring(0, splitIndex1).trim();
    const remainingAfter1 = cleanAiAnalysis.substring(splitIndex1).trim();
    const splitIndex2 = remainingAfter1.search(/(?:\r?\n)(?:3\.|3\s+QUALITY|QUALITY\s*&\s*TESTING)/i);
    if (splitIndex2 !== -1) {
      part2 = remainingAfter1.substring(0, splitIndex2).trim();
      const remainingAfter2 = remainingAfter1.substring(splitIndex2).trim();
      const splitIndex3 = remainingAfter2.search(/(?:\r?\n)(?:4\.|4\s+KEY|KEY\s+RECOMMENDATIONS)/i);
      if (splitIndex3 !== -1) {
        part3 = remainingAfter2.substring(0, splitIndex3).trim();
        part4 = remainingAfter2.substring(splitIndex3).trim();
      } else {
        part3 = remainingAfter2;
      }
    } else {
      part2 = remainingAfter1;
    }
  }

  const aiSlides: { title: string; label: string; content: string }[] = [
    { title: 'AI Executive Summary', label: 'Part 1 – Executive Summary & Overview', content: part1 },
    { title: 'AI Financial Health', label: 'Part 2 – Financial Health', content: part2 },
    { title: 'AI Quality & Testing', label: 'Part 3 – Quality & Testing', content: part3 },
    { title: 'AI Recommendations', label: 'Part 4 – Key Recommendations', content: part4 },
  ].filter(s => s.content.trim() !== '');

  let currentSlideNum = 8;

  aiSlides.forEach((s) => {
    const paragraphs = s.content.split(/\n\n|\r\n\r\n/);
    const chunks: string[] = [];
    let currentChunk = '';

    paragraphs.forEach(p => {
      if ((currentChunk.length + p.length) > 1200 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = p + '\n\n';
      } else {
        currentChunk += p + '\n\n';
      }
    });
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    chunks.forEach((chunk, chunkIndex) => {
      const aiSlide = pptx.addSlide();
      const title = chunks.length > 1 ? `${s.title} (${chunkIndex + 1}/${chunks.length})` : s.title;
      addSlideHeader(aiSlide, title, currentSlideNum++);

      aiSlide.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: 1.2, w: 12.3, h: 5.8, fill: { color: VF_RED_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
      aiSlide.addShape(pptxgen.ShapeType.rect, { x: 0.5, y: 1.2, w: 0.08, h: 5.8, fill: { color: VF_RED } });
      aiSlide.addText(s.label, { x: 0.75, y: 1.25, w: 11.0, h: 0.35, fontSize: 13, bold: true, color: VF_RED, fontFace: VF_FONT });
      aiSlide.addText(chunk, {
        x: 0.75, y: 1.7, w: 11.8, h: 5.2,
        fontSize: 10, color: VF_BLACK, fontFace: 'Arial',
        align: 'left', valign: 'top', lineSpacing: 14,
      });
    });
  });

  pptx.writeFile({ fileName: `TDM_SteerCo_Report_${new Date().toISOString().split('T')[0]}.pptx` });
};

export const exportPOAPToPPT = (
  _poapData: POAPData,
  _ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string }
) => {
  // Stubbed implementation for POAP pptx
};
