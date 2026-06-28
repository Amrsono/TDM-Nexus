import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { WalkthroughData } from './mockData';

export const exportWalkthroughToExcel = (data: WalkthroughData) => {
  const wb = XLSX.utils.book_new();

  // Create a 2D array representing the report
  const reportData = [
    ['E2E Demand Journey - Project Walkthrough Report'],
    [''],
    ['--- 1. FUNNEL PHASE ---'],
    ['Epic Name', data.epicName],
    ['Idea Description', data.ideaDescription],
    ['Portfolio', data.portfolio],
    ['Resource Assessment', data.resourceAssessment],
    [''],
    ['--- 2. REVIEWING PHASE ---'],
    ['Impact Assessment Done?', data.impactAssessmentDone ? 'Yes' : 'No'],
    ['High-Level Business Case', data.highLevelBusinessCase],
    ['VVROM Created?', data.vvromCreated ? 'Yes' : 'No'],
    ['LRP Updated?', data.lrpUpdated ? 'Yes' : 'No'],
    ['Mobilization Plan', data.mobilizationPlan],
    ['Stop/Go Decision', data.stopGoDecision],
    [''],
    ['--- 3. ANALYSING PHASE ---'],
    ['BRS Signed Off?', data.brsSignedOff ? 'Yes' : 'No'],
    ['HLDs Started?', data.hldStarted ? 'Yes' : 'No'],
    ['TIL Specs Complete?', data.tilSpecsComplete ? 'Yes' : 'No'],
    ['Timeline (Weeks)', data.timelineWeeks],
    [''],
    ['--- 4. IMPLEMENTING PHASE ---'],
    ['MVP Build Status', data.mvpBuildStatus],
    ['SIT Testing', data.sitTesting ? 'Complete' : 'Pending'],
    ['UAT Testing', data.uatTesting ? 'Complete' : 'Pending'],
    ['PAT Testing', data.patTesting ? 'Complete' : 'Pending'],
    ['CJT Testing', data.cjtTesting ? 'Complete' : 'Pending'],
    ['Commercial Go/No-Go', data.commercialGoNoGo],
    [''],
    ['--- 5. POST LAUNCH PHASE ---'],
    ['ELS Active?', data.elsActive ? 'Yes' : 'No'],
    ['P1/P2 Defects Remaining', data.p1p2DefectsRemaining],
    ['Retrospective Notes', data.retrospectiveNotes]
  ];

  const ws = XLSX.utils.aoa_to_sheet(reportData);
  
  // Basic column width adjustment
  ws['!cols'] = [{ wch: 30 }, { wch: 60 }];

  XLSX.utils.book_append_sheet(wb, ws, 'Walkthrough Report');
  
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Walkthrough_Report_${timestamp}.xlsx`);
};

export const exportWalkthroughToPPT = (data: WalkthroughData) => {
  const pres = new pptxgen();

  pres.author = 'TDM Nexus';
  pres.company = 'Vodafone';
  pres.subject = 'Digital Compass Walkthrough Report';
  pres.title = `${data.epicName} - Walkthrough Report`;

  // Master Slide Definition
  pres.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: 'FFFFFF' },
    objects: [
      { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: 'E60000' } } },
      { text: { text: 'Digital Compass Guide - Project Status', options: { x: 0.5, y: 0.1, w: 9, h: 0.6, fontSize: 18, color: 'FFFFFF', bold: true } } }
    ],
    slideNumber: { x: 9.5, y: 5.2, fontSize: 12, color: '888888' }
  });

  // Title Slide
  const slide1 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide1.addText(data.epicName || 'Project Walkthrough Report', { x: 1, y: 2, w: 8, fontSize: 32, bold: true, color: 'E60000', align: 'center' });
  slide1.addText(data.ideaDescription || 'No description provided.', { x: 1, y: 3, w: 8, fontSize: 16, color: '333333', align: 'center' });
  slide1.addText(`Portfolio: ${data.portfolio}`, { x: 1, y: 4, w: 8, fontSize: 14, color: '666666', align: 'center' });

  // Slide 2: Funnel & Reviewing
  const slide2 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide2.addText('Phase 1 & 2: Funnel & Reviewing', { x: 0.5, y: 1, w: 9, fontSize: 22, bold: true, color: '333333' });
  
  const tableData1: any[] = [
    [{ text: 'Metric', options: { bold: true, fill: { color: 'F0F0F0' } } }, { text: 'Status/Value', options: { bold: true, fill: { color: 'F0F0F0' } } }],
    ['Resource Assessment', data.resourceAssessment],
    ['Impact Assessment', data.impactAssessmentDone ? 'Done' : 'Pending'],
    ['VVROM Created', data.vvromCreated ? 'Yes' : 'No'],
    ['LRP Updated', data.lrpUpdated ? 'Yes' : 'No'],
    ['Stop/Go Decision', data.stopGoDecision],
  ];
  
  slide2.addTable(tableData1, { x: 0.5, y: 1.6, w: 9, colW: [3, 6], border: { type: 'solid', color: 'CCCCCC' } });
  slide2.addText('Business Case:', { x: 0.5, y: 4.2, fontSize: 14, bold: true, color: '333333' });
  slide2.addText(data.highLevelBusinessCase || 'N/A', { x: 0.5, y: 4.5, w: 9, h: 1, fontSize: 12, color: '666666' });

  // Slide 3: Analysing & Implementing
  const slide3 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide3.addText('Phase 3 & 4: Analysing & Implementing', { x: 0.5, y: 1, w: 9, fontSize: 22, bold: true, color: '333333' });

  const tableData2: any[] = [
    [{ text: 'Metric', options: { bold: true, fill: { color: 'F0F0F0' } } }, { text: 'Status/Value', options: { bold: true, fill: { color: 'F0F0F0' } } }],
    ['BRS Signed Off', data.brsSignedOff ? 'Yes' : 'No'],
    ['HLDs Started', data.hldStarted ? 'Yes' : 'No'],
    ['TIL Specs Complete', data.tilSpecsComplete ? 'Yes' : 'No'],
    ['Timeline (Weeks)', String(data.timelineWeeks)],
    ['MVP Build Status', data.mvpBuildStatus],
    ['Testing (SIT/UAT/PAT/CJT)', `${data.sitTesting?'Y':'N'}/${data.uatTesting?'Y':'N'}/${data.patTesting?'Y':'N'}/${data.cjtTesting?'Y':'N'}`],
    ['Commercial Go/No-Go', data.commercialGoNoGo],
  ];
  slide3.addTable(tableData2, { x: 0.5, y: 1.6, w: 9, colW: [3, 6], border: { type: 'solid', color: 'CCCCCC' } });

  // Slide 4: Post Launch
  const slide4 = pres.addSlide({ masterName: 'MASTER_SLIDE' });
  slide4.addText('Phase 5: Post Launch', { x: 0.5, y: 1, w: 9, fontSize: 22, bold: true, color: '333333' });
  
  const tableData3: any[] = [
    [{ text: 'Metric', options: { bold: true, fill: { color: 'F0F0F0' } } }, { text: 'Status/Value', options: { bold: true, fill: { color: 'F0F0F0' } } }],
    ['Early Life Support (ELS)', data.elsActive ? 'Active' : 'Inactive'],
    ['P1/P2 Defects Remaining', String(data.p1p2DefectsRemaining)],
  ];
  slide4.addTable(tableData3, { x: 0.5, y: 1.6, w: 9, colW: [3, 6], border: { type: 'solid', color: 'CCCCCC' } });
  
  slide4.addText('Retrospective Notes:', { x: 0.5, y: 3.2, fontSize: 14, bold: true, color: '333333' });
  slide4.addText(data.retrospectiveNotes || 'No notes provided.', { x: 0.5, y: 3.5, w: 9, h: 1.5, fontSize: 12, color: '666666' });

  // Generate & Save
  const timestamp = new Date().toISOString().split('T')[0];
  pres.writeFile({ fileName: `Walkthrough_Report_${timestamp}.pptx` });
};
