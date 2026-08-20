export interface MilestoneRow {
  id: number;
  name: string;
  status: string;
  targetedDate: string; // Used as End Date in timeline
  releaseDate: string;
  actualDate: string;
  startDate?: string;
  phase?: 'Inception' | 'Elaboration' | 'Construction' | 'Transition';
  track?: 'Governance' | 'Core' | 'Sprints' | 'Testing' | 'Transition' | 'Support';
  type?: 'Block' | 'Chevron' | 'Sprint' | 'SignOff' | 'Milestone';
}

export interface POAPSlideData {
  projectName: string;
  reqId: string;
  projectManager: string;
  expectedClosure: string;
  portfolio: string;
  transition: string;
  ragOverall: 'Green' | 'Amber' | 'Red';
  mpGate: string;
  build: string;
  projectGate: string;
  projectScope: string;
  currentStatus: string;
  milestones: MilestoneRow[];
  obstacles: string;
  planAssumptions: string;
}
