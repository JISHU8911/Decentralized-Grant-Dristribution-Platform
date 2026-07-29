'use client';

import Link from 'next/link';
import { Shield, ArrowRight, Layers, Coins, Activity, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESSES, formatContractExplorerUrl } from '@/services/stellar';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 py-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>TreasuryFlow — Autonomous Capital Infrastructure for Stellar Soroban</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-900">
          Decentralized Grant & Treasury Infrastructure on{' '}
          <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Stellar Soroban
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Institutional-grade grant allocation platform featuring dual Soroban WASM smart contracts, cross-contract milestone escrow disbursements, real-time RPC event streaming, and role permissions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-4 text-base font-bold text-white hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-lg shadow-indigo-600/20 group"
          >
            <span>Launch Enterprise Dashboard</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/activity"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:border-indigo-300 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Activity className="h-5 w-5 text-indigo-600" />
            <span>Live Activity Stream</span>
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Vault Reserves</div>
            <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">225,000 XLM</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">✓ Escrow Locked</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Active Programs</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">3 Grants</div>
            <div className="text-[11px] text-indigo-600 font-bold mt-1">Infrastructure & DeFi</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Milestone Finality</div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">&lt; 5s</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Inter-contract approved</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Smart Contracts</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">2 WASM</div>
            <div className="text-[11px] text-purple-700 font-bold mt-1">Platform + Treasury</div>
          </div>
        </div>
      </section>

      {/* Dual Contract Architecture Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Inter-Contract Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Automated contract-to-contract communication between Core Registry and Treasury Escrow Vault.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Contract A */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-100 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-800">
                Contract A: Core Registry
              </span>
              <a
                href={formatContractExplorerUrl(CONTRACT_ADDRESSES.grantPlatform)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
              >
                <span>grant_platform.wasm</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Grant & Proposal Logic</h3>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Stores Grant proposals, milestones, applicant state
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Enforces role-based permissions (Admin, Reviewer, Grantee)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Invokes `GrantTreasuryContract.disburse()` via cross-contract calls
              </li>
            </ul>
          </div>

          {/* Contract B */}
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-cyan-100 border border-cyan-200 px-3 py-1 text-xs font-bold text-cyan-800">
                Contract B: Treasury Escrow
              </span>
              <a
                href={formatContractExplorerUrl(CONTRACT_ADDRESSES.grantTreasury)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-slate-500 hover:text-cyan-600 flex items-center gap-1 font-medium"
              >
                <span>grant_treasury.wasm</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Vault & Milestone Disbursements</h3>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600" /> Holds XLM / SAC token reserves safely in vault
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600" /> Validates authorized caller (Only Contract A allowed)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600" /> Releases funds directly to applicant upon milestone approval
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
