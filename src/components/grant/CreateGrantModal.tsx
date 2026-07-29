'use client';

import { useState } from 'react';
import { X, PlusCircle, AlertTriangle } from 'lucide-react';
import { useGrants } from '@/hooks/useGrants';
import { GrantCategory } from '@/types';
import { useStellarWallet } from '@/hooks/useStellarWallet';

interface CreateGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGrantModal({ isOpen, onClose }: CreateGrantModalProps) {
  const { createGrantProposal } = useGrants();
  const { isConnected } = useStellarWallet();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GrantCategory>('Infrastructure');
  const [budgetXlm, setBudgetXlm] = useState('25000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a grant title');
      return;
    }

    const budget = parseFloat(budgetXlm);
    if (isNaN(budget) || budget <= 0) {
      setError('Please enter a valid positive budget');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createGrantProposal(title, category, budget);
      onClose();
      setTitle('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create grant program');
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
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Launch New Grant Program</h3>
            <p className="text-xs text-slate-500 font-medium">Create a new Soroban funded grant initiative</p>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Grant Program Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Soroban Cross-Chain Bridge Infrastructure"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GrantCategory)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="DeFi">DeFi</option>
                <option value="Tooling">Tooling</option>
                <option value="Education">Education</option>
                <option value="Security">Security</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Treasury Allocation (XLM)</label>
              <input
                type="number"
                value={budgetXlm}
                onChange={(e) => setBudgetXlm(e.target.value)}
                placeholder="25000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-indigo-900 leading-relaxed font-medium">
            💡 Creating a grant program registers the grant ID on the Soroban Core contract and locks initial budget allocation in the Treasury Escrow contract.
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
              {isSubmitting ? 'Submitting to Soroban...' : 'Launch Grant Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
