import { useEffect } from 'react';
import { useEventStore } from '@/stores/event-store';
import { eventService } from '@/services/events';

export function useContractEvents() {
  const { events, isSubscribed, addEvent, setSubscribed } = useEventStore();

  useEffect(() => {
    if (isSubscribed) {
      eventService.startRealtimeSubscription((newEvent) => {
        addEvent(newEvent);
      });
    } else {
      eventService.stopSubscription();
    }

    return () => {
      eventService.stopSubscription();
    };
  }, [isSubscribed, addEvent]);

  return {
    events,
    isSubscribed,
    toggleSubscription: () => setSubscribed(!isSubscribed),
  };
}
