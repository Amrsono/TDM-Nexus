import * as XLSX from 'xlsx';
import { 
  ProjectFinancials, 
  Requirement, 
  DomainBuild, 
  FinancialAllocation, 
  FundTransfer, 
  QAStatus, 
  Defect, 
  RiskIssue 
} from './mockData';

export const exportToExcel = (
  financials: ProjectFinancials,
  requirements: Requirement[],
  domains: DomainBuild[],
  allocations: FinancialAllocation[],
  transfers: FundTransfer[],
  qaStatus: QAStatus,
  defects: Defect[],
  risks: RiskIssue[]
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Project Overview & Finances
  const overviewData = [
    { Parameter: 'Project Name', Value: 'Project Velocity (eSIM & Carrier Billing Launch)' },
    { Parameter: 'Current Phase', Value: 'Testing & QA Integration' },
    { Parameter: 'Business Case Summary', Value: 'Launch the new Unified Mobile & Digital Proposition platform, enabling instant eSIM activation and carrier-billing. Estimated benefit: $12.5M over 5 years.' },
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
    { Parameter: 'Remaining Variance Budget', Value: `$${(financials.capexLimit + financials.opexLimit - financials.totalSpent).toLocaleString()}` }
  ];
  const wsOverview = XLSX.utils.json_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Project Overview');

  // Sheet 2: Domain Finance Breakdown
  const financeBreakdown = allocations.map(a => ({
    'Domain Name': a.domainName,
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
  XLSX.utils.book_append_sheet(wb, wsFinance, 'Domain Finances');

  // Sheet 3: Budget Transfers
  const transferData = transfers.map(t => ({
    'Transfer ID': t.id,
    'Source Domain': t.fromDomain,
    'Target Domain': t.toDomain,
    'Amount ($)': t.amount,
    'Reason/Justification': t.reason,
    'Date Requested': t.date,
    'Approval Status': t.status
  }));
  const wsTransfers = XLSX.utils.json_to_sheet(transferData);
  XLSX.utils.book_append_sheet(wb, wsTransfers, 'Budget Transfers');

  // Sheet 4: Requirements Backlog
  const reqData = requirements.map(r => ({
    'Requirement ID': r.id,
    'Title': r.title,
    'Type': r.type,
    'Priority': r.priority,
    'Approval Status': r.status,
    'Impacted System Domain': r.domain
  }));
  const wsReq = XLSX.utils.json_to_sheet(reqData);
  XLSX.utils.book_append_sheet(wb, wsReq, 'Requirements Backlog');

  // Sheet 5: Build & Release Tracker
  const buildData = domains.map(d => ({
    'Domain Name': d.name,
    'Lead Engineer': d.lead,
    'Build Progress (%)': d.progress,
    'Status': d.status,
    'Release Version': d.releaseVersion,
    'Scope Details': d.description
  }));
  const wsBuild = XLSX.utils.json_to_sheet(buildData);
  XLSX.utils.book_append_sheet(wb, wsBuild, 'Build & Releases');

  // Sheet 6: QA Metrics & Defects
  const qaOverview = [
    { Metric: 'Total Tests Planned', Count: qaStatus.totalTests },
    { Metric: 'Tests Passed', Count: qaStatus.passed },
    { Metric: 'Tests Failed', Count: qaStatus.failed },
    { Metric: 'Tests Blocked', Count: qaStatus.blocked },
    { Metric: 'Execution Run Rate (%)', Count: Math.round(((qaStatus.passed + qaStatus.failed + qaStatus.blocked) / qaStatus.totalTests) * 100) },
    { Metric: 'Defect Pass Rate (%)', Count: Math.round((qaStatus.passed / (qaStatus.passed + qaStatus.failed)) * 100) }
  ];
  const wsQA = XLSX.utils.json_to_sheet(qaOverview);
  XLSX.utils.book_append_sheet(wb, wsQA, 'QA Overview');

  const defectData = defects.map(d => ({
    'Defect ID': d.id,
    'Title': d.title,
    'Severity': d.severity,
    'Status': d.status,
    'Domain Owner': d.domain,
    'Detailed Description': d.description
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

  // Write workbook to file
  XLSX.writeFile(wb, 'TDM_Nexus_Project_Report.xlsx');
};
