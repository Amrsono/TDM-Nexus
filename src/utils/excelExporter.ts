import * as XLSX from 'xlsx';
import { 
  ProjectFinancials, 
  ADOWorkItem, 
  PortfolioSquad, 
  FinancialAllocation, 
  FundTransfer, 
  QAGate, 
  Defect, 
  RiskIssue 
} from './mockData';

export const exportToExcel = (
  financials: ProjectFinancials,
  adoWorkItems: ADOWorkItem[],
  squads: PortfolioSquad[],
  allocations: FinancialAllocation[],
  transfers: FundTransfer[],
  qaGates: QAGate[],
  defects: Defect[],
  risks: RiskIssue[],
  aiAnalysis: string
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Project Overview & Finances
  const overviewData = [
    { Parameter: 'Project Name', Value: 'Project Velocity' },
    { Parameter: 'Current Phase', Value: 'Funnel & Mobilisation' },
    { Parameter: '', Value: '' },
    { Parameter: 'FINANCIAL VIABILITY INDICATORS', Value: '' },
    { Parameter: 'Net Present Value (NPV)', Value: `$${financials.NPV.toLocaleString()}` },
    { Parameter: 'Internal Rate of Return (IRR)', Value: `${financials.IRR}%` },
    { Parameter: 'Payback Period (Years)', Value: financials.paybackPeriod },
    { Parameter: '', Value: '' },
    { Parameter: 'BUDGET CEILINGS', Value: '' },
    { Parameter: 'Total CAPEX Allocated Limit', Value: `$${financials.capexLimit.toLocaleString()}` },
    { Parameter: 'Total OPEX Allocated Limit', Value: `$${financials.opexLimit.toLocaleString()}` },
    { Parameter: 'Total Combined Budget Spent', Value: `$${financials.totalSpent.toLocaleString()}` },
    { Parameter: 'Remaining Variance Budget', Value: `$${(financials.capexLimit + financials.opexLimit - financials.totalSpent).toLocaleString()}` },
    { Parameter: '', Value: '' },
    { Parameter: 'APPROVAL STATUS', Value: '' },
    { Parameter: 'PE Demand Sized', Value: financials.peDemandSized ? 'Yes' : 'No' },
    { Parameter: 'VROM Approved', Value: financials.vromApproved ? 'Yes' : 'No' },
    { Parameter: 'ITRB Approved', Value: financials.itrbApproved ? 'Yes' : 'No' },
    { Parameter: 'ICAR Status', Value: financials.icarStatus }
  ];
  const wsOverview = XLSX.utils.json_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Project Overview');

  // Sheet 2: Domain Finance Breakdown
  const financeBreakdown = allocations.map(a => ({
    'Squad / Portfolio Name': a.squadName,
    'CAPEX Allocated': a.capexAllocated,
    'CAPEX Spent': a.capexSpent,
    'CAPEX Forecast': a.capexForecast,
    'CAPEX Variance': a.capexAllocated - a.capexSpent,
    'OPEX Allocated': a.opexAllocated,
    'OPEX Spent': a.opexSpent,
    'OPEX Forecast': a.opexForecast,
    'OPEX Variance': a.opexAllocated - a.opexSpent,
  }));
  const wsFinance = XLSX.utils.json_to_sheet(financeBreakdown);
  XLSX.utils.book_append_sheet(wb, wsFinance, 'Squad Finances');

  // Sheet 3: Budget Transfers
  const transferData = transfers.map(t => ({
    'Transfer ID': t.id,
    'Source Squad': t.fromSquad,
    'Target Squad': t.toSquad,
    'Amount ($)': t.amount,
    'Reason/Justification': t.reason,
    'Date Requested': t.date,
    'Approval Status': t.status
  }));
  const wsTransfers = XLSX.utils.json_to_sheet(transferData);
  XLSX.utils.book_append_sheet(wb, wsTransfers, 'Fund Transfers');

  // Sheet 4: Requirements Backlog -> ADO Work Items
  const reqData = adoWorkItems.map(r => ({
    'ADO ID': r.id,
    'Type': r.type,
    'Title': r.title,
    'Status': r.status,
    'Portfolio': r.portfolio
  }));
  const wsReq = XLSX.utils.json_to_sheet(reqData);
  XLSX.utils.book_append_sheet(wb, wsReq, 'ADO Work Items');

  // Sheet 5: Build & Release Tracker -> Squads
  const buildData = squads.map(s => ({
    'Squad / Portfolio': s.name,
    'Lead': s.lead,
    'Progress (%)': s.progress,
    'Status': s.status,
    'Target Release': s.targetRelease,
    'Description': s.description
  }));
  const wsBuild = XLSX.utils.json_to_sheet(buildData);
  XLSX.utils.book_append_sheet(wb, wsBuild, 'Portfolio Squads');

  // Sheet 6: QA Metrics & Defects
  const qaOverview = qaGates.map(g => ({
    Gate: g.name,
    Status: g.status,
    'Total Tests': g.totalTests,
    'Passed': g.passed,
    'Failed': g.failed,
    'Blocked': g.blocked,
    'Pass Rate (%)': g.totalTests > 0 ? Math.round((g.passed / g.totalTests) * 100) : 0
  }));
  const wsQA = XLSX.utils.json_to_sheet(qaOverview);
  XLSX.utils.book_append_sheet(wb, wsQA, 'QA Gates');

  const defectData = defects.map(d => ({
    'Defect ID': d.id,
    'Title': d.title,
    'Severity': d.severity,
    'Status': d.status,
    'Squad': d.squad,
    'Phase': d.phase,
    'Description': d.description
  }));
  const wsDefects = XLSX.utils.json_to_sheet(defectData);
  XLSX.utils.book_append_sheet(wb, wsDefects, 'Defects Log');

  // Sheet 7: Governance & RAID
  const raidData = risks.map(r => ({
    'Reference ID': r.id,
    'Type': r.type,
    'Title': r.title,
    'Impact Level': r.impact,
    'Mitigation Strategy': r.mitigation,
    'Status': r.status
  }));
  const wsRaid = XLSX.utils.json_to_sheet(raidData);
  XLSX.utils.book_append_sheet(wb, wsRaid, 'RAID Log');

  // Sheet 8: AI Analysis
  const aiData = [
    { 'AI Analysis & Recommendations': aiAnalysis }
  ];
  const wsAI = XLSX.utils.json_to_sheet(aiData);
  XLSX.utils.book_append_sheet(wb, wsAI, 'AI Analysis');

  // Write workbook to file
  XLSX.writeFile(wb, 'TDM_Nexus_Project_Report.xlsx');
};
