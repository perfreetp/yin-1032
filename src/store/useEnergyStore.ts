import { create } from 'zustand';
import {
  energyHourlyTrend,
  energyDailyTrend,
  energyByCategory,
  energyByRoom,
  energyRank,
  energySummary,
  type EnergyTrendPoint,
  type EnergyCategoryStat,
  type EnergyRankItem,
} from '@/mock/energy';

export type TimeRange = 'day' | 'week' | 'month' | 'year';

interface EnergyStore {
  trendData: EnergyTrendPoint[];
  categoryStats: EnergyCategoryStat[];
  roomStats: EnergyCategoryStat[];
  rankList: EnergyRankItem[];
  summary: typeof energySummary;
  timeRange: TimeRange;
  fetchEnergy: (houseId?: string) => Promise<void>;
  setTimeRange: (range: TimeRange) => void;
}

const getTrendByRange = (range: TimeRange): EnergyTrendPoint[] => {
  switch (range) {
    case 'day':
      return energyHourlyTrend;
    case 'week':
      return Array.from({ length: 7 }, (_, i) => {
        const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const baseVals = [11.2, 12.8, 10.5, 13.6, 14.2, 16.8, 15.3];
        return {
          timestamp: Date.now() - (6 - i) * 86400000,
          label: labels[i],
          value: Number((baseVals[i] + Math.random() * 2 - 1).toFixed(1)),
          power: Number((baseVals[i] * 40 + Math.random() * 50).toFixed(0)),
        };
      });
    case 'month':
      return energyDailyTrend;
    case 'year':
      return Array.from({ length: 12 }, (_, i) => ({
        timestamp: Date.now() - (11 - i) * 86400000 * 30,
        label: `${i + 1}月`,
        value: Number((380 + Math.random() * 120 - 60).toFixed(1)),
        power: 500 + Math.floor(Math.random() * 200),
      }));
    default:
      return energyHourlyTrend;
  }
};

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  trendData: [],
  categoryStats: [],
  roomStats: [],
  rankList: [],
  summary: energySummary,
  timeRange: 'day',
  fetchEnergy: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const { timeRange } = get();
    set({
      trendData: getTrendByRange(timeRange),
      categoryStats: energyByCategory,
      roomStats: energyByRoom,
      rankList: energyRank,
    });
  },
  setTimeRange: (range) => {
    set({ timeRange: range });
    set({ trendData: getTrendByRange(range) });
  },
}));
