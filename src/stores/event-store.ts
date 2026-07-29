import { create } from 'zustand';
import { ContractEventItem } from '@/types';

interface EventStoreState {
  events: ContractEventItem[];
  isSubscribed: boolean;
  addEvent: (event: ContractEventItem) => void;
  setSubscribed: (subscribed: boolean) => void;
  clearEvents: () => void;
}

const INITIAL_EVENTS: ContractEventItem[] = [
  {
    id: 'evt-1',
    eventType: 'grant_created',
    contractId: 'CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890',
    topics: ['grant', 'created'],
    payload: { grantId: 1, creator: 'GDST...WXYZ', totalBudget: 100000, category: 'Infrastructure' },
    timestamp: Date.now() - 7200000,
    txHash: '0xa1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
  },
  {
    id: 'evt-2',
    eventType: 'treasury_deposit',
    contractId: 'CCTREASURYVAULT1234567890STELLARDEVNETHERO1234567890',
    topics: ['treasury', 'deposit'],
    payload: { grantId: 1, from: 'GADMIN...9999', amount: 100000 },
    timestamp: Date.now() - 5400000,
    txHash: '0xf6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987',
  },
  {
    id: 'evt-3',
    eventType: 'application_submitted',
    contractId: 'CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890',
    topics: ['app', 'submit'],
    payload: { appId: 1, grantId: 1, applicant: 'GDEV...8888', requestedAmount: 40000 },
    timestamp: Date.now() - 3600000,
    txHash: '0x7777c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
  },
  {
    id: 'evt-4',
    eventType: 'milestone_disbursed',
    contractId: 'CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890',
    topics: ['milestone', 'disburse'],
    payload: { appId: 1, milestoneIndex: 0, recipient: 'GDEV...8888', payoutAmount: 20000 },
    timestamp: Date.now() - 1800000,
    txHash: '0x8888c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
  },
];

export const useEventStore = create<EventStoreState>((set) => ({
  events: INITIAL_EVENTS,
  isSubscribed: true,

  addEvent: (newEvent) =>
    set((state) => ({
      events: [newEvent, ...state.events.slice(0, 49)], // Keep up to 50 latest real-time events
    })),

  setSubscribed: (isSubscribed) => set({ isSubscribed }),
  clearEvents: () => set({ events: [] }),
}));
