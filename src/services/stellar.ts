import { Horizon, rpc } from '@stellar/stellar-sdk';
import { NetworkType } from '@/types';

export const CONTRACT_ADDRESSES = {
  grantPlatform: process.env.NEXT_PUBLIC_GRANT_PLATFORM_CONTRACT || 'CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890',
  grantTreasury: process.env.NEXT_PUBLIC_GRANT_TREASURY_CONTRACT || 'CCTREASURYVAULT1234567890STELLARDEVNETHERO1234567890',
};

export const NETWORK_CONFIG: Record<NetworkType, { rpcUrl: string; networkPassphrase: string; explorerUrl: string }> = {
  testnet: {
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org:443',
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
  },
  futurenet: {
    rpcUrl: 'https://rpc-futurenet.stellar.org:443',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
    explorerUrl: 'https://stellar.expert/explorer/futurenet',
  },
  standalone: {
    rpcUrl: 'http://localhost:8000/soroban/rpc',
    networkPassphrase: 'Standalone Network ; February 2022',
    explorerUrl: 'http://localhost:8000',
  },
  mainnet: {
    rpcUrl: 'https://soroban-rpc.mainnet.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    explorerUrl: 'https://stellar.expert/explorer/public',
  },
};

export const getRpcServer = (network: NetworkType = 'testnet'): rpc.Server => {
  const config = NETWORK_CONFIG[network];
  return new rpc.Server(config.rpcUrl);
};

export const formatTxExplorerUrl = (txHash: string, network: NetworkType = 'testnet'): string => {
  const config = NETWORK_CONFIG[network];
  return `${config.explorerUrl}/tx/${txHash}`;
};

export const formatContractExplorerUrl = (contractId: string, network: NetworkType = 'testnet'): string => {
  const config = NETWORK_CONFIG[network];
  return `${config.explorerUrl}/contract/${contractId}`;
};

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const formatAmount = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

export const fetchAccountBalance = async (address: string, network: NetworkType = 'testnet'): Promise<string> => {
  if (!address) return '0.00';
  try {
    const horizonUrl =
      network === 'mainnet'
        ? 'https://horizon.stellar.org'
        : network === 'futurenet'
        ? 'https://horizon-futurenet.stellar.org'
        : 'https://horizon-testnet.stellar.org';

    const response = await fetch(`${horizonUrl}/accounts/${address}`);
    if (!response.ok) {
      if (response.status === 404) {
        return '0.00 (Unfunded)';
      }
      return '0.00';
    }

    const data = await response.json();
    const nativeBalance = data.balances?.find((b: any) => b.asset_type === 'native');
    if (nativeBalance && nativeBalance.balance) {
      const parsed = parseFloat(nativeBalance.balance);
      return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
    }
    return '0.00';
  } catch (err) {
    console.warn('Failed to fetch account balance from Horizon:', err);
    return '0.00';
  }
};

