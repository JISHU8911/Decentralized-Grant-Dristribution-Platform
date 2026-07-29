'use client';

import { GrantApplication } from '@/types';
import { CheckCircle2, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useGrants } from '@/hooks/useGrants';
import { shortenAddress, formatAmount } from '@/services/stellar';

interface MilestoneTrackerProps {
  application: GrantApplication;
}

export function MilestoneTracker({ application }: MilestoneTrackerProps) {
  const { triggerMilestonePayout, approveApplication, rejectApplication } = useGrants();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm hover:border-indigo-200 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-base">{application.projectTitle}</h4>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                application.status === 'Approved'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : application.status === 'Submitted'
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                  : 'bg-purple-50 border border-purple-200 text-purple-700'
              }`}
            >
              {application.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1" suppressHydrationWarning>
            Applicant: <span className="font-mono text-slate-700 font-medium">{shortenAddress(application.applicant)}</span> | Requested:{' '}
            <span className="font-bold text-amber-700 font-mono">{formatAmount(application.requestedAmountXlm)} XLM</span>
          </p>
        </div>

        {application.status === 'Submitted' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => rejectApplication(application.id)}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all"
            >
              Reject
            </button>
            <button
              onClick={() => approveApplication(application.id)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              Approve Application
            </button>
          </div>
        )}
      </div>

      {/* Milestones list */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milestones & Cross-Contract Escrow Releases</h5>
        {application.milestones.map((m) => (
          <div
            key={m.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {m.isDisbursed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Clock className="h-5 w-5 text-indigo-600" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">{m.description}</div>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5" suppressHydrationWarning>
                  Escrow Amount: <span className="text-amber-700 font-bold">{formatAmount(m.payoutAmountXlm)} XLM</span>
                </div>
              </div>
            </div>

            <div>
              {m.isDisbursed ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="h-3.5 w-3.5" /> Disbursed via Treasury Vault
                </span>
              ) : (
                <button
                  onClick={() => triggerMilestonePayout(application.id, m.index)}
                  disabled={application.status !== 'Approved'}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-40 transition-all shadow-sm"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Release Escrow (Cross-Contract Call)</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
