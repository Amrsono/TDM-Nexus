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
  GovernanceGateDetail
} from './mockData';

export const exportToPPT = (
  financials: ProjectFinancials,
  adoWorkItems: ADOWorkItem[],
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

  // ── VOIS Official Brand Colours ──────────────────────────────────────
  const VF_RED        = 'E60000';   // VOIS Primary Red
  const VF_WHITE      = 'FFFFFF';   // White
  const VF_BLACK      = '333333';   // VOIS Black
  const VF_AUBERGINE  = '5E2750';   // VOIS Finn / Aubergine
  const VF_ABBEY      = '4A4D4E';   // VOIS Abbey – secondary text
  const VF_CERULEAN   = '00B0CA';   // VOIS Cerulean – info accents
  const VF_LAGOON     = '007C92';   // VOIS Blue Lagoon – deep info
  const VF_SEANCE     = '9C2AA0';   // VOIS Seance – purple accent
  const VF_GRAY_MID   = 'D6D6D6';   // Neutral mid-grey borders
  const VF_GRAY_LITE  = 'F4F4F4';   // Neutral light-grey card fill
  const VF_RED_LITE   = 'FCEAEA';   // Soft VOIS red tint

  // RAG status colours – VOIS brand-aligned
  const COLOR_GREEN = '428600';   // VOIS status green
  const COLOR_AMBER = 'EB9700';   // VOIS status amber
  const COLOR_RED   = 'E60000';   // VOIS status red

  // Font – matches the web app
  const VF_FONT = 'Outfit';

  const getRagHex = (val: string) => {
    if (val.toLowerCase() === 'green') return COLOR_GREEN;
    if (val.toLowerCase() === 'amber') return COLOR_AMBER;
    return COLOR_RED;
  };

  // ── Shared helpers ────────────────────────────────────────────────────────
  const addSlideHeader = (slide: any, title: string, slideNum?: number) => {
    slide.background = { color: VF_WHITE };
    // Top red accent bar
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: VF_RED } });
    // Title
    slide.addText(title, {
      x: 0.5, y: 0.2, w: 10.0, h: 0.6,
      fontSize: 24, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT
    });
    // Thin red underline beneath title
    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.85, w: 1.5, h: 0.04, fill: { color: VF_RED } });
    // Aubergine footer bar
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.3, w: '100%', h: 0.2, fill: { color: VF_AUBERGINE } });
    slide.addText('TDM NEXUS  •  Steering Committee Report', {
      x: 0.3, y: 7.32, w: 8.0, h: 0.15, fontSize: 7, color: VF_GRAY_MID, fontFace: VF_FONT
    });
    // VOIS branding badge bottom-right (shifted left if page number is present to prevent overlap)
    const badgeX = slideNum !== undefined ? 11.3 : 12.0;
    slide.addShape(pptx.ShapeType.rect, { x: badgeX, y: 7.05, w: 1.3, h: 0.4, fill: { color: VF_RED } });
    slide.addText('VOIS', {
      x: badgeX, y: 7.05, w: 1.3, h: 0.4, fontSize: 9, bold: true,
      color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle'
    });
    if (slideNum !== undefined) {
      slide.addShape(pptx.ShapeType.rect, { x: 12.7, y: 7.05, w: 0.6, h: 0.4, fill: { color: VF_AUBERGINE } });
      slide.addText(slideNum.toString(), {
        x: 12.7, y: 7.05, w: 0.6, h: 0.4, fontSize: 14, bold: true,
        color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle'
      });
    }
  };

  // ── SLIDE 1: Title ────────────────────────────────────────────────────────
  const slide1 = pptx.addSlide();
  slide1.background = { color: VF_WHITE };
  // Top red accent bar
  slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: VF_RED } });
  // Aubergine footer bar
  slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 7.3, w: '100%', h: 0.2, fill: { color: VF_AUBERGINE } });
  // Large aubergine left accent bar
  slide1.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.4, w: 0.12, h: 3.8, fill: { color: VF_AUBERGINE } });
  slide1.addText('TDM NEXUS', { x: 0.8, y: 1.5, w: 11.0, h: 1.0, fontSize: 52, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT });
  slide1.addText('STEERING COMMITTEE REPORT', { x: 0.8, y: 2.7, w: 10.0, h: 0.5, fontSize: 16, bold: true, color: VF_RED, fontFace: VF_FONT });
  slide1.addShape(pptx.ShapeType.rect, { x: 0.8, y: 3.4, w: 6.0, h: 1.6, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 1 } });
  slide1.addText([
    { text: 'Reporting Date: ', options: { bold: true, color: VF_BLACK } },
    { text: new Date().toLocaleDateString('en-GB') + '\n', options: { color: VF_ABBEY } },
    { text: 'Overall Status: ', options: { bold: true, color: VF_BLACK } },
    { text: ragStatus.overall.toUpperCase(), options: { color: getRagHex(ragStatus.overall), bold: true } }
  ], { x: 1.0, y: 3.55, w: 5.5, h: 1.3, fontSize: 13, fontFace: VF_FONT, lineSpacing: 24 });
  // VOIS branding badge bottom-right
  slide1.addShape(pptx.ShapeType.rect, { x: 11.8, y: 6.8, w: 1.5, h: 0.6, fill: { color: VF_RED } });
  slide1.addText('VOIS', { x: 11.8, y: 6.8, w: 1.5, h: 0.6, fontSize: 11, bold: true, color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle' });

  // ── SLIDE 2: RAG Status ───────────────────────────────────────────────────
  const slide2 = pptx.addSlide();
  addSlideHeader(slide2, 'Executive Summary & RAG Status', 2);
  const rags = [
    { label: 'Schedule', val: ragStatus.schedule, desc: 'Progress on track for next PI.' },
    { label: 'Budget',   val: ragStatus.budget,   desc: 'Spending aligned with VROM bounds.' },
    { label: 'Scope',    val: ragStatus.scope,     desc: 'HLD locked.' },
    { label: 'Quality',  val: ragStatus.quality,   desc: 'Tracking defects across SIT/UAT.' }
  ];
  rags.forEach((r, idx) => {
    const xOff = 0.4 + idx * 3.2;
    const ragHex = getRagHex(r.val);
    slide2.addShape(pptx.ShapeType.rect, { x: xOff, y: 1.3, w: 3.0, h: 4.5, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide2.addShape(pptx.ShapeType.rect, { x: xOff, y: 1.3, w: 3.0, h: 0.08, fill: { color: ragHex } });
    slide2.addText(r.label.toUpperCase(), { x: xOff + 0.15, y: 1.45, w: 2.7, h: 0.4, fontSize: 15, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT });
    slide2.addShape(pptx.ShapeType.rect, { x: xOff + 0.15, y: 2.0, w: 1.4, h: 0.45, fill: { color: ragHex }, line: { color: ragHex, width: 1 } });
    slide2.addText(r.val.toUpperCase(), { x: xOff + 0.15, y: 2.0, w: 1.4, h: 0.45, fontSize: 13, bold: true, color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle' });
    slide2.addText(r.desc, { x: xOff + 0.15, y: 2.65, w: 2.7, h: 2.8, fontSize: 12, color: VF_ABBEY, fontFace: VF_FONT, lineSpacing: 18 });
  });

  // ── SLIDE 3: Financial Health ─────────────────────────────────────────────
  const slide3 = pptx.addSlide();
  addSlideHeader(slide3, 'Financial Health & Forecast Allocations', 3);
  const finTableRows: any[][] = [[
    { text: 'Squad / Portfolio', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' } },
    { text: 'CAPEX Alloc',       options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' } },
    { text: 'CAPEX Spent',       options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' } },
    { text: 'OPEX Alloc',        options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' } },
    { text: 'OPEX Spent',        options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'right' } }
  ]];
  allocations.forEach((a, i) => {
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    finTableRows.push([
      { text: a.squadName, options: { color: VF_BLACK, fill: { color: rowFill }, align: 'left', bold: true } },
      { text: `$${(a.capexAllocated / 1000).toFixed(0)}k`, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' } },
      { text: `$${(a.capexSpent / 1000).toFixed(0)}k`,     options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' } },
      { text: `$${(a.opexAllocated / 1000).toFixed(0)}k`,  options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' } },
      { text: `$${(a.opexSpent / 1000).toFixed(0)}k`,      options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'right' } }
    ]);
  });
  slide3.addTable(finTableRows, { x: 0.5, y: 1.3, w: 12.3, h: 5.5, border: { type: 'solid', color: VF_GRAY_MID, pt: 1 }, fontSize: 11, fontFace: VF_FONT, valign: 'middle' });

  // ── SLIDE 4: Squad Delivery ───────────────────────────────────────────────
  const slide4 = pptx.addSlide();
  addSlideHeader(slide4, 'Squad Delivery Pipeline', 4);
  squads.forEach((s, idx) => {
    const yOff = 1.3 + idx * 0.95;
    const isBlocked = s.status === 'Blocked';
    slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: yOff, w: 12.3, h: 0.82, fill: { color: VF_GRAY_LITE }, line: { color: isBlocked ? VF_RED : VF_GRAY_MID, width: isBlocked ? 1.5 : 0.75 } });
    slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: yOff, w: 0.08, h: 0.82, fill: { color: isBlocked ? VF_RED : COLOR_GREEN } });
    slide4.addText(s.name, { x: 0.75, y: yOff + 0.1, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: VF_BLACK, fontFace: VF_FONT });
    slide4.addText(`Lead: ${s.lead} | Target: ${s.targetRelease}`, { x: 0.75, y: yOff + 0.44, w: 3.5, h: 0.28, fontSize: 9, color: VF_ABBEY, fontFace: VF_FONT });
    // Progress bar track
    slide4.addShape(pptx.ShapeType.rect, { x: 4.5, y: yOff + 0.3, w: 5.5, h: 0.22, fill: { color: VF_GRAY_MID } });
    if (s.progress > 0) {
      slide4.addShape(pptx.ShapeType.rect, { x: 4.5, y: yOff + 0.3, w: (s.progress / 100) * 5.5, h: 0.22, fill: { color: isBlocked ? COLOR_AMBER : VF_RED } });
    }
    slide4.addText(`${s.progress}%`, { x: 10.1, y: yOff + 0.22, w: 0.8, h: 0.3, fontSize: 12, bold: true, color: VF_RED, fontFace: VF_FONT });
    const stCol = s.status === 'Blocked' ? COLOR_RED : s.status === 'Completed' ? COLOR_GREEN : VF_ABBEY;
    slide4.addText(s.status, { x: 11.0, y: yOff + 0.24, w: 1.7, h: 0.28, fontSize: 11, bold: true, color: stCol, fontFace: VF_FONT, align: 'right' });
  });

  // ── SLIDE 5: QA Gates ─────────────────────────────────────────────────────
  const slide5 = pptx.addSlide();
  addSlideHeader(slide5, 'Testing & Quality Gates', 5);

  const totalTests    = qaGates.reduce((s, g) => s + g.totalTests, 0);
  const totalPassed   = qaGates.reduce((s, g) => s + g.passed, 0);
  const totalFailed   = qaGates.reduce((s, g) => s + g.failed, 0);
  const overallPassRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  const kpis = [
    { label: 'Total Tests', val: totalTests.toString(),       color: VF_RED     },
    { label: 'Passed',      val: totalPassed.toString(),      color: COLOR_GREEN },
    { label: 'Failed',      val: totalFailed.toString(),      color: COLOR_RED   },
    { label: 'Pass Rate',   val: `${overallPassRate}%`,       color: overallPassRate >= 80 ? COLOR_GREEN : overallPassRate >= 50 ? COLOR_AMBER : COLOR_RED },
  ];
  kpis.forEach((kpi, i) => {
    const kx = 0.4 + i * 3.2;
    slide5.addShape(pptx.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 1.0, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide5.addShape(pptx.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 0.07, fill: { color: kpi.color } });
    slide5.addText(kpi.label, { x: kx + 0.15, y: 1.3, w: 2.7, h: 0.3, fontSize: 10, color: VF_ABBEY, fontFace: VF_FONT });
    slide5.addText(kpi.val,   { x: kx + 0.15, y: 1.6, w: 2.7, h: 0.45, fontSize: 22, bold: true, color: kpi.color, fontFace: VF_FONT });
  });

  const qaTableHeader: any[] = [
    { text: 'Gate',       options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left'   } },
    { text: 'Status',     options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Total',      options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Passed',     options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Failed',     options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Blocked',    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Pass Rate',  options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
  ];
  const qaTableRows: any[][] = [qaTableHeader];
  qaGates.forEach((g, i) => {
    const pr = g.totalTests > 0 ? Math.round((g.passed / g.totalTests) * 100) : 0;
    const prColor = pr >= 80 ? COLOR_GREEN : pr >= 50 ? COLOR_AMBER : COLOR_RED;
    const stColor = g.status === 'Passed' ? COLOR_GREEN : g.status === 'Failed' ? COLOR_RED : g.status === 'In Progress' ? COLOR_AMBER : VF_ABBEY;
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    qaTableRows.push([
      { text: g.name,                       options: { color: VF_BLACK,    fill: { color: rowFill }, bold: true, align: 'left'   } },
      { text: g.status,                     options: { color: stColor,     fill: { color: rowFill }, bold: true, align: 'center' } },
      { text: g.totalTests.toString(),      options: { color: VF_BLACK,    fill: { color: rowFill }, align: 'center' } },
      { text: g.passed.toString(),          options: { color: COLOR_GREEN, fill: { color: rowFill }, bold: true, align: 'center' } },
      { text: g.failed.toString(),          options: { color: g.failed > 0 ? COLOR_RED : VF_ABBEY, fill: { color: rowFill }, bold: g.failed > 0, align: 'center' } },
      { text: (g.blocked || 0).toString(), options: { color: g.blocked ? COLOR_AMBER : VF_ABBEY, fill: { color: rowFill }, align: 'center' } },
      { text: `${pr}%`,                     options: { color: prColor, fill: { color: rowFill }, bold: true, align: 'center' } },
    ]);
  });
  slide5.addTable(qaTableRows, {
    x: 0.5, y: 2.4, w: 12.3, h: Math.min(4.5, 0.45 + qaGates.length * 0.45),
    border: { type: 'solid', color: VF_GRAY_MID, pt: 1 },
    fontSize: 11, fontFace: VF_FONT, valign: 'middle',
    colW: [1.6, 1.6, 1.2, 1.2, 1.2, 1.2, 1.3]
  });

  // ── SLIDE 5b: Defects ─────────────────────────────────────────────────────
  const slide5b = pptx.addSlide();
  addSlideHeader(slide5b, 'Defects Log & Breakdown', 6);

  const openDefs   = defects.filter(d => d.status !== 'Closed');
  const p1p2       = defects.filter(d => d.severity === 'P1' || d.severity === 'P2');
  const closedDefs = defects.filter(d => d.status === 'Closed');

  const defKpis = [
    { label: 'Total Defects', val: defects.length.toString(),   color: VF_RED },
    { label: 'Open',          val: openDefs.length.toString(),   color: openDefs.length > 0 ? COLOR_RED : COLOR_GREEN },
    { label: 'P1/P2 Critical',val: p1p2.length.toString(),      color: p1p2.length > 0 ? COLOR_RED : COLOR_GREEN },
    { label: 'Closed',        val: closedDefs.length.toString(), color: COLOR_GREEN },
  ];
  defKpis.forEach((kpi, i) => {
    const kx = 0.4 + i * 3.2;
    slide5b.addShape(pptx.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 1.0, fill: { color: VF_GRAY_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    slide5b.addShape(pptx.ShapeType.rect, { x: kx, y: 1.2, w: 3.0, h: 0.07, fill: { color: kpi.color } });
    slide5b.addText(kpi.label, { x: kx + 0.15, y: 1.3, w: 2.7, h: 0.3, fontSize: 10, color: VF_ABBEY, fontFace: VF_FONT });
    slide5b.addText(kpi.val,   { x: kx + 0.15, y: 1.6, w: 2.7, h: 0.45, fontSize: 22, bold: true, color: kpi.color, fontFace: VF_FONT });
  });

  const defTableHeader: any[] = [
    { text: 'ID',       options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Title',    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left'   } },
    { text: 'Phase',    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Squad',    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left'   } },
    { text: 'Severity', options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Status',   options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
  ];
  const defTableRows: any[][] = [defTableHeader];
  defects.slice(0, 18).forEach((d, i) => {
    const sevColor = d.severity === 'P1' ? COLOR_RED : d.severity === 'P2' ? COLOR_AMBER : VF_ABBEY;
    const stColor  = d.status === 'Closed' ? COLOR_GREEN : d.status === 'In Progress' || d.status === 'Retesting' ? COLOR_AMBER : COLOR_RED;
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    defTableRows.push([
      { text: d.id,           options: { color: VF_RED,      fill: { color: rowFill }, bold: true, align: 'center' } },
      { text: d.title,        options: { color: VF_BLACK,    fill: { color: rowFill }, align: 'left'   } },
      { text: d.phase || '-', options: { color: VF_ABBEY,    fill: { color: rowFill }, align: 'center' } },
      { text: d.squad,        options: { color: VF_ABBEY,    fill: { color: rowFill }, align: 'left'   } },
      { text: d.severity,     options: { color: sevColor,    fill: { color: rowFill }, bold: true, align: 'center' } },
      { text: d.status,       options: { color: stColor,     fill: { color: rowFill }, bold: true, align: 'center' } },
    ]);
  });
  if (defTableRows.length > 1) {
    slide5b.addTable(defTableRows, {
      x: 0.5, y: 2.4, w: 12.3, h: Math.min(4.5, 0.45 + (defTableRows.length - 1) * 0.35),
      border: { type: 'solid', color: VF_GRAY_MID, pt: 1 },
      fontSize: 10, fontFace: VF_FONT, valign: 'middle',
      colW: [1.2, 3.8, 1.0, 2.3, 1.2, 1.5]
    });
  } else {
    slide5b.addText('No defects logged yet.', { x: 0.5, y: 3.5, w: 12.3, h: 0.5, fontSize: 14, color: VF_ABBEY, fontFace: VF_FONT, align: 'center' });
  }

  // ── SLIDE 6: RAID Log ─────────────────────────────────────────────────────
  const slide6 = pptx.addSlide();
  addSlideHeader(slide6, 'RAID Log', 7);
  const riskTableRows: any[][] = [[
    { text: 'Ref ID',                    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' } },
    { text: 'Type',                      options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' } },
    { text: 'Risk Description / Trigger',options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' } },
    { text: 'Impact',                    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } },
    { text: 'Mitigation Plan',           options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'left' } },
    { text: 'Status',                    options: { bold: true, color: VF_WHITE, fill: { color: VF_RED }, align: 'center' } }
  ]];
  risks.forEach((r, i) => {
    const rowFill = i % 2 === 0 ? VF_WHITE : VF_GRAY_LITE;
    riskTableRows.push([
      { text: r.id,     options: { color: VF_RED,      fill: { color: rowFill }, bold: true, align: 'left'   } },
      { text: r.type,   options: { color: VF_BLACK,    fill: { color: rowFill }, bold: true, align: 'left'   } },
      { text: r.title,  options: { color: VF_BLACK,    fill: { color: rowFill }, align: 'left'   } },
      { text: r.impact, options: { color: r.impact === 'Critical' || r.impact === 'High' ? COLOR_RED : COLOR_AMBER, fill: { color: rowFill }, bold: true, align: 'center' } },
      { text: r.mitigation, options: { color: VF_ABBEY, fill: { color: rowFill }, align: 'left' } },
      { text: r.status.toUpperCase(), options: { color: r.status === 'Open' ? COLOR_RED : COLOR_GREEN, fill: { color: rowFill }, bold: true, align: 'center' } }
    ]);
  });
  slide6.addTable(riskTableRows, {
    x: 0.5, y: 1.3, w: 12.3, h: 5.8,
    border: { type: 'solid', color: VF_GRAY_MID, pt: 1 },
    fontSize: 10, fontFace: VF_FONT, align: 'left', valign: 'middle'
  });

  // ── SLIDES 7–10: AI Analytics ─────────────────────────────────────────────
  const splitIndex1 = aiAnalysis.search(/(?:\r?\n)(?:2\.|2\s+FINANCIAL|FINANCIAL\s+HEALTH)/i);
  let part1 = aiAnalysis;
  let part2 = '';
  let part3 = '';
  let part4 = '';

  if (splitIndex1 !== -1) {
    part1 = aiAnalysis.substring(0, splitIndex1).trim();
    const remainingAfter1 = aiAnalysis.substring(splitIndex1).trim();
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
    { title: 'AI Executive Summary',  label: 'Part 1 – Executive Summary & Overview', content: part1 },
    { title: 'AI Financial Health',   label: 'Part 2 – Financial Health',              content: part2 },
    { title: 'AI Quality & Testing',  label: 'Part 3 – Quality & Testing',             content: part3 },
    { title: 'AI Recommendations',    label: 'Part 4 – Key Recommendations',           content: part4 },
  ].filter(s => s.content.trim() !== '');

  aiSlides.forEach((s, i) => {
    const aiSlide = pptx.addSlide();
    addSlideHeader(aiSlide, s.title, 8 + i);
    // Light red content card
    aiSlide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 12.3, h: 5.8, fill: { color: VF_RED_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
    aiSlide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 0.08, h: 5.8, fill: { color: VF_RED } });
    aiSlide.addText(s.label, { x: 0.75, y: 1.25, w: 11.0, h: 0.35, fontSize: 13, bold: true, color: VF_RED, fontFace: VF_FONT });
    aiSlide.addText(s.content, {
      x: 0.75, y: 1.7, w: 11.8, h: 5.2,
      fontSize: 10, color: VF_BLACK, fontFace: VF_FONT,
      align: 'left', valign: 'top', lineSpacing: 14
    });
  });

  // Save
  pptx.writeFile({ fileName: `TDM_SteerCo_Report_${new Date().toISOString().split('T')[0]}.pptx` });
};

export const exportPOAPToPPT = (
  poapData: POAPData,
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string }
) => {
  // Stubbed implementation for POAP pptx
};

// Export Governance Gates (RPM, CP1, CP2, Change Requests) to PowerPoint
export const exportGovernanceGatesToPPT = (
  gates: GovernanceGateDetail[],
  singleGateId?: string
) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  // Filter gates if we only want to export a single slide
  const gatesToExport = singleGateId 
    ? gates.filter(g => g.id === singleGateId) 
    : gates;

  gatesToExport.forEach(gate => {
    const slide = pptx.addSlide();
    
    // Set slide background to white
    slide.background = { color: 'FFFFFF' };

    // Slide Title
    slide.addText(gate.title.toUpperCase(), {
      x: 0.5,
      y: 0.3,
      w: 12.3,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: 'E60000',
      fontFace: 'Outfit'
    });

    // Objective Box
    slide.addText([
      { text: 'Objective: ', options: { bold: true, color: 'E60000' } },
      { text: gate.objective, options: { color: 'E60000' } }
    ], {
      x: 0.5,
      y: 1.1,
      w: 4.8,
      h: 1.2,
      line: { color: 'E60000', width: 2 },
      fill: { color: 'FFFFFF' },
      valign: 'middle',
      fontSize: 11,
      fontFace: 'Outfit',
      margin: 10
    });

    // Entry Criteria
    slide.addText('Entry criteria:', {
      x: 0.5,
      y: 2.5,
      w: 4.8,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: '000000',
      fontFace: 'Outfit'
    });

    const entryText = gate.entryCriteria
      .filter(item => item.trim() !== '')
      .map(item => ({
        text: item,
        options: { bullet: true, color: '000000', fontSize: 10 }
      }));
    slide.addText(entryText, {
      x: 0.5,
      y: 2.8,
      w: 4.8,
      h: 1.3,
      fontSize: 10,
      fontFace: 'Outfit',
      lineSpacing: 14
    });

    // Output
    slide.addText('Output:', {
      x: 0.5,
      y: 4.2,
      w: 4.8,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: '000000',
      fontFace: 'Outfit'
    });

    const outputText = gate.outputs
      .filter(item => item.trim() !== '')
      .map(item => ({
        text: item,
        options: { bullet: true, color: '000000', fontSize: 10 }
      }));
    slide.addText(outputText, {
      x: 0.5,
      y: 4.5,
      w: 4.8,
      h: 1.0,
      fontSize: 10,
      fontFace: 'Outfit',
      lineSpacing: 14
    });

    // Audience position based on CR
    const isCR = gate.id === 'cr';
    const audienceY = isCR ? 5.4 : 5.6;

    const audienceText: any[] = [
      { text: 'Mandatory Audience: ', options: { bold: true, color: '000000' } },
      { text: gate.mandatoryAudience + '\n\n', options: { color: '333333' } }
    ];
    if (gate.optionalAudience) {
      audienceText.push({ text: 'Optional Audience: ', options: { bold: true, color: '000000' } });
      audienceText.push({ text: gate.optionalAudience, options: { color: '333333' } });
    }
    
    slide.addText(audienceText, {
      x: 0.5,
      y: audienceY,
      w: 4.8,
      h: isCR ? 0.7 : 1.0,
      fontSize: 10,
      fontFace: 'Outfit'
    });

    // For Change Requests: Types Considered and Not Considered at the bottom
    if (isCR && gate.typesConsidered && gate.typesNotConsidered) {
      // Considered (Green)
      slide.addText('The following types of CRs will be considered:', {
        x: 0.5,
        y: 6.1,
        w: 5.8,
        h: 0.25,
        fontSize: 12,
        bold: true,
        color: '008000',
        fontFace: 'Outfit'
      });
      const consText = gate.typesConsidered
        .filter(item => item.trim() !== '')
        .map(item => ({
          text: item,
          options: { bullet: { code: '2022' }, color: '333333', fontSize: 10 }
        }));
      slide.addText(consText, {
        x: 0.5,
        y: 6.4,
        w: 5.8,
        h: 0.9,
        fontSize: 10,
        fontFace: 'Outfit',
        lineSpacing: 14
      });

      // Not Considered (Red)
      slide.addText('The following types of CRs will not be considered:', {
        x: 6.8,
        y: 6.1,
        w: 6.0,
        h: 0.25,
        fontSize: 12,
        bold: true,
        color: 'E60000',
        fontFace: 'Outfit'
      });
      const notConsText = gate.typesNotConsidered
        .filter(item => item.trim() !== '')
        .map(item => ({
          text: item,
          options: { bullet: { code: '2022' }, color: '333333', fontSize: 10 }
        }));
      slide.addText(notConsText, {
        x: 6.8,
        y: 6.4,
        w: 6.0,
        h: 0.9,
        fontSize: 10,
        fontFace: 'Outfit',
        lineSpacing: 14
      });
    }

    // Right Side Table (Participants)
    const tableHeader = [
      { text: 'Participant', options: { bold: true, color: 'FFFFFF', fill: { color: 'E60000' }, align: 'left', valign: 'middle' } },
      { text: 'Input (Actions Done)', options: { bold: true, color: 'FFFFFF', fill: { color: 'E60000' }, align: 'left', valign: 'middle' } },
      { text: 'Output (Actions to do)', options: { bold: true, color: 'FFFFFF', fill: { color: 'E60000' }, align: 'left', valign: 'middle' } }
    ];

    const tableRows: any[][] = [tableHeader];

    const formatCellWithBullets = (items: string[]) => {
      const activeItems = items.filter(item => item.trim() !== '');
      if (activeItems.length === 0 || (activeItems.length === 1 && activeItems[0].trim() === 'N/A')) {
        return [{ text: 'N/A', options: { color: '333333', fontSize: 9 } }];
      }
      return activeItems.map(item => ({
        text: item,
        options: { bullet: true, color: '333333', fontSize: 9 }
      }));
    };

    gate.participants.forEach(p => {
      tableRows.push([
        { text: [{ text: p.participant, options: { bold: true, color: '000000', fontSize: 10 } }], options: { fill: { color: 'FCE4E4' }, valign: 'middle' } },
        { text: formatCellWithBullets(p.inputs), options: { fill: { color: 'FCE4E4' }, valign: 'middle' } },
        { text: formatCellWithBullets(p.outputs), options: { fill: { color: 'FCE4E4' }, valign: 'middle' } }
      ]);
    });

    const tableH = isCR ? 4.3 : 5.0;
    slide.addTable(tableRows, {
      x: 5.6,
      y: 1.1,
      w: 7.2,
      h: tableH,
      border: { type: 'solid', color: 'FFFFFF', pt: 2 },
      fontSize: 9,
      fontFace: 'Outfit',
      valign: 'middle',
      margin: 6
    });
  });

  const fileName = singleGateId 
    ? `${gatesToExport[0].title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}_Report.pptx`
    : 'TDM_Release_Governance_Gate_Deck.pptx';

  pptx.writeFile({ fileName });
};

// Export individual AI Insight/Chat to PowerPoint
export const exportAIInsightToPPT = (
  title: string,
  markdownContent: string
) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  // ── VOIS Official Brand Colours ──────────────────────────────────────
  const VF_RED        = 'E60000';   // VOIS Primary Red
  const VF_WHITE      = 'FFFFFF';   // White
  const VF_BLACK      = '333333';   // VOIS Black
  const VF_AUBERGINE  = '5E2750';   // VOIS Finn / Aubergine
  const VF_GRAY_MID   = 'D6D6D6';   // Neutral mid-grey borders
  const VF_RED_LITE   = 'FCEAEA';   // Soft VOIS red tint
  const VF_FONT       = 'Outfit';

  // Strip complex markdown tables and replace with simplified text if present, 
  // or just let pptxgen do its best. A simple cleanup regex to remove some md characters.
  const cleanContent = markdownContent.replace(/\*\*/g, '').replace(/#/g, '');

  const slide = pptx.addSlide();
  
  slide.background = { color: VF_WHITE };
  // Top red accent bar
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: VF_RED } });
  
  // Title
  slide.addText('TDM NEXUS AI INSIGHT', {
    x: 0.5, y: 0.2, w: 10.0, h: 0.6,
    fontSize: 24, bold: true, color: VF_AUBERGINE, fontFace: VF_FONT
  });
  // Thin red underline beneath title
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.85, w: 1.5, h: 0.04, fill: { color: VF_RED } });

  // Light red content card
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 12.3, h: 5.8, fill: { color: VF_RED_LITE }, line: { color: VF_GRAY_MID, width: 0.75 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 0.08, h: 5.8, fill: { color: VF_RED } });
  
  slide.addText(title, { x: 0.75, y: 1.25, w: 11.0, h: 0.35, fontSize: 14, bold: true, color: VF_RED, fontFace: VF_FONT });
  
  slide.addText(cleanContent, {
    x: 0.75, y: 1.7, w: 11.8, h: 5.2,
    fontSize: 11, color: VF_BLACK, fontFace: VF_FONT,
    align: 'left', valign: 'top', lineSpacing: 16
  });

  // Aubergine footer bar
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.3, w: '100%', h: 0.2, fill: { color: VF_AUBERGINE } });
  slide.addText('TDM NEXUS  •  AI Generated Insight', {
    x: 0.3, y: 7.32, w: 8.0, h: 0.15, fontSize: 7, color: VF_GRAY_MID, fontFace: VF_FONT
  });

  const badgeX = 12.0;
  slide.addShape(pptx.ShapeType.rect, { x: badgeX, y: 7.05, w: 1.3, h: 0.4, fill: { color: VF_RED } });
  slide.addText('VOIS', {
    x: badgeX, y: 7.05, w: 1.3, h: 0.4, fontSize: 9, bold: true,
    color: VF_WHITE, fontFace: VF_FONT, align: 'center', valign: 'middle'
  });

  pptx.writeFile({ fileName: `TDM_AI_Insight_${new Date().getTime()}.pptx` });
};
