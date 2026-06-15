/**
 * 告警级别
 * critical: 严重告警（需立即处理，如火灾报警、门锁异常等）
 * warning: 警告告警（需关注处理，如设备离线、电池低电量等）
 * info: 信息通知（普通提示信息，如设备上线、场景执行完成等）
 */
export type AlertLevel = 'critical' | 'warning' | 'info';

/**
 * 告警处理状态
 * pending: 待处理（新产生的告警）
 * handling: 处理中（已有人认领处理）
 * resolved: 已解决（问题已修复处理完成）
 * ignored: 已忽略（确认无需处理）
 */
export type AlertStatus = 'pending' | 'handling' | 'resolved' | 'ignored';

/**
 * 告警实体
 * id: 告警唯一标识
 * level: 告警级别
 * title: 告警标题（简短描述）
 * message: 告警详情信息
 * houseId: 所属房屋ID
 * deviceId: 关联设备ID（可选，非设备类告警为空）
 * roomId: 关联房间ID（可选）
 * status: 当前处理状态
 * handlerId: 处理人用户ID（可选，未处理时为空）
 * handledAt: 处理完成时间戳（可选，未处理时为空）
 * createdAt: 告警产生时间戳
 * snapshot: 告警产生时的设备状态快照（可选，用于追溯问题）
 */
export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  houseId: string;
  deviceId?: string;
  roomId?: string;
  status: AlertStatus;
  handlerId?: string;
  handledAt?: number;
  createdAt: number;
  snapshot?: Record<string, unknown>;
}
