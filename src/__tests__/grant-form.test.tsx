import { describe, it, expect, beforeEach } from 'vitest';
import { useGrantStore } from '@/stores/grant-store';

describe('Grant Platform Business Logic Store', () => {
  it('should create new grant program and update treasury allocation', () => {
    const initialCount = useGrantStore.getState().grants.length;
    const initialTreasury = useGrantStore.getState().treasuryBalanceXlm;

    const newGrant = useGrantStore.getState().addGrant({
      title: 'Soroban Rust Tools',
      category: 'Tooling',
      creator: 'GADMIN...1234',
      totalBudgetXlm: 50000,
      remainingBudgetXlm: 50000,
      status: 'Active',
    });

    expect(useGrantStore.getState().grants.length).toBe(initialCount + 1);
    expect(useGrantStore.getState().treasuryBalanceXlm).toBe(initialTreasury + 50000);
    expect(newGrant.title).toBe('Soroban Rust Tools');
  });

  it('should submit grant application with milestone breakdown', () => {
    const newApp = useGrantStore.getState().addApplication({
      grantId: 1,
      applicant: 'GDEV...9999',
      projectTitle: 'Stellar Indexer Node',
      proposalUrl: 'https://github.com/stellar/proposal',
      requestedAmountXlm: 20000,
      totalMilestones: 2,
    });

    expect(newApp.milestones.length).toBe(2);
    expect(newApp.milestones[0].payoutAmountXlm).toBe(10000);
    expect(newApp.status).toBe('Submitted');
  });

  it('should disburse milestone and deduct from vault balance', () => {
    const app = useGrantStore.getState().applications[0];
    const initialVault = useGrantStore.getState().treasuryBalanceXlm;

    const result = useGrantStore.getState().disburseMilestone(app.id, 1);

    expect(result.amount).toBe(10000);
    expect(useGrantStore.getState().treasuryBalanceXlm).toBe(initialVault - 10000);
  });
});
