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

// ─── Release Governance & Planning Gates ────────────────────────────────────

export interface RPMParticipantRow {
  participant: string;
  inputs: string[];
  outputs: string[];
}

export interface GovernanceGateDetail {
  id: string; // 'rpm' | 'cp1' | 'cp2' | 'cr'
  title: string;
  objective: string;
  entryCriteria: string[];
  outputs: string[];
  mandatoryAudience: string;
  optionalAudience?: string;
  participants: RPMParticipantRow[];
  typesConsidered?: string[];
  typesNotConsidered?: string[];
}

export const initialGovernanceGates: GovernanceGateDetail[] = [
  {
    id: 'rpm',
    title: 'Release Planning Meeting (RPM)',
    objective: 'Commit candidates into the Release, where all readiness requirements are met, including Test assessments',
    entryCriteria: [
      'Delivery plans are available at least 4 working days before RPM, for VF3 E2E RM & Test Assessment',
      'Dependencies managed – 3rd Party apps, Projects, Connectivity, etc.',
      'Consumption plans',
      'SIT planned dates',
      'Test assessments concluded, with capacity available'
    ],
    outputs: [
      'Commit Green candidates',
      'Amber candidates remain for 1 working week',
      'Red candidates are moved to the Backlog',
      'Publish RPM outcomes'
    ],
    mandatoryAudience: 'VF3 E2E RM, Domain RM, Factory RM, Delivery Managers, Test (SIT & PAT) & Environments (VES)',
    optionalAudience: '',
    participants: [
      {
        participant: 'VF3 E2E RM',
        inputs: ['Assessed and RAG\'d candidates for their readiness'],
        outputs: [
          'Commit Green candidates',
          'Amber candidates remain for 1 working week',
          'Red candidates are moved to the Backlog',
          'Publish RPM outcomes'
        ]
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: [
          'VROMS approved',
          'Delivery plans',
          'Technical dependencies highlighted',
          'Low level design complete'
        ],
        outputs: ['Ensure Domain and Development teams proceed with the scope committed']
      },
      {
        participant: 'Delivery Managers',
        inputs: ['All release readiness requirements are met'],
        outputs: [
          'Close outstanding actions with Amber candidates within 1 working week',
          'Address issues with Red candidates, and target a future release'
        ]
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: [
          'Test assessments completed',
          'Finalise ADO\'s Test, Environment fields'
        ],
        outputs: [
          'Commence test preparation',
          'Test quotes Issued'
        ]
      },
      {
        participant: 'Environments',
        inputs: [
          'Review EQF',
          'Highlight risks, challenges & dependencies impacting environment readiness'
        ],
        outputs: ['Proposed plans & uplift timelines for VES owned apps']
      }
    ]
  },
  {
    id: 'cp1',
    title: 'Check Point 1 – Build Scope Freeze',
    objective: 'Freeze build scope for new business demand, no new build requirements considered',
    entryCriteria: [
      'Development is complete or already in progress'
    ],
    outputs: [
      'Final build scope for CCS Stack, Domains, Digital & Third Parties = Everything',
      'Review any scope changes'
    ],
    mandatoryAudience: 'VF3 E2E RM, Domain RM, Factory RM, Delivery Managers, Test (SIT & PAT) & Environments (VES)',
    optionalAudience: 'Domains',
    participants: [
      {
        participant: 'VF3 E2E RM',
        inputs: ['Review execution progress'],
        outputs: ['Confirm there are no further build requirements']
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: [
          'Confirm final release build scope',
          'Highlight risks via RAID'
        ],
        outputs: [
          'Align build scope as required',
          'Action any RAID items'
        ]
      },
      {
        participant: 'Delivery Managers',
        inputs: ['Raise any scope changes or dependency issues'],
        outputs: ['Communicate scope changes']
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: ['Raise any challenges to the start of testing'],
        outputs: ['Align execution resources']
      },
      {
        participant: 'Environments',
        inputs: ['Raise any issues regarding plans for new interfaces'],
        outputs: ['Review environment plans following any scope changes']
      }
    ]
  },
  {
    id: 'cp2',
    title: 'Check Point 2 – Final Scope Freeze',
    objective: 'Final release scope freeze',
    entryCriteria: [
      'Identify candidates at risk',
      'CJT & DVT Packs to be requested from projects'
    ],
    outputs: [
      'Switch off plans/rollback efforts to be confirmed',
      'Publish final scope for the release',
      'Revise project plans for spill-over scope',
      'Final consumption plan aligned based on testing outcomes'
    ],
    mandatoryAudience: 'VF3 E2E RM, Domain RM, Factory RM, Delivery Managers, Test (SIT & PAT) & Environments (VES)',
    optionalAudience: 'Domains',
    participants: [
      {
        participant: 'VF3 E2E RM',
        inputs: ['Review candidates at risk of not completing testing in time for release'],
        outputs: [
          'Final scope list for release, including consumption plans',
          'Agree mitigation plans with projects where applicable',
          'For spill-over scope, propose future releases'
        ]
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: ['N/A'],
        outputs: ['Switch off plans/rollback efforts and regression impacts']
      },
      {
        participant: 'Delivery Managers',
        inputs: ['CJT & DVT Packs'],
        outputs: [
          'Confirm project status to business',
          'Where scope moved out, revise project plans'
        ]
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: ['List of candidates at risk'],
        outputs: ['Confirm potential deferrals from release']
      },
      {
        participant: 'Environments',
        inputs: ['N/A'],
        outputs: ['N/A']
      }
    ]
  },
  {
    id: 'cr',
    title: 'Change Requests',
    objective: 'Review late changes into the release post-RPM',
    entryCriteria: [
      'Completion of the ADO Change Request including – Reason for being late, Business justification, Impact from not proceeding, Value change brings',
      'Approved VROMs and delivery plans',
      'Test Assessment'
    ],
    outputs: [
      'Accept or Reject the CR'
    ],
    mandatoryAudience: 'VF3 E2E RM, Domain RM, Factory RM, Delivery Managers, Test (SIT & PAT) & Environments (VES)',
    optionalAudience: 'Domains',
    typesConsidered: [
      'Technical CRs such as defect fixes that need a change in Low Level Design',
      'Fall-outs from previous release due to open defects despite realistic project planning'
    ],
    typesNotConsidered: [
      'Due to project missing readiness timelines',
      'Due to late business requirements or requests'
    ],
    participants: [
      {
        participant: 'VF3 E2E RM',
        inputs: ['N/A'],
        outputs: ['Accept or Reject the CR']
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: [
          'Approve VROMs',
          'Provide delivery plans'
        ],
        outputs: ['N/A']
      },
      {
        participant: 'Delivery Managers',
        inputs: [
          'Complete ADO CR work item will all key information correctly completed',
          'Provide delivery plans in linked ADO work items'
        ],
        outputs: ['N/A']
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: ['Test assessment completed'],
        outputs: ['N/A']
      },
      {
        participant: 'Environments',
        inputs: ['N/A'],
        outputs: ['N/A']
      }
    ]
  }
];

// ─── Digital PI Process Guide & Wizard ──────────────────────────────────────

export interface PIChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface PICheckpointItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

export interface PIWizardData {
  piName: string;
  startDate: string;
  endDate: string;
  sprints: number;
  selectedWorkItemIds: string[];
  reviewChecklist: PIChecklistItem[];
  analyseChecklist: PIChecklistItem[];
  postKickoffCheckpoints: PICheckpointItem[];
  ragStatus: {
    schedule: string;
    budget: string;
    scope: string;
    quality: string;
    overall: string;
  };
}

export const initialPIWizardData: PIWizardData = {
  piName: 'PI 40',
  startDate: '2026-07-01',
  endDate: '2026-09-30',
  sprints: 6,
  selectedWorkItemIds: [],
  ragStatus: {
    schedule: 'Green',
    budget: 'Green',
    scope: 'Green',
    quality: 'Green',
    overall: 'Green'
  },
  reviewChecklist: [
    { id: 'rv-1', text: 'Budget Approved – Funding secured', checked: false },
    { id: 'rv-2', text: 'Tech PM Assigned – Accountability', checked: false },
    { id: 'rv-3', text: 'Digital Solution Architect Assigned – Technical leadership', checked: false },
    { id: 'rv-4', text: 'Product Manager & UX Resource Assigned – Expertise secured', checked: false },
    { id: 'rv-5', text: 'BRS Complete – Requirements finalized', checked: false },
    { id: 'rv-6', text: 'HLD Started (if required)', checked: false },
    { id: 'rv-7', text: 'Discovery Complete (if required)', checked: false },
    { id: 'rv-8', text: 'Low-Level UX Fidelity Started', checked: false },
    { id: 'rv-9', text: 'DP2 Complete', checked: false },
    { id: 'rv-10', text: 'LRP & Tags Attached', checked: false },
    { id: 'rv-11', text: 'ADO Hierarchy Correct (P2D > Digital Epic)', checked: false },
  ],
  analyseChecklist: [
    { id: 'an-1', text: 'Requirements Run-through & Kick-off Call', checked: false },
    { id: 'an-2', text: 'UX Designs Finalised & Signed Off', checked: false },
    { id: 'an-3', text: 'Solution Blueprint & Walkthrough Complete', checked: false },
    { id: 'an-4', text: 'TIL SOA Specs Complete', checked: false },
    { id: 'an-5', text: 'Features Refined', checked: false },
    { id: 'an-6', text: 'Dependencies Mapped', checked: false },
    { id: 'an-7', text: 'Digital VROMs Raised', checked: false },
    { id: 'an-8', text: 'Digital LRP Updated', checked: false },
  ],
  postKickoffCheckpoints: [
    {
      id: 'pk-1',
      title: 'PI Planning Kick-off Call',
      description: 'Align TPMs on assigned work, scope, and key delivery dates. Raise risks and clarify missing prerequisites.',
      checked: false,
    },
    {
      id: 'pk-2',
      title: 'Delivery Reviews & Approvals',
      description: 'Validate designs, UX, and solution recommendations with cross-functional teams. Ensure dependencies are mapped.',
      checked: false,
    },
    {
      id: 'pk-3',
      title: 'Weekly Readiness Check-ins',
      description: 'Review progress and risks using the Readiness Dashboard. Highlight blockers and seek support.',
      checked: false,
    },
    {
      id: 'pk-4',
      title: 'D&IT TPM Readiness Working Group',
      description: 'Stay updated on key dates and processes. Use the channel for questions and clarifications outside meetings.',
      checked: false,
    },
    {
      id: 'pk-5',
      title: 'PI Hardlock',
      description: 'Final checkpoint before PI Kick-off. Confirm all deliverables with Product Lead and Tech Portfolio Lead.',
      checked: false,
    },
  ],
};

// ─── E2E Demand Journey (Walkthrough) Data ───────────────────────────────────

export interface WalkthroughData {
  // Funnel
  epicName: string;
  ideaDescription: string;
  portfolio: string;
  resourceAssessment: 'High' | 'Medium' | 'Low' | '';
  // Reviewing
  impactAssessmentDone: boolean;
  highLevelBusinessCase: string;
  vvromCreated: boolean;
  lrpUpdated: boolean;
  mobilizationPlan: string;
  stopGoDecision: 'Pending' | 'Stop' | 'Go';
  // Analysing
  brsSignedOff: boolean;
  hldStarted: boolean;
  tilSpecsComplete: boolean;
  timelineWeeks: number;
  // Implementing
  mvpBuildStatus: 'Not Started' | 'In Progress' | 'Complete';
  sitTesting: boolean;
  uatTesting: boolean;
  patTesting: boolean;
  cjtTesting: boolean;
  commercialGoNoGo: 'Pending' | 'Go' | 'No-Go';
  // Post Launch
  elsActive: boolean;
  p1p2DefectsRemaining: number;
  retrospectiveNotes: string;
}

export const initialWalkthroughData: WalkthroughData = {
  epicName: 'New Digital Checkout Journey',
  ideaDescription: 'Revamp the checkout journey for eShop to increase conversion rate by 15%.',
  portfolio: 'MVO (eShop)',
  resourceAssessment: 'Medium',
  
  impactAssessmentDone: true,
  highLevelBusinessCase: 'Projected to increase sales conversion and improve NPS by 12 points.',
  vvromCreated: false,
  lrpUpdated: false,
  mobilizationPlan: 'Form a squad comprised of UX, Frontend, Backend, and Test engineers.',
  stopGoDecision: 'Pending',
  
  brsSignedOff: false,
  hldStarted: false,
  tilSpecsComplete: false,
  timelineWeeks: 12,
  
  mvpBuildStatus: 'Not Started',
  sitTesting: false,
  uatTesting: false,
  patTesting: false,
  cjtTesting: false,
  commercialGoNoGo: 'Pending',
  
  elsActive: false,
  p1p2DefectsRemaining: 0,
  retrospectiveNotes: ''
};

