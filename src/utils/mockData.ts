export interface ProjectFinancials {
  NPV: number;
  IRR: number;
  paybackPeriod: number;
  capexLimit: number;
  opexLimit: number;
  totalSpent: number;
  vromApproved: boolean;
  peDemandSized: boolean;
  itrbApproved: boolean;
  icarStatus: 'Pending' | 'Approved' | 'Not Required';
}

export interface ADOWorkItem {
  id: string;
  type: 'Epic' | 'Feature' | 'Delivery' | 'Function';
  title: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Committed' | 'In Progress' | 'Ready to Deploy' | 'Deployed';
  portfolio: string;
}

export interface PortfolioSquad {
  id: string;
  name: string; // e.g., P&C, Mobile, HBB & DOPs, VF Business, Raptors, Care Bears
  lead: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
  targetRelease: string; // e.g., CCS 26.6
  description: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface FinancialAllocation {
  squadId: string;
  squadName: string;
  capexAllocated: number;
  capexSpent: number;
  capexForecast: number;
  opexAllocated: number;
  opexSpent: number;
  opexForecast: number;
}

export interface ForecastMonth {
  month: string;
  capexForecast: number;
  capexActual: number;
  opexForecast: number;
  opexActual: number;
}

export interface FundTransfer {
  id: string;
  fromSquad: string;
  toSquad: string;
  amount: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface QAGate {
  name: 'SIT' | 'UAT' | 'PAT' | 'OAT' | 'PEN' | 'CJT' | 'DVT';
  status: 'Not Started' | 'In Progress' | 'Passed' | 'Failed';
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
}

export interface Defect {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'New' | 'In Progress' | 'Retesting' | 'Closed';
  squad: string;
  phase: 'SIT' | 'UAT' | 'PAT' | 'OAT' | 'PEN' | 'CJT' | 'DVT' | 'Hypercare';
  description: string;
}

export interface RiskIssue {
  id: string;
  type: 'Risk' | 'Issue' | 'Dependency';
  title: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  mitigation: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface ChecklistItem {
  id: string;
  category: 'CP0' | 'RPM' | 'CP1' | 'CP2' | 'Go-Live';
  item: string;
  checked: boolean;
  owner: string;
}

export interface HypercareTicket {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Open' | 'Investigating' | 'Resolved';
  reportedAt: string;
  slaMinutes: number;
}

export const initialFinancials: ProjectFinancials = {
  NPV: 6420000,
  IRR: 28.6,
  paybackPeriod: 2.1,
  capexLimit: 3200000,
  opexLimit: 950000,
  totalSpent: 1980000,
  vromApproved: true,
  peDemandSized: true,
  itrbApproved: false,
  icarStatus: 'Pending'
};

export const initialADOWorkItems: ADOWorkItem[] = [
  { id: 'EPIC-101', type: 'Epic', title: 'Digital Sales Transformation', status: 'Approved', portfolio: 'P&C' },
  { id: 'FEAT-201', type: 'Feature', title: 'MVO iPhone Upgrade Journey', status: 'In Review', portfolio: 'MVO (eShop)' },
  { id: 'DEL-301', type: 'Delivery', title: 'CCS 26.6 Drop', status: 'Committed', portfolio: 'MVO (eShop)' },
  { id: 'FUNC-401', type: 'Function', title: 'eShop Cart Component API', status: 'In Progress', portfolio: 'CARTman' }
];

export const initialSquads: PortfolioSquad[] = [
  { id: 'sq-1', name: 'Raptors (MVO)', lead: 'Sarah Jenkins', progress: 85, status: 'In Progress', targetRelease: 'CCS 26.6', description: 'Digital eShop sales journeys.' },
  { id: 'sq-2', name: 'MVA-Alex (MVA)', lead: 'David Chen', progress: 72, status: 'In Progress', targetRelease: 'CCS 26.6A', description: 'My Vodafone App core experience.' },
  { id: 'sq-3', name: 'Care Bears (eCare)', lead: 'Elena Rostova', progress: 50, status: 'In Progress', targetRelease: 'CCS 26.8', description: 'Customer self-service portal.' },
  { id: 'sq-4', name: 'TOBi Nova', lead: 'Marcus Brody', progress: 30, status: 'Blocked', targetRelease: 'SD 26.10', description: 'Chatbot intent handling.' },
  { id: 'sq-5', name: 'Gravity (Platform)', lead: 'Aaron Vance', progress: 100, status: 'Completed', targetRelease: 'CCS 26.4', description: 'Shared platform integrations.' }
];

export const initialMilestones: Milestone[] = [
  { id: 'ms-1', name: 'CP0 - Release Ready', date: '2026-05-15', status: 'Completed' },
  { id: 'ms-2', name: 'RPM - Release Planning Meeting', date: '2026-06-01', status: 'Completed' },
  { id: 'ms-3', name: 'CP1 - Build Scope Freeze', date: '2026-07-10', status: 'In Progress' },
  { id: 'ms-4', name: 'CP2 - Final Scope Freeze', date: '2026-08-20', status: 'Not Started' },
  { id: 'ms-5', name: 'SIT Start', date: '2026-08-15', status: 'Not Started' },
  { id: 'ms-6', name: 'Go-Live (Commercial Launch)', date: '2026-09-01', status: 'Not Started' }
];

export const initialAllocations: FinancialAllocation[] = [
  { squadId: 'sq-1', squadName: 'Raptors (MVO)', capexAllocated: 800000, capexSpent: 620000, capexForecast: 790000, opexAllocated: 200000, opexSpent: 150000, opexForecast: 195000 },
  { squadId: 'sq-2', squadName: 'MVA-Alex (MVA)', capexAllocated: 900000, capexSpent: 590000, capexForecast: 880000, opexAllocated: 250000, opexSpent: 180000, opexForecast: 240000 },
  { squadId: 'sq-3', squadName: 'Care Bears (eCare)', capexAllocated: 600000, capexSpent: 300000, capexForecast: 610000, opexAllocated: 200000, opexSpent: 90000, opexForecast: 190000 }
];

export const initialForecastMonths: ForecastMonth[] = [
  { month: 'Jan', capexForecast: 180000, capexActual: 170000, opexForecast: 50000, opexActual: 46000 },
  { month: 'Feb', capexForecast: 220000, capexActual: 215000, opexForecast: 60000, opexActual: 58000 }
];

export const initialTransfers: FundTransfer[] = [
  { id: 'TX-101', fromSquad: 'Gravity (Platform)', toSquad: 'Raptors (MVO)', amount: 45000, reason: 'ICAR uplift approved for extra test coverage.', date: '2026-05-18', status: 'Approved' }
];

export const initialQAGates: QAGate[] = [
  { name: 'SIT', status: 'In Progress', totalTests: 250, passed: 150, failed: 20, blocked: 10 },
  { name: 'UAT', status: 'Not Started', totalTests: 120, passed: 0, failed: 0, blocked: 0 },
  { name: 'PAT', status: 'In Progress', totalTests: 80, passed: 40, failed: 5, blocked: 0 },
  { name: 'OAT', status: 'Not Started', totalTests: 50, passed: 0, failed: 0, blocked: 0 },
  { name: 'PEN', status: 'Not Started', totalTests: 30, passed: 0, failed: 0, blocked: 0 },
  { name: 'CJT', status: 'Not Started', totalTests: 100, passed: 0, failed: 0, blocked: 0 },
  { name: 'DVT', status: 'Not Started', totalTests: 20, passed: 0, failed: 0, blocked: 0 }
];

export const initialDefects: Defect[] = [
  { id: 'DEF-001', title: 'Cart sync failure on iOS', severity: 'P1', status: 'In Progress', squad: 'Raptors (MVO)', phase: 'SIT', description: 'Items do not persist across sessions.' },
  { id: 'DEF-002', title: 'Slow response in identity verification', severity: 'P2', status: 'New', squad: 'Gravity (Platform)', phase: 'PAT', description: 'Latency > 200ms.' }
];

export const initialRisks: RiskIssue[] = [
  { id: 'RSK-01', type: 'Risk', title: 'VES Environment connectivity', impact: 'High', mitigation: 'Engage VES team for stubbing.', status: 'Open' }
];

export const initialChecklist: ChecklistItem[] = [
  { id: 'chk-1', category: 'CP0', item: 'E2E HLD and VROMs signed off', checked: true, owner: 'TDM' },
  { id: 'chk-2', category: 'RPM', item: 'Test Assessment completed', checked: false, owner: 'SIT Manager' },
  { id: 'chk-3', category: 'CP1', item: 'Build Scope Frozen', checked: false, owner: 'TDM' }
];

export const initialHypercare: HypercareTicket[] = [
  { id: 'HYP-01', title: 'Order failure spike', severity: 'P2', status: 'Investigating', reportedAt: '2026-09-02T09:15:00', slaMinutes: 120 }
];

// ─── POAP (Plan on a Page) Data ─────────────────────────────────────────────

export interface POAPStakeholder {
  id: string;
  name: string;
  role: string;
  engagement: 'Accountable' | 'Consulted' | 'Informed';
}

export interface POAPMilestone {
  id: string;
  name: string;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface POAPAction {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
}

export interface POAPData {
  projectName: string;
  projectCode: string;
  projectManager: string;
  executiveSponsor: string;
  reportingDate: string;
  projectPhase: string;
  piIncrement: string;
  
  problemStatement: string;
  objectives: string[];
  inScope: string[];
  outOfScope: string[];
  assumptions: string[];
  totalBudget: number;
  spentToDate: number;
  forecastToComplete: number;
  milestones: POAPMilestone[];
  keyRisks: string[];
  stakeholders: POAPStakeholder[];
  successCriteria: string[];
  dependencies: string[];
  nextActions: POAPAction[];
}

export const initialPOAPData: POAPData = {
  projectName: 'Digital Sales Transformation',
  projectCode: 'PRJ-2026-DST',
  projectManager: 'Aaron Vance',
  executiveSponsor: 'CTO',
  reportingDate: new Date().toISOString().split('T')[0],
  projectPhase: 'Implementing',
  piIncrement: 'PI40',
  problemStatement: 'Legacy ordering systems cannot handle new digital channels volume.',
  objectives: ['Launch new digital checkout by Q3', 'Deliver $12.5M NPV benefit'],
  inScope: ['MVO checkout update', 'MVA core flow update'],
  outOfScope: ['Physical store POS updates'],
  assumptions: ['VES test environments will be stable'],
  totalBudget: 4150000,
  spentToDate: 1980000,
  forecastToComplete: 2050000,
  milestones: [
    { id: 'pm-1', name: 'PI40 Planning Event', date: '2026-02-15', status: 'Completed' },
    { id: 'pm-2', name: 'MVP Build Complete', date: '2026-05-10', status: 'Completed' },
  ],
  keyRisks: ['SIT delays due to environment constraints'],
  stakeholders: [
    { id: 'st-1', name: 'Aaron Vance', role: 'TPM', engagement: 'Accountable' },
  ],
  successCriteria: ['Zero P1/P2 defects at Go-Live'],
  dependencies: ['Billing & Rating API updates (Mobile Portfolio)'],
  nextActions: [
    { id: 'na-1', description: 'Raise ICAR request for UAT funding', owner: 'Aaron Vance', dueDate: '2026-06-28' },
  ],
};
