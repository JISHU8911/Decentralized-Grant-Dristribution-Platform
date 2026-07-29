'use client';

import { useState } from 'react';
import { X, Send, AlertTriangle, FileText } from 'lucide-react';
import { Grant } from '@/types';
import { useGrants } from '@/hooks/useGrants';
import { useStellarWallet } from '@/hooks/useStellarWallet';

interface ApplicationModalProps {
  grant: Grant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationModal({ grant, isOpen, onClose }: ApplicationModalProps) {
  const { applyForGrant } = useGrants();
  const { isConnected } = useStellarWallet();

  const [projectTitle, setProjectTitle] = useState('');
  const [proposalUrl, setProposalUrl] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('15000');
  const [totalMilestones, setTotalMilestones] = useState('2');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !grant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !proposalUrl.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(requestedAmount);
    const milestones = parseInt(totalMilestones, 10);

    if (isNaN(amount) || amount <= 0 || amount > grant.remainingBudgetXlm) {
      setError(`Amount must be positive and within grant budget limit (${grant.remainingBudgetXlm} XLM)`);
      return;
    }

    if (isNaN(milestones) || milestones < 1 || milestones > 10) {
      setError('Total milestones must be between 1 and 10');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await applyForGrant(grant.id, projectTitle, proposalUrl, amount, milestones);
      onClose();
      setProjectTitle('');
      setProposalUrl('');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit grant application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Submit Grant Application</h3>
            <p className="text-xs text-slate-500 font-medium">Apply for Grant #{grant.id}: {grant.title}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. High Performance Soroban Indexer Node"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Proposal Repository / Spec URL</label>
            <input
              type="url"
              value={proposalUrl}
              onChange={(e) => setProposalUrl(e.target.value)}
              placeholder="https://github.com/my-org/project-proposal"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Requested Funding (XLM)</label>
              <input
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="15000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Milestones</label>
              <input
                type="number"
                value={totalMilestones}
                onChange={(e) => setTotalMilestones(e.target.value)}
                placeholder="2"
                min="1"
                max="10"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isConnected}
              className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20"
            >
              {isSubmitting ? 'Submitting to Soroban...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
