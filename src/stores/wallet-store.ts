import { create } from 'zustand';
import { SupportedWallet, NetworkType, WalletState } from '@/types';

interface WalletStoreActions {
  setWallet: (address: string, walletType: SupportedWallet, balance?: string) => void;
  disconnect: () => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  setNetwork: (network: NetworkType) => void;
  setBalance: (balance: string) => void;
}

const INITIAL_STATE: WalletState = {
  address: null,
  network: 'testnet',
  walletType: null,
  balanceXlm: '0.00',
  isConnected: false,
  isConnecting: false,
  error: null,
};

export const useWalletStore = create<WalletState & WalletStoreActions>((set) => ({
  ...INITIAL_STATE,

  setWallet: (address, walletType, balance = '0.00') =>
    set({
      address,
      walletType,
      balanceXlm: balance,
      isConnected: true,
      isConnecting: false,
      error: null,
    }),

  disconnect: () =>
    set({
      address: null,
      walletType: null,
      balanceXlm: '0.00',
      isConnected: false,
      isConnecting: false,
      error: null,
    }),

  setConnecting: (isConnecting) => set({ isConnecting }),
  setError: (error) => set({ error, isConnecting: false }),
  setNetwork: (network) => set({ network }),
  setBalance: (balanceXlm) => set({ balanceXlm }),
}));
