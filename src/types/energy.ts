/**
 * 能耗读数记录
 * id: 记录唯一标识
 * deviceId: 关联设备ID（为房屋ID时表示全屋总能耗）
 * houseId: 所属房屋ID
 * timestamp: 记录时间戳
 * power: 瞬时功率（瓦特 W）
 * energy: 累计能耗（千瓦时 kWh）
 * voltage: 电压（伏特 V，可选）
 * current: 电流（安培 A，可选）
 */
export interface EnergyReading {
  id: string;
  deviceId: string;
  houseId: string;
  timestamp: number;
  power: number;
  energy: number;
  voltage?: number;
  current?: number;
}

/**
 * 能耗趋势数据点
 * timestamp: 时间点时间戳
 * value: 该时间点的能耗值（kWh）
 * label: 显示标签（如"1月"、"周一"、"10:00"等）
 */
export interface EnergyTrendPoint {
  timestamp: number;
  value: number;
  label: string;
}

/**
 * 分类能耗统计
 * category: 设备分类
 * energy: 该分类总能耗（kWh）
 * percentage: 占总能耗百分比（0-100）
 * cost: 估算电费（元）
 */
export interface EnergyCategoryStat {
  category: import('./device').DeviceCategory | 'total';
  energy: number;
  percentage: number;
  cost: number;
}

/**
 * 能耗排行项
 * deviceId: 设备ID
 * deviceName: 设备名称
 * roomId: 所属房间ID
 * roomName: 所属房间名称
 * energy: 能耗值（kWh）
 * cost: 估算电费（元）
 * rank: 排名（从1开始，数值越小能耗越高）
 * trend: 相比上一周期变化趋势（-1=下降，0=持平，1=上升）
 */
export interface EnergyRankItem {
  deviceId: string;
  deviceName: string;
  roomId: string;
  roomName: string;
  energy: number;
  cost: number;
  rank: number;
  trend: -1 | 0 | 1;
}
