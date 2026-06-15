import { create } from 'zustand';
import {
  getEnergyData,
  getTrendData,
  getRoomEnergy,
  energySummary,
  type EnergyTrendPoint,
  type EnergyCategoryStat,
  type EnergyRankItem,
  type TimeRange,
  type RoomEnergyData,
} from '@/mock/energy';
import type { Device, DeviceCategory } from '@/types/device';

export type { TimeRange, RoomEnergyData };

const devicePowerRange: Record<DeviceCategory, [number, number]> = {
  ac: [0.5, 1.5],
  light: [0.05, 0.3],
  tv: [0.1, 0.3],
  speaker: [0.03, 0.15],
  curtain: [0.01, 0.05],
  camera: [0.02, 0.08],
  sensor: [0.005, 0.02],
  lock: [0.005, 0.02],
};

const getDevicePower = (device: Device): number => {
  const range = devicePowerRange[device.category];
  if (!range) return 0;

  const [min, max] = range;
  let multiplier = 0.5;

  if ('power' in device.state && device.state.power === false) {
    return 0;
  }

  if (device.category === 'ac' && 'power' in device.state && device.state.power) {
    const state = device.state as { temperature: number; mode: string };
    if (state.mode === 'cool') {
      multiplier = Math.max(0.3, 1 - (state.temperature - 16) / 14);
    } else if (state.mode === 'heat') {
      multiplier = Math.max(0.3, (state.temperature - 16) / 14);
    }
  }

  if (device.category === 'light' && 'brightness' in device.state) {
    multiplier = (device.state as { brightness: number }).brightness / 100;
  }

  if (device.category === 'speaker' && 'volume' in device.state) {
    multiplier = (device.state as { volume: number }).volume / 100;
  }

  if (device.category === 'curtain' && 'position' in device.state) {
    const pos = (device.state as { position: number }).position;
    multiplier = pos === 0 || pos === 100 ? 0 : 0.5;
  }

  return Number((min + (max - min) * multiplier).toFixed(4));
};

interface EnergyStore {
  trendData: EnergyTrendPoint[];
  categoryStats: EnergyCategoryStat[];
  roomStats: EnergyCategoryStat[];
  rankList: EnergyRankItem[];
  summary: typeof energySummary;
  timeRange: TimeRange;
  houseId: string;
  realTimeUsage: number;
  selectedRoomId: string | null;
  fetchEnergy: (houseId: string) => Promise<void>;
  setTimeRange: (range: TimeRange) => void;
  incrementUsage: (deviceId: string, amount: number) => void;
  updateRealTimeUsage: (devices: Device[]) => void;
  selectRoom: (roomId: string | null) => void;
  readonly roomEnergy: RoomEnergyData | null;
}

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  trendData: [],
  categoryStats: [],
  roomStats: [],
  rankList: [],
  summary: energySummary,
  timeRange: 'day',
  houseId: '',
  realTimeUsage: 0,
  selectedRoomId: null,
  fetchEnergy: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const { timeRange, selectedRoomId } = get();
    const data = getEnergyData(houseId);
    const validRoomIds = data.roomStats.map((r) => r.category);
    const newSelectedRoomId = selectedRoomId && validRoomIds.includes(selectedRoomId)
      ? selectedRoomId
      : null;
    set({
      houseId,
      summary: data.summary,
      trendData: getTrendData(timeRange, houseId),
      categoryStats: data.categoryStats,
      roomStats: data.roomStats,
      rankList: data.rankList,
      selectedRoomId: newSelectedRoomId,
    });
  },
  setTimeRange: (range) => {
    const { houseId } = get();
    set({ timeRange: range });
    set({ trendData: getTrendData(range, houseId) });
  },
  incrementUsage: (deviceId, amount) => {
    const { summary } = get();
    const increment = Number(amount.toFixed(4));
    set({
      summary: {
        ...summary,
        todayUsage: Number((summary.todayUsage + increment).toFixed(2)),
        todayCost: Number((summary.todayCost + increment * 0.6).toFixed(2)),
        weekUsage: Number((summary.weekUsage + increment).toFixed(2)),
        weekCost: Number((summary.weekCost + increment * 0.6).toFixed(2)),
        monthUsage: Number((summary.monthUsage + increment).toFixed(2)),
        monthCost: Number((summary.monthCost + increment * 0.6).toFixed(2)),
      },
    });
  },
  updateRealTimeUsage: (devices) => {
    const totalPower = devices.reduce((sum, device) => {
      if (device.status !== 'online') return sum;
      return sum + getDevicePower(device);
    }, 0);
    set({ realTimeUsage: Number(totalPower.toFixed(4)) });
  },
  selectRoom: (roomId) => {
    const { roomStats } = get();
    if (roomId === null) {
      set({ selectedRoomId: null });
      return;
    }
    const validRoomIds = roomStats.map((r) => r.category);
    if (validRoomIds.includes(roomId)) {
      set({ selectedRoomId: roomId });
    } else {
      set({ selectedRoomId: null });
    }
  },
  get roomEnergy() {
    const { houseId, selectedRoomId } = get();
    if (!houseId || !selectedRoomId) return null;
    return getRoomEnergy(houseId, selectedRoomId);
  },
}));
