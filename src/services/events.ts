import { ContractEventItem, NetworkType } from '@/types';
import { getRpcServer, CONTRACT_ADDRESSES } from './stellar';

export class SorobanEventService {
  private listenerCallback: ((event: ContractEventItem) => void) | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private network: NetworkType = 'testnet';

  startRealtimeSubscription(callback: (event: ContractEventItem) => void, network: NetworkType = 'testnet') {
    this.listenerCallback = callback;
    this.network = network;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Query Soroban RPC getEvents every 12 seconds
    this.intervalId = setInterval(async () => {
      if (this.listenerCallback) {
        try {
          const server = getRpcServer(this.network);
          // Query events for the platform contract
          const eventsResponse = await server.getEvents({
            startLedger: 0,
            filters: [
              {
                type: 'contract',
                contractIds: [CONTRACT_ADDRESSES.grantPlatform],
              },
            ],
            limit: 5,
          });

          if (eventsResponse && eventsResponse.events && eventsResponse.events.length > 0) {
            eventsResponse.events.forEach((evtRes: any) => {
              if (this.listenerCallback) {
                this.listenerCallback({
                  id: `rpc-evt-${evtRes.id || Date.now()}`,
                  eventType: 'milestone_disbursed',
                  contractId: CONTRACT_ADDRESSES.grantPlatform,
                  topics: evtRes.topic || ['contract', 'event'],
                  payload: { ledger: evtRes.ledger, contractId: CONTRACT_ADDRESSES.grantPlatform },
                  timestamp: Date.now(),
                  txHash: evtRes.txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
                });
              }
            });
          }
        } catch (rpcErr) {
          // Quietly handle RPC connection polling
        }
      }
    }, 12000);
  }

  stopSubscription() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listenerCallback = null;
  }
}

export const eventService = new SorobanEventService();
