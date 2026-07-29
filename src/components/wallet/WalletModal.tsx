'use client';

import { X, Wallet, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { SupportedWallet } from '@/types';
import { shortenAddress } from '@/services/stellar';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { address, isConnected, isConnecting, walletType, balanceXlm, error, connectWallet, disconnect, refreshBalance } =
    useStellarWallet();

  if (!isOpen) return null;

  const wallets: { id: SupportedWallet; name: string; desc: string; iconBg: string; isPopular?: boolean }[] = [
    {
      id: 'freighter',
      name: 'Freighter Wallet',
      desc: 'Official non-custodial browser extension wallet by SDF',
      iconBg: 'bg-indigo-600',
      isPopular: true,
    },
    {
      id: 'albedo',
      name: 'Albedo',
      desc: 'Web-based web3 delegated signing for Stellar',
      iconBg: 'bg-cyan-600',
    },
    {
      id: 'hana',
      name: 'Hana Wallet',
      desc: 'Multi-chain non-custodial wallet provider',
      iconBg: 'bg-purple-600',
    },
    {
      id: 'xbull',
      name: 'xBull Wallet',
      desc: 'Advanced power-user wallet for Stellar & Soroban',
      iconBg: 'bg-violet-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Web3 Wallet Infrastructure</h3>
            <p className="text-xs text-slate-500 font-medium">
              {isConnected ? 'Active Wallet Session' : 'Connect your Stellar wallet'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>Wallet Connection Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-700">{error}</p>
            {error.includes('Freighter') && (
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline pt-1"
              >
                <span>Install Freighter Extension</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Connected Provider:</span>
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-emerald-700 font-bold uppercase text-[11px]">
                  {walletType}
                </span>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium mb-1">Stellar Public Key:</div>
                <div className="font-mono text-xs font-bold text-slate-900 break-all bg-white p-2.5 rounded-lg border border-slate-200 select-all">
                  {address}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-xs text-slate-500">Horizon Account Balance:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-600 font-mono">{balanceXlm} XLM</span>
                  <button
                    onClick={refreshBalance}
                    title="Refresh Live Balance"
                    className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={disconnect}
                className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all"
              >
                Disconnect Session
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 font-medium mb-2">
              Select an installed Stellar browser wallet provider:
            </div>
            {wallets.map((w) => (
              <button
                key={w.id}
                onClick={async () => {
                  await connectWallet(w.id);
                }}
                disabled={isConnecting}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 hover:border-indigo-400 hover:bg-indigo-50/60 transition-all text-left group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${w.iconBg} text-white font-bold text-xs shadow-md`}
                  >
                    {w.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {w.name}
                      </span>
                      {w.isPopular && (
                        <span className="rounded-full bg-indigo-100 border border-indigo-200 px-2 py-0.5 text-[9px] font-bold text-indigo-700">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{w.desc}</div>
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">→</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
