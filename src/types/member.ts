/**
 * 家庭成员角色
 * owner: 房主（拥有全部权限，可移交）
 * admin: 管理员（大部分权限，可邀请成员）
 * member: 普通成员（日常控制权限）
 * guest: 访客（临时受限权限）
 * property: 物业人员（特定授权权限）
 */
export type MemberRole = 'owner' | 'admin' | 'member' | 'guest' | 'property';

/**
 * 权限键定义
 * device:control: 控制设备开关、调节参数
 * device:pair: 配对新增设备、删除设备
 * scene:execute: 执行触发场景
 * scene:edit: 创建编辑删除场景
 * energy:view: 查看能耗统计数据
 * alert:handle: 处理告警信息
 * member:invite: 邀请新成员加入
 * member:authorize: 成员权限管理、角色分配
 * log:view: 查看操作日志和审计记录
 * lock:unlock: 远程开锁权限
 * camera:view: 查看摄像头实时画面
 */
export type PermissionKey =
  | 'device:control'
  | 'device:pair'
  | 'scene:execute'
  | 'scene:edit'
  | 'energy:view'
  | 'alert:handle'
  | 'member:invite'
  | 'member:authorize'
  | 'log:view'
  | 'lock:unlock'
  | 'camera:view';

/**
 * 家庭成员实体
 * id: 成员唯一标识
 * name: 成员姓名/昵称
 * avatar: 头像图片URL
 * phone: 手机号码
 * role: 成员角色
 * houseId: 所属房屋ID
 * permissions: 拥有的权限列表
 * isOnline: 当前是否在线
 * lastActiveAt: 最近活跃时间戳
 * createdAt: 加入时间戳
 */
export interface Member {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  role: MemberRole;
  houseId: string;
  permissions: PermissionKey[];
  isOnline: boolean;
  lastActiveAt: number;
  createdAt: number;
}

/**
 * 访客临时通行证
 * id: 通行证唯一标识
 * guestName: 访客姓名
 * guestPhone: 访客手机号码（可选）
 * creatorId: 创建人成员ID
 * houseId: 所属房屋ID
 * validFrom: 生效开始时间戳
 * validTo: 生效结束时间戳
 * permissions: 授予的权限列表
 * deviceIds: 可访问的设备ID列表
 * code: 临时凭证码（用于开锁等验证）
 * usedCount: 已使用次数
 * maxUseCount: 最大使用次数限制（可选，为空则不限次数）
 * revoked: 是否已被撤销
 * createdAt: 创建时间戳
 */
export interface GuestPass {
  id: string;
  guestName: string;
  guestPhone?: string;
  creatorId: string;
  houseId: string;
  validFrom: number;
  validTo: number;
  permissions: PermissionKey[];
  deviceIds: string[];
  code: string;
  usedCount: number;
  maxUseCount?: number;
  revoked: boolean;
  createdAt: number;
}
