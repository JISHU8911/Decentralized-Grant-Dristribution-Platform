'use client';

import { Grant } from '@/types';
import { Users, ArrowRight } from 'lucide-react';
import { shortenAddress, formatAmount } from '@/services/stellar';

interface GrantCardProps {
  grant: Grant;
  onApply: (grant: Grant) => void;
}

export function GrantCard({ grant, onApply }: GrantCardProps) {
  const percentAllocated = Math.round(
    ((grant.totalBudgetXlm - grant.remainingBudgetXlm) / grant.totalBudgetXlm) * 100
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
            {grant.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            {grant.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
          {grant.title}
        </h3>

        <div className="text-xs text-slate-500 flex items-center gap-2 mb-4">
          <span>Created by:</span>
          <span className="font-mono text-slate-700 font-medium">{shortenAddress(grant.creator)}</span>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Treasury Allocation:</span>
            <span className="font-bold text-amber-700 font-mono" suppressHydrationWarning>{formatAmount(grant.totalBudgetXlm)} XLM</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, percentAllocated))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium" suppressHydrationWarning>
            <span>Allocated: {percentAllocated}%</span>
            <span>Available: {formatAmount(grant.remainingBudgetXlm)} XLM</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium">{grant.applicationsCount} Applications</span>
        </div>

        <button
          onClick={() => onApply(grant)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
        >
          <span>Apply Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
