export type SupportedWallet = 'freighter' | 'albedo' | 'hana' | 'xbull';

export type NetworkType = 'testnet' | 'futurenet' | 'standalone' | 'mainnet';

export interface WalletState {
  address: string | null;
  network: NetworkType;
  walletType: SupportedWallet | null;
  balanceXlm: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export type TransactionStatus = 'pending' | 'processing' | 'confirmed' | 'failed';

export interface TransactionItem {
  id: string;
  hash: string;
  type: string;
  contractId: string;
  status: TransactionStatus;
  timestamp: number;
  explorerUrl: string;
  errorDetails?: string;
  feePaidXlm?: string;
}

export type GrantCategory = 'Infrastructure' | 'DeFi' | 'Tooling' | 'Education' | 'Security' | 'Gaming';

export type GrantStatus = 'Active' | 'Completed' | 'Draft' | 'Cancelled';

export type ApplicationStatus = 'Submitted' | 'UnderReview' | 'Approved' | 'Rejected' | 'MilestonesCompleted';

export interface Milestone {
  id: number;
  applicationId: number;
  index: number;
  description: string;
  payoutAmountXlm: number;
  isApproved: boolean;
  isDisbursed: boolean;
}

export interface GrantApplication {
  id: number;
  grantId: number;
  applicant: string;
  projectTitle: string;
  proposalUrl: string;
  requestedAmountXlm: number;
  totalMilestones: number;
  completedMilestones: number;
  status: ApplicationStatus;
  submittedAt: number;
  milestones: Milestone[];
}

export interface Grant {
  id: number;
  title: string;
  category: GrantCategory;
  creator: string;
  totalBudgetXlm: number;
  remainingBudgetXlm: number;
  status: GrantStatus;
  createdAt: number;
  applicationsCount: number;
}

export interface ContractEventItem {
  id: string;
  eventType: 'grant_created' | 'application_submitted' | 'application_reviewed' | 'milestone_disbursed' | 'treasury_deposit';
  contractId: string;
  topics: string[];
  payload: Record<string, any>;
  timestamp: number;
  txHash: string;
}
