'use client';

import Link from 'next/link';
import { ExternalLink, Shield } from 'lucide-react';
import { formatContractExplorerUrl } from '@/services/stellar';
import { CONTRACT_ADDRESSES } from '@/services/contract';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg text-slate-900">TreasuryFlow Protocol</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            Institutional-grade decentralized grant & community treasury distribution platform on Stellar Soroban. Featuring cross-contract milestone escrow releases, role permissions, and real-time RPC event streaming.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Stellar Testnet Live
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">Soroban Rust WASM</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Soroban Smart Contracts</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li>
              <a
                href={formatContractExplorerUrl(CONTRACT_ADDRESSES.grantPlatform)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors text-slate-700"
              >
                <span>Platform Core</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href={formatContractExplorerUrl(CONTRACT_ADDRESSES.grantTreasury)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors text-slate-700"
              >
                <span>Treasury Escrow</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Developer Resources</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://developers.stellar.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors text-slate-700"
              >
                <span>Stellar Developer Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://stellar.expert"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors text-slate-700"
              >
                <span>Stellar Expert Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 TreasuryFlow Protocol. All rights reserved.</p>
        <p className="font-mono text-slate-600">Production-Grade Soroban Architecture</p>
      </div>
    </footer>
  );
}
