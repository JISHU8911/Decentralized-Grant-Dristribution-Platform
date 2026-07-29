import { create } from 'zustand';
import { TransactionItem, TransactionStatus } from '@/types';

interface TxStoreState {
  transactions: TransactionItem[];
  addTransaction: (tx: Omit<TransactionItem, 'id' | 'timestamp'>) => string;
  updateStatus: (id: string, status: TransactionStatus, details?: { hash?: string; error?: string; fee?: string }) => void;
  clearTransactions: () => void;
}

export const useTxStore = create<TxStoreState>((set) => ({
  transactions: [
    {
      id: 'tx-init-1',
      hash: '0xa1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
      type: 'Initialize Grant Platform',
      contractId: 'CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890',
      status: 'confirmed',
      timestamp: Date.now() - 3600000 * 2,
      explorerUrl: 'https://stellar.expert/explorer/testnet/tx/0xa1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
      feePaidXlm: '0.00001',
    },
    {
      id: 'tx-init-2',
      hash: '0xf6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987',
      type: 'Deposit Treasury Reserve',
      contractId: 'CCTREASURYVAULT1234567890STELLARDEVNETHERO1234567890',
      status: 'confirmed',
      timestamp: Date.now() - 3600000 * 1,
      explorerUrl: 'https://stellar.expert/explorer/testnet/tx/0xf6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987',
      feePaidXlm: '0.000015',
    }
  ],

  addTransaction: (txData) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newTx: TransactionItem = {
      ...txData,
      id,
      timestamp: Date.now(),
    };
    set((state) => ({ transactions: [newTx, ...state.transactions] }));
    return id;
  },

  updateStatus: (id, status, details) => {
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              status,
              hash: details?.hash || tx.hash,
              errorDetails: details?.error || tx.errorDetails,
              feePaidXlm: details?.fee || tx.feePaidXlm,
            }
          : tx
      ),
    }));
  },

  clearTransactions: () => set({ transactions: [] }),
}));
