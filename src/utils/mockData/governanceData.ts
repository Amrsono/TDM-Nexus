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

export const initialRisks: RiskIssue[] = [
  { id: 'RSK-01', type: 'Risk', title: 'VES Environment connectivity', impact: 'High', mitigation: 'Engage VES team for stubbing.', status: 'Open' },
];

export const initialChecklist: ChecklistItem[] = [
  { id: 'chk-1', category: 'CP0', item: 'E2E HLD and VROMs signed off', checked: true, owner: 'TDM' },
  { id: 'chk-2', category: 'RPM', item: 'Test Assessment completed', checked: false, owner: 'SIT Manager' },
  { id: 'chk-3', category: 'CP1', item: 'Build Scope Frozen', checked: false, owner: 'TDM' },
];

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
      'Test assessments concluded, with capacity available',
    ],
    outputs: [
      'Commit Green candidates',
      'Amber candidates remain for 1 working week',
      'Red candidates are moved to the Backlog',
      'Publish RPM outcomes',
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
          'Publish RPM outcomes',
        ],
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: [
          'VROMS approved',
          'Delivery plans',
          'Technical dependencies highlighted',
          'Low level design complete',
        ],
        outputs: ['Ensure Domain and Development teams proceed with the scope committed'],
      },
      {
        participant: 'Delivery Managers',
        inputs: ['All release readiness requirements are met'],
        outputs: [
          'Close outstanding actions with Amber candidates within 1 working week',
          'Address issues with Red candidates, and target a future release',
        ],
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: [
          'Test assessments completed',
          'Finalise ADO\'s Test, Environment fields',
        ],
        outputs: [
          'Commence test preparation',
          'Test quotes Issued',
        ],
      },
      {
        participant: 'Environments',
        inputs: [
          'Review EQF',
          'Highlight risks, challenges & dependencies impacting environment readiness',
        ],
        outputs: ['Proposed plans & uplift timelines for VES owned apps'],
      },
    ],
  },
  {
    id: 'cp1',
    title: 'Check Point 1 – Build Scope Freeze',
    objective: 'Freeze build scope for new business demand, no new build requirements considered',
    entryCriteria: [
      'Development is complete or already in progress',
    ],
    outputs: [
      'Final build scope for CCS Stack, Domains, Digital & Third Parties = Everything',
      'Review any scope changes',
    ],
    mandatoryAudience: 'VF3 E2E RM, Domain RM, Factory RM, Delivery Managers, Test (SIT & PAT) & Environments (VES)',
    optionalAudience: 'Domains',
    participants: [
      {
        participant: 'VF3 E2E RM',
        inputs: ['Review execution progress'],
        outputs: ['Confirm there are no further build requirements'],
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: [
          'Confirm final release build scope',
          'Highlight risks via RAID',
        ],
        outputs: [
          'Align build scope as required',
          'Action any RAID items',
        ],
      },
      {
        participant: 'Delivery Managers',
        inputs: ['Raise any scope changes or dependency issues'],
        outputs: ['Communicate scope changes'],
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: ['Raise any challenges to the start of testing'],
        outputs: ['Align execution resources'],
      },
      {
        participant: 'Environments',
        inputs: ['Raise any issues regarding plans for new interfaces'],
        outputs: ['Review environment plans following any scope changes'],
      },
    ],
  },
  {
    id: 'cp2',
    title: 'Check Point 2 – Final Scope Freeze',
    objective: 'Final release scope freeze',
    entryCriteria: [
      'Identify candidates at risk',
      'CJT & DVT Packs to be requested from projects',
    ],
    outputs: [
      'Switch off plans/rollback efforts to be confirmed',
      'Publish final scope for the release',
      'Revise project plans for spill-over scope',
      'Final consumption plan aligned based on testing outcomes',
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
          'For spill-over scope, propose future releases',
        ],
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: ['N/A'],
        outputs: ['Switch off plans/rollback efforts and regression impacts'],
      },
      {
        participant: 'Delivery Managers',
        inputs: ['CJT & DVT Packs'],
        outputs: [
          'Confirm project status to business',
          'Where scope moved out, revise project plans',
        ],
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: ['List of candidates at risk'],
        outputs: ['Confirm potential deferrals from release'],
      },
      {
        participant: 'Environments',
        inputs: ['N/A'],
        outputs: ['N/A'],
      },
    ],
  },
  {
    id: 'cr',
    title: 'Change Requests',
    objective: 'Review late changes into the release post-RPM',
    entryCriteria: [
      'Completion of the ADO Change Request including – Reason for being late, Business justification, Impact from not proceeding, Value change brings',
      'Approved VROMs and delivery plans',
      'Test Assessment',
    ],
    outputs: [
      'Accept or Reject the CR',
    ],
    mandatoryAudience: 'VF3 E2E RM, Domain RM, Factory RM, Delivery Managers, Test (SIT & PAT) & Environments (VES)',
    optionalAudience: 'Domains',
    typesConsidered: [
      'Technical CRs such as defect fixes that need a change in Low Level Design',
      'Fall-outs from previous release due to open defects despite realistic project planning',
    ],
    typesNotConsidered: [
      'Due to project missing readiness timelines',
      'Due to late business requirements or requests',
    ],
    participants: [
      {
        participant: 'VF3 E2E RM',
        inputs: ['N/A'],
        outputs: ['Accept or Reject the CR'],
      },
      {
        participant: 'Domain RM & Factory RM',
        inputs: [
          'Approve VROMs',
          'Provide delivery plans',
        ],
        outputs: ['N/A'],
      },
      {
        participant: 'Delivery Managers',
        inputs: [
          'Complete ADO CR work item will all key information correctly completed',
          'Provide delivery plans in linked ADO work items',
        ],
        outputs: ['N/A'],
      },
      {
        participant: 'Test (SIT & PAT)',
        inputs: ['Test assessment completed'],
        outputs: ['N/A'],
      },
      {
        participant: 'Environments',
        inputs: ['N/A'],
        outputs: ['N/A'],
      },
    ],
  },
];
