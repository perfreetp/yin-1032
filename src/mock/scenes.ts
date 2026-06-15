export type SceneTriggerType = 'manual' | 'schedule' | 'location' | 'device' | 'timeRange';
export type SceneActionType = 'setDeviceState' | 'runScene' | 'delay' | 'notify';

export interface SceneTrigger {
  id: string;
  type: SceneTriggerType;
  config: {
    cronExpression?: string;
    location?: 'arrive' | 'leave';
    deviceId?: string;
    condition?: string;
  };
}

export interface SceneAction {
  id: string;
  type: SceneActionType;
  order: number;
  delayMs?: number;
  target: {
    deviceId?: string;
    sceneId?: string;
  };
  state?: Record<string, unknown>;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  color: string;
  houseId: string;
  enabled: boolean;
  triggers: SceneTrigger[];
  actions: SceneAction[];
  lastRunAt?: number;
  createdAt: number;
}

export const scenes: Scene[] = [
  {
    id: 'scene-home',
    name: '回家模式',
    icon: 'home',
    color: '#3B82F6',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-home-1', type: 'location', config: { location: 'arrive' } },
      { id: 'trig-home-2', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-home-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-001' }, state: { power: true, brightness: 80, colorTemp: 4000 } },
      { id: 'act-home-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-light-002' }, state: { power: true, brightness: 60, colorTemp: 3500 } },
      { id: 'act-home-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-curtain-001' }, state: { position: 100 } },
      { id: 'act-home-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-ac-001' }, state: { power: true, mode: 'cool', temperature: 26 } },
      { id: 'act-home-5', type: 'setDeviceState', order: 5, delayMs: 5000, target: { deviceId: 'dev-speaker-001' }, state: { power: true, volume: 30 } },
      { id: 'act-home-6', type: 'notify', order: 6, target: {}, state: { message: '欢迎回家，主人！已为您开启回家模式' } },
    ],
    lastRunAt: Date.now() - 3600000 * 2,
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: 'scene-leave',
    name: '离家模式',
    icon: 'log-out',
    color: '#6366F1',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-leave-1', type: 'location', config: { location: 'leave' } },
      { id: 'trig-leave-2', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-leave-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-001' }, state: { power: false } },
      { id: 'act-leave-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-light-002' }, state: { power: false } },
      { id: 'act-leave-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-light-003' }, state: { power: false } },
      { id: 'act-leave-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-light-006' }, state: { power: false } },
      { id: 'act-leave-5', type: 'setDeviceState', order: 5, target: { deviceId: 'dev-curtain-001' }, state: { position: 0 } },
      { id: 'act-leave-6', type: 'setDeviceState', order: 6, target: { deviceId: 'dev-ac-001' }, state: { power: false } },
      { id: 'act-leave-7', type: 'setDeviceState', order: 7, target: { deviceId: 'dev-tv-001' }, state: { power: false } },
      { id: 'act-leave-8', type: 'setDeviceState', order: 8, target: { deviceId: 'dev-speaker-001' }, state: { power: false } },
      { id: 'act-leave-9', type: 'notify', order: 9, target: {}, state: { message: '已开启离家布防，全屋设备已关闭，安防系统已启动' } },
    ],
    lastRunAt: Date.now() - 3600000 * 10,
    createdAt: Date.now() - 86400000 * 58,
  },
  {
    id: 'scene-sleep',
    name: '睡眠模式',
    icon: 'moon',
    color: '#8B5CF6',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-sleep-1', type: 'schedule', config: { cronExpression: '0 23 * * *' } },
      { id: 'trig-sleep-2', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-sleep-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-001' }, state: { power: false } },
      { id: 'act-sleep-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-light-002' }, state: { power: false } },
      { id: 'act-sleep-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-light-003' }, state: { power: false } },
      { id: 'act-sleep-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-curtain-002' }, state: { position: 0 } },
      { id: 'act-sleep-5', type: 'setDeviceState', order: 5, target: { deviceId: 'dev-ac-002' }, state: { power: true, mode: 'auto', temperature: 25, fanSpeed: 'auto' } },
      { id: 'act-sleep-6', type: 'setDeviceState', order: 6, delayMs: 3000, target: { deviceId: 'dev-tv-001' }, state: { power: false } },
    ],
    lastRunAt: Date.now() - 3600000 * 8,
    createdAt: Date.now() - 86400000 * 55,
  },
  {
    id: 'scene-wakeup',
    name: '晨起模式',
    icon: 'sunrise',
    color: '#F59E0B',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-wake-1', type: 'schedule', config: { cronExpression: '0 7 * * 1-5' } },
      { id: 'trig-wake-2', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-wake-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-curtain-002' }, state: { position: 60 } },
      { id: 'act-wake-2', type: 'setDeviceState', order: 2, delayMs: 60000, target: { deviceId: 'dev-light-003' }, state: { power: true, brightness: 50, colorTemp: 3000 } },
      { id: 'act-wake-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-ac-002' }, state: { power: false } },
      { id: 'act-wake-4', type: 'setDeviceState', order: 4, delayMs: 120000, target: { deviceId: 'dev-speaker-002' }, state: { power: true, volume: 20 } },
      { id: 'act-wake-5', type: 'notify', order: 5, target: {}, state: { message: '早上好！今天天气晴朗，气温22-28度，适合外出' } },
    ],
    lastRunAt: Date.now() - 3600000 * 14,
    createdAt: Date.now() - 86400000 * 50,
  },
  {
    id: 'scene-cinema',
    name: '影院模式',
    icon: 'film',
    color: '#EC4899',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-cinema-1', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-cinema-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-001' }, state: { power: true, brightness: 15, colorTemp: 2700 } },
      { id: 'act-cinema-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-light-002' }, state: { power: false } },
      { id: 'act-cinema-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-curtain-001' }, state: { position: 10 } },
      { id: 'act-cinema-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-tv-001' }, state: { power: true } },
      { id: 'act-cinema-5', type: 'setDeviceState', order: 5, target: { deviceId: 'dev-speaker-001' }, state: { power: true, volume: 50 } },
      { id: 'act-cinema-6', type: 'notify', order: 6, target: {}, state: { message: '影院模式已开启，请尽情享受观影时光' } },
    ],
    lastRunAt: Date.now() - 3600000 * 26,
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: 'scene-reading',
    name: '阅读模式',
    icon: 'book-open',
    color: '#10B981',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-read-1', type: 'manual', config: {} },
      { id: 'trig-read-2', type: 'device', config: { deviceId: 'dev-sensor-007', condition: 'motion == true && illumination < 200' } },
    ],
    actions: [
      { id: 'act-read-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-008' }, state: { power: true, brightness: 85, colorTemp: 5000 } },
      { id: 'act-read-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-curtain-003' }, state: { position: 80 } },
      { id: 'act-read-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-ac-004' }, state: { power: true, mode: 'auto', temperature: 25, fanSpeed: 1 } },
      { id: 'act-read-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-speaker-001' }, state: { power: false } },
    ],
    lastRunAt: Date.now() - 3600000 * 5,
    createdAt: Date.now() - 86400000 * 40,
  },
  {
    id: 'scene-dining',
    name: '用餐模式',
    icon: 'utensils',
    color: '#EF4444',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-dine-1', type: 'schedule', config: { cronExpression: '0 12,19 * * *' } },
      { id: 'trig-dine-2', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-dine-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-001' }, state: { power: true, brightness: 70, colorTemp: 3200 } },
      { id: 'act-dine-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-light-006' }, state: { power: true, brightness: 100, colorTemp: 4500 } },
      { id: 'act-dine-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-speaker-001' }, state: { power: true, volume: 25 } },
    ],
    lastRunAt: Date.now() - 3600000 * 30,
    createdAt: Date.now() - 86400000 * 35,
  },
  {
    id: 'scene-guest',
    name: '会客模式',
    icon: 'users',
    color: '#06B6D4',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-guest-1', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-guest-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-001' }, state: { power: true, brightness: 100, colorTemp: 4000 } },
      { id: 'act-guest-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-light-002' }, state: { power: true, brightness: 80, colorTemp: 4000 } },
      { id: 'act-guest-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-light-010' }, state: { power: true, brightness: 50, colorTemp: 3000 } },
      { id: 'act-guest-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-curtain-001' }, state: { position: 100 } },
      { id: 'act-guest-5', type: 'setDeviceState', order: 5, target: { deviceId: 'dev-ac-001' }, state: { power: true, mode: 'auto', temperature: 25 } },
      { id: 'act-guest-6', type: 'setDeviceState', order: 6, target: { deviceId: 'dev-speaker-001' }, state: { power: true, volume: 30 } },
    ],
    lastRunAt: Date.now() - 3600000 * 72,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'scene-away-guard',
    name: '离家布防',
    icon: 'shield-check',
    color: '#DC2626',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-guard-1', type: 'device', config: { deviceId: 'dev-lock-001', condition: 'state == "locked"' } },
      { id: 'trig-guard-2', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-guard-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-camera-001' }, state: { power: true } },
      { id: 'act-guard-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-camera-002' }, state: { power: true } },
      { id: 'act-guard-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-camera-003' }, state: { power: true } },
      { id: 'act-guard-4', type: 'notify', order: 4, target: {}, state: { message: '安防系统已启动，所有摄像头已开启录像模式' } },
    ],
    lastRunAt: Date.now() - 3600000 * 10,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'scene-morning',
    name: '晨起唤醒',
    icon: 'alarm-clock',
    color: '#F97316',
    houseId: 'house-villa-001',
    enabled: false,
    triggers: [
      { id: 'trig-morning-1', type: 'schedule', config: { cronExpression: '30 6 * * 6,7' } },
    ],
    actions: [
      { id: 'act-morning-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-curtain-002' }, state: { position: 30 } },
      { id: 'act-morning-2', type: 'setDeviceState', order: 2, delayMs: 120000, target: { deviceId: 'dev-curtain-002' }, state: { position: 80 } },
      { id: 'act-morning-3', type: 'setDeviceState', order: 3, delayMs: 180000, target: { deviceId: 'dev-light-003' }, state: { power: true, brightness: 60, colorTemp: 3500 } },
      { id: 'act-morning-4', type: 'setDeviceState', order: 4, target: { deviceId: 'dev-speaker-002' }, state: { power: true, volume: 25 } },
      { id: 'act-morning-5', type: 'notify', order: 5, target: {}, state: { message: '周末愉快！今天是个好天气，适合去公园散步吧' } },
    ],
    lastRunAt: Date.now() - 86400000 * 1,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'scene-nap',
    name: '午休模式',
    icon: 'bed',
    color: '#A855F7',
    houseId: 'house-villa-001',
    enabled: true,
    triggers: [
      { id: 'trig-nap-1', type: 'manual', config: {} },
    ],
    actions: [
      { id: 'act-nap-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-curtain-002' }, state: { position: 20 } },
      { id: 'act-nap-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-ac-002' }, state: { power: true, mode: 'cool', temperature: 26, fanSpeed: 1 } },
      { id: 'act-nap-3', type: 'setDeviceState', order: 3, target: { deviceId: 'dev-speaker-001' }, state: { power: false } },
    ],
    lastRunAt: Date.now() - 3600000 * 96,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'scene-apt-relax',
    name: '度假放松',
    icon: 'palm-tree',
    color: '#14B8A6',
    houseId: 'house-apartment-002',
    enabled: true,
    triggers: [
      { id: 'trig-relax-1', type: 'manual', config: {} },
      { id: 'trig-relax-2', type: 'location', config: { location: 'arrive' } },
    ],
    actions: [
      { id: 'act-relax-1', type: 'setDeviceState', order: 1, target: { deviceId: 'dev-light-011' }, state: { power: true, brightness: 60, colorTemp: 3200 } },
      { id: 'act-relax-2', type: 'setDeviceState', order: 2, target: { deviceId: 'dev-ac-005' }, state: { power: true, mode: 'cool', temperature: 25 } },
    ],
    lastRunAt: Date.now() - 86400000 * 3,
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const scenesByHouse = (houseId: string) => scenes.filter((s) => s.houseId === houseId);
