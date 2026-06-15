export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface EnergyTrendPoint {
  timestamp: number;
  label: string;
  value: number;
  power?: number;
}

export interface EnergyCategoryStat {
  category: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface EnergyRankItem {
  rank: number;
  deviceId: string;
  deviceName: string;
  category: string;
  roomId: string;
  value: number;
  unit: string;
  trend: number;
}

export type TrendDataPoint = EnergyTrendPoint;
export type CategoryStat = EnergyCategoryStat;
export type RankItem = EnergyRankItem;

const HOURS_24 = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

const DAYS_30 = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);

const VILLA_HOURLY = [0.8, 0.6, 0.5, 0.4, 0.4, 0.6, 1.2, 2.0, 2.8, 2.2, 1.8, 2.5, 2.3, 2.0, 1.7, 1.9, 2.6, 3.5, 4.2, 3.8, 3.2, 2.5, 1.8, 1.2];
const APARTMENT_HOURLY = [0.2, 0.15, 0.12, 0.1, 0.1, 0.15, 0.3, 0.6, 0.9, 0.7, 0.5, 0.8, 0.7, 0.6, 0.5, 0.6, 0.9, 1.2, 1.4, 1.2, 1.0, 0.7, 0.5, 0.3];

const VILLA_DAILY = [42, 38, 45, 35, 32, 48, 52, 46, 40, 38, 50, 55, 45, 42, 38, 36, 47, 52, 49, 42, 39, 44, 50, 54, 56, 48, 43, 38, 34, 46];
const APARTMENT_DAILY = [14, 12, 15, 11, 10, 16, 18, 15, 13, 12, 17, 19, 15, 14, 12, 11, 16, 18, 17, 14, 13, 15, 17, 19, 20, 16, 14, 12, 11, 15];

const generateTrend24h = (base: number[]): EnergyTrendPoint[] =>
  HOURS_24.map((label, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    label,
    value: Number((base[i] + Math.random() * 0.3 - 0.15).toFixed(2)),
    power: Number((base[i] * 1000 + Math.random() * 300 - 150).toFixed(0)),
  }));

const generateTrend30d = (base: number[]): EnergyTrendPoint[] =>
  DAYS_30.map((label, i) => ({
    timestamp: Date.now() - (29 - i) * 86400000,
    label,
    value: Number((base[i] + Math.random() * 4 - 2).toFixed(1)),
    power: Number((base[i] * 100 / 24).toFixed(0)),
  }));

const villaCategoryStats: EnergyCategoryStat[] = [
  { category: 'ac', name: '空调', value: 268.5, percentage: 42.3, color: '#3B82F6' },
  { category: 'light', name: '照明', value: 112.3, percentage: 17.7, color: '#F59E0B' },
  { category: 'tv', name: '影音娱乐', value: 88.6, percentage: 14.0, color: '#8B5CF6' },
  { category: 'water', name: '厨房电器', value: 65.2, percentage: 10.3, color: '#10B981' },
  { category: 'speaker', name: '其他设备', value: 42.8, percentage: 6.7, color: '#EC4899' },
  { category: 'sensor', name: '传感器', value: 25.5, percentage: 4.0, color: '#06B6D4' },
  { category: 'other', name: '待机功耗', value: 31.4, percentage: 5.0, color: '#64748B' },
];

const apartmentCategoryStats: EnergyCategoryStat[] = [
  { category: 'ac', name: '空调', value: 62.5, percentage: 28.5, color: '#3B82F6' },
  { category: 'light', name: '照明', value: 55.3, percentage: 25.2, color: '#F59E0B' },
  { category: 'tv', name: '影音娱乐', value: 32.6, percentage: 14.9, color: '#8B5CF6' },
  { category: 'water', name: '厨房电器', value: 28.2, percentage: 12.9, color: '#10B981' },
  { category: 'speaker', name: '其他设备', value: 18.8, percentage: 8.6, color: '#EC4899' },
  { category: 'sensor', name: '传感器', value: 10.5, percentage: 4.8, color: '#06B6D4' },
  { category: 'other', name: '待机功耗', value: 11.4, percentage: 5.2, color: '#64748B' },
];

const villaRoomStats: EnergyCategoryStat[] = [
  { category: 'living', name: '客厅', value: 215.8, percentage: 34.0, color: '#3B82F6' },
  { category: 'master', name: '主卧', value: 148.5, percentage: 23.4, color: '#8B5CF6' },
  { category: 'second', name: '次卧', value: 92.3, percentage: 14.5, color: '#F59E0B' },
  { category: 'kitchen', name: '厨房', value: 75.6, percentage: 11.9, color: '#10B981' },
  { category: 'study', name: '书房', value: 58.2, percentage: 9.2, color: '#EC4899' },
  { category: 'other', name: '其他房间', value: 44.8, percentage: 7.0, color: '#06B6D4' },
];

const apartmentRoomStats: EnergyCategoryStat[] = [
  { category: 'living', name: '客厅', value: 72.8, percentage: 33.2, color: '#3B82F6' },
  { category: 'master', name: '主卧', value: 48.5, percentage: 22.1, color: '#8B5CF6' },
  { category: 'second', name: '次卧', value: 35.3, percentage: 16.1, color: '#F59E0B' },
  { category: 'kitchen', name: '厨房', value: 28.6, percentage: 13.0, color: '#10B981' },
  { category: 'bathroom', name: '卫生间', value: 18.2, percentage: 8.3, color: '#EC4899' },
  { category: 'balcony', name: '海景阳台', value: 15.8, percentage: 7.2, color: '#06B6D4' },
];

const villaRankList: EnergyRankItem[] = [
  { rank: 1, deviceId: 'dev-ac-001', deviceName: '客厅中央空调', category: 'ac', roomId: 'room-villa-001', value: 98.5, unit: 'kWh', trend: 15.3 },
  { rank: 2, deviceId: 'dev-ac-003', deviceName: '次卧挂机空调', category: 'ac', roomId: 'room-villa-003', value: 65.2, unit: 'kWh', trend: 10.6 },
  { rank: 3, deviceId: 'dev-ac-002', deviceName: '主卧挂机空调', category: 'ac', roomId: 'room-villa-002', value: 52.8, unit: 'kWh', trend: -3.1 },
  { rank: 4, deviceId: 'dev-light-001', deviceName: '客厅主灯', category: 'light', roomId: 'room-villa-001', value: 48.4, unit: 'kWh', trend: -6.2 },
  { rank: 5, deviceId: 'dev-tv-001', deviceName: '客厅激光电视', category: 'tv', roomId: 'room-villa-001', value: 42.6, unit: 'kWh', trend: 5.4 },
  { rank: 6, deviceId: 'dev-ac-004', deviceName: '书房空调', category: 'ac', roomId: 'room-villa-007', value: 35.8, unit: 'kWh', trend: 2.6 },
  { rank: 7, deviceId: 'dev-speaker-001', deviceName: '客厅智能音箱', category: 'speaker', roomId: 'room-villa-001', value: 28.9, unit: 'kWh', trend: 1.8 },
  { rank: 8, deviceId: 'dev-light-008', deviceName: '书房台灯', category: 'light', roomId: 'room-villa-007', value: 22.6, unit: 'kWh', trend: -2.8 },
  { rank: 9, deviceId: 'dev-light-006', deviceName: '厨房吊灯', category: 'light', roomId: 'room-villa-005', value: 18.3, unit: 'kWh', trend: 3.5 },
  { rank: 10, deviceId: 'dev-curtain-001', deviceName: '客厅落地窗帘', category: 'curtain', roomId: 'room-villa-001', value: 12.5, unit: 'kWh', trend: -0.5 },
];

const apartmentRankList: EnergyRankItem[] = [
  { rank: 1, deviceId: 'dev-ac-apt-001', deviceName: '客厅空调', category: 'ac', roomId: 'room-apt-001', value: 28.5, unit: 'kWh', trend: 8.3 },
  { rank: 2, deviceId: 'dev-light-apt-001', deviceName: '客厅主灯', category: 'light', roomId: 'room-apt-001', value: 22.4, unit: 'kWh', trend: -3.2 },
  { rank: 3, deviceId: 'dev-ac-apt-002', deviceName: '主卧空调', category: 'ac', roomId: 'room-apt-002', value: 18.8, unit: 'kWh', trend: -2.1 },
  { rank: 4, deviceId: 'dev-tv-apt-001', deviceName: '客厅电视', category: 'tv', roomId: 'room-apt-001', value: 15.6, unit: 'kWh', trend: 2.4 },
  { rank: 5, deviceId: 'dev-light-apt-002', deviceName: '主卧顶灯', category: 'light', roomId: 'room-apt-002', value: 12.8, unit: 'kWh', trend: -1.5 },
  { rank: 6, deviceId: 'dev-water-apt-001', deviceName: '厨房冰箱', category: 'water', roomId: 'room-apt-004', value: 10.5, unit: 'kWh', trend: 1.2 },
  { rank: 7, deviceId: 'dev-light-apt-003', deviceName: '次卧灯', category: 'light', roomId: 'room-apt-003', value: 8.6, unit: 'kWh', trend: 0.8 },
  { rank: 8, deviceId: 'dev-speaker-apt-001', deviceName: '智能音箱', category: 'speaker', roomId: 'room-apt-001', value: 6.9, unit: 'kWh', trend: 0.5 },
  { rank: 9, deviceId: 'dev-light-apt-004', deviceName: '厨房灯', category: 'light', roomId: 'room-apt-004', value: 5.3, unit: 'kWh', trend: -0.6 },
  { rank: 10, deviceId: 'dev-fan-apt-001', deviceName: '阳台风扇', category: 'other', roomId: 'room-apt-006', value: 3.8, unit: 'kWh', trend: -0.2 },
];

const villaSummary = {
  todayUsage: 52.8,
  todayCost: 31.68,
  yesterdayUsage: 48.5,
  weekUsage: 356.2,
  weekCost: 213.72,
  monthUsage: 1412.3,
  monthCost: 847.38,
  monthTrend: 6.2,
  peakPower: 5.85,
  peakTime: '21:30',
  avgDailyUsage: 47.08,
  carbonReduction: 35.5,
  savingTip: '建议在22:00后将所有空调自动切换为睡眠模式，预计每月可节省约18%空调能耗。',
};

const apartmentSummary = {
  todayUsage: 18.5,
  todayCost: 11.10,
  yesterdayUsage: 16.2,
  weekUsage: 125.6,
  weekCost: 75.36,
  monthUsage: 518.4,
  monthCost: 311.04,
  monthTrend: -3.8,
  peakPower: 2.15,
  peakTime: '20:00',
  avgDailyUsage: 17.28,
  carbonReduction: 12.8,
  savingTip: '建议启用无人检测功能，离开房间时自动关闭空调和照明，预计每月可节省约12%能耗。',
};

export interface EnergyData {
  todayUsage: number;
  yesterdayUsage: number;
  weekUsage: number;
  monthUsage: number;
  trend24h: EnergyTrendPoint[];
  trend30d: EnergyTrendPoint[];
  categoryStats: EnergyCategoryStat[];
  roomStats: EnergyCategoryStat[];
  rankList: EnergyRankItem[];
  summary: typeof villaSummary;
}

export const energyDataByHouse: Record<string, EnergyData> = {
  'house-villa-001': {
    todayUsage: villaSummary.todayUsage,
    yesterdayUsage: villaSummary.yesterdayUsage,
    weekUsage: villaSummary.weekUsage,
    monthUsage: villaSummary.monthUsage,
    trend24h: generateTrend24h(VILLA_HOURLY),
    trend30d: generateTrend30d(VILLA_DAILY),
    categoryStats: villaCategoryStats,
    roomStats: villaRoomStats,
    rankList: villaRankList,
    summary: villaSummary,
  },
  'house-apartment-002': {
    todayUsage: apartmentSummary.todayUsage,
    yesterdayUsage: apartmentSummary.yesterdayUsage,
    weekUsage: apartmentSummary.weekUsage,
    monthUsage: apartmentSummary.monthUsage,
    trend24h: generateTrend24h(APARTMENT_HOURLY),
    trend30d: generateTrend30d(APARTMENT_DAILY),
    categoryStats: apartmentCategoryStats,
    roomStats: apartmentRoomStats,
    rankList: apartmentRankList,
    summary: apartmentSummary,
  },
};

export const getEnergyData = (houseId: string): EnergyData => {
  return energyDataByHouse[houseId] || energyDataByHouse['house-villa-001'];
};

export const getTrendData = (range: TimeRange, houseId: string = 'house-villa-001'): TrendDataPoint[] => {
  const data = getEnergyData(houseId);
  switch (range) {
    case 'day':
      return data.trend24h;
    case 'week':
      return Array.from({ length: 7 }, (_, i) => {
        const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const isVilla = houseId === 'house-villa-001';
        const baseVals = isVilla
          ? [45.2, 48.8, 42.5, 50.6, 52.2, 58.8, 55.3]
          : [16.2, 17.8, 14.5, 18.6, 19.2, 22.8, 20.3];
        return {
          timestamp: Date.now() - (6 - i) * 86400000,
          label: labels[i],
          value: Number((baseVals[i] + Math.random() * 4 - 2).toFixed(1)),
          power: Number((baseVals[i] * 40 + Math.random() * 80).toFixed(0)),
        };
      });
    case 'month':
      return data.trend30d;
    case 'year':
      return Array.from({ length: 12 }, (_, i) => {
        const isVilla = houseId === 'house-villa-001';
        const baseVal = isVilla ? 1380 : 520;
        return {
          timestamp: Date.now() - (11 - i) * 86400000 * 30,
          label: `${i + 1}月`,
          value: Number((baseVal + Math.random() * 250 - 125).toFixed(1)),
          power: isVilla ? 1200 + Math.floor(Math.random() * 400) : 500 + Math.floor(Math.random() * 200),
        };
      });
    default:
      return data.trend24h;
  }
};

export const energyHourlyTrend = energyDataByHouse['house-villa-001'].trend24h;
export const energyDailyTrend = energyDataByHouse['house-villa-001'].trend30d;
export const energyByCategory = energyDataByHouse['house-villa-001'].categoryStats;
export const energyByRoom = energyDataByHouse['house-villa-001'].roomStats;
export const energyRank = energyDataByHouse['house-villa-001'].rankList;
export const energySummary = energyDataByHouse['house-villa-001'].summary;
export const categoryStats = energyByCategory;
export const rankList = energyRank;
