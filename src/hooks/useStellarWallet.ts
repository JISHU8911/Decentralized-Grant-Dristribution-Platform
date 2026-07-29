import { useWalletStore } from '@/stores/wallet-store';
import { SupportedWallet } from '@/types';
import {
  isConnected as isFreighterConnected,
  requestAccess as requestFreighterAccess,
  getAddress as getFreighterAddress,
} from '@stellar/freighter-api';
import { fetchAccountBalance } from '@/services/stellar';

export function useStellarWallet() {
  const {
    address,
    network,
    walletType,
    balanceXlm,
    isConnected,
    isConnecting,
    error,
    setWallet,
    disconnect,
    setConnecting,
    setError,
    setNetwork,
    setBalance,
  } = useWalletStore();

  const connectWallet = async (type: SupportedWallet) => {
    setConnecting(true);
    setError(null);

    try {
      if (type === 'freighter') {
        const connectedRes = await isFreighterConnected();
        const isConn =
          typeof connectedRes === 'boolean'
            ? connectedRes
            : connectedRes && connectedRes.isConnected;

        if (!isConn) {
          throw new Error(
            'Freighter Wallet Not Installed. Please install the Freighter extension from https://freighter.app'
          );
        }

        let pubKey = '';
        try {
          const accessRes = await requestFreighterAccess();
          if (accessRes && (accessRes as any).address) {
            pubKey = (accessRes as any).address;
          } else if (typeof accessRes === 'string') {
            pubKey = accessRes;
          }
        } catch (accessErr) {
          const addressRes = await getFreighterAddress();
          if (addressRes && (addressRes as any).address) {
            pubKey = (addressRes as any).address;
          } else if (typeof addressRes === 'string') {
            pubKey = addressRes;
          }
        }

        if (!pubKey) {
          throw new Error('Connection request rejected or no public key returned by Freighter.');
        }

        // Fetch live native XLM balance from Horizon RPC
        const liveBalance = await fetchAccountBalance(pubKey, network);
        setWallet(pubKey, 'freighter', liveBalance);
        return;
      }

      if (type === 'albedo') {
        if (typeof window !== 'undefined' && (window as any).albedo) {
          const res = await (window as any).albedo.publicKey({});
          const pubKey = res.pubkey;
          const liveBalance = await fetchAccountBalance(pubKey, network);
          setWallet(pubKey, 'albedo', liveBalance);
        } else {
          throw new Error('Albedo wallet provider is not available in browser context.');
        }
        return;
      }

      if (type === 'hana') {
        if (typeof window !== 'undefined' && (window as any).hana) {
          const pubKey = await (window as any).hana.getPublicKey();
          const liveBalance = await fetchAccountBalance(pubKey, network);
          setWallet(pubKey, 'hana', liveBalance);
        } else {
          throw new Error('Hana Wallet extension is not installed in your browser.');
        }
        return;
      }

      if (type === 'xbull') {
        if (typeof window !== 'undefined' && (window as any).xBullWallet) {
          const pubKey = await (window as any).xBullWallet.getPublicKey();
          const liveBalance = await fetchAccountBalance(pubKey, network);
          setWallet(pubKey, 'xbull', liveBalance);
        } else {
          throw new Error('xBull Wallet extension is not installed in your browser.');
        }
        return;
      }

      throw new Error(`Unsupported wallet provider: ${type}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const refreshBalance = async () => {
    if (address) {
      const liveBalance = await fetchAccountBalance(address, network);
      setBalance(liveBalance);
    }
  };

  return {
    address,
    network,
    walletType,
    balanceXlm,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnect,
    setNetwork,
    setBalance,
    refreshBalance,
  };
}
