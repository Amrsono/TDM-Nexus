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
  icarStatus: 'Pending',
};

export const initialAllocations: FinancialAllocation[] = [
  { squadId: 'sq-1', squadName: 'Raptors (MVO)', capexAllocated: 800000, capexSpent: 620000, capexForecast: 790000, opexAllocated: 200000, opexSpent: 150000, opexForecast: 195000 },
  { squadId: 'sq-2', squadName: 'MVA-Alex (MVA)', capexAllocated: 900000, capexSpent: 590000, capexForecast: 880000, opexAllocated: 250000, opexSpent: 180000, opexForecast: 240000 },
  { squadId: 'sq-3', squadName: 'Care Bears (eCare)', capexAllocated: 600000, capexSpent: 300000, capexForecast: 610000, opexAllocated: 200000, opexSpent: 90000, opexForecast: 190000 },
];

export const initialForecastMonths: ForecastMonth[] = [
  { month: 'Jan', capexForecast: 180000, capexActual: 170000, opexForecast: 50000, opexActual: 46000 },
  { month: 'Feb', capexForecast: 220000, capexActual: 215000, opexForecast: 60000, opexActual: 58000 },
];

export const initialTransfers: FundTransfer[] = [
  { id: 'TX-101', fromSquad: 'Gravity (Platform)', toSquad: 'Raptors (MVO)', amount: 45000, reason: 'ICAR uplift approved for extra test coverage.', date: '2026-05-18', status: 'Approved' },
];
