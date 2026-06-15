import { create } from 'zustand';
import { logs as mockLogs, type LogEntry, type LogType } from '@/mock/logs';
import type { TimeRange } from './useEnergyStore';

interface LogStore {
  logs: LogEntry[];
  filterType: LogType | 'all';
  filterUserId: string | 'all';
  timeRange: TimeRange;
  fetchLogs: (houseId?: string) => Promise<LogEntry[]>;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  setFilters: (filters: Partial<Pick<LogStore, 'filterType' | 'filterUserId' | 'timeRange'>>) => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  filterType: 'all',
  filterUserId: 'all',
  timeRange: 'day',
  fetchLogs: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let result = mockLogs;
    if (houseId) {
      result = mockLogs.filter((l) => l.houseId === houseId);
    }
    set({ logs: result });
    return result;
  },
  addLog: (logData) => {
    const newLog: LogEntry = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
    };
    set((state) => ({ logs: [newLog, ...state.logs] }));
  },
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));
