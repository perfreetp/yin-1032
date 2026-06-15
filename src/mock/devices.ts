export type DeviceCategory = 'light' | 'ac' | 'curtain' | 'lock' | 'camera' | 'sensor' | 'tv' | 'speaker';
export type DeviceStatus = 'online' | 'offline' | 'fault';
export type DeviceState = LightState | ACState | CurtainState | LockDeviceState | SensorReading | { power: boolean } | { power: boolean; volume: number };

export interface LightState {
  power: boolean;
  brightness: number;
  colorTemp: number;
  color?: string;
}

export interface ACState {
  power: boolean;
  mode: 'cool' | 'heat' | 'auto' | 'dry' | 'fan';
  temperature: number;
  fanSpeed: 1 | 2 | 3 | 4 | 'auto';
  swing: boolean;
}

export interface CurtainState {
  position: number;
}

export interface LockDeviceState {
  state: 'locked' | 'unlocked' | 'alarm';
  battery: number;
  lastUnlockUser?: string;
  lastUnlockTime?: number;
}

export interface SensorReading {
  temperature?: number;
  humidity?: number;
  pm25?: number;
  co2?: number;
  illumination?: number;
  smoke?: boolean;
  waterLeak?: boolean;
  doorContact?: 'open' | 'close';
  motion?: boolean;
}

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  roomId: string;
  houseId: string;
  status: DeviceStatus;
  state: LightState | ACState | CurtainState | LockDeviceState | SensorReading | { power: boolean } | { power: boolean; volume: number };
  icon: string;
  pairedAt: number;
  firmware?: string;
}

export const devices: Device[] = [
  // === 别墅灯光设备 (10个) ===
  { id: 'dev-light-001', name: '客厅主灯', category: 'light', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true, brightness: 85, colorTemp: 4000 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 120, firmware: 'v2.3.1' },
  { id: 'dev-light-002', name: '客厅筒灯组', category: 'light', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: false, brightness: 60, colorTemp: 3500 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 118, firmware: 'v2.3.1' },
  { id: 'dev-light-003', name: '主卧吸顶灯', category: 'light', roomId: 'room-villa-002', houseId: 'house-villa-001', status: 'online', state: { power: false, brightness: 70, colorTemp: 3000 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 115, firmware: 'v2.3.0' },
  { id: 'dev-light-004', name: '主卧床头灯左', category: 'light', roomId: 'room-villa-002', houseId: 'house-villa-001', status: 'online', state: { power: true, brightness: 40, colorTemp: 2700, color: '#FFA500' }, icon: 'lamp', pairedAt: Date.now() - 86400000 * 110, firmware: 'v2.2.8' },
  { id: 'dev-light-005', name: '次卧吸顶灯', category: 'light', roomId: 'room-villa-003', houseId: 'house-villa-001', status: 'online', state: { power: false, brightness: 75, colorTemp: 4500 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 105, firmware: 'v2.3.1' },
  { id: 'dev-light-006', name: '厨房吊灯', category: 'light', roomId: 'room-villa-005', houseId: 'house-villa-001', status: 'online', state: { power: true, brightness: 100, colorTemp: 5500 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 100, firmware: 'v2.3.1' },
  { id: 'dev-light-007', name: '主卫镜前灯', category: 'light', roomId: 'room-villa-006', houseId: 'house-villa-001', status: 'online', state: { power: false, brightness: 90, colorTemp: 5000 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 95, firmware: 'v2.2.5' },
  { id: 'dev-light-008', name: '书房台灯', category: 'light', roomId: 'room-villa-009', houseId: 'house-villa-001', status: 'online', state: { power: true, brightness: 80, colorTemp: 5000 }, icon: 'lamp', pairedAt: Date.now() - 86400000 * 90, firmware: 'v2.3.0' },
  { id: 'dev-light-009', name: '花园露台灯带', category: 'light', roomId: 'room-villa-008', houseId: 'house-villa-001', status: 'offline', state: { power: false, brightness: 50, colorTemp: 3500 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 85, firmware: 'v2.3.0' },
  { id: 'dev-light-010', name: '客厅氛围灯', category: 'light', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true, brightness: 35, colorTemp: 2800, color: '#FF6B9D' }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 80, firmware: 'v2.3.2' },

  // === 别墅空调设备 (4个) ===
  { id: 'dev-ac-001', name: '客厅中央空调', category: 'ac', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true, mode: 'cool', temperature: 26, fanSpeed: 2, swing: true }, icon: 'air-conditioning', pairedAt: Date.now() - 86400000 * 75, firmware: 'v3.1.0' },
  { id: 'dev-ac-002', name: '主卧挂机空调', category: 'ac', roomId: 'room-villa-002', houseId: 'house-villa-001', status: 'online', state: { power: false, mode: 'auto', temperature: 25, fanSpeed: 'auto', swing: false }, icon: 'air-conditioning', pairedAt: Date.now() - 86400000 * 70, firmware: 'v3.0.8' },
  { id: 'dev-ac-003', name: '次卧挂机空调', category: 'ac', roomId: 'room-villa-003', houseId: 'house-villa-001', status: 'online', state: { power: true, mode: 'cool', temperature: 27, fanSpeed: 1, swing: true }, icon: 'air-conditioning', pairedAt: Date.now() - 86400000 * 65, firmware: 'v3.1.0' },
  { id: 'dev-ac-004', name: '书房空调', category: 'ac', roomId: 'room-villa-009', houseId: 'house-villa-001', status: 'fault', state: { power: false, mode: 'auto', temperature: 26, fanSpeed: 'auto', swing: false }, icon: 'air-conditioning', pairedAt: Date.now() - 86400000 * 60, firmware: 'v3.0.5' },

  // === 别墅窗帘设备 (4个) ===
  { id: 'dev-curtain-001', name: '客厅落地窗帘', category: 'curtain', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { position: 80 }, icon: 'curtains', pairedAt: Date.now() - 86400000 * 55, firmware: 'v1.5.2' },
  { id: 'dev-curtain-002', name: '主卧遮光帘', category: 'curtain', roomId: 'room-villa-002', houseId: 'house-villa-001', status: 'online', state: { position: 0 }, icon: 'curtains', pairedAt: Date.now() - 86400000 * 50, firmware: 'v1.5.2' },
  { id: 'dev-curtain-003', name: '书房纱帘', category: 'curtain', roomId: 'room-villa-009', houseId: 'house-villa-001', status: 'online', state: { position: 60 }, icon: 'curtains', pairedAt: Date.now() - 86400000 * 45, firmware: 'v1.5.1' },
  { id: 'dev-curtain-004', name: '花园露台遮阳帘', category: 'curtain', roomId: 'room-villa-008', houseId: 'house-villa-001', status: 'online', state: { position: 100 }, icon: 'curtains', pairedAt: Date.now() - 86400000 * 40, firmware: 'v1.5.2' },

  // === 别墅门锁设备 (2个) ===
  { id: 'dev-lock-001', name: '入户大门锁', category: 'lock', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { state: 'locked', battery: 82, lastUnlockUser: 'member-owner-001', lastUnlockTime: Date.now() - 86400000 * 0.3 }, icon: 'lock-keyhole', pairedAt: Date.now() - 86400000 * 35, firmware: 'v4.2.0' },
  { id: 'dev-lock-002', name: '车库门锁', category: 'lock', roomId: 'room-villa-010', houseId: 'house-villa-001', status: 'online', state: { state: 'locked', battery: 68, lastUnlockUser: 'member-admin-002', lastUnlockTime: Date.now() - 86400000 * 1.2 }, icon: 'lock-keyhole', pairedAt: Date.now() - 86400000 * 30, firmware: 'v4.1.8' },

  // === 别墅摄像头设备 (3个) ===
  { id: 'dev-camera-001', name: '客厅全景摄像头', category: 'camera', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true }, icon: 'camera', pairedAt: Date.now() - 86400000 * 25, firmware: 'v5.3.2' },
  { id: 'dev-camera-002', name: '门口可视门铃', category: 'camera', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true }, icon: 'door-open', pairedAt: Date.now() - 86400000 * 20, firmware: 'v5.3.1' },
  { id: 'dev-camera-003', name: '车库监控摄像头', category: 'camera', roomId: 'room-villa-010', houseId: 'house-villa-001', status: 'online', state: { power: true }, icon: 'camera', pairedAt: Date.now() - 86400000 * 15, firmware: 'v5.3.0' },

  // === 别墅传感器设备 (8个) ===
  { id: 'dev-sensor-001', name: '客厅温湿度传感器', category: 'sensor', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { temperature: 25.8, humidity: 52, pm25: 18, co2: 680, illumination: 450 }, icon: 'thermometer', pairedAt: Date.now() - 86400000 * 14, firmware: 'v6.0.1' },
  { id: 'dev-sensor-002', name: '主卧环境传感器', category: 'sensor', roomId: 'room-villa-002', houseId: 'house-villa-001', status: 'online', state: { temperature: 24.5, humidity: 58, pm25: 12, co2: 520, illumination: 85 }, icon: 'thermometer', pairedAt: Date.now() - 86400000 * 13, firmware: 'v6.0.1' },
  { id: 'dev-sensor-003', name: '厨房烟雾报警器', category: 'sensor', roomId: 'room-villa-005', houseId: 'house-villa-001', status: 'online', state: { smoke: false, temperature: 28.3 }, icon: 'smoke', pairedAt: Date.now() - 86400000 * 12, firmware: 'v6.1.0' },
  { id: 'dev-sensor-004', name: '主卫水浸传感器', category: 'sensor', roomId: 'room-villa-006', houseId: 'house-villa-001', status: 'online', state: { waterLeak: false, humidity: 72 }, icon: 'droplets', pairedAt: Date.now() - 86400000 * 11, firmware: 'v6.0.2' },
  { id: 'dev-sensor-005', name: '入户门磁传感器', category: 'sensor', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { doorContact: 'close' }, icon: 'door-closed', pairedAt: Date.now() - 86400000 * 10, firmware: 'v6.0.0' },
  { id: 'dev-sensor-006', name: '花园露台门窗磁', category: 'sensor', roomId: 'room-villa-008', houseId: 'house-villa-001', status: 'online', state: { doorContact: 'close' }, icon: 'door-closed', pairedAt: Date.now() - 86400000 * 9, firmware: 'v6.0.0' },
  { id: 'dev-sensor-007', name: '书房人体红外', category: 'sensor', roomId: 'room-villa-009', houseId: 'house-villa-001', status: 'online', state: { motion: true, illumination: 380 }, icon: 'scan-eye', pairedAt: Date.now() - 86400000 * 8, firmware: 'v6.0.3' },
  { id: 'dev-sensor-008', name: '车库人体感应', category: 'sensor', roomId: 'room-villa-010', houseId: 'house-villa-001', status: 'online', state: { motion: false }, icon: 'scan-eye', pairedAt: Date.now() - 86400000 * 7, firmware: 'v6.0.3' },

  // === 别墅电视设备 (1个) ===
  { id: 'dev-tv-001', name: '客厅激光电视', category: 'tv', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true }, icon: 'tv', pairedAt: Date.now() - 86400000 * 6, firmware: 'v7.2.1' },

  // === 别墅音箱设备 (2个) ===
  { id: 'dev-speaker-001', name: '客厅智能音箱', category: 'speaker', roomId: 'room-villa-001', houseId: 'house-villa-001', status: 'online', state: { power: true, volume: 35 }, icon: 'volume-2', pairedAt: Date.now() - 86400000 * 5, firmware: 'v8.1.0' },
  { id: 'dev-speaker-002', name: '主卧床头音箱', category: 'speaker', roomId: 'room-villa-002', houseId: 'house-villa-001', status: 'online', state: { power: false, volume: 25 }, icon: 'volume-2', pairedAt: Date.now() - 86400000 * 4, firmware: 'v8.1.0' },

  // === 度假公寓灯光设备 (5个) ===
  { id: 'dev-light-011', name: '客厅主灯(公寓)', category: 'light', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { power: false, brightness: 80, colorTemp: 4000 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 3, firmware: 'v2.3.1' },
  { id: 'dev-light-012', name: '海景主卧灯', category: 'light', roomId: 'room-apt-002', houseId: 'house-apartment-002', status: 'online', state: { power: false, brightness: 65, colorTemp: 3200 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 2, firmware: 'v2.3.1' },
  { id: 'dev-light-013', name: '次卧灯', category: 'light', roomId: 'room-apt-003', houseId: 'house-apartment-002', status: 'online', state: { power: false, brightness: 70, colorTemp: 4200 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 1.8, firmware: 'v2.3.1' },
  { id: 'dev-light-014', name: '厨房灯', category: 'light', roomId: 'room-apt-004', houseId: 'house-apartment-002', status: 'online', state: { power: true, brightness: 90, colorTemp: 5200 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 1.6, firmware: 'v2.3.0' },
  { id: 'dev-light-015', name: '卫生间灯', category: 'light', roomId: 'room-apt-005', houseId: 'house-apartment-002', status: 'online', state: { power: false, brightness: 85, colorTemp: 4800 }, icon: 'lightbulb', pairedAt: Date.now() - 86400000 * 1.4, firmware: 'v2.3.0' },

  // === 度假公寓空调设备 (2个) ===
  { id: 'dev-ac-005', name: '公寓客厅空调', category: 'ac', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { power: false, mode: 'cool', temperature: 26, fanSpeed: 'auto', swing: true }, icon: 'air-conditioning', pairedAt: Date.now() - 86400000 * 1.5, firmware: 'v3.1.0' },
  { id: 'dev-ac-006', name: '主卧空调', category: 'ac', roomId: 'room-apt-002', houseId: 'house-apartment-002', status: 'online', state: { power: false, mode: 'cool', temperature: 25, fanSpeed: 2, swing: false }, icon: 'air-conditioning', pairedAt: Date.now() - 86400000 * 1.3, firmware: 'v3.1.0' },

  // === 度假公寓门锁设备 (1个) ===
  { id: 'dev-lock-003', name: '公寓入户门锁', category: 'lock', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { state: 'locked', battery: 91 }, icon: 'lock-keyhole', pairedAt: Date.now() - 86400000 * 1, firmware: 'v4.2.0' },

  // === 度假公寓摄像头设备 (1个) ===
  { id: 'dev-camera-004', name: '门铃摄像头', category: 'camera', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { power: true }, icon: 'camera', pairedAt: Date.now() - 86400000 * 0.9, firmware: 'v5.3.2' },

  // === 度假公寓传感器设备 (1个) ===
  { id: 'dev-sensor-009', name: '客厅温湿度', category: 'sensor', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { temperature: 26.2, humidity: 65, pm25: 22, co2: 720, illumination: 380 }, icon: 'thermometer', pairedAt: Date.now() - 86400000 * 0.8, firmware: 'v6.0.1' },

  // === 度假公寓电视设备 (1个) ===
  { id: 'dev-tv-002', name: '客厅电视', category: 'tv', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { power: false }, icon: 'tv', pairedAt: Date.now() - 86400000 * 0.7, firmware: 'v7.2.0' },

  // === 度假公寓音箱设备 (1个) ===
  { id: 'dev-speaker-003', name: '智能音箱', category: 'speaker', roomId: 'room-apt-001', houseId: 'house-apartment-002', status: 'online', state: { power: true, volume: 30 }, icon: 'volume-2', pairedAt: Date.now() - 86400000 * 0.6, firmware: 'v8.1.0' },

  // === 度假公寓窗帘设备 (1个) ===
  { id: 'dev-curtain-005', name: '阳台遮阳帘', category: 'curtain', roomId: 'room-apt-006', houseId: 'house-apartment-002', status: 'online', state: { position: 70 }, icon: 'curtains', pairedAt: Date.now() - 86400000 * 0.5, firmware: 'v1.5.2' },
];

export const devicesByHouse = (houseId: string) => devices.filter((d) => d.houseId === houseId);
export const devicesByRoom = (roomId: string) => devices.filter((d) => d.roomId === roomId);
export const devicesByCategory = (category: DeviceCategory) => devices.filter((d) => d.category === category);
