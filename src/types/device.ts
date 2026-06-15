/**
 * 设备类型枚举
 * light: 灯光设备
 * ac: 空调设备
 * curtain: 窗帘设备
 * lock: 门锁设备
 * camera: 摄像头设备
 * sensor: 传感器设备
 * tv: 电视设备
 * speaker: 音响设备
 */
export type DeviceCategory =
  | 'light'
  | 'ac'
  | 'curtain'
  | 'lock'
  | 'camera'
  | 'sensor'
  | 'tv'
  | 'speaker';

/**
 * 设备在线状态
 * online: 在线
 * offline: 离线
 * fault: 故障
 */
export type DeviceStatus = 'online' | 'offline' | 'fault';

/**
 * 灯光设备状态
 * power: 开关状态（true=开，false=关）
 * brightness: 亮度百分比（0-100）
 * colorTemp: 色温（2700K-6500K，数值越低越暖黄，越高越冷白）
 * color: RGB彩色值（仅彩色灯支持，可选）
 */
export interface LightState {
  power: boolean;
  brightness: number;
  colorTemp: number;
  color?: string;
}

/**
 * 空调运行模式
 * cool: 制冷模式
 * heat: 制热模式
 * auto: 自动模式
 * dry: 除湿模式
 * fan: 送风模式
 */
export type ACMode = 'cool' | 'heat' | 'auto' | 'dry' | 'fan';

/**
 * 空调设备状态
 * power: 开关状态（true=开，false=关）
 * mode: 运行模式
 * temperature: 设定温度（16-30摄氏度）
 * fanSpeed: 风速档位（1-4档或auto自动）
 * swing: 扫风状态（true=开，false=关）
 */
export interface ACState {
  power: boolean;
  mode: ACMode;
  temperature: number;
  fanSpeed: 1 | 2 | 3 | 4 | 'auto';
  swing: boolean;
}

/**
 * 窗帘设备状态
 * position: 开合位置百分比（0=全关，100=全开）
 */
export interface CurtainState {
  position: number;
}

/**
 * 门锁状态
 * locked: 已锁定
 * unlocked: 已解锁
 * alarm: 报警状态（异常开锁等）
 */
export type LockState = 'locked' | 'unlocked' | 'alarm';

/**
 * 门锁设备状态
 * state: 门锁当前状态
 * battery: 电池电量百分比（0-100）
 * lastUnlockUser: 最近一次开锁的用户ID（可选）
 * lastUnlockTime: 最近一次开锁的时间戳（可选）
 */
export interface LockDeviceState {
  state: LockState;
  battery: number;
  lastUnlockUser?: string;
  lastUnlockTime?: number;
}

/**
 * 传感器读数
 * temperature: 温度（摄氏度）
 * humidity: 湿度（百分比）
 * pm25: PM2.5浓度（μg/m³）
 * co2: 二氧化碳浓度（ppm）
 * illumination: 照度（lux）
 * smoke: 烟雾检测（true=检测到烟雾）
 * waterLeak: 水浸检测（true=检测到漏水）
 * doorContact: 门磁状态（open=打开，close=关闭）
 * motion: 人体感应（true=检测到人体）
 */
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

/**
 * 摄像头设备状态
 * power: 开关状态
 * recording: 录制状态
 * panTilt: 云台位置 [水平角度, 垂直角度]
 * online: 在线状态
 */
export interface CameraState {
  power: boolean;
  recording?: boolean;
  panTilt?: [number, number];
  online?: boolean;
}

/**
 * 通用设备实体
 * id: 设备唯一标识
 * name: 设备名称
 * category: 设备类型
 * roomId: 所属房间ID
 * houseId: 所属房屋ID
 * status: 设备在线状态
 * state: 设备具体状态（根据设备类型不同而不同）
 * icon: 设备图标标识
 * pairedAt: 配对时间戳
 * firmware: 固件版本号（可选）
 */
export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  roomId: string;
  houseId: string;
  status: DeviceStatus;
  state:
    | LightState
    | ACState
    | CurtainState
    | LockDeviceState
    | SensorReading
    | CameraState;
  icon: string;
  pairedAt: number;
  firmware?: string;
}
