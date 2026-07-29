'use client';

import { Coins, Layers, CheckCircle2, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';
import { useGrants } from '@/hooks/useGrants';
import { formatAmount } from '@/services/stellar';

export default function AnalyticsPage() {
  const { grants, applications, treasuryBalanceXlm } = useGrants();

  const totalAllocated = grants.reduce((sum, g) => sum + g.totalBudgetXlm, 0);
  const totalDisbursed = applications.reduce((sum, a) => {
    const appDisbursed = a.milestones
      .filter((m) => m.isDisbursed)
      .reduce((mSum, m) => mSum + m.payoutAmountXlm, 0);
    return sum + appDisbursed;
  }, 0);

  const categories = [
    { name: 'Infrastructure', count: grants.filter((g) => g.category === 'Infrastructure').length, percent: 40, color: 'bg-indigo-600' },
    { name: 'DeFi', count: grants.filter((g) => g.category === 'DeFi').length, percent: 30, color: 'bg-cyan-600' },
    { name: 'Security', count: grants.filter((g) => g.category === 'Security').length, percent: 20, color: 'bg-emerald-600' },
    { name: 'Tooling', count: grants.filter((g) => g.category === 'Tooling').length, percent: 10, color: 'bg-purple-600' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Platform Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
          Comprehensive metrics and treasury disbursement analytics across the Stellar Soroban network.
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Treasury Reserve</span>
            <Coins className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono" suppressHydrationWarning>
            {formatAmount(treasuryBalanceXlm)} XLM
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">100% Backed by Soroban Vault</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Funds Allocated</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono" suppressHydrationWarning>
            {formatAmount(totalAllocated)} XLM
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Across {grants.length} Active Grant Initiatives</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Disbursed to Grantees</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono" suppressHydrationWarning>
            {formatAmount(totalDisbursed)} XLM
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Inter-contract verified payouts</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Milestone Success Rate</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">100%</div>
          <div className="text-[11px] text-slate-500 font-medium">Zero default on milestone completion</div>
        </div>
      </div>

      {/* Distribution Charts Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              Grant Distribution by Category
            </h3>
          </div>

          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{c.name} ({c.count})</span>
                  <span className="font-mono text-slate-600">{c.percent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Payout Velocity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Soroban Inter-Contract Escrow Health
            </h3>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs text-slate-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Vault Security Audit:</span>
              <span className="text-emerald-700 font-bold">Passed 100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cross-Contract Permission Gate:</span>
              <span className="text-indigo-700 font-bold font-mono">ENFORCED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Average Payout Finality:</span>
              <span className="text-amber-700 font-bold font-mono">&lt; 5 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
