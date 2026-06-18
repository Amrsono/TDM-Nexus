import pptxgen from 'pptxgenjs';
import { 
  ProjectFinancials, 
  Requirement, 
  DomainBuild, 
  FinancialAllocation, 
  QAStatus, 
  Defect, 
  RiskIssue,
  POAPData
} from './mockData';

export const exportToPPT = (
  financials: ProjectFinancials,
  requirements: Requirement[],
  domains: DomainBuild[],
  allocations: FinancialAllocation[],
  qaStatus: QAStatus,
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
    // Slide Background
    slide.background = { color: BG_COLOR };

    // Header bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.9,
      fill: { color: '050812' }
    });

    // Header title
    slide.addText(title.toUpperCase(), {
      x: 0.5, y: 0.2, w: 8.0, h: 0.5,
      fontSize: 22, bold: true, color: CYAN, fontFace: 'Outfit'
    });

    // Small footer label
    slide.addText('TDM NEXUS - STEERING COMMITTEE REPORT', {
      x: 0.5, y: 7.1, w: 5.0, h: 0.3,
      fontSize: 10, color: TEXT_GRAY, fontFace: 'Outfit'
    });

    // Slide Number (handled by library automatically if defined globally, but simple text is fine here)
  };

  // ==========================================
  // SLIDE 1: Title Slide (Futuristic Landing)
  // ==========================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: BG_COLOR };

  // Decorative glow blocks (shapes)
  slide1.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: 1.5, w: 0.15, h: 3.5,
    fill: { color: CYAN }
  });

  slide1.addText('PROJECT VELOCITY', {
    x: 1.4, y: 1.6, w: 10.0, h: 1.0,
    fontSize: 44, bold: true, color: TEXT_WHITE, fontFace: 'Outfit'
  });

  slide1.addText('eSIM & Multi-Play Carrier Billing Launch', {
    x: 1.4, y: 2.6, w: 10.0, h: 0.5,
    fontSize: 20, color: CYAN, fontFace: 'Outfit'
  });

  slide1.addText('TECHNICAL DELIVERY STEERING COMMITTEE REPORT', {
    x: 1.4, y: 3.5, w: 10.0, h: 0.4,
    fontSize: 14, bold: true, color: PURPLE, fontFace: 'Outfit'
  });

  // Details box
  slide1.addShape(pptx.ShapeType.rect, {
    x: 1.4, y: 4.4, w: 5.5, h: 1.5,
    fill: { color: CARD_BG },
    line: { color: '00F2FE', width: 1 }
  });

  slide1.addText([
    { text: 'Reporting Date: ', options: { bold: true, color: TEXT_WHITE } },
    { text: new Date().toLocaleDateString() + '\n', options: { color: TEXT_GRAY } },
    { text: 'Overall Project status: ', options: { bold: true, color: TEXT_WHITE } },
    { text: ragStatus.overall.toUpperCase() + '\n', options: { color: getRagHex(ragStatus.overall), bold: true } },
    { text: 'Release Version: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'v3.0.0-Core (Production)', options: { color: TEXT_GRAY } }
  ], {
    x: 1.6, y: 4.5, w: 5.1, h: 1.3,
    fontSize: 12, fontFace: 'Outfit', lineSpacing: 22
  });

  // ==========================================
  // SLIDE 2: Executive Summary & RAG Status
  // ==========================================
  const slide2 = pptx.addSlide();
  addSlideHeader(slide2, 'Executive Summary & RAG Status');

  // Business case context card
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.2, w: 12.3, h: 1.3,
    fill: { color: CARD_BG },
    line: { color: '00F2FE', width: 1 }
  });

  slide2.addText('PROJECT GOAL & BUSINESS VALUE PROPOSITION', {
    x: 0.7, y: 1.3, w: 6.0, h: 0.3,
    fontSize: 11, bold: true, color: CYAN, fontFace: 'Outfit'
  });

  slide2.addText('Launch the new Unified Mobile & Digital Proposition platform, enabling instant eSIM activation and carrier-billing integration for third-party streaming partners. Replaces manual SIM processes and legacy billing interfaces, yielding an expected revenue benefit of $12.5M over 5 years.', {
    x: 0.7, y: 1.6, w: 11.9, h: 0.8,
    fontSize: 12, color: TEXT_WHITE, fontFace: 'Outfit', lineSpacing: 18
  });

  // RAG cards (4 cards side-by-side)
  const rags = [
    { label: 'Schedule', val: ragStatus.schedule, desc: 'E2E Testing completion scheduled 1 week delay' },
    { label: 'Budget', val: ragStatus.budget, desc: 'Spending aligned with forecast; Capex margin OK' },
    { label: 'Scope', val: ragStatus.scope, desc: 'Core specifications locked. No scope creep reported' },
    { label: 'Quality', val: ragStatus.quality, desc: 'Critical defects open on eSIM provisioning gateway' }
  ];

  rags.forEach((r, idx) => {
    const xOffset = 0.5 + idx * 3.1;
    slide2.addShape(pptx.ShapeType.rect, {
      x: xOffset, y: 2.8, w: 2.9, h: 3.8,
      fill: { color: CARD_BG },
      line: { color: getRagHex(r.val), width: 1.5 }
    });

    slide2.addText(r.label.toUpperCase(), {
      x: xOffset + 0.2, y: 3.0, w: 2.5, h: 0.3,
      fontSize: 16, bold: true, color: TEXT_WHITE, fontFace: 'Outfit'
    });

    // RAG Status Badge indicator inside card
    slide2.addShape(pptx.ShapeType.rect, {
      x: xOffset + 0.2, y: 3.4, w: 1.2, h: 0.4,
      fill: { color: getRagHex(r.val) + '22' },
      line: { color: getRagHex(r.val), width: 1 }
    });

    slide2.addText(r.val.toUpperCase(), {
      x: xOffset + 0.2, y: 3.4, w: 1.2, h: 0.4,
      fontSize: 12, bold: true, color: getRagHex(r.val), fontFace: 'Outfit',
      align: 'center', valign: 'middle'
    });

    slide2.addText(r.desc, {
      x: xOffset + 0.2, y: 4.1, w: 2.5, h: 2.0,
      fontSize: 12, color: TEXT_GRAY, fontFace: 'Outfit', lineSpacing: 18
    });
  });

  // ==========================================
  // SLIDE 3: Financial Health
  // ==========================================
  const slide3 = pptx.addSlide();
  addSlideHeader(slide3, 'Financial Health & Forecast Allocations');

  // Main high-level financial summary (3 top cards)
  const finCards = [
    { label: 'CAPEX BUDGET LIMIT', val: `$${financials.capexLimit.toLocaleString()}`, color: CYAN },
    { label: 'OPEX BUDGET LIMIT', val: `$${financials.opexLimit.toLocaleString()}`, color: PURPLE },
    { label: 'TOTAL FUNDS SPENT', val: `$${financials.totalSpent.toLocaleString()}`, color: COLOR_GREEN }
  ];

  finCards.forEach((c, idx) => {
    const xOffset = 0.5 + idx * 4.2;
    slide3.addShape(pptx.ShapeType.rect, {
      x: xOffset, y: 1.2, w: 3.9, h: 1.2,
      fill: { color: CARD_BG },
      line: { color: c.color, width: 1 }
    });

    slide3.addText(c.label, {
      x: xOffset + 0.2, y: 1.3, w: 3.5, h: 0.3,
      fontSize: 10, bold: true, color: TEXT_GRAY, fontFace: 'Outfit'
    });

    slide3.addText(c.val, {
      x: xOffset + 0.2, y: 1.6, w: 3.5, h: 0.6,
      fontSize: 24, bold: true, color: c.color, fontFace: 'Outfit'
    });
  });

  // Financial table of domain allocations
  const finTableRows: any[][] = [
    [
      { text: 'System Domain Owner', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'CAPEX Alloc', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'CAPEX Spent', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'OPEX Alloc', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'OPEX Spent', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Variance', options: { bold: true, color: CYAN, fill: { color: '050812' } } }
    ]
  ];

  allocations.forEach(a => {
    const totalAlloc = a.capexAllocated + a.opexAllocated;
    const totalSpent = a.capexSpent + a.opexSpent;
    const variance = totalAlloc - totalSpent;
    
    finTableRows.push([
      { text: a.domainName, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { text: `$${(a.capexAllocated / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: `$${(a.capexSpent / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: `$${(a.opexAllocated / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: `$${(a.opexSpent / 1000).toFixed(0)}k`, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { 
        text: `$${(variance / 1000).toFixed(0)}k`, 
        options: { color: variance >= 0 ? COLOR_GREEN : COLOR_RED, bold: true, fill: { color: CARD_BG } } 
      }
    ]);
  });

  slide3.addTable(finTableRows, {
    x: 0.5, y: 2.8, w: 12.3, h: 3.8,
    border: { type: 'solid', color: '1e293b', pt: 1 },
    fontSize: 11, fontFace: 'Outfit',
    align: 'left',
    valign: 'middle'
  });

  // ==========================================
  // SLIDE 4: Delivery & Domain Build Progress
  // ==========================================
  const slide4 = pptx.addSlide();
  addSlideHeader(slide4, 'Delivery Pipeline & Build Progress');

  // Draw 5 domain tracks
  domains.forEach((d, idx) => {
    const yOffset = 1.3 + idx * 1.1;

    // Background panel
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: yOffset, w: 12.3, h: 0.9,
      fill: { color: CARD_BG },
      line: { color: d.status === 'Blocked' ? COLOR_RED : '1e293b', width: 1 }
    });

    // Domain name
    slide4.addText(d.name, {
      x: 0.7, y: yOffset + 0.15, w: 3.5, h: 0.3,
      fontSize: 14, bold: true, color: TEXT_WHITE, fontFace: 'Outfit'
    });

    slide4.addText(`Lead: ${d.lead} | Target: ${d.releaseVersion}`, {
      x: 0.7, y: yOffset + 0.45, w: 3.5, h: 0.3,
      fontSize: 10, color: TEXT_GRAY, fontFace: 'Outfit'
    });

    // Build Progress Bar Background
    slide4.addShape(pptx.ShapeType.rect, {
      x: 4.5, y: yOffset + 0.3, w: 5.0, h: 0.25,
      fill: { color: '161e38' }
    });

    // Fill progress
    if (d.progress > 0) {
      slide4.addShape(pptx.ShapeType.rect, {
        x: 4.5, y: yOffset + 0.3, w: (d.progress / 100) * 5.0, h: 0.25,
        fill: { color: d.status === 'Blocked' ? COLOR_AMBER : CYAN }
      });
    }

    // Progress percentage text
    slide4.addText(`${d.progress}%`, {
      x: 9.6, y: yOffset + 0.25, w: 0.8, h: 0.3,
      fontSize: 12, bold: true, color: CYAN, fontFace: 'Outfit'
    });

    // Status badge
    const statusCol = d.status === 'Completed' ? COLOR_GREEN : d.status === 'Blocked' ? COLOR_RED : COLOR_AMBER;
    slide4.addShape(pptx.ShapeType.rect, {
      x: 10.6, y: yOffset + 0.25, w: 1.8, h: 0.4,
      fill: { color: statusCol + '22' },
      line: { color: statusCol, width: 1 }
    });

    slide4.addText(d.status.toUpperCase(), {
      x: 10.6, y: yOffset + 0.25, w: 1.8, h: 0.4,
      fontSize: 10, bold: true, color: statusCol, fontFace: 'Outfit',
      align: 'center', valign: 'middle'
    });
  });

  // ==========================================
  // SLIDE 5: QA Testing & Defects
  // ==========================================
  const slide5 = pptx.addSlide();
  addSlideHeader(slide5, 'QA Testing & Defect Metrics');

  // QA Summary Stats (4 cards)
  const runRate = Math.round(((qaStatus.passed + qaStatus.failed + qaStatus.blocked) / qaStatus.totalTests) * 100);
  const passRate = Math.round((qaStatus.passed / (qaStatus.passed + qaStatus.failed)) * 100);

  const qaStats = [
    { label: 'TOTAL E2E TESTS', val: qaStatus.totalTests, color: TEXT_WHITE },
    { label: 'PASSED', val: qaStatus.passed, color: COLOR_GREEN },
    { label: 'EXEC RUN RATE', val: `${runRate}%`, color: CYAN },
    { label: 'QA PASS RATE', val: `${passRate}%`, color: passRate >= 85 ? COLOR_GREEN : COLOR_AMBER }
  ];

  qaStats.forEach((s, idx) => {
    const xOffset = 0.5 + idx * 3.1;
    slide5.addShape(pptx.ShapeType.rect, {
      x: xOffset, y: 1.2, w: 2.9, h: 1.3,
      fill: { color: CARD_BG },
      line: { color: '1e293b', width: 1 }
    });

    slide5.addText(s.label, {
      x: xOffset + 0.2, y: 1.3, w: 2.5, h: 0.3,
      fontSize: 9, bold: true, color: TEXT_GRAY, fontFace: 'Outfit'
    });

    slide5.addText(String(s.val), {
      x: xOffset + 0.2, y: 1.6, w: 2.5, h: 0.7,
      fontSize: 28, bold: true, color: s.color, fontFace: 'Outfit'
    });
  });

  // Defects section header
  slide5.addText('CRITICAL & HIGH OPEN DEFECTS', {
    x: 0.5, y: 2.8, w: 6.0, h: 0.3,
    fontSize: 14, bold: true, color: CYAN, fontFace: 'Outfit'
  });

  // Filter and display key defects
  const criticalDefects = defects.filter(d => d.severity === 'Critical' || d.severity === 'High');
  
  const defectTableRows: any[][] = [
    [
      { text: 'ID', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Defect Summary', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Severity', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Domain Owner', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Status', options: { bold: true, color: CYAN, fill: { color: '050812' } } }
    ]
  ];

  criticalDefects.forEach(d => {
    defectTableRows.push([
      { text: d.id, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { text: d.title, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { 
        text: d.severity, 
        options: { color: d.severity === 'Critical' ? COLOR_RED : COLOR_AMBER, bold: true, fill: { color: CARD_BG } } 
      },
      { text: d.domain, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { text: d.status, options: { color: COLOR_AMBER, fill: { color: CARD_BG } } }
    ]);
  });

  if (criticalDefects.length > 0) {
    slide5.addTable(defectTableRows, {
      x: 0.5, y: 3.2, w: 12.3, h: 3.3,
      border: { type: 'solid', color: '1e293b', pt: 1 },
      fontSize: 10, fontFace: 'Outfit',
      align: 'left',
      valign: 'middle'
    });
  } else {
    slide5.addText('No critical/high open defects in active queues.', {
      x: 0.5, y: 3.5, w: 12.3, h: 0.5,
      fontSize: 12, color: COLOR_GREEN, fontFace: 'Outfit'
    });
  }

  // ==========================================
  // SLIDE 6: RAID Log & Risks Matrix
  // ==========================================
  const slide6 = pptx.addSlide();
  addSlideHeader(slide6, 'RAID Log (Risks, Actions, Issues, Dependencies)');

  const riskTableRows: any[][] = [
    [
      { text: 'Ref ID', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Type', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Risk Description / Trigger', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Impact', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Mitigation Plan / Action Owner', options: { bold: true, color: CYAN, fill: { color: '050812' } } },
      { text: 'Status', options: { bold: true, color: CYAN, fill: { color: '050812' } } }
    ]
  ];

  risks.forEach(r => {
    riskTableRows.push([
      { text: r.id, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { text: r.type, options: { color: PURPLE, bold: true, fill: { color: CARD_BG } } },
      { text: r.title, options: { color: TEXT_WHITE, fill: { color: CARD_BG } } },
      { 
        text: r.impact, 
        options: { color: r.impact === 'Critical' || r.impact === 'High' ? COLOR_RED : COLOR_AMBER, bold: true, fill: { color: CARD_BG } } 
      },
      { text: r.mitigation, options: { color: TEXT_GRAY, fill: { color: CARD_BG } } },
      { 
        text: r.status.toUpperCase(), 
        options: { color: r.status === 'Open' ? COLOR_RED : COLOR_GREEN, bold: true, fill: { color: CARD_BG } } 
      }
    ]);
  });

  slide6.addTable(riskTableRows, {
    x: 0.5, y: 1.5, w: 12.3, h: 5.0,
    border: { type: 'solid', color: '1e293b', pt: 1 },
    fontSize: 10, fontFace: 'Outfit',
    align: 'left',
    valign: 'middle'
  });

  // Write presentation to file
  pptx.writeFile({ fileName: 'TDM_SteerCo_Report.pptx' });
};

export const exportPOAPToPPT = (
  poapData: POAPData,
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

  const slide = pptx.addSlide();
  slide.background = { color: BG_COLOR };

  // ==========================================
  // HEADER BANNER (y: 0.2 to 1.1)
  // ==========================================
  // Header background shape
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 0.2, w: 12.33, h: 1.0,
    fill: { color: CARD_BG },
    line: { color: CYAN, width: 1 }
  });

  // Project Title & Subtitle
  slide.addText(poapData.projectName.toUpperCase(), {
    x: 0.7, y: 0.3, w: 4.0, h: 0.4,
    fontSize: 20, bold: true, color: TEXT_WHITE, fontFace: 'Outfit'
  });
  slide.addText('PLAN ON A PAGE (POAP) SUMMARY', {
    x: 0.7, y: 0.7, w: 4.0, h: 0.3,
    fontSize: 10, bold: true, color: CYAN, fontFace: 'Outfit'
  });

  // Metadata block (middle section of header)
  slide.addText([
    { text: 'PM: ', options: { bold: true, color: CYAN } },
    { text: poapData.projectManager + '   ', options: { color: TEXT_WHITE } },
    { text: 'Sponsor: ', options: { bold: true, color: CYAN } },
    { text: poapData.executiveSponsor + '\n', options: { color: TEXT_WHITE } },
    { text: 'Code: ', options: { bold: true, color: CYAN } },
    { text: poapData.projectCode + '   ', options: { color: TEXT_WHITE } },
    { text: 'Phase: ', options: { bold: true, color: CYAN } },
    { text: poapData.projectPhase + '   ', options: { color: TEXT_WHITE } },
    { text: 'Date: ', options: { bold: true, color: CYAN } },
    { text: poapData.reportingDate, options: { color: TEXT_WHITE } }
  ], {
    x: 5.0, y: 0.25, w: 4.5, h: 0.9,
    fontSize: 10, fontFace: 'Outfit', lineSpacing: 18
  });

  // RAG status indicators
  const ragKeys = ['schedule', 'budget', 'scope', 'quality', 'overall'] as const;
  ragKeys.forEach((key, idx) => {
    const xOffset = 9.8 + idx * 0.58;
    const val = ragStatus[key];
    const colorHex = getRagHex(val);

    // Label above status badge
    slide.addText(key.toUpperCase().substring(0, 3), {
      x: xOffset, y: 0.25, w: 0.5, h: 0.2,
      fontSize: 8, bold: true, color: TEXT_GRAY, fontFace: 'Outfit', align: 'center'
    });

    // RAG Status Badge indicator
    slide.addShape(pptx.ShapeType.rect, {
      x: xOffset, y: 0.48, w: 0.5, h: 0.6,
      fill: { color: colorHex + '22' },
      line: { color: colorHex, width: 1 }
    });

    slide.addText(val.toUpperCase().substring(0, 3), {
      x: xOffset, y: 0.48, w: 0.5, h: 0.6,
      fontSize: 10, bold: true, color: colorHex, fontFace: 'Outfit',
      align: 'center', valign: 'middle'
    });
  });

  // ==========================================
  // BODY COLUMNS
  // ==========================================
  // Left Column: Vision/Objectives & Scope
  // Box 1: Problem Statement & Objectives
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.35, w: 3.9, h: 1.85,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  const objectivesText = poapData.objectives.map(o => `• ${o}`).join('\n');
  slide.addText([
    { text: 'VISION & STRATEGIC OBJECTIVES', options: { fontSize: 11, bold: true, color: PURPLE, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: poapData.problemStatement, options: { fontSize: 8.5, color: TEXT_WHITE, italic: true, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: objectivesText, options: { fontSize: 8.5, color: TEXT_GRAY } }
  ], {
    x: 0.65, y: 1.45, w: 3.6, h: 1.65,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 13
  });

  // Box 2: Scope (In/Out)
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 3.35, w: 3.9, h: 1.85,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  slide.addText('PROJECT SCOPE', {
    x: 0.65, y: 3.45, w: 3.6, h: 0.2,
    fontSize: 11, bold: true, color: COLOR_GREEN, fontFace: 'Outfit'
  });
  
  const inScopeText = poapData.inScope.slice(0, 4).map(s => `✓ ${s}`).join('\n');
  slide.addText([
    { text: '✓ IN SCOPE', options: { fontSize: 9, bold: true, color: COLOR_GREEN, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: inScopeText, options: { fontSize: 8, color: TEXT_WHITE } }
  ], {
    x: 0.65, y: 3.75, w: 1.7, h: 1.35,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 12
  });

  const outOfScopeText = poapData.outOfScope.slice(0, 4).map(s => `✗ ${s}`).join('\n');
  slide.addText([
    { text: '✗ OUT OF SCOPE', options: { fontSize: 9, bold: true, color: COLOR_AMBER, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: outOfScopeText, options: { fontSize: 8, color: TEXT_WHITE } }
  ], {
    x: 2.5, y: 3.75, w: 1.7, h: 1.35,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 12
  });

  // Middle Column: Success Criteria, Assumptions, Risks, Dependencies
  // Box 3: Success Criteria & Assumptions
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.6, y: 1.35, w: 3.9, h: 1.85,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  const criteriaText = poapData.successCriteria.slice(0, 3).map(c => `• ${c}`).join('\n');
  const assumptionsText = poapData.assumptions.slice(0, 3).map(a => `• ${a}`).join('\n');
  slide.addText([
    { text: 'SUCCESS CRITERIA & ASSUMPTIONS', options: { fontSize: 11, bold: true, color: CYAN, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: 'SUCCESS CRITERIA', options: { fontSize: 9, bold: true, color: COLOR_GREEN, breakLine: true } },
    { text: criteriaText, options: { fontSize: 8, color: TEXT_WHITE, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'KEY ASSUMPTIONS', options: { fontSize: 9, bold: true, color: TEXT_GRAY, breakLine: true } },
    { text: assumptionsText, options: { fontSize: 8, color: TEXT_WHITE } }
  ], {
    x: 4.75, y: 1.45, w: 3.6, h: 1.65,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 12
  });

  // Box 4: Key Risks & Dependencies
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.6, y: 3.35, w: 3.9, h: 1.85,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  const risksText = poapData.keyRisks.slice(0, 3).map(r => `• ${r}`).join('\n');
  const dependenciesText = poapData.dependencies.slice(0, 3).map(d => `• ${d}`).join('\n');
  slide.addText([
    { text: 'KEY RISKS & DEPENDENCIES', options: { fontSize: 11, bold: true, color: COLOR_AMBER, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: 'TOP RISKS', options: { fontSize: 9, bold: true, color: COLOR_RED, breakLine: true } },
    { text: risksText, options: { fontSize: 8, color: TEXT_WHITE, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'DEPENDENCIES', options: { fontSize: 9, bold: true, color: PURPLE, breakLine: true } },
    { text: dependenciesText, options: { fontSize: 8, color: TEXT_WHITE } }
  ], {
    x: 4.75, y: 3.45, w: 3.6, h: 1.65,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 12
  });

  // Right Column: Budget, Stakeholders, Next Steps
  // Box 5: Budget Summary
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.7, y: 1.35, w: 4.1, h: 1.25,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  const variance = poapData.totalBudget - poapData.forecastToComplete;
  slide.addText([
    { text: 'BUDGET SUMMARY', options: { fontSize: 10, bold: true, color: COLOR_AMBER, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: 'Total Budget: ', options: { fontSize: 8.5, bold: true, color: TEXT_GRAY } },
    { text: `$${poapData.totalBudget.toLocaleString()}   `, options: { fontSize: 8.5, color: TEXT_WHITE } },
    { text: 'Spent to Date: ', options: { fontSize: 8.5, bold: true, color: TEXT_GRAY } },
    { text: `$${poapData.spentToDate.toLocaleString()}`, options: { fontSize: 8.5, color: TEXT_WHITE, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'Forecast: ', options: { fontSize: 8.5, bold: true, color: TEXT_GRAY } },
    { text: `$${poapData.forecastToComplete.toLocaleString()}   `, options: { fontSize: 8.5, color: TEXT_WHITE } },
    { text: 'Variance: ', options: { fontSize: 8.5, bold: true, color: TEXT_GRAY } },
    { text: `$${variance.toLocaleString()}`, options: { fontSize: 8.5, color: variance >= 0 ? COLOR_GREEN : COLOR_RED, bold: true } }
  ], {
    x: 8.85, y: 1.45, w: 3.8, h: 1.05,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 15
  });

  // Box 6: Stakeholders
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.7, y: 2.7, w: 4.1, h: 1.2,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  const stakeholdersText = poapData.stakeholders.slice(0, 3).map(s => `• ${s.name} (${s.role}) - ${s.engagement}`).join('\n');
  slide.addText([
    { text: 'KEY STAKEHOLDERS', options: { fontSize: 10, bold: true, color: CYAN, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: stakeholdersText, options: { fontSize: 8, color: TEXT_WHITE } }
  ], {
    x: 8.85, y: 2.8, w: 3.8, h: 1.0,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 13
  });

  // Box 7: Next Steps
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.7, y: 4.0, w: 4.1, h: 1.2,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 }
  });
  const actionsText = poapData.nextActions.slice(0, 3).map(a => `• ${a.description} [${a.owner} - ${a.dueDate}]`).join('\n');
  slide.addText([
    { text: 'NEXT STEPS & ACTIONS', options: { fontSize: 10, bold: true, color: PURPLE, breakLine: true } },
    { text: ' ', options: { fontSize: 4, breakLine: true } },
    { text: actionsText, options: { fontSize: 8, color: TEXT_WHITE } }
  ], {
    x: 8.85, y: 4.1, w: 3.8, h: 1.0,
    fontFace: 'Outfit', valign: 'top', lineSpacing: 13
  });

  // ==========================================
  // BOTTOM ROW: TIMELINE & KEY MILESTONES (y: 5.35 to 7.15)
  // ==========================================
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 5.35, w: 12.3, h: 1.8,
    fill: { color: CARD_BG },
    line: { color: CYAN, width: 1 }
  });
  slide.addText('KEY MILESTONES & TIMELINE', {
    x: 0.65, y: 5.45, w: 5.0, h: 0.3,
    fontSize: 11, bold: true, color: CYAN, fontFace: 'Outfit'
  });

  // Horizontal line for timeline
  slide.addShape(pptx.ShapeType.line, {
    x: 1.5, y: 6.25, w: 10.3, h: 0,
    line: { color: '1E293B', width: 2 }
  });

  const totalMs = poapData.milestones.length;
  if (totalMs > 0) {
    poapData.milestones.slice(0, 6).forEach((m, idx) => {
      // Calculate position
      const xPos = 1.5 + (idx * (10.3 / Math.max(1, totalMs - 1)));
      
      const statusColor = m.status === 'Completed' ? COLOR_GREEN : m.status === 'In Progress' ? CYAN : TEXT_GRAY;
      
      // Node point (torus or circle)
      slide.addShape(pptx.ShapeType.ellipse, {
        x: xPos - 0.065, y: 6.185, w: 0.13, h: 0.13,
        fill: { color: statusColor },
        line: { color: BG_COLOR, width: 1.5 }
      });

      // Name & Date Labels (alternating top/bottom or just top and bottom aligned)
      const isTop = idx % 2 === 0;
      const yText = isTop ? 5.75 : 6.45;

      // Small line connecting to the dot
      slide.addShape(pptx.ShapeType.line, {
        x: xPos, y: isTop ? 5.95 : 6.25, w: 0, h: 0.3,
        line: { color: statusColor, width: 1, dashType: 'dash' }
      });

      slide.addText(`${m.name}\n${m.date}`, {
        x: xPos - 0.75, y: yText, w: 1.5, h: 0.45,
        fontSize: 7.5, bold: true, color: TEXT_WHITE, fontFace: 'Outfit',
        align: 'center', lineSpacing: 10, valign: 'top'
      });
    });
  }

  pptx.writeFile({ fileName: 'TDM_POAP.pptx' });
};
