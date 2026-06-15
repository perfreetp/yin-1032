export type MemberRole = 'owner' | 'admin' | 'member' | 'guest' | 'property';
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

const ALL_PERMISSIONS: PermissionKey[] = [
  'device:control',
  'device:pair',
  'scene:execute',
  'scene:edit',
  'energy:view',
  'alert:handle',
  'member:invite',
  'member:authorize',
  'log:view',
  'lock:unlock',
  'camera:view',
];

export const members: Member[] = [
  {
    id: 'member-owner-001',
    name: '张明轩',
    avatar: '👨‍💼',
    phone: '138****6820',
    role: 'owner',
    houseId: 'house-villa-001',
    permissions: ALL_PERMISSIONS,
    isOnline: true,
    lastActiveAt: Date.now() - 180000,
    createdAt: Date.now() - 86400000 * 180,
  },
  {
    id: 'member-admin-002',
    name: '李雨婷',
    avatar: '👩‍💻',
    phone: '139****2581',
    role: 'admin',
    houseId: 'house-villa-001',
    permissions: [
      'device:control',
      'device:pair',
      'scene:execute',
      'scene:edit',
      'energy:view',
      'alert:handle',
      'member:invite',
      'log:view',
      'lock:unlock',
      'camera:view',
    ],
    isOnline: true,
    lastActiveAt: Date.now() - 900000,
    createdAt: Date.now() - 86400000 * 175,
  },
  {
    id: 'member-member-003',
    name: '张小乐',
    avatar: '🧑‍🎓',
    phone: '137****9965',
    role: 'member',
    houseId: 'house-villa-001',
    permissions: [
      'device:control',
      'scene:execute',
      'energy:view',
      'log:view',
      'lock:unlock',
      'camera:view',
    ],
    isOnline: false,
    lastActiveAt: Date.now() - 86400000 * 0.8,
    createdAt: Date.now() - 86400000 * 150,
  },
  {
    id: 'member-member-004',
    name: '王奶奶',
    avatar: '�',
    phone: '136****3302',
    role: 'member',
    houseId: 'house-villa-001',
    permissions: [
      'device:control',
      'scene:execute',
      'lock:unlock',
    ],
    isOnline: true,
    lastActiveAt: Date.now() - 3600000,
    createdAt: Date.now() - 86400000 * 160,
  },
  {
    id: 'member-guest-006',
    name: '刘阿姨（钟点工）',
    avatar: '👩‍🍳',
    phone: '158****7714',
    role: 'guest',
    houseId: 'house-villa-001',
    permissions: [
      'lock:unlock',
      'device:control',
    ],
    isOnline: false,
    lastActiveAt: Date.now() - 86400000 * 2,
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    id: 'member-property-005',
    name: '物业管家·陈师傅',
    avatar: '🧰',
    phone: '400****8899',
    role: 'property',
    houseId: 'house-villa-001',
    permissions: [
      'alert:handle',
      'camera:view',
      'log:view',
      'device:control',
    ],
    isOnline: false,
    lastActiveAt: Date.now() - 86400000 * 1.5,
    createdAt: Date.now() - 86400000 * 120,
  },
  {
    id: 'member-owner-007',
    name: '张明轩',
    avatar: '🏖️',
    phone: '138****6820',
    role: 'owner',
    houseId: 'house-apartment-002',
    permissions: ALL_PERMISSIONS,
    isOnline: false,
    lastActiveAt: Date.now() - 86400000 * 3,
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: 'member-guest-008',
    name: '好友·周子豪',
    avatar: '🏄‍♂️',
    phone: '135****4421',
    role: 'guest',
    houseId: 'house-apartment-002',
    permissions: [
      'lock:unlock',
      'device:control',
      'scene:execute',
    ],
    isOnline: true,
    lastActiveAt: Date.now() - 7200000,
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const membersByHouse = (houseId: string) => members.filter((m) => m.houseId === houseId);
export const ownerOfHouse = (houseId: string) => members.find((m) => m.houseId === houseId && m.role === 'owner');

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

export const guestPasses: GuestPass[] = [
  {
    id: 'gp-001',
    guestName: '李阿姨',
    guestPhone: '159****2245',
    creatorId: 'member-owner-001',
    houseId: 'house-villa-001',
    validFrom: Date.now() - 86400000,
    validTo: Date.now() + 86400000 * 0.8,
    permissions: ['lock:unlock'],
    deviceIds: ['dev-lock-001'],
    code: '884236',
    usedCount: 3,
    maxUseCount: 10,
    revoked: false,
    createdAt: Date.now() - 86400000 * 1.5,
  },
  {
    id: 'gp-002',
    guestName: '王师傅（维修）',
    guestPhone: '136****7788',
    creatorId: 'member-admin-002',
    houseId: 'house-villa-001',
    validFrom: Date.now() + 86400000,
    validTo: Date.now() + 86400000 * 1.5,
    permissions: ['lock:unlock', 'device:control'],
    deviceIds: ['dev-lock-001', 'dev-ac-004'],
    code: '551289',
    usedCount: 0,
    revoked: false,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'gp-003',
    guestName: '赵叔叔（邻居）',
    guestPhone: '138****4432',
    creatorId: 'member-owner-001',
    houseId: 'house-villa-001',
    validFrom: Date.now() - 86400000 * 5,
    validTo: Date.now() - 86400000 * 2,
    permissions: ['lock:unlock'],
    deviceIds: ['dev-lock-001'],
    code: '223471',
    usedCount: 2,
    maxUseCount: 5,
    revoked: true,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'gp-004',
    guestName: '度假好友·林小美',
    guestPhone: '137****9988',
    creatorId: 'member-owner-007',
    houseId: 'house-apartment-002',
    validFrom: Date.now() - 86400000 * 2,
    validTo: Date.now() + 86400000 * 5,
    permissions: ['lock:unlock', 'device:control', 'scene:execute'],
    deviceIds: ['dev-lock-003', 'dev-light-011', 'dev-ac-005'],
    code: '778842',
    usedCount: 5,
    revoked: false,
    createdAt: Date.now() - 86400000 * 3,
  },
];

export const roleInfo: Record<MemberRole, { label: string; color: string; description: string }> = {
  owner: { label: '户主', color: '#EF4444', description: '房屋产权人，拥有全部权限' },
  admin: { label: '管理员', color: '#3B82F6', description: '由户主授权，可管理设备和成员' },
  member: { label: '家庭成员', color: '#10B981', description: '可控制设备、查看日志和能耗' },
  guest: { label: '访客', color: '#F59E0B', description: '临时权限，限时开锁和指定设备' },
  property: { label: '物业管家', color: '#8B5CF6', description: '接收和处理告警，远程协助' },
};
