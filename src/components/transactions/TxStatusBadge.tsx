'use client';

import { TransactionStatus } from '@/types';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

interface TxStatusBadgeProps {
  status: TransactionStatus;
}

export function TxStatusBadge({ status }: TxStatusBadgeProps) {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirmed
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Processing
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-400">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-400">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </span>
      );
  }
}
