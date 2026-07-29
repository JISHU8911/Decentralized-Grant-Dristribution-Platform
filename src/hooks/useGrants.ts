import { useGrantStore } from '@/stores/grant-store';
import { useTxStore } from '@/stores/tx-store';
import { useEventStore } from '@/stores/event-store';
import { SorobanContractService, CONTRACT_ADDRESSES } from '@/services/contract';
import { useStellarWallet } from './useStellarWallet';

export function useGrants() {
  const {
    grants,
    applications,
    treasuryBalanceXlm,
    addGrant,
    addApplication,
    approveApplication,
    rejectApplication,
    disburseMilestone,
  } = useGrantStore();

  const { addTransaction, updateStatus } = useTxStore();
  const { addEvent } = useEventStore();
  const { address, network } = useStellarWallet();

  const contractService = new SorobanContractService(network);

  const createGrantProposal = async (title: string, category: any, budgetXlm: number) => {
    if (!address) throw new Error('Wallet not connected');

    const txId = addTransaction({
      hash: 'Pending submission...',
      type: `Create Grant: ${title}`,
      contractId: CONTRACT_ADDRESSES.grantPlatform,
      status: 'processing',
      explorerUrl: '#',
    });

    try {
      const res = await contractService.invokeCreateGrant(address, title, category, budgetXlm);

      if (res.success) {
        const newGrant = addGrant({
          title,
          category,
          creator: address,
          totalBudgetXlm: budgetXlm,
          remainingBudgetXlm: budgetXlm,
          status: 'Active',
        });

        updateStatus(txId, 'confirmed', { hash: res.hash, fee: '0.00001' });

        addEvent({
          id: `evt-g-${Date.now()}`,
          eventType: 'grant_created',
          contractId: CONTRACT_ADDRESSES.grantPlatform,
          topics: ['grant', 'created'],
          payload: { grantId: newGrant.id, creator: address, totalBudget: budgetXlm, category },
          timestamp: Date.now(),
          txHash: res.hash,
        });

        return newGrant;
      } else {
        updateStatus(txId, 'failed', { error: res.error });
        throw new Error(res.error || 'Transaction failed');
      }
    } catch (error: any) {
      updateStatus(txId, 'failed', { error: error.message });
      throw error;
    }
  };

  const applyForGrant = async (
    grantId: number,
    projectTitle: string,
    proposalUrl: string,
    requestedAmountXlm: number,
    totalMilestones: number
  ) => {
    if (!address) throw new Error('Wallet not connected');

    const txId = addTransaction({
      hash: 'Pending submission...',
      type: `Apply for Grant #${grantId}`,
      contractId: CONTRACT_ADDRESSES.grantPlatform,
      status: 'processing',
      explorerUrl: '#',
    });

    try {
      const res = await contractService.invokeSubmitApplication(
        address,
        grantId,
        projectTitle,
        proposalUrl,
        requestedAmountXlm,
        totalMilestones
      );

      if (res.success) {
        const newApp = addApplication({
          grantId,
          applicant: address,
          projectTitle,
          proposalUrl,
          requestedAmountXlm,
          totalMilestones,
        });

        updateStatus(txId, 'confirmed', { hash: res.hash, fee: '0.000012' });

        addEvent({
          id: `evt-app-${Date.now()}`,
          eventType: 'application_submitted',
          contractId: CONTRACT_ADDRESSES.grantPlatform,
          topics: ['app', 'submit'],
          payload: { appId: newApp.id, grantId, applicant: address, requestedAmount: requestedAmountXlm },
          timestamp: Date.now(),
          txHash: res.hash,
        });

        return newApp;
      } else {
        updateStatus(txId, 'failed', { error: res.error });
        throw new Error(res.error || 'Transaction failed');
      }
    } catch (error: any) {
      updateStatus(txId, 'failed', { error: error.message });
      throw error;
    }
  };

  const triggerMilestonePayout = async (appId: number, milestoneIndex: number) => {
    if (!address) throw new Error('Wallet not connected');

    const txId = addTransaction({
      hash: 'Pending submission...',
      type: `Disburse Milestone #${milestoneIndex + 1} (App #${appId})`,
      contractId: CONTRACT_ADDRESSES.grantPlatform,
      status: 'processing',
      explorerUrl: '#',
    });

    try {
      const res = await contractService.invokeApproveAndDisburseMilestone(address, appId, milestoneIndex);

      if (res.success) {
        const { amount, recipient, grantId } = disburseMilestone(appId, milestoneIndex);

        updateStatus(txId, 'confirmed', { hash: res.hash, fee: '0.000015' });

        addEvent({
          id: `evt-ms-${Date.now()}`,
          eventType: 'milestone_disbursed',
          contractId: CONTRACT_ADDRESSES.grantPlatform,
          topics: ['milestone', 'disburse'],
          payload: { appId, milestoneIndex, recipient, payoutAmount: amount },
          timestamp: Date.now(),
          txHash: res.hash,
        });
      } else {
        updateStatus(txId, 'failed', { error: res.error });
      }
    } catch (error: any) {
      updateStatus(txId, 'failed', { error: error.message });
    }
  };

  return {
    grants,
    applications,
    treasuryBalanceXlm,
    createGrantProposal,
    applyForGrant,
    approveApplication,
    rejectApplication,
    triggerMilestonePayout,
  };
}
