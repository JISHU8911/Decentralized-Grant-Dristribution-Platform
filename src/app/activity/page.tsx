'use client';

import { useState } from 'react';
import { Activity, Radio, Filter } from 'lucide-react';
import { useContractEvents } from '@/hooks/useContractEvents';
import { ActivityFeedItem } from '@/components/activity/ActivityFeedItem';

export default function ActivityPage() {
  const { events, isSubscribed, toggleSubscription } = useContractEvents();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents =
    filterType === 'all' ? events : events.filter((evt) => evt.eventType === filterType);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Real-Time Event Architecture</h1>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Soroban RPC WebSocket Event Subscription
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Live activity stream monitoring contract event topics (`grant_created`, `application_submitted`, `milestone_disbursed`).
          </p>
        </div>

        <button
          onClick={toggleSubscription}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
            isSubscribed
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className={`h-4 w-4 ${isSubscribed ? 'animate-pulse text-emerald-600' : ''}`} />
          <span>{isSubscribed ? 'Streaming Live (Connected)' : 'Paused'}</span>
        </button>
      </div>

      {/* Event Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
        {[
          { id: 'all', label: 'All Contract Events' },
          { id: 'grant_created', label: 'Grant Created' },
          { id: 'application_submitted', label: 'Application Submitted' },
          { id: 'milestone_disbursed', label: 'Milestone Disbursed' },
          { id: 'treasury_deposit', label: 'Treasury Funded' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === f.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Event Items Feed */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 font-medium">
            No events match the selected topic filter.
          </div>
        ) : (
          filteredEvents.map((evt) => <ActivityFeedItem key={evt.id} event={evt} />)
        )}
      </div>
    </div>
  );
}
