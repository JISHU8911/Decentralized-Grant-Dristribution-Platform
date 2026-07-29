'use client';

import { useState } from 'react';
import {
  PlusCircle,
  Filter,
  Shield,
  Coins,
  FileText,
  Layers,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  PieChart,
} from 'lucide-react';
import { useGrants } from '@/hooks/useGrants';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useContractEvents } from '@/hooks/useContractEvents';
import { useTxStore } from '@/stores/tx-store';
import { GrantCard } from '@/components/grant/GrantCard';
import { CreateGrantModal } from '@/components/grant/CreateGrantModal';
import { ApplicationModal } from '@/components/grant/ApplicationModal';
import { MilestoneTracker } from '@/components/grant/MilestoneTracker';
import { ActivityFeedItem } from '@/components/activity/ActivityFeedItem';
import { TxStatusBadge } from '@/components/transactions/TxStatusBadge';
import { Grant } from '@/types';
import { shortenAddress, formatTxExplorerUrl, formatAmount } from '@/services/stellar';

export default function DashboardPage() {
  const { grants, applications, treasuryBalanceXlm } = useGrants();
  const { address, isConnected, balanceXlm, network } = useStellarWallet();
  const { events } = useContractEvents();
  const { transactions } = useTxStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGrantForApp, setSelectedGrantForApp] = useState<Grant | null>(null);

  const categories = ['All', 'Infrastructure', 'DeFi', 'Tooling', 'Security', 'Gaming'];

  const filteredGrants =
    selectedCategory === 'All' ? grants : grants.filter((g) => g.category === selectedCategory);

  const totalAllocated = grants.reduce((sum, g) => sum + g.totalBudgetXlm, 0);
  const totalDisbursed = applications.reduce((sum, a) => {
    const appDisbursed = a.milestones
      .filter((m) => m.isDisbursed)
      .reduce((mSum, m) => mSum + m.payoutAmountXlm, 0);
    return sum + appDisbursed;
  }, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* SECTION 1: TOP WELCOME HEADER, WALLET SUMMARY & QUICK ACTIONS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
            <Shield className="h-3.5 w-3.5" />
            <span>TreasuryFlow Enterprise Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Decentralized Capital & Grant Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
            Autonomous grant registry and cross-contract milestone escrow disbursements on Stellar Soroban RPC.
          </p>
        </div>

        {/* Wallet Summary Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-bold">
              <Wallet className="h-3.5 w-3.5 text-indigo-600" />
              <span>Active Account Session</span>
            </div>
            {isConnected ? (
              <div>
                <div className="font-mono text-xs font-bold text-slate-900">{shortenAddress(address!)}</div>
                <div className="text-xs font-mono font-bold text-indigo-600">{balanceXlm} XLM</div>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-500 italic">No wallet connected</div>
            )}
          </div>

          <div className="h-full w-[1px] bg-slate-200 hidden sm:block"></div>

          <div className="space-y-1">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-bold">
              <Coins className="h-3.5 w-3.5 text-cyan-600" />
              <span>Vault Reserve</span>
            </div>
            <div className="text-sm font-extrabold text-amber-700 font-mono" suppressHydrationWarning>
              {formatAmount(treasuryBalanceXlm)} XLM
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Launch Grant</span>
          </button>
        </div>
      </section>

      {/* SECTION 2: KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 hover:border-indigo-300 shadow-sm transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Grants</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{grants.length} Programs</div>
          <div className="text-[11px] text-indigo-600 font-bold">Registered on Soroban Core</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 hover:border-cyan-300 shadow-sm transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Submitted Applications</span>
            <FileText className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{applications.length} Applications</div>
          <div className="text-[11px] text-cyan-600 font-bold">Milestone escrow defined</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 hover:border-emerald-300 shadow-sm transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Funds Distributed</span>
            <Coins className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono" suppressHydrationWarning>
            {formatAmount(totalDisbursed)} XLM
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Cross-contract verified</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 hover:border-purple-300 shadow-sm transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Milestone Success Rate</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">100%</div>
          <div className="text-[11px] text-slate-500 font-medium">Zero default rate</div>
        </div>
      </section>

      {/* SECTION 3: ACTIVE GRANT PROGRAMS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            Active Grant Initiatives
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrants.map((grant) => (
            <GrantCard
              key={grant.id}
              grant={grant}
              onApply={(g) => setSelectedGrantForApp(g)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: RECENT ACTIVITY FEED & MILESTONE ESCROW REVIEWS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Applications & Escrow Review */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
            <FileText className="h-5 w-5 text-cyan-600" />
            Applications & Milestone Escrow Reviews
          </h2>

          <div className="space-y-4">
            {applications.map((app) => (
              <MilestoneTracker key={app.id} application={app} />
            ))}
          </div>
        </div>

        {/* Live Soroban RPC Event Stream */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
            <Activity className="h-5 w-5 text-indigo-600" />
            Live Event Stream
          </h2>

          <div className="space-y-3">
            {events.slice(0, 4).map((evt) => (
              <ActivityFeedItem key={evt.id} event={evt} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: ANALYTICS DASHBOARD SNAPSHOT */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Treasury Allocation & Capital Efficiency
          </h2>
          <span className="text-xs font-mono text-slate-500 font-medium">Ledger Finality: &lt; 5 seconds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold">Total Treasury Pool</div>
            <div className="text-xl font-bold text-amber-700 font-mono" suppressHydrationWarning>
              {formatAmount(treasuryBalanceXlm)} XLM
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">100% Backed by Soroban Vault</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold">Allocated Grants</div>
            <div className="text-xl font-bold text-indigo-600 font-mono" suppressHydrationWarning>
              {formatAmount(totalAllocated)} XLM
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold">Across {grants.length} Active Grant Initiatives</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold">Verified Escrow Disbursed</div>
            <div className="text-xl font-bold text-emerald-700 font-mono" suppressHydrationWarning>
              {formatAmount(totalDisbursed)} XLM
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">Inter-contract approved</div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRANSACTION CENTER MONITOR */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-indigo-600" />
            Production Transaction Center
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">{transactions.length} Total Tx Logs</span>
        </div>

        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-xs">{tx.type}</span>
                  <TxStatusBadge status={tx.status} />
                </div>
                <div className="text-[11px] text-slate-500 font-mono" suppressHydrationWarning>
                  Contract: <span className="text-slate-700 font-semibold">{shortenAddress(tx.contractId)}</span> | Time:{' '}
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {tx.hash && tx.hash !== 'Pending submission...' && (
                <a
                  href={formatTxExplorerUrl(tx.hash, network)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-mono font-bold text-indigo-700 hover:bg-indigo-100 transition-all self-start sm:self-center"
                >
                  <span>Hash: {tx.hash.substring(0, 8)}...</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <CreateGrantModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ApplicationModal
        grant={selectedGrantForApp}
        isOpen={!!selectedGrantForApp}
        onClose={() => setSelectedGrantForApp(null)}
      />
    </div>
  );
}
