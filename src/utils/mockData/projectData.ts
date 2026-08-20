export interface ADOWorkItem {
  id: string;
  type: 'Epic' | 'Feature' | 'Delivery' | 'Function';
  title: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Committed' | 'In Progress' | 'Ready to Deploy' | 'Deployed';
  portfolio: string;
}

export interface PortfolioSquad {
  id: string;
  name: string;
  lead: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
  targetRelease: string;
  description: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

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

export interface WalkthroughData {
  epicName: string;
  ideaDescription: string;
  portfolio: string;
  resourceAssessment: 'High' | 'Medium' | 'Low' | '';
  impactAssessmentDone: boolean;
  highLevelBusinessCase: string;
  vvromCreated: boolean;
  lrpUpdated: boolean;
  mobilizationPlan: string;
  stopGoDecision: 'Pending' | 'Stop' | 'Go';
  brsSignedOff: boolean;
  hldStarted: boolean;
  tilSpecsComplete: boolean;
  timelineWeeks: number;
  mvpBuildStatus: 'Not Started' | 'In Progress' | 'Complete';
  sitTesting: boolean;
  uatTesting: boolean;
  patTesting: boolean;
  cjtTesting: boolean;
  commercialGoNoGo: 'Pending' | 'Go' | 'No-Go';
  elsActive: boolean;
  p1p2DefectsRemaining: number;
  retrospectiveNotes: string;
}

export const initialADOWorkItems: ADOWorkItem[] = [
  { id: 'EPIC-101', type: 'Epic', title: 'Digital Sales Transformation', status: 'Approved', portfolio: 'P&C' },
  { id: 'FEAT-201', type: 'Feature', title: 'MVO iPhone Upgrade Journey', status: 'In Review', portfolio: 'MVO (eShop)' },
  { id: 'DEL-301', type: 'Delivery', title: 'CCS 26.6 Drop', status: 'Committed', portfolio: 'MVO (eShop)' },
  { id: 'FUNC-401', type: 'Function', title: 'eShop Cart Component API', status: 'In Progress', portfolio: 'CARTman' },
];

export const initialSquads: PortfolioSquad[] = [
  { id: 'sq-1', name: 'Raptors (MVO)', lead: 'Sarah Jenkins', progress: 85, status: 'In Progress', targetRelease: 'CCS 26.6', description: 'Digital eShop sales journeys.' },
  { id: 'sq-2', name: 'MVA-Alex (MVA)', lead: 'David Chen', progress: 72, status: 'In Progress', targetRelease: 'CCS 26.6A', description: 'My VOIS App core experience.' },
  { id: 'sq-3', name: 'Care Bears (eCare)', lead: 'Elena Rostova', progress: 50, status: 'In Progress', targetRelease: 'CCS 26.8', description: 'Customer self-service portal.' },
  { id: 'sq-4', name: 'TOBi Nova', lead: 'Marcus Brody', progress: 30, status: 'Blocked', targetRelease: 'SD 26.10', description: 'Chatbot intent handling.' },
  { id: 'sq-5', name: 'Gravity (Platform)', lead: 'Aaron Vance', progress: 100, status: 'Completed', targetRelease: 'CCS 26.4', description: 'Shared platform integrations.' },
];

export const initialMilestones: Milestone[] = [
  { id: 'ms-1', name: 'CP0 - Release Ready', date: '2026-05-15', status: 'Completed' },
  { id: 'ms-2', name: 'RPM - Release Planning Meeting', date: '2026-06-01', status: 'Completed' },
  { id: 'ms-3', name: 'CP1 - Build Scope Freeze', date: '2026-07-10', status: 'In Progress' },
  { id: 'ms-4', name: 'CP2 - Final Scope Freeze', date: '2026-08-20', status: 'Not Started' },
  { id: 'ms-5', name: 'SIT Start', date: '2026-08-15', status: 'Not Started' },
  { id: 'ms-6', name: 'Go-Live (Commercial Launch)', date: '2026-09-01', status: 'Not Started' },
];

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
    overall: 'Green',
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
  retrospectiveNotes: '',
};
