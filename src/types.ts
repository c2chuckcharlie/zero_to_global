export type Language = 'en' | 'zh' | 'ja';

export interface TeamInfo {
  teamNumber: string;
  country: string;
  prefecture: string;
  city: string;
  town: string;
}

export interface UserStory {
  targetUser: string;
  coreProblem: string;
  solutionSummary: string;
  desiredOutcome: string;
}

export interface ElevatorPitchInput {
  for: string;
  who: string;
  product: string;
  that: string;
  unlike: string;
  we: string;
}

export interface BMC {
  customerSegments: string;
  valueProposition: string;
  channels: string;
  customerRelationships: string;
  revenueStreams: string;
  keyActivities: string;
  keyResources: string;
  keyPartners: string;
  costStructure: string;
}

export interface ValueCreation {
  create: string;
  deliver: string;
  capture: string;
}

export interface LTVData {
  explanation: string;
  arpu: number;
  margin: number;
  lifetime: number;
  calculation: string;
  total: number;
}

export interface COCAData {
  definition: string;
  assumptions: string;
  cost: number;
}

export interface FinancialYear {
  year: number;
  revenue: number;
  costs: number;
  cashFlow: number;
}

export interface Financials {
  assumptions: {
    firstYearUsers: number;
    growthRate: number;
    arpu: number;
    coca: number;
    churnRate: number;
    infraCost: number;
    marketingGrowth: number;
    supportCost: number;
    opCosts: number;
    discountRate: number;
    taxRate: number;
  };
  table: FinancialYear[];
  paybackPeriod: number;
  roi: number;
  npv: number;
  risks: {
    market: string;
    regulatory: string;
    competitive: string;
    sensitivity: string;
  };
}

export interface InvestorOutput {
  polishedPitch: string;
  summary: {
    problem: string;
    solution: string;
    market: string;
    businessModel: string;
    viability: string;
    advantage: string;
    impact: string;
  };
}

export interface Gamification {
  sustainabilityScore: number;
  riskLevel: number; // 0-100
  scalabilityIndex: number; // 0-100
  aiFeedback: string;
  aiScore: number; // 0-100
}

export interface SimulationResult {
  bmc: BMC;
  valueCreation: ValueCreation;
  ltv: LTVData;
  coca: COCAData;
  ltvCocaRatio: number;
  financials: Financials;
  investorOutput: InvestorOutput;
  gamification: Gamification;
}

export interface InnovationReport {
  executiveOverview: {
    pitch: string;
    vision: string;
    thesis: string;
  };
  problemAnalysis: {
    painPoints: string;
    gapAnalysis: string;
    opportunityContext: string;
  };
  businessModelDesign: {
    bmcSummary: string;
    valueCreation: string;
    positioning: string;
  };
  financialSustainability: {
    ltvCocaAnalysis: string;
    projectionsSummary: string;
    riskSensitivity: string;
  };
  strategicRisk: {
    market: string;
    regulatory: string;
    operational: string;
    competitive: string;
  };
  growthStrategy: {
    domesticPath: string;
    internationalPotential: string;
    partnerships: string;
  };
  scorecard: {
    sustainability: number;
    scalability: number;
    innovation: number;
  };
}

export interface AppState {
  language: Language;
  step: number;
  teamInfo: TeamInfo | null;
  userStory: UserStory | null;
  elevatorPitch: ElevatorPitchInput | null;
  result: SimulationResult | null;
  report: InnovationReport | null;
  isGenerating: boolean;
  isGeneratingReport: boolean;
}
