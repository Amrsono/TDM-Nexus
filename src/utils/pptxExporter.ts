import pptxgen from 'pptxgenjs';
import { 
  ProjectFinancials, 
  ADOWorkItem, 
  PortfolioSquad, 
  FinancialAllocation, 
  QAGate, 
  Defect, 
  RiskIssue,
  POAPData
} from './mockData';

export const exportToPPT = (
  financials: ProjectFinancials,
  adoWorkItems: ADOWorkItem[],
  squads: PortfolioSquad[],
  allocations: FinancialAllocation[],
  qaGates: QAGate[],
  defects: Defect[],
  risks: RiskIssue[],
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string }
) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  // Theme colors
  const BG_COLOR = '070B19';
  const CARD_BG = '0D162F';
  const CYAN = '00F2FE';
  const PURPLE = 'BD00FF';
  const TEXT_WHITE = 'F8FAFC';
  const TEXT_GRAY = '94A3B8';
  
  // Status Colors
  const COLOR_GREEN = '00F5A0';
  const COLOR_AMBER = 'F59E0B';
  const COLOR_RED = 'EF4444';

  const getRagHex = (val: string) => {
    if (val.toLowerCase() === 'green') return COLOR_GREEN;
    if (val.toLowerCase() === 'amber') return COLOR_AMBER;
    return COLOR_RED;
  };

  // Helper to add standard slide header
  const addSlideHeader = (slide: any, title: string) => {
    slide.background = { color: BG_COLOR };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: '050812' } });
    slide.addText(title.toUpperCase(), { x: 0.5, y: 0.2, w: 8.0, h: 0.5, fontSize: 22, bold: true, color: CYAN, fontFace: 'Outfit' });
    slide.addText('TDM NEXUS - STEERING COMMITTEE REPORT', { x: 0.5, y: 7.1, w: 5.0, h: 0.3, fontSize: 10, color: TEXT_GRAY, fontFace: 'Outfit' });
  };

  // SLIDE 1
  const slide1 = pptx.addSlide();
  slide1.background = { color: BG_COLOR };
  slide1.addShape(pptx.ShapeType.rect, { x: 1.0, y: 1.5, w: 0.15, h: 3.5, fill: { color: CYAN } });
  slide1.addText('PROJECT VELOCITY', { x: 1.4, y: 1.6, w: 10.0, h: 1.0, fontSize: 44, bold: true, color: TEXT_WHITE, fontFace: 'Outfit' });
  slide1.addText('STEERING COMMITTEE REPORT', { x: 1.4, y: 3.5, w: 10.0, h: 0.4, fontSize: 14, bold: true, color: PURPLE, fontFace: 'Outfit' });
  slide1.addShape(pptx.ShapeType.rect, { x: 1.4, y: 4.4, w: 5.5, h: 1.5, fill: { color: CARD_BG }, line: { color: '00F2FE', width: 1 } });
  slide1.addText([
    { text: 'Reporting Date: ', options: { bold: true, color: TEXT_WHITE } },
    { text: new Date().toLocaleDateString() + '\n', options: { color: TEXT_GRAY } },
    { text: 'Overall Project status: ', options: { bold: true, color: TEXT_WHITE } },
    { text: ragStatus.overall.toUpperCase() + '\n', options: { color: getRagHex(ragStatus.overall), bold: true } }
  ], { x: 1.6, y: 4.5, w: 5.1, h: 1.3, fontSize: 12, fontFace: 'Outfit', lineSpacing: 22 });

  // SLIDE 2: Executive Summary
  const slide2 = pptx.addSlide();
  addSlideHeader(slide2, 'Executive Summary & RAG Status');
  const rags = [
    { label: 'Schedule', val: ragStatus.schedule, desc: 'Progress on track for next PI.' },
    { label: 'Budget', val: ragStatus.budget, desc: 'Spending aligned with VROM bounds.' },
    { label: 'Scope', val: ragStatus.scope, desc: 'HLD locked.' },
    { label: 'Quality', val: ragStatus.quality, desc: 'Tracking defects across SIT/UAT.' }
  ];
  rags.forEach((r, idx) => {
    const xOffset = 0.5 + idx * 3.1;
    slide2.addShape(pptx.ShapeType.rect, { x: xOffset, y: 2.8, w: 2.9, h: 3.8, fill: { color: CARD_BG }, line: { color: getRagHex(r.val), width: 1.5 } });
    slide2.addText(r.label.toUpperCase(), { x: xOffset + 0.2, y: 3.0, w: 2.5, h: 0.3, fontSize: 16, bold: true, color: TEXT_WHITE, fontFace: 'Outfit' });
    slide2.addShape(pptx.ShapeType.rect, { x: xOffset + 0.2, y: 3.4, w: 1.2, h: 0.4, fill: { color: getRagHex(r.val) + '22' }, line: { color: getRagHex(r.val), width: 1 } });
    slide2.addText(r.val.toUpperCase(), { x: xOffset + 0.2, y: 3.4, w: 1.2, h: 0.4, fontSize: 12, bold: true, color: getRagHex(r.val), fontFace: 'Outfit', align: 'center', valign: 'middle' });
    slide2.addText(r.desc, { x: xOffset + 0.2, y: 4.1, w: 2.5, h: 2.0, fontSize: 12, color: TEXT_GRAY, fontFace: 'Outfit', lineSpacing: 18 });
  });

  // SLIDE 3: Finances
  const slide3 = pptx.addSlide();
  addSlideHeader(slide3, 'Financial Health & Forecast Allocations');
  const finTableRows: any[][] = [
    [
      { text: 'Squad / Portfolio', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'CAPEX Alloc', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'CAPEX Spent', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'OPEX Alloc', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'OPEX Spent', options: { bold: true, color: CYAN, fill: { color: '050812' } } }
    ]
  ];
  allocations.forEach(a => {
    finTableRows.push([
      { text: a.squadName, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { text: `$${(a.capexAllocated / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: `$${(a.capexSpent / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: `$${(a.opexAllocated / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: `$${(a.opexSpent / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } }
    ]);
  });
  slide3.addTable(finTableRows, { x: 0.5, y: 2.8, w: 12.3, h: 3.8, border: { type: 'solid', color: '1e293b', pt: 1 }, fontSize: 11, fontFace: 'Outfit', align: 'left', valign: 'middle' });

  // SLIDE 4: Squad Progress
  const slide4 = pptx.addSlide();
  addSlideHeader(slide4, 'Squad Delivery Pipeline');
  squads.forEach((s, idx) => {
    const yOffset = 1.3 + idx * 1.1;
    slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: yOffset, w: 12.3, h: 0.9, fill: { color: CARD_BG }, line: { color: s.status === 'Blocked' ? COLOR_RED : '1e293b', width: 1 } });
    slide4.addText(s.name, { x: 0.7, y: yOffset + 0.15, w: 3.5, h: 0.3, fontSize: 14, bold: true, color: TEXT_WHITE, fontFace: 'Outfit' });
    slide4.addText(`Lead: ${s.lead} | Target: ${s.targetRelease}`, { x: 0.7, y: yOffset + 0.45, w: 3.5, h: 0.3, fontSize: 10, color: TEXT_GRAY, fontFace: 'Outfit' });
    slide4.addShape(pptx.ShapeType.rect, { x: 4.5, y: yOffset + 0.3, w: 5.0, h: 0.25, fill: { color: '161e38' } });
    if (s.progress > 0) {
      slide4.addShape(pptx.ShapeType.rect, { x: 4.5, y: yOffset + 0.3, w: (s.progress / 100) * 5.0, h: 0.25, fill: { color: s.status === 'Blocked' ? COLOR_AMBER : CYAN } });
    }
    slide4.addText(`${s.progress}%`, { x: 9.6, y: yOffset + 0.25, w: 0.8, h: 0.3, fontSize: 12, bold: true, color: CYAN, fontFace: 'Outfit' });
  });

  // SLIDE 5: QA
  const slide5 = pptx.addSlide();
  addSlideHeader(slide5, 'QA Gates Testing');
  let sit = qaGates.find(g => g.name === 'SIT');
  if (sit) {
    slide5.addText(`SIT Total Tests: ${sit.totalTests}`, { x: 0.5, y: 1.5, w: 4, h: 0.5, fontSize: 16, color: TEXT_WHITE });
    slide5.addText(`SIT Passed: ${sit.passed}`, { x: 0.5, y: 2.0, w: 4, h: 0.5, fontSize: 16, color: COLOR_GREEN });
    slide5.addText(`SIT Failed: ${sit.failed}`, { x: 0.5, y: 2.5, w: 4, h: 0.5, fontSize: 16, color: COLOR_RED });
  }

  // SLIDE 6: Risks
  const slide6 = pptx.addSlide();
  addSlideHeader(slide6, 'RAID Log');
  const riskTableRows: any[][] = [
    [
      { text: 'Ref ID', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Type', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Risk Description / Trigger', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Impact', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Mitigation Plan', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Status', options: { bold: true, color: CYAN, fill: { color: '050812' } } }
    ]
  ];
  risks.forEach(r => {
    riskTableRows.push([
      { text: r.id, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { text: r.type, options: { color: PURPLE, bold: true, fill: { color: CARD_BG } } },
      { text: r.title, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { text: r.impact, options: { color: r.impact === 'Critical' || r.impact === 'High' ? COLOR_RED : COLOR_AMBER, bold: true, fill: { color: CARD_BG } } },
      { text: r.mitigation, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: r.status.toUpperCase(), options: { color: r.status === 'Open' ? COLOR_RED : COLOR_GREEN, bold: true, fill: { color: CARD_BG } } }
    ]);
  });
  slide6.addTable(riskTableRows, { x: 0.5, y: 1.5, w: 12.3, h: 5.0, border: { type: 'solid', color: '1e293b', pt: 1 }, fontSize: 10, fontFace: 'Outfit', align: 'left', valign: 'middle' });

  pptx.writeFile({ fileName: 'TDM_SteerCo_Report.pptx' });
};

export const exportPOAPToPPT = (
  poapData: POAPData,
  ragStatus: { schedule: string; budget: string; scope: string; quality: string; overall: string }
) => {
  // Stubbed implementation for POAP pptx
};
