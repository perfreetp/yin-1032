/**
 * 场景触发类型
 * manual: 手动触发（点击场景按钮）
 * schedule: 定时触发（按cron表达式定时执行）
 * location: 位置触发（到达/离开指定位置）
 * device: 设备状态触发（设备满足某条件时触发）
 * timeRange: 时间段触发（进入指定时间段时触发）
 */
export type SceneTriggerType =
  | 'manual'
  | 'schedule'
  | 'location'
  | 'device'
  | 'timeRange';

/**
 * 场景动作类型
 * setDeviceState: 设置指定设备状态
 * runScene: 执行另一场景
 * delay: 延时等待
 * notify: 发送通知消息
 */
export type SceneActionType =
  | 'setDeviceState'
  | 'runScene'
  | 'delay'
  | 'notify';

/**
 * 场景触发器配置
 * cronExpression: Cron定时表达式（schedule类型使用）
 * location: 位置触发条件（arrive=到达时触发，leave=离开时触发）
 * deviceId: 触发关联的设备ID（device类型使用）
 * condition: 条件表达式（用于设备状态判断等）
 */
export interface SceneTriggerConfig {
  cronExpression?: string;
  location?: 'arrive' | 'leave';
  deviceId?: string;
  condition?: string;
}

/**
 * 场景触发器
 * id: 触发器唯一标识
 * type: 触发类型
 * config: 触发器配置项
 */
export interface SceneTrigger {
  id: string;
  type: SceneTriggerType;
  config: SceneTriggerConfig;
}

/**
 * 场景动作目标
 * deviceId: 目标设备ID（setDeviceState类型使用）
 * sceneId: 目标场景ID（runScene类型使用）
 */
export interface SceneActionTarget {
  deviceId?: string;
  sceneId?: string;
}

/**
 * 场景动作
 * id: 动作唯一标识
 * type: 动作类型
 * order: 执行顺序（从小到大依次执行）
 * delayMs: 动作执行前延时毫秒数（可选）
 * target: 动作目标对象
 * state: 需要设置的设备状态（setDeviceState类型使用，可选）
 */
export interface SceneAction {
  id: string;
  type: SceneActionType;
  order: number;
  delayMs?: number;
  target: SceneActionTarget;
  state?: Partial<import('./device').Device['state']>;
}

/**
 * 场景实体
 * id: 场景唯一标识
 * name: 场景名称
 * icon: 场景图标标识
 * color: 场景主题颜色
 * houseId: 所属房屋ID
 * enabled: 是否启用
 * triggers: 触发器列表
 * actions: 动作列表
 * lastRunAt: 最近一次执行时间戳（可选）
 * createdAt: 创建时间戳
 */
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
