import { create } from 'zustand';
import {
  getEnergyData,
  getTrendData,
  energySummary,
  type EnergyTrendPoint,
  type EnergyCategoryStat,
  type EnergyRankItem,
  type TimeRange,
} from '@/mock/energy';

export type { TimeRange };

interface EnergyStore {
  trendData: EnergyTrendPoint[];
  categoryStats: EnergyCategoryStat[];
  roomStats: EnergyCategoryStat[];
  rankList: EnergyRankItem[];
  summary: typeof energySummary;
  timeRange: TimeRange;
  houseId: string;
  fetchEnergy: (houseId: string) => Promise<void>;
  setTimeRange: (range: TimeRange) => void;
}

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  trendData: [],
  categoryStats: [],
  roomStats: [],
  rankList: [],
  summary: energySummary,
  timeRange: 'day',
  houseId: '',
  fetchEnergy: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const { timeRange } = get();
    const data = getEnergyData(houseId);
    set({
      houseId,
      summary: data.summary,
      trendData: getTrendData(timeRange, houseId),
      categoryStats: data.categoryStats,
      roomStats: data.roomStats,
      rankList: data.rankList,
    });
  },
  setTimeRange: (range) => {
    const { houseId } = get();
    set({ timeRange: range });
    set({ trendData: getTrendData(range, houseId) });
  },
}));
