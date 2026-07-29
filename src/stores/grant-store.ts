import { create } from 'zustand';
import { Grant, GrantApplication, Milestone } from '@/types';

interface GrantStoreState {
  grants: Grant[];
  applications: GrantApplication[];
  treasuryBalanceXlm: number;
  addGrant: (grant: Omit<Grant, 'id' | 'createdAt' | 'applicationsCount'>) => Grant;
  addApplication: (app: Omit<GrantApplication, 'id' | 'submittedAt' | 'completedMilestones' | 'status' | 'milestones'>) => GrantApplication;
  approveApplication: (appId: number) => void;
  rejectApplication: (appId: number) => void;
  disburseMilestone: (appId: number, milestoneIndex: number) => { amount: number; recipient: string; grantId: number };
}

const INITIAL_GRANTS: Grant[] = [
  {
    id: 1,
    title: 'Stellar Infrastructure & Soroban SDK Grants Q3',
    category: 'Infrastructure',
    creator: 'GDST...WXYZ',
    totalBudgetXlm: 100000,
    remainingBudgetXlm: 60000,
    status: 'Active',
    createdAt: Date.now() - 7200000,
    applicationsCount: 2,
  },
  {
    id: 2,
    title: 'DeFi Liquidity & Automated Market Maker Innovation',
    category: 'DeFi',
    creator: 'GDST...WXYZ',
    totalBudgetXlm: 75000,
    remainingBudgetXlm: 75000,
    status: 'Active',
    createdAt: Date.now() - 5400000,
    applicationsCount: 1,
  },
  {
    id: 3,
    title: 'Soroban Security Audit & Verification Tooling',
    category: 'Security',
    creator: 'GADMIN...9999',
    totalBudgetXlm: 50000,
    remainingBudgetXlm: 50000,
    status: 'Active',
    createdAt: Date.now() - 3600000,
    applicationsCount: 0,
  },
];

const INITIAL_APPLICATIONS: GrantApplication[] = [
  {
    id: 1,
    grantId: 1,
    applicant: 'GDEV...8888',
    projectTitle: 'Soroban Real-time Event Streaming Indexer',
    proposalUrl: 'https://github.com/stellar/event-indexer-proposal',
    requestedAmountXlm: 40000,
    totalMilestones: 2,
    completedMilestones: 1,
    status: 'Approved',
    submittedAt: Date.now() - 3600000,
    milestones: [
      {
        id: 101,
        applicationId: 1,
        index: 0,
        description: 'Core Indexer Architecture & Websocket Engine',
        payoutAmountXlm: 20000,
        isApproved: true,
        isDisbursed: true,
      },
      {
        id: 102,
        applicationId: 1,
        index: 1,
        description: 'Production Multi-node Sync & UI SDK Integration',
        payoutAmountXlm: 20000,
        isApproved: false,
        isDisbursed: false,
      },
    ],
  },
  {
    id: 2,
    grantId: 1,
    applicant: 'GBUILDER...7777',
    projectTitle: 'Stellar CLI Smart Contract Verification Plugin',
    proposalUrl: 'https://github.com/stellar/cli-verifier',
    requestedAmountXlm: 25000,
    totalMilestones: 2,
    completedMilestones: 0,
    status: 'Submitted',
    submittedAt: Date.now() - 1800000,
    milestones: [
      {
        id: 201,
        applicationId: 2,
        index: 0,
        description: 'Bytecode hashing and source verification spec',
        payoutAmountXlm: 12500,
        isApproved: false,
        isDisbursed: false,
      },
      {
        id: 202,
        applicationId: 2,
        index: 1,
        description: 'CLI Integration and Testnet API Deployment',
        payoutAmountXlm: 12500,
        isApproved: false,
        isDisbursed: false,
      },
    ],
  },
];

export const useGrantStore = create<GrantStoreState>((set, get) => ({
  grants: INITIAL_GRANTS,
  applications: INITIAL_APPLICATIONS,
  treasuryBalanceXlm: 225000,

  addGrant: (newGrantData) => {
    const nextId = get().grants.length + 1;
    const newGrant: Grant = {
      ...newGrantData,
      id: nextId,
      createdAt: Date.now(),
      applicationsCount: 0,
    };
    set((state) => ({
      grants: [newGrant, ...state.grants],
      treasuryBalanceXlm: state.treasuryBalanceXlm + newGrant.totalBudgetXlm,
    }));
    return newGrant;
  },

  addApplication: (appData) => {
    const nextAppId = get().applications.length + 1;
    const milestonePayout = appData.requestedAmountXlm / appData.totalMilestones;

    const milestones: Milestone[] = Array.from({ length: appData.totalMilestones }).map((_, idx) => ({
      id: nextAppId * 100 + idx,
      applicationId: nextAppId,
      index: idx,
      description: `Milestone #${idx + 1}: Implementation Phase`,
      payoutAmountXlm: milestonePayout,
      isApproved: false,
      isDisbursed: false,
    }));

    const newApp: GrantApplication = {
      ...appData,
      id: nextAppId,
      completedMilestones: 0,
      status: 'Submitted',
      submittedAt: Date.now(),
      milestones,
    };

    set((state) => ({
      applications: [newApp, ...state.applications],
      grants: state.grants.map((g) =>
        g.id === appData.grantId ? { ...g, applicationsCount: g.applicationsCount + 1 } : g
      ),
    }));

    return newApp;
  },

  approveApplication: (appId) => {
    set((state) => {
      const app = state.applications.find((a) => a.id === appId);
      if (!app) return state;

      return {
        applications: state.applications.map((a) => (a.id === appId ? { ...a, status: 'Approved' } : a)),
        grants: state.grants.map((g) =>
          g.id === app.grantId
            ? { ...g, remainingBudgetXlm: Math.max(0, g.remainingBudgetXlm - app.requestedAmountXlm) }
            : g
        ),
      };
    });
  },

  rejectApplication: (appId) => {
    set((state) => ({
      applications: state.applications.map((a) => (a.id === appId ? { ...a, status: 'Rejected' } : a)),
    }));
  },

  disburseMilestone: (appId, milestoneIndex) => {
    let result = { amount: 0, recipient: '', grantId: 0 };
    set((state) => {
      const app = state.applications.find((a) => a.id === appId);
      if (!app) return state;

      const updatedMilestones = app.milestones.map((m) => {
        if (m.index === milestoneIndex) {
          result = { amount: m.payoutAmountXlm, recipient: app.applicant, grantId: app.grantId };
          return { ...m, isApproved: true, isDisbursed: true };
        }
        return m;
      });

      const completedCount = updatedMilestones.filter((m) => m.isDisbursed).length;
      const isAllDone = completedCount >= app.totalMilestones;

      return {
        treasuryBalanceXlm: Math.max(0, state.treasuryBalanceXlm - result.amount),
        applications: state.applications.map((a) =>
          a.id === appId
            ? {
                ...a,
                completedMilestones: completedCount,
                status: isAllDone ? 'MilestonesCompleted' : 'Approved',
                milestones: updatedMilestones,
              }
            : a
        ),
      };
    });
    return result;
  },
}));
