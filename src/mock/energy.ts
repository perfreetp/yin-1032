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

const BASE_HOURLY = [0.15, 0.12, 0.10, 0.08, 0.08, 0.12, 0.25, 0.42, 0.58, 0.45, 0.38, 0.52, 0.48, 0.42, 0.35, 0.40, 0.55, 0.72, 0.85, 0.78, 0.65, 0.52, 0.38, 0.25];
const BASE_DAILY = [12.5, 11.8, 13.2, 10.5, 9.8, 14.2, 15.6, 13.8, 12.1, 11.5, 14.8, 16.2, 13.5, 12.8, 11.2, 10.8, 13.9, 15.2, 14.5, 12.3, 11.6, 13.1, 14.7, 15.8, 16.5, 14.2, 12.9, 11.4, 10.2, 13.6];

export const energyHourlyTrend: EnergyTrendPoint[] = HOURS_24.map((label, i) => ({
  timestamp: Date.now() - (23 - i) * 3600000,
  label,
  value: Number((BASE_HOURLY[i] + Math.random() * 0.15 - 0.075).toFixed(2)),
  power: Number((BASE_HOURLY[i] * 1000 + Math.random() * 200 - 100).toFixed(0)),
}));

export const energyDailyTrend: EnergyTrendPoint[] = DAYS_30.map((label, i) => ({
  timestamp: Date.now() - (29 - i) * 86400000,
  label,
  value: Number((BASE_DAILY[i] + Math.random() * 3 - 1.5).toFixed(1)),
  power: Number((BASE_DAILY[i] * 100 / 24).toFixed(0)),
}));

export const energyByCategory: EnergyCategoryStat[] = [
  { category: 'ac', name: '空调', value: 168.5, percentage: 38.2, color: '#3B82F6' },
  { category: 'light', name: '照明', value: 92.3, percentage: 20.9, color: '#F59E0B' },
  { category: 'tv', name: '影音娱乐', value: 58.6, percentage: 13.3, color: '#8B5CF6' },
  { category: 'water', name: '厨房电器', value: 45.2, percentage: 10.3, color: '#10B981' },
  { category: 'speaker', name: '其他设备', value: 32.8, percentage: 7.4, color: '#EC4899' },
  { category: 'sensor', name: '传感器', value: 18.5, percentage: 4.2, color: '#06B6D4' },
  { category: 'other', name: '待机功耗', value: 25.4, percentage: 5.7, color: '#64748B' },
];

export const energyByRoom: EnergyCategoryStat[] = [
  { category: 'living', name: '客厅', value: 145.8, percentage: 33.0, color: '#3B82F6' },
  { category: 'master', name: '主卧', value: 98.5, percentage: 22.4, color: '#8B5CF6' },
  { category: 'second', name: '次卧', value: 62.3, percentage: 14.2, color: '#F59E0B' },
  { category: 'kitchen', name: '厨房', value: 55.6, percentage: 12.6, color: '#10B981' },
  { category: 'study', name: '书房', value: 48.2, percentage: 11.0, color: '#EC4899' },
  { category: 'other', name: '其他房间', value: 31.8, percentage: 6.8, color: '#06B6D4' },
];

export const energyRank: EnergyRankItem[] = [
  { rank: 1, deviceId: 'dev-ac-001', deviceName: '客厅中央空调', category: 'ac', roomId: 'room-villa-living', value: 68.5, unit: 'kWh', trend: 12.3 },
  { rank: 2, deviceId: 'dev-ac-003', deviceName: '次卧挂机空调', category: 'ac', roomId: 'room-villa-second', value: 45.2, unit: 'kWh', trend: 8.6 },
  { rank: 3, deviceId: 'dev-light-001', deviceName: '客厅主灯', category: 'light', roomId: 'room-villa-living', value: 38.4, unit: 'kWh', trend: -5.2 },
  { rank: 4, deviceId: 'dev-ac-002', deviceName: '主卧挂机空调', category: 'ac', roomId: 'room-villa-master', value: 32.8, unit: 'kWh', trend: -2.1 },
  { rank: 5, deviceId: 'dev-tv-001', deviceName: '客厅激光电视', category: 'tv', roomId: 'room-villa-living', value: 28.6, unit: 'kWh', trend: 3.4 },
  { rank: 6, deviceId: 'dev-speaker-001', deviceName: '客厅智能音箱', category: 'speaker', roomId: 'room-villa-living', value: 18.9, unit: 'kWh', trend: 1.2 },
  { rank: 7, deviceId: 'dev-light-008', deviceName: '书房台灯', category: 'light', roomId: 'room-villa-study', value: 15.6, unit: 'kWh', trend: -1.8 },
  { rank: 8, deviceId: 'dev-light-006', deviceName: '厨房吊灯', category: 'light', roomId: 'room-villa-kitchen', value: 14.3, unit: 'kWh', trend: 2.5 },
  { rank: 9, deviceId: 'dev-ac-004', deviceName: '书房空调', category: 'ac', roomId: 'room-villa-study', value: 12.8, unit: 'kWh', trend: 0.6 },
  { rank: 10, deviceId: 'dev-curtain-001', deviceName: '客厅落地窗帘', category: 'curtain', roomId: 'room-villa-living', value: 8.5, unit: 'kWh', trend: -0.3 },
];

export const energySummary = {
  todayUsage: 13.8,
  todayCost: 8.28,
  weekUsage: 96.5,
  weekCost: 57.90,
  monthUsage: 389.2,
  monthCost: 233.52,
  monthTrend: -5.8,
  peakPower: 2.85,
  peakTime: '20:30',
  avgDailyUsage: 12.97,
  carbonReduction: 12.5,
  savingTip: '建议在22:00后关闭空调自动切换为睡眠模式，预计每月可节省约15%空调能耗。',
};

export const categoryStats = energyByCategory;
export const rankList = energyRank;

export const getTrendData = (range: TimeRange): TrendDataPoint[] => {
  switch (range) {
    case 'day':
      return energyHourlyTrend;
    case 'week':
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
