export type LogType = 'operation' | 'device' | 'alert' | 'member' | 'scene';

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

const randomIP = () => {
  const parts = [192, 168, 10, Math.floor(Math.random() * 254) + 1];
  return parts.join('.');
};

const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const operationLogs: LogEntry[] = [
  { id: 'log-op-001', type: 'operation', timestamp: Date.now() - 60000 * 5, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '打开设备', targetType: 'device', targetId: 'dev-light-001', targetName: '客厅主灯', result: 'success', detail: '设置亮度85%，色温4000K', ip: randomIP(), userAgent: ua },
  { id: 'log-op-002', type: 'operation', timestamp: Date.now() - 60000 * 12, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '调节温度', targetType: 'device', targetId: 'dev-ac-001', targetName: '客厅中央空调', result: 'success', detail: '设置制冷模式，温度26°C，风速2档', ip: randomIP(), userAgent: ua },
  { id: 'log-op-003', type: 'operation', timestamp: Date.now() - 60000 * 28, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '调节窗帘', targetType: 'device', targetId: 'dev-curtain-001', targetName: '客厅落地窗帘', result: 'success', detail: '开合度调整至80%', ip: randomIP(), userAgent: ua },
  { id: 'log-op-004', type: 'operation', timestamp: Date.now() - 60000 * 45, houseId: 'house-villa-001', userId: 'member-member-003', userName: '张小乐', action: '打开设备', targetType: 'device', targetId: 'dev-tv-001', targetName: '客厅激光电视', result: 'success', detail: '切换至HDMI1输入源', ip: randomIP(), userAgent: ua },
  { id: 'log-op-005', type: 'operation', timestamp: Date.now() - 60000 * 62, houseId: 'house-villa-001', userId: 'member-member-004', userName: '王奶奶', action: '打开设备', targetType: 'device', targetId: 'dev-light-003', targetName: '主卧吸顶灯', result: 'success', detail: '亮度70%', ip: randomIP(), userAgent: ua },
  { id: 'log-op-006', type: 'operation', timestamp: Date.now() - 60000 * 85, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '打开设备', targetType: 'device', targetId: 'dev-light-008', targetName: '书房台灯', result: 'success', detail: '亮度85%，色温5000K', ip: randomIP(), userAgent: ua },
  { id: 'log-op-007', type: 'operation', timestamp: Date.now() - 60000 * 108, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '调节音量', targetType: 'device', targetId: 'dev-speaker-001', targetName: '客厅智能音箱', result: 'success', detail: '音量调整至35%', ip: randomIP(), userAgent: ua },
  { id: 'log-op-008', type: 'operation', timestamp: Date.now() - 60000 * 135, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '开锁', targetType: 'device', targetId: 'dev-lock-001', targetName: '入户大门锁', result: 'success', detail: '指纹识别开锁', ip: randomIP(), userAgent: ua },
  { id: 'log-op-009', type: 'operation', timestamp: Date.now() - 60000 * 168, houseId: 'house-villa-001', userId: 'member-member-003', userName: '张小乐', action: '关闭设备', targetType: 'device', targetId: 'dev-ac-003', targetName: '次卧挂机空调', result: 'success', detail: '', ip: randomIP(), userAgent: ua },
  { id: 'log-op-010', type: 'operation', timestamp: Date.now() - 60000 * 192, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '调节颜色', targetType: 'device', targetId: 'dev-light-010', targetName: '客厅氛围灯', result: 'success', detail: 'RGB颜色 #FF6B9D，亮度35%', ip: randomIP(), userAgent: ua },
  { id: 'log-op-011', type: 'operation', timestamp: Date.now() - 60000 * 215, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '调节窗帘', targetType: 'device', targetId: 'dev-curtain-002', targetName: '主卧遮光帘', result: 'success', detail: '完全关闭', ip: randomIP(), userAgent: ua },
  { id: 'log-op-012', type: 'operation', timestamp: Date.now() - 60000 * 248, houseId: 'house-villa-001', userId: 'member-guest-006', userName: '刘阿姨（钟点工）', action: '开锁', targetType: 'device', targetId: 'dev-lock-001', targetName: '入户大门锁', result: 'success', detail: '临时密码开锁', ip: randomIP(), userAgent: ua },
  { id: 'log-op-013', type: 'operation', timestamp: Date.now() - 60000 * 280, houseId: 'house-villa-001', userId: 'member-guest-006', userName: '刘阿姨（钟点工）', action: '打开设备', targetType: 'device', targetId: 'dev-light-006', targetName: '厨房吊灯', result: 'success', detail: '', ip: randomIP(), userAgent: ua },
  { id: 'log-op-014', type: 'operation', timestamp: Date.now() - 60000 * 315, houseId: 'house-apartment-002', userId: 'member-guest-008', userName: '好友·周子豪', action: '开锁', targetType: 'device', targetId: 'dev-lock-003', targetName: '公寓入户门锁', result: 'success', detail: '蓝牙密钥开锁', ip: randomIP(), userAgent: ua },
  { id: 'log-op-015', type: 'operation', timestamp: Date.now() - 60000 * 358, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '批量关闭', targetType: 'device', targetName: '所有灯光设备', result: 'success', detail: '关闭7个灯光设备', ip: randomIP(), userAgent: ua },
  { id: 'log-op-016', type: 'operation', timestamp: Date.now() - 60000 * 398, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '添加设备', targetType: 'device', targetName: '阳台灯带', result: 'failed', detail: '设备配对超时，请重试', ip: randomIP(), userAgent: ua },
  { id: 'log-op-017', type: 'operation', timestamp: Date.now() - 60000 * 442, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '调节温度', targetType: 'device', targetId: 'dev-ac-002', targetName: '主卧挂机空调', result: 'success', detail: '自动模式，25°C', ip: randomIP(), userAgent: ua },
  { id: 'log-op-018', type: 'operation', timestamp: Date.now() - 60000 * 488, houseId: 'house-villa-001', userId: 'member-member-004', userName: '王奶奶', action: '打开设备', targetType: 'device', targetId: 'dev-speaker-002', targetName: '主卧床头音箱', result: 'success', detail: '音量25%', ip: randomIP(), userAgent: ua },
];

const deviceLogs: LogEntry[] = [
  { id: 'log-dev-001', type: 'device', timestamp: Date.now() - 60000 * 3, houseId: 'house-villa-001', action: '状态变更', targetType: 'device', targetId: 'dev-sensor-001', targetName: '客厅温湿度传感器', result: 'success', detail: '温度25.8°C，湿度52%' },
  { id: 'log-dev-002', type: 'device', timestamp: Date.now() - 60000 * 18, houseId: 'house-villa-001', action: '固件升级', targetType: 'device', targetId: 'dev-speaker-001', targetName: '客厅智能音箱', result: 'success', detail: '升级至v8.1.0版本' },
  { id: 'log-dev-003', type: 'device', timestamp: Date.now() - 60000 * 52, houseId: 'house-villa-001', action: '设备上线', targetType: 'device', targetId: 'dev-light-009', targetName: '阳台灯带', result: 'failed', detail: '尝试重连失败，设备持续离线' },
  { id: 'log-dev-004', type: 'device', timestamp: Date.now() - 60000 * 95, houseId: 'house-villa-001', action: '状态变更', targetType: 'device', targetId: 'dev-sensor-007', targetName: '书房人体红外', result: 'success', detail: '检测到人体移动' },
  { id: 'log-dev-005', type: 'device', timestamp: Date.now() - 60000 * 132, houseId: 'house-villa-001', action: '电量上报', targetType: 'device', targetId: 'dev-lock-002', targetName: '车库门锁', result: 'success', detail: '剩余电量68%' },
  { id: 'log-dev-006', type: 'device', timestamp: Date.now() - 60000 * 175, houseId: 'house-villa-001', action: '状态变更', targetType: 'device', targetId: 'dev-sensor-003', targetName: '厨房烟雾报警器', result: 'success', detail: '烟雾浓度恢复正常' },
  { id: 'log-dev-007', type: 'device', timestamp: Date.now() - 60000 * 218, houseId: 'house-villa-001', action: '故障检测', targetType: 'device', targetId: 'dev-ac-004', targetName: '书房空调', result: 'success', detail: '检测到通信模块异常，错误码E-018' },
  { id: 'log-dev-008', type: 'device', timestamp: Date.now() - 60000 * 265, houseId: 'house-villa-001', action: '状态变更', targetType: 'device', targetId: 'dev-sensor-005', targetName: '入户门磁传感器', result: 'success', detail: '门已关闭' },
  { id: 'log-dev-009', type: 'device', timestamp: Date.now() - 60000 * 302, houseId: 'house-villa-001', action: '状态变更', targetType: 'device', targetId: 'dev-sensor-006', targetName: '阳台门窗磁', result: 'success', detail: '门已打开' },
  { id: 'log-dev-010', type: 'device', timestamp: Date.now() - 60000 * 345, houseId: 'house-villa-001', action: '录像启动', targetType: 'device', targetId: 'dev-camera-003', targetName: '车库监控摄像头', result: 'success', detail: '检测到移动，自动录像' },
  { id: 'log-dev-011', type: 'device', timestamp: Date.now() - 60000 * 388, houseId: 'house-villa-001', action: '设备上线', targetType: 'device', targetId: 'dev-light-007', targetName: '卫生间镜前灯', result: 'success', detail: '' },
  { id: 'log-dev-012', type: 'device', timestamp: Date.now() - 60000 * 432, houseId: 'house-villa-001', action: '状态变更', targetType: 'device', targetId: 'dev-sensor-002', targetName: '主卧环境传感器', result: 'success', detail: 'CO₂浓度520ppm，正常范围' },
  { id: 'log-dev-013', type: 'device', timestamp: Date.now() - 60000 * 475, houseId: 'house-apartment-002', action: '状态变更', targetType: 'device', targetId: 'dev-ac-005', targetName: '公寓客厅空调', result: 'success', detail: '已关闭' },
  { id: 'log-dev-014', type: 'device', timestamp: Date.now() - 60000 * 518, houseId: 'house-villa-001', action: '设备下线', targetType: 'device', targetId: 'dev-light-009', targetName: '阳台灯带', result: 'success', detail: '网络连接中断' },
];

const alertLogs: LogEntry[] = [
  { id: 'log-alt-001', type: 'alert', timestamp: Date.now() - 60000 * 60, houseId: 'house-villa-001', userId: 'member-property-005', userName: '物业管家·陈师傅', action: '处理告警', targetType: 'alert', targetId: 'alert-006', targetName: '设备故障告警', result: 'success', detail: '已安排维修人员上门，预约明日上午10:00' },
  { id: 'log-alt-002', type: 'alert', timestamp: Date.now() - 60000 * 120, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '处理告警', targetType: 'alert', targetId: 'alert-004', targetName: '水浸检测告警', result: 'success', detail: '已远程关闭主水阀，正在回家检查（处理中）' },
  { id: 'log-alt-003', type: 'alert', timestamp: Date.now() - 60000 * 200, houseId: 'house-villa-001', userId: 'member-member-003', userName: '张小乐', action: '处理告警', targetType: 'alert', targetId: 'alert-008', targetName: '门窗未关提醒', result: 'success', detail: '已关闭阳台门' },
  { id: 'log-alt-004', type: 'alert', timestamp: Date.now() - 60000 * 280, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '忽略告警', targetType: 'alert', targetId: 'alert-009', targetName: 'PM2.5超标提醒', result: 'success', detail: '正在开窗通风，暂不处理' },
  { id: 'log-alt-005', type: 'alert', timestamp: Date.now() - 60000 * 360, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '处理告警', targetType: 'alert', targetId: 'alert-001', targetName: '烟雾报警触发', result: 'success', detail: '确认厨房油烟，启动油烟机和排风，已解除警报' },
  { id: 'log-alt-006', type: 'alert', timestamp: Date.now() - 60000 * 440, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '处理告警', targetType: 'alert', targetId: 'alert-002', targetName: '门锁异常告警', result: 'success', detail: '确认是小朋友恶作剧，重置门锁状态' },
  { id: 'log-alt-007', type: 'alert', timestamp: Date.now() - 60000 * 520, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '处理告警', targetType: 'alert', targetId: 'alert-003', targetName: '高温告警', result: 'success', detail: '空调已启动制冷，温度恢复正常' },
  { id: 'log-alt-008', type: 'alert', timestamp: Date.now() - 60000 * 580, houseId: 'house-villa-001', action: '告警生成', targetType: 'alert', targetId: 'alert-015', targetName: '安防区域异常', result: 'success', detail: '车库检测到移动，已推送录像至户主' },
];

const memberLogs: LogEntry[] = [
  { id: 'log-mem-001', type: 'member', timestamp: Date.now() - 60000 * 8, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '登录系统', result: 'success', ip: randomIP(), userAgent: ua },
  { id: 'log-mem-002', type: 'member', timestamp: Date.now() - 60000 * 78, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '登录系统', result: 'success', ip: randomIP(), userAgent: ua },
  { id: 'log-mem-003', type: 'member', timestamp: Date.now() - 60000 * 185, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '邀请成员', targetType: 'member', targetId: 'member-guest-006', targetName: '刘阿姨（钟点工）', result: 'success', detail: '授予临时开锁权限，有效期7天' },
  { id: 'log-mem-004', type: 'member', timestamp: Date.now() - 60000 * 255, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '修改权限', targetType: 'member', targetId: 'member-member-003', targetName: '张小乐', result: 'success', detail: '新增能耗查看权限' },
  { id: 'log-mem-005', type: 'member', timestamp: Date.now() - 60000 * 335, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '创建访客权限', targetType: 'member', targetName: '李阿姨', result: 'success', detail: '临时密码有效期至明日18:00' },
  { id: 'log-mem-006', type: 'member', timestamp: Date.now() - 60000 * 415, houseId: 'house-apartment-002', userId: 'member-guest-008', userName: '好友·周子豪', action: '登录系统', result: 'success', ip: randomIP(), userAgent: ua },
  { id: 'log-mem-007', type: 'member', timestamp: Date.now() - 60000 * 495, houseId: 'house-villa-001', userId: 'member-member-004', userName: '王奶奶', action: '修改密码', result: 'success', detail: '' },
  { id: 'log-mem-008', type: 'member', timestamp: Date.now() - 60000 * 560, houseId: 'house-villa-001', userId: 'member-property-005', userName: '物业管家·陈师傅', action: '登录系统', result: 'success', ip: randomIP(), userAgent: ua },
  { id: 'log-mem-009', type: 'member', timestamp: Date.now() - 60000 * 620, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '添加管理员', targetType: 'member', targetId: 'member-admin-002', targetName: '李雨婷', result: 'success', detail: '分配房屋管理权限' },
];

const sceneLogs: LogEntry[] = [
  { id: 'log-scn-001', type: 'scene', timestamp: Date.now() - 60000 * 15, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '执行场景', targetType: 'scene', targetId: 'scene-reading', targetName: '阅读模式', result: 'success', detail: '完成4个设备联动操作' },
  { id: 'log-scn-002', type: 'scene', timestamp: Date.now() - 60000 * 100, houseId: 'house-villa-001', action: '场景自动执行', targetType: 'scene', targetId: 'scene-wakeup', targetName: '晨起模式', result: 'success', detail: '定时触发，完成5个动作' },
  { id: 'log-scn-003', type: 'scene', timestamp: Date.now() - 60000 * 220, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '创建场景', targetType: 'scene', targetId: 'scene-nap', targetName: '午休模式', result: 'success', detail: '' },
  { id: 'log-scn-004', type: 'scene', timestamp: Date.now() - 60000 * 330, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '执行场景', targetType: 'scene', targetId: 'scene-cinema', targetName: '影院模式', result: 'success', detail: '完成6个设备联动操作' },
  { id: 'log-scn-005', type: 'scene', timestamp: Date.now() - 60000 * 440, houseId: 'house-villa-001', action: '场景自动执行', targetType: 'scene', targetId: 'scene-sleep', targetName: '睡眠模式', result: 'success', detail: '定时触发，完成6个动作' },
  { id: 'log-scn-006', type: 'scene', timestamp: Date.now() - 60000 * 550, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '执行场景', targetType: 'scene', targetId: 'scene-leave', targetName: '离家模式', result: 'success', detail: '完成9个设备操作和1个通知' },
  { id: 'log-scn-007', type: 'scene', timestamp: Date.now() - 60000 * 610, houseId: 'house-villa-001', userId: 'member-member-003', userName: '张小乐', action: '执行场景', targetType: 'scene', targetId: 'scene-dining', targetName: '用餐模式', result: 'success', detail: '完成3个设备操作' },
  { id: 'log-scn-008', type: 'scene', timestamp: Date.now() - 60000 * 650, houseId: 'house-apartment-002', userId: 'member-guest-008', userName: '好友·周子豪', action: '执行场景', targetType: 'scene', targetId: 'scene-apt-relax', targetName: '度假放松', result: 'success', detail: '完成2个设备操作' },
  { id: 'log-scn-009', type: 'scene', timestamp: Date.now() - 60000 * 680, houseId: 'house-villa-001', userId: 'member-admin-002', userName: '李雨婷', action: '编辑场景', targetType: 'scene', targetId: 'scene-guest', targetName: '会客模式', result: 'success', detail: '新增音箱开启动作' },
  { id: 'log-scn-010', type: 'scene', timestamp: Date.now() - 60000 * 710, houseId: 'house-villa-001', userId: 'member-owner-001', userName: '张明轩', action: '启用场景', targetType: 'scene', targetId: 'scene-morning', targetName: '晨起唤醒', result: 'success', detail: '' },
];

export const logs: LogEntry[] = [
  ...operationLogs,
  ...deviceLogs,
  ...alertLogs,
  ...memberLogs,
  ...sceneLogs,
].sort((a, b) => b.timestamp - a.timestamp);

export const logsByHouse = (houseId: string) => logs.filter((l) => l.houseId === houseId);
export const logsByType = (type: LogType) => logs.filter((l) => l.type === type);
