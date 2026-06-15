/**
 * 日志类型
 * operation: 操作日志（用户主动操作，如控制设备、编辑场景）
 * device: 设备日志（设备状态变化、上下线等自动事件）
 * alert: 告警日志（告警产生、处理、解决等记录）
 * member: 成员日志（成员加入、离开、权限变更等）
 * scene: 场景日志（场景触发、动作执行记录）
 */
export type LogType = 'operation' | 'device' | 'alert' | 'member' | 'scene';

/**
 * 日志条目实体
 * id: 日志唯一标识
 * type: 日志类型
 * timestamp: 日志记录时间戳
 * houseId: 所属房屋ID
 * userId: 操作用户ID（系统自动事件时为空）
 * userName: 操作用户名称（系统自动事件时为空）
 * action: 动作名称（如"开灯"、"创建场景"、"设备上线"等）
 * targetType: 操作目标类型（如"device"、"scene"、"member"等）
 * targetId: 操作目标ID
 * targetName: 操作目标名称
 * result: 操作结果（success=成功，failed=失败）
 * detail: 详细描述信息（可选）
 * ip: 操作者IP地址（可选）
 * userAgent: 操作者客户端信息（可选）
 */
export interface LogEntry {
  id: string;
  type: LogType;
  timestamp: number;
  houseId: string;
  userId?: string;
  userName?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  result: 'success' | 'failed';
  detail?: string;
  ip?: string;
  userAgent?: string;
}
