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

export interface HypercareTicket {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Open' | 'Investigating' | 'Resolved';
  reportedAt: string;
  slaMinutes: number;
}

export const initialQAGates: QAGate[] = [
  { name: 'SIT', status: 'In Progress', totalTests: 250, passed: 150, failed: 20, blocked: 10 },
  { name: 'UAT', status: 'Not Started', totalTests: 120, passed: 0, failed: 0, blocked: 0 },
  { name: 'PAT', status: 'In Progress', totalTests: 80, passed: 40, failed: 5, blocked: 0 },
  { name: 'OAT', status: 'Not Started', totalTests: 50, passed: 0, failed: 0, blocked: 0 },
  { name: 'PEN', status: 'Not Started', totalTests: 30, passed: 0, failed: 0, blocked: 0 },
  { name: 'CJT', status: 'Not Started', totalTests: 100, passed: 0, failed: 0, blocked: 0 },
  { name: 'DVT', status: 'Not Started', totalTests: 20, passed: 0, failed: 0, blocked: 0 },
];

export const initialDefects: Defect[] = [
  { id: 'DEF-001', title: 'Cart sync failure on iOS', severity: 'P1', status: 'In Progress', squad: 'Raptors (MVO)', phase: 'SIT', description: 'Items do not persist across sessions.' },
  { id: 'DEF-002', title: 'Slow response in identity verification', severity: 'P2', status: 'New', squad: 'Gravity (Platform)', phase: 'PAT', description: 'Latency > 200ms.' },
];

export const initialHypercare: HypercareTicket[] = [
  { id: 'HYP-01', title: 'Order failure spike', severity: 'P2', status: 'Investigating', reportedAt: '2026-09-02T09:15:00', slaMinutes: 120 },
];
