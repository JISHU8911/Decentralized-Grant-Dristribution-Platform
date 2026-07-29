import { describe, it, expect, beforeEach } from 'vitest';
import { useWalletStore } from '@/stores/wallet-store';

describe('Stellar Wallet Infrastructure Store', () => {
  const TEST_STELLAR_PUBKEY = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYSFZW2BV3CYGMOKBN2';

  beforeEach(() => {
    useWalletStore.getState().disconnect();
  });

  it('should initialize with disconnected wallet state', () => {
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.walletType).toBeNull();
    expect(state.balanceXlm).toBe('0.00');
  });

  it('should connect real Freighter wallet and store public key and balance', () => {
    useWalletStore.getState().setWallet(TEST_STELLAR_PUBKEY, 'freighter', '100.00');

    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(true);
    expect(state.address).toBe(TEST_STELLAR_PUBKEY);
    expect(state.walletType).toBe('freighter');
    expect(state.balanceXlm).toBe('100.00');
  });

  it('should clear session upon disconnect', () => {
    useWalletStore.getState().setWallet(TEST_STELLAR_PUBKEY, 'albedo', '50.00');
    useWalletStore.getState().disconnect();

    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.walletType).toBeNull();
  });
});
