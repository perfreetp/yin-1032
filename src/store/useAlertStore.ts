import { create } from 'zustand';
import { alerts as mockAlerts, type Alert, type AlertLevel, type AlertStatus } from '@/mock/alerts';

type FilterLevel = AlertLevel | 'all';
type FilterStatus = AlertStatus | 'all';

interface AlertStore {
  alerts: Alert[];
  unreadCount: number;
  filterLevel: FilterLevel;
  filterStatus: FilterStatus;
  fetchAlerts: (houseId?: string) => Promise<Alert[]>;
  markRead: (alertId: string) => void;
  markResolved: (alertId: string, handlerId?: string) => void;
  ignoreAlert: (alertId: string) => void;
  setFilter: (filters: Partial<Pick<AlertStore, 'filterLevel' | 'filterStatus'>>) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  unreadCount: 0,
  filterLevel: 'all',
  filterStatus: 'all',
  fetchAlerts: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let result = mockAlerts;
    if (houseId) {
      result = mockAlerts.filter((a) => a.houseId === houseId);
    }
    const unread = result.filter((a) => a.status === 'pending').length;
    set({ alerts: result, unreadCount: unread });
    return result;
  },
  markRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId && alert.status === 'pending'
          ? { ...alert, status: 'handling' }
          : alert
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  markResolved: (alertId, handlerId) => {
    const { currentUserId } = { currentUserId: 'member-1' };
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'resolved',
              handlerId: handlerId || currentUserId,
              handledAt: Date.now(),
            }
          : alert
      ),
    }));
  },
  ignoreAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: 'ignored' } : alert
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  setFilter: (filters) => set((state) => ({ ...state, ...filters })),
}));
