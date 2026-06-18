export interface ProjectFinancials {
  NPV: number;
  IRR: number;
  paybackPeriod: number;
  capexLimit: number;
  opexLimit: number;
  totalSpent: number;
}

export interface Requirement {
  id: string;
  title: string;
  type: 'Functional' | 'Non-Functional';
  priority: 'P1' | 'P2' | 'P3';
  status: 'Draft' | 'In Review' | 'Approved';
  domain: string;
}

export interface DomainBuild {
  id: string;
  name: string;
  lead: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
  releaseVersion: string;
  description: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface FinancialAllocation {
  domainId: string;
  domainName: string;
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
  fromDomain: string;
  toDomain: string;
  amount: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface QAStatus {
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
}

export interface Defect {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'New' | 'In Progress' | 'Retesting' | 'Closed';
  domain: string;
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
  category: 'Technical' | 'Business' | 'Operations';
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
  totalSpent: 1980000
};

export const initialRequirements: Requirement[] = [
  { id: 'REQ-001', title: 'Over-The-Air (OTA) eSIM Profile Download Handler', type: 'Functional', priority: 'P1', status: 'Approved', domain: 'eSIM & Carrier Activation Gateway' },
  { id: 'REQ-002', title: 'SSO Carrier Federated Account Integration', type: 'Functional', priority: 'P1', status: 'Approved', domain: 'Identity Registry & Security' },
  { id: 'REQ-003', title: 'Dynamic bundle rating engine rules updates for 5G Data Packets', type: 'Functional', priority: 'P2', status: 'In Review', domain: 'Billing & Rating Engine' },
  { id: 'REQ-004', title: 'eSIM activation provisioning latency < 200ms', type: 'Non-Functional', priority: 'P1', status: 'Approved', domain: 'eSIM & Carrier Activation Gateway' },
  { id: 'REQ-005', title: 'Carrier-billing integration for third-party streaming partners', type: 'Functional', priority: 'P2', status: 'Draft', domain: 'Billing & Rating Engine' },
  { id: 'REQ-006', title: 'Secure hardware storage of cellular IMSI keys (AES-256)', type: 'Non-Functional', priority: 'P1', status: 'Approved', domain: 'Identity Registry & Security' },
  { id: 'REQ-007', title: 'Real-time billing usage notification triggers', type: 'Functional', priority: 'P2', status: 'Approved', domain: 'OSS/BSS Integration Middleware' },
  { id: 'REQ-008', title: 'Multinational customer portal multi-currency checkouts', type: 'Functional', priority: 'P3', status: 'Approved', domain: 'Mobile & Web Portal (B2C Channels)' }
];

export const initialDomains: DomainBuild[] = [
  { id: 'dom-1', name: 'Billing & Rating Engine', lead: 'Sarah Jenkins', progress: 85, status: 'In Progress', releaseVersion: 'v2.4.0', description: 'Telecom rating engines, bundle price configurations, and usage meters.' },
  { id: 'dom-2', name: 'OSS/BSS Integration Middleware', lead: 'David Chen', progress: 72, status: 'In Progress', releaseVersion: 'v1.8.2-rc1', description: 'Middleware orchestration linking customer portals with carrier networks.' },
  { id: 'dom-3', name: 'Mobile & Web Portal (B2C Channels)', lead: 'Elena Rostova', progress: 50, status: 'In Progress', releaseVersion: 'v3.0.0-beta', description: 'Customer self-service app and bundle selection checkout UI.' },
  { id: 'dom-4', name: 'eSIM & Carrier Activation Gateway', lead: 'Marcus Brody', progress: 30, status: 'Blocked', releaseVersion: 'v1.0.0-dev', description: 'Network provisioning, eSIM profile generation, and carrier updates.' },
  { id: 'dom-5', name: 'Identity Registry & Security', lead: 'Aaron Vance', progress: 100, status: 'Completed', releaseVersion: 'v2.1.0', description: 'Federated SSO, token generation, and SIM authentication modules.' }
];

export const initialMilestones: Milestone[] = [
  { id: 'ms-1', name: 'eSIM Provisioning API spec approved', date: '2026-02-15', status: 'Completed' },
  { id: 'ms-2', name: 'Carrier Gateway Dev Sandbox Provisioned', date: '2026-03-01', status: 'Completed' },
  { id: 'ms-3', name: 'eSIM Profile Download handler compiled', date: '2026-05-10', status: 'Completed' },
  { id: 'ms-4', name: 'Dynamic Rating rules integration tests', date: '2026-07-20', status: 'In Progress' },
  { id: 'ms-5', name: 'E2E User Acceptance Testing (UAT)', date: '2026-08-15', status: 'Not Started' },
  { id: 'ms-6', name: 'Market Proposition Launch', date: '2026-09-01', status: 'Not Started' }
];

export const initialAllocations: FinancialAllocation[] = [
  { domainId: 'dom-1', domainName: 'Billing & Rating Engine', capexAllocated: 800000, capexSpent: 620000, capexForecast: 790000, opexAllocated: 200000, opexSpent: 150000, opexForecast: 195000 },
  { domainId: 'dom-2', domainName: 'OSS/BSS Integration Middleware', capexAllocated: 900000, capexSpent: 590000, capexForecast: 880000, opexAllocated: 250000, opexSpent: 180000, opexForecast: 240000 },
  { domainId: 'dom-3', domainName: 'Mobile & Web Portal (B2C Channels)', capexAllocated: 600000, capexSpent: 300000, capexForecast: 610000, opexAllocated: 200000, opexSpent: 90000, opexForecast: 190000 },
  { domainId: 'dom-4', domainName: 'eSIM & Carrier Activation Gateway', capexAllocated: 500000, capexSpent: 120000, capexForecast: 580000, opexAllocated: 150000, opexSpent: 40000, opexForecast: 170000 },
  { domainId: 'dom-5', domainName: 'Identity Registry & Security', capexAllocated: 400000, capexSpent: 400000, capexForecast: 400000, opexAllocated: 150000, opexSpent: 150000, opexForecast: 150000 }
];

export const initialForecastMonths: ForecastMonth[] = [
  { month: 'Jan', capexForecast: 180000, capexActual: 170000, opexForecast: 50000, opexActual: 46000 },
  { month: 'Feb', capexForecast: 220000, capexActual: 215000, opexForecast: 60000, opexActual: 58000 },
  { month: 'Mar', capexForecast: 280000, capexActual: 275000, opexForecast: 70000, opexActual: 72000 },
  { month: 'Apr', capexForecast: 320000, capexActual: 310000, opexForecast: 80000, opexActual: 78000 },
  { month: 'May', capexForecast: 380000, capexActual: 390000, opexForecast: 90000, opexActual: 95000 },
  { month: 'Jun', capexForecast: 420000, capexActual: 410000, opexForecast: 100000, opexActual: 98000 },
  { month: 'Jul', capexForecast: 380000, capexActual: 0, opexForecast: 100000, opexActual: 0 },
  { month: 'Aug', capexForecast: 320000, capexActual: 0, opexForecast: 90000, opexActual: 0 },
  { month: 'Sep', capexForecast: 220000, capexActual: 0, opexForecast: 70000, opexActual: 0 }
];

export const initialTransfers: FundTransfer[] = [
  { id: 'TX-101', fromDomain: 'OSS/BSS Integration Middleware', toDomain: 'eSIM & Carrier Activation Gateway', amount: 45000, reason: 'Carrier API specifications revised mid-cycle, requiring additional engineering sprints.', date: '2026-05-18', status: 'Approved' },
  { id: 'TX-102', fromDomain: 'Mobile & Web Portal (B2C Channels)', toDomain: 'Identity Registry & Security', amount: 20000, reason: 'Accelerate penetration tests on user data storage prior to compliance audit.', date: '2026-06-02', status: 'Approved' },
  { id: 'TX-103', fromDomain: 'Billing & Rating Engine', toDomain: 'eSIM & Carrier Activation Gateway', amount: 60000, reason: 'Mitigate carrier-profile download speed bottleneck.', date: '2026-06-12', status: 'Pending' }
];

export const initialQAStatus: QAStatus = {
  totalTests: 580,
  passed: 380,
  failed: 35,
  blocked: 15
};

export const initialDefects: Defect[] = [
  { id: 'DEF-001', title: 'eSIM profile download handshake timeout', severity: 'Critical', status: 'In Progress', domain: 'eSIM & Carrier Activation Gateway', description: 'Provisioning queue timeouts when processing 50+ concurrent requests.' },
  { id: 'DEF-002', title: 'Rating engine drops fractional usage units', severity: 'High', status: 'New', domain: 'Billing & Rating Engine', description: 'Data bundles rating rounds up excessively on fractional megabytes.' },
  { id: 'DEF-003', title: 'Mobile App billing widget freeze on Android 14', severity: 'Medium', status: 'Closed', domain: 'Mobile & Web Portal (B2C Channels)', description: 'CSS grid render loop blocks UI interaction on webview builds.' },
  { id: 'DEF-004', title: 'Federated SSO rejects token renewals', severity: 'Critical', status: 'New', domain: 'Identity Registry & Security', description: 'SSO validation keys expire prematurely after 60 seconds.' }
];

export const initialRisks: RiskIssue[] = [
  { id: 'RSK-01', type: 'Risk', title: 'Carrier partner gateway SLA delays', impact: 'High', mitigation: 'Engage carrier technical executives; deploy local simulator mock for staging E2E validation.', status: 'Open' },
  { id: 'RSK-02', type: 'Dependency', title: 'Network provisioning environment downtime', impact: 'Medium', mitigation: 'Provision virtualized cell simulation stubs on local servers.', status: 'Mitigated' },
  { id: 'RSK-03', type: 'Issue', title: 'Loss of Senior OSS/BSS Integration Developer', impact: 'Critical', mitigation: 'Cross-trained Sarah Jenkins to cover integration gateway APIs; expedite consultant hiring.', status: 'Open' }
];

export const initialChecklist: ChecklistItem[] = [
  { id: 'chk-1', category: 'Technical', item: 'All carrier gateway builds compiled, tagged, and deployed in staging', checked: false, owner: 'Devops Lead' },
  { id: 'chk-2', category: 'Technical', item: 'Penetration testing and security compliance sign-off obtained', checked: true, owner: 'Security Lead' },
  { id: 'chk-3', category: 'Technical', item: 'eSIM certificate authority chain setup completed', checked: false, owner: 'Security Lead' },
  { id: 'chk-4', category: 'Business', item: 'Customer representative scripts and proposition training completed', checked: true, owner: 'Proposition Manager' },
  { id: 'chk-5', category: 'Business', item: 'Marketing campaigns and subscription pricing approved', checked: false, owner: 'Marketing Director' },
  { id: 'chk-6', category: 'Operations', item: '24/7 hypercare support schedule finalized', checked: false, owner: 'Operations Lead' },
  { id: 'chk-7', category: 'Operations', item: 'Carrier outage escalation procedure approved', checked: true, owner: 'Incident Manager' }
];

export const initialHypercare: HypercareTicket[] = [
  { id: 'HYP-01', title: 'eSIM profile activation SMS delay', severity: 'P2', status: 'Investigating', reportedAt: '2026-09-02T09:15:00', slaMinutes: 120 },
  { id: 'HYP-02', title: 'Bill detail CSV exporter failing', severity: 'P3', status: 'Open', reportedAt: '2026-09-02T10:45:00', slaMinutes: 240 },
  { id: 'HYP-03', title: 'eSIM key validation database deadlock', severity: 'P1', status: 'Resolved', reportedAt: '2026-09-01T23:30:00', slaMinutes: 30 }
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
  // Project Identity
  projectName: string;
  projectCode: string;
  projectManager: string;
  executiveSponsor: string;
  reportingDate: string;
  projectPhase: string;

  // Vision & Objectives
  problemStatement: string;
  objectives: string[];

  // Scope
  inScope: string[];
  outOfScope: string[];

  // Assumptions
  assumptions: string[];

  // Budget
  totalBudget: number;
  spentToDate: number;
  forecastToComplete: number;

  // Key Milestones
  milestones: POAPMilestone[];

  // Key Risks (free-text top 3)
  keyRisks: string[];

  // Stakeholders
  stakeholders: POAPStakeholder[];

  // Success Criteria
  successCriteria: string[];

  // Key Dependencies
  dependencies: string[];

  // Next Steps / Actions
  nextActions: POAPAction[];
}

export const initialPOAPData: POAPData = {
  projectName: 'PROJECT VELOCITY',
  projectCode: 'PRJ-2026-VEL',
  projectManager: 'Aaron Vance',
  executiveSponsor: 'Chief Technology Officer',
  reportingDate: new Date().toISOString().split('T')[0],
  projectPhase: 'Build & Delivery',

  problemStatement:
    'Legacy SIM card provisioning and manual carrier-billing processes are unable to scale with growing demand for instant digital connectivity. A unified eSIM and carrier-billing platform is required to unlock new revenue streams and reduce operational costs.',

  objectives: [
    'Launch unified eSIM activation & carrier-billing platform by Q3 2026',
    'Enable instant OTA eSIM provisioning with <200ms latency SLA',
    'Deliver $12.5M NPV benefit over 5 years through new streaming partner integrations',
  ],

  inScope: [
    'eSIM profile download and OTA provisioning handler',
    'Carrier-billing integration for third-party streaming partners',
    'SSO federated account integration across B2C channels',
    'Dynamic bundle rating engine with 5G data packet support',
    'Real-time usage notification triggers',
  ],
  outOfScope: [
    'Legacy 2G/3G SIM card management systems',
    'International roaming billing negotiations',
    'Physical SIM card inventory and logistics',
  ],

  assumptions: [
    'Carrier partner APIs will be available and stable by July 2026',
    'Security compliance sign-off will be granted before UAT',
    'Infrastructure provisioning in staging environment remains available',
  ],

  totalBudget: 4150000,
  spentToDate: 1980000,
  forecastToComplete: 2050000,

  milestones: [
    { id: 'pm-1', name: 'eSIM API Spec Approved', date: '2026-02-15', status: 'Completed' },
    { id: 'pm-2', name: 'Carrier Gateway Sandbox', date: '2026-03-01', status: 'Completed' },
    { id: 'pm-3', name: 'Profile Download Handler', date: '2026-05-10', status: 'Completed' },
    { id: 'pm-4', name: 'Dynamic Rating Integration Tests', date: '2026-07-20', status: 'In Progress' },
    { id: 'pm-5', name: 'E2E UAT Sign-off', date: '2026-08-15', status: 'Not Started' },
    { id: 'pm-6', name: 'Market Launch', date: '2026-09-01', status: 'Not Started' },
  ],

  keyRisks: [
    'Carrier gateway SLA delays could push UAT beyond Aug 15 deadline',
    'Loss of senior OSS/BSS developer reduces integration throughput',
    'eSIM provisioning handshake timeout defect remains unresolved',
  ],

  stakeholders: [
    { id: 'st-1', name: 'Aaron Vance', role: 'Project Manager', engagement: 'Accountable' },
    { id: 'st-2', name: 'Sarah Jenkins', role: 'Billing Lead', engagement: 'Accountable' },
    { id: 'st-3', name: 'CTO Office', role: 'Executive Sponsor', engagement: 'Informed' },
    { id: 'st-4', name: 'Carrier Partner Ops', role: 'Technical Counterpart', engagement: 'Consulted' },
  ],

  successCriteria: [
    'eSIM provisioning latency consistently below 200ms in production',
    'Zero Critical defects open at market launch',
    'First streaming partner billing integration live within 30 days of go-live',
    'Customer self-service portal adoption rate >60% within 90 days',
  ],

  dependencies: [
    'Carrier partner technical team providing stable gateway API by July 2026',
    'Security audit completion prior to UAT phase',
    'Cloud infrastructure capacity approved by platform team',
    'Legal sign-off on streaming partner billing contracts',
  ],

  nextActions: [
    { id: 'na-1', description: 'Resolve eSIM provisioning handshake timeout (DEF-001)', owner: 'Marcus Brody', dueDate: '2026-06-25' },
    { id: 'na-2', description: 'Complete penetration testing and obtain security sign-off', owner: 'Security Lead', dueDate: '2026-07-05' },
    { id: 'na-3', description: 'Finalise UAT test scripts and schedule stakeholder walkthroughs', owner: 'QA Lead', dueDate: '2026-07-15' },
    { id: 'na-4', description: 'Engage carrier partner for API staging environment access', owner: 'David Chen', dueDate: '2026-06-28' },
  ],
};
