'use client';

import { useTxStore } from '@/stores/tx-store';
import { TxStatusBadge } from '@/components/transactions/TxStatusBadge';
import { ArrowUpRight, ExternalLink, Trash2 } from 'lucide-react';
import { shortenAddress, formatTxExplorerUrl } from '@/services/stellar';
import { useStellarWallet } from '@/hooks/useStellarWallet';

export default function TransactionsPage() {
  const { transactions, clearTransactions } = useTxStore();
  const { network } = useStellarWallet();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Transaction Center</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Production lifecycle tracking for all Soroban smart contract operations across Pending, Processing, Confirmed, and Failed states.
          </p>
        </div>

        {transactions.length > 0 && (
          <button
            onClick={clearTransactions}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-all self-start md:self-center"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Transactions List Table / Cards */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 font-medium">
            No transactions submitted yet.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">{tx.type}</span>
                  <TxStatusBadge status={tx.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
                  <span>
                    Contract:{' '}
                    <span className="text-slate-800 font-semibold">{shortenAddress(tx.contractId)}</span>
                  </span>
                  <span>•</span>
                  <span>Time: {new Date(tx.timestamp).toLocaleString()}</span>
                  {tx.feePaidXlm && (
                    <>
                      <span>•</span>
                      <span>Gas Fee: {tx.feePaidXlm} XLM</span>
                    </>
                  )}
                </div>

                {tx.errorDetails && (
                  <div className="text-xs font-mono text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-2 font-medium">
                    Error: {tx.errorDetails}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {tx.hash && tx.hash !== 'Pending submission...' ? (
                  <a
                    href={formatTxExplorerUrl(tx.hash, network)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-mono font-bold text-indigo-700 hover:bg-indigo-100 transition-all"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 font-mono italic">Submitting to RPC...</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
