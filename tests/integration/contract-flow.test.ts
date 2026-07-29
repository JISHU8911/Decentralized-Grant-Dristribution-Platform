import { describe, it, expect } from 'vitest';
import { SorobanContractService, CONTRACT_ADDRESSES } from '../../src/services/contract';

describe('Soroban Inter-Contract Integration Pipeline', () => {
  const service = new SorobanContractService('testnet');

  it('should execute grant creation on Soroban Core contract', async () => {
    const res = await service.invokeCreateGrant(
      'GDST...WXYZ',
      'Stellar Soroban Ecosystem Grant',
      'Infrastructure',
      50000
    );

    expect(res.success).toBe(true);
    expect(res.hash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(res.explorerUrl).toContain('stellar.expert');
  });

  it('should submit grant application and return valid tx hash', async () => {
    const res = await service.invokeSubmitApplication(
      'GDEV...8888',
      1,
      'Soroban Event Indexer',
      'https://github.com/stellar/proposal',
      25000,
      2
    );

    expect(res.success).toBe(true);
    expect(res.hash).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('should trigger inter-contract milestone payout to treasury contract', async () => {
    const res = await service.invokeApproveAndDisburseMilestone('GADMIN...9999', 1, 0);

    expect(res.success).toBe(true);
    expect(res.hash).toMatch(/^0x[a-f0-9]{64}$/);
  });
});
