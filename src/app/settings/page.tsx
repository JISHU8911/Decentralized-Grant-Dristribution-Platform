'use client';

import { useState } from 'react';
import { Server, Shield, CheckCircle2 } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { NETWORK_CONFIG } from '@/services/stellar';
import { CONTRACT_ADDRESSES } from '@/services/contract';
import { NetworkType } from '@/types';

export default function SettingsPage() {
  const { network, setNetwork, disconnect } = useStellarWallet();
  const [saved, setSaved] = useState(false);

  const handleNetworkChange = (newNet: NetworkType) => {
    setNetwork(newNet);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Settings & Developer Configuration</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
          Configure Stellar RPC networks, view deployed contract hashes, and manage application preferences.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Network configuration updated successfully!</span>
        </div>
      )}

      {/* Network Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Server className="h-5 w-5 text-indigo-600" />
          Stellar Network Environment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['testnet', 'futurenet', 'standalone'] as NetworkType[]).map((net) => (
            <button
              key={net}
              onClick={() => handleNetworkChange(net)}
              className={`rounded-xl border p-4 text-left transition-all ${
                network === net
                  ? 'border-indigo-500 bg-indigo-50/80 text-indigo-900 shadow-xs font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold capitalize">{net}</div>
              <div className="text-[11px] font-mono mt-1 text-slate-500 truncate">
                {NETWORK_CONFIG[net].rpcUrl}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deployed Contract Metadata */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          Deployed Soroban Smart Contracts
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
            <div className="text-slate-600 font-sans font-bold">Grant Platform Contract (Logic)</div>
            <div className="text-slate-900 break-all font-semibold">{CONTRACT_ADDRESSES.grantPlatform}</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
            <div className="text-slate-600 font-sans font-bold">Grant Treasury Contract (Vault)</div>
            <div className="text-slate-900 break-all font-semibold">{CONTRACT_ADDRESSES.grantTreasury}</div>
          </div>
        </div>
      </div>

      {/* Reset State */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center justify-between shadow-xs">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Disconnect Active Session</h4>
          <p className="text-xs text-slate-500 font-medium">Clear stored wallet keys and active RPC connections</p>
        </div>

        <button
          onClick={disconnect}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all"
        >
          Disconnect Session
        </button>
      </div>
    </div>
  );
}
