import { describe, it, expect, beforeEach } from 'vitest';
import { useTxStore } from '@/stores/tx-store';

describe('Transaction Center Store', () => {
  beforeEach(() => {
    useTxStore.getState().clearTransactions();
  });

  it('should add pending transaction and transition status', () => {
    const txId = useTxStore.getState().addTransaction({
      hash: 'Pending submission...',
      type: 'Create Grant Initiative',
      contractId: 'CCGRANTPLATFORM123',
      status: 'processing',
      explorerUrl: '#',
    });

    let txs = useTxStore.getState().transactions;
    expect(txs.length).toBe(1);
    expect(txs[0].status).toBe('processing');

    useTxStore.getState().updateStatus(txId, 'confirmed', {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      fee: '0.00001',
    });

    txs = useTxStore.getState().transactions;
    expect(txs[0].status).toBe('confirmed');
    expect(txs[0].hash).toContain('0x123456');
    expect(txs[0].feePaidXlm).toBe('0.00001');
  });

  it('should record failed transaction error details', () => {
    const txId = useTxStore.getState().addTransaction({
      hash: 'Pending submission...',
      type: 'Disburse Milestone',
      contractId: 'CCGRANTPLATFORM123',
      status: 'processing',
      explorerUrl: '#',
    });

    useTxStore.getState().updateStatus(txId, 'failed', {
      error: 'Exceeds remaining budget',
    });

    const txs = useTxStore.getState().transactions;
    expect(txs[0].status).toBe('failed');
    expect(txs[0].errorDetails).toBe('Exceeds remaining budget');
  });
});
