'use client';

import { ContractEventItem } from '@/types';
import { Activity, ArrowUpRight, Coins, FileText, Layers, Shield } from 'lucide-react';
import { formatTxExplorerUrl } from '@/services/stellar';

interface ActivityFeedItemProps {
  event: ContractEventItem;
}

export function ActivityFeedItem({ event }: ActivityFeedItemProps) {
  const getBadgeStyle = () => {
    switch (event.eventType) {
      case 'grant_created':
        return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: Layers, label: 'Grant Created' };
      case 'application_submitted':
        return { bg: 'bg-cyan-50 border-cyan-200 text-cyan-700', icon: FileText, label: 'Application Submitted' };
      case 'milestone_disbursed':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: Coins, label: 'Milestone Disbursed' };
      case 'treasury_deposit':
        return { bg: 'bg-purple-50 border-purple-200 text-purple-700', icon: Shield, label: 'Treasury Funded' };
      default:
        return { bg: 'bg-slate-100 border-slate-200 text-slate-700', icon: Activity, label: 'Soroban Event' };
    }
  };

  const badge = getBadgeStyle();
  const Icon = badge.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 shadow-xs transition-all">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl border ${badge.bg} shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badge.bg}`}>
              {badge.label}
            </span>
            <span className="text-[11px] text-slate-500 font-mono" suppressHydrationWarning>
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="text-xs font-mono text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            {JSON.stringify(event.payload)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <a
          href={formatTxExplorerUrl(event.txHash)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-mono text-indigo-600 hover:underline bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold"
        >
          <span>Hash: {event.txHash.substring(0, 8)}...</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
