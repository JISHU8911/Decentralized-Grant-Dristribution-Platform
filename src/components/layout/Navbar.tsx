'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Activity, ArrowUpRight, Shield, Layers, BarChart3, Settings } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { WalletModal } from '@/components/wallet/WalletModal';
import { shortenAddress } from '@/services/stellar';

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, balanceXlm, network } = useStellarWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Layers },
    { label: 'Activity Feed', href: '/activity', icon: Activity },
    { label: 'Transactions', href: '/transactions', icon: ArrowUpRight },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo - TreasuryFlow */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <Shield className="h-5 w-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  TreasuryFlow
                </span>
                <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Stellar Soroban
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Decentralized Capital Infrastructure</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Live RPC Beacon */}
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs text-slate-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono capitalize text-slate-600">{network} RPC</span>
            </div>

            {/* Wallet Status Button */}
            {isConnected ? (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs sm:text-sm font-medium text-indigo-900 hover:bg-indigo-100 transition-all shadow-sm"
              >
                <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                <span className="font-mono font-bold text-slate-800">{shortenAddress(address!)}</span>
                <span className="hidden sm:inline-block rounded-md bg-white border border-indigo-200 px-2 py-0.5 text-xs text-indigo-700 font-bold font-mono">
                  {balanceXlm} XLM
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">No wallet connected</span>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation sub-bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </>
  );
}
