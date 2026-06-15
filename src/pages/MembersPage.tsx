import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  UserCog,
  Phone,
  Calendar,
  Clock,
  Key,
  Edit2,
  Trash2,
  X,
  Plus,
  Check,
  ChevronDown,
  Wifi,
  WifiOff,
  Ticket,
  Copy,
  Ban,
  Settings,
  Lock,
  Cpu,
  Play,
  Zap,
  FileText,
  Camera,
  type LucideIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useMemberStore } from '@/store/useMemberStore';
import type { MemberRole, PermissionKey } from '@/mock/members';
import { useHouseStore } from '@/store/useHouseStore';
import { roleInfo, type GuestPass, type Member } from '@/mock/members';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import { cn } from '@/lib/utils';

const DEFAULT_HOUSE_ID = 'house-villa-001';

const ROLE_ORDER: MemberRole[] = ['owner', 'admin', 'member', 'guest', 'property'];

const permissionLabels: Record<PermissionKey, { label: string; icon: LucideIcon }> = {
  'device:control': { label: '设备控制', icon: Cpu },
  'device:pair': { label: '设备配对', icon: Plus },
  'scene:execute': { label: '场景执行', icon: Play },
  'scene:edit': { label: '场景编辑', icon: Settings },
  'energy:view': { label: '能耗查看', icon: Zap },
  'alert:handle': { label: '告警处理', icon: ShieldAlert },
  'member:invite': { label: '邀请成员', icon: UserPlus },
  'member:authorize': { label: '权限管理', icon: ShieldCheck },
  'log:view': { label: '日志查看', icon: FileText },
  'lock:unlock': { label: '门锁开锁', icon: Lock },
  'camera:view': { label: '摄像头查看', icon: Camera },
};

const roleIcons: Record<MemberRole, typeof User> = {
  owner: ShieldAlert,
  admin: UserCog,
  member: User,
  guest: Ticket,
  property: Shield,
};

const MembersPage = () => {
  const { members, guestPasses, fetchMembers, inviteMember, updateMemberRole, createGuestPass, revokeGuestPass } =
    useMemberStore();
  const { currentHouseId, getHouses } = useHouseStore();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [filterRole, setFilterRole] = useState<MemberRole | 'all'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    phone: '',
    role: 'member' as MemberRole,
    permissions: [
      'device:control',
      'scene:execute',
      'lock:unlock',
    ] as PermissionKey[],
  });

  const [guestForm, setGuestForm] = useState({
    guestName: '',
    guestPhone: '',
    validFrom: dayjs().format('YYYY-MM-DD'),
    validTo: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    permissions: ['lock:unlock'] as PermissionKey[],
  });

  useEffect(() => {
    const init = async () => {
      const houses = await getHouses();
      const houseId = currentHouseId || houses[0]?.id || DEFAULT_HOUSE_ID;
      await fetchMembers(houseId);
    };
    init();
  }, [fetchMembers, getHouses, currentHouseId]);

  const houseMembers = useMemo(
    () => members.filter((m) => m.houseId === (currentHouseId || DEFAULT_HOUSE_ID)),
    [members, currentHouseId]
  );

  const houseGuestPasses = useMemo(
    () => guestPasses.filter((g) => g.houseId === (currentHouseId || DEFAULT_HOUSE_ID)),
    [guestPasses, currentHouseId]
  );

  const filteredMembers = useMemo(() => {
    let result = houseMembers;
    if (filterRole !== 'all') {
      result = result.filter((m) => m.role === filterRole);
    }
    return result.sort((a, b) => {
      const orderA = ROLE_ORDER.indexOf(a.role);
      const orderB = ROLE_ORDER.indexOf(b.role);
      if (orderA !== orderB) return orderA - orderB;
      return b.createdAt - a.createdAt;
    });
  }, [houseMembers, filterRole]);

  const stats = useMemo(() => {
    const total = houseMembers.length;
    const online = houseMembers.filter((m) => m.isOnline).length;
    const admins = houseMembers.filter((m) => m.role === 'owner' || m.role === 'admin').length;
    const guests = houseMembers.filter((m) => m.role === 'guest').length;
    return { total, online, admins, guests };
  }, [houseMembers]);

  const handleInviteSubmit = useCallback(() => {
    if (!inviteForm.name || !inviteForm.phone) return;
    inviteMember({
      name: inviteForm.name,
      avatar: '👤',
      phone: inviteForm.phone,
      role: inviteForm.role,
      houseId: currentHouseId || DEFAULT_HOUSE_ID,
      permissions: inviteForm.permissions,
    });
    setShowInviteModal(false);
    setInviteForm({
      name: '',
      phone: '',
      role: 'member',
      permissions: ['device:control', 'scene:execute', 'lock:unlock'],
    });
  }, [inviteForm, inviteMember, currentHouseId]);

  const handleGuestSubmit = useCallback(() => {
    if (!guestForm.guestName) return;
    createGuestPass({
      guestName: guestForm.guestName,
      guestPhone: guestForm.guestPhone || undefined,
      creatorId: 'member-owner-001',
      houseId: currentHouseId || DEFAULT_HOUSE_ID,
      validFrom: new Date(guestForm.validFrom).getTime(),
      validTo: new Date(guestForm.validTo).getTime() + 86399999,
      permissions: guestForm.permissions,
      deviceIds: [],
      code: Math.random().toString().slice(2, 8),
    });
    setShowGuestModal(false);
    setGuestForm({
      guestName: '',
      guestPhone: '',
      validFrom: dayjs().format('YYYY-MM-DD'),
      validTo: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      permissions: ['lock:unlock'],
    });
  }, [guestForm, createGuestPass, currentHouseId]);

  const togglePermission = <T extends { permissions: PermissionKey[] }>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: PermissionKey
  ) => {
    setter((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const getGuestStatus = useCallback((gp: GuestPass) => {
    const now = Date.now();
    if (gp.revoked) return { label: '已撤销', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    if (now < gp.validFrom) return { label: '未生效', color: 'bg-primary-500/15 text-primary-300 border-primary-500/30' };
    if (now > gp.validTo) return { label: '已过期', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    if (gp.maxUseCount && gp.usedCount >= gp.maxUseCount) return { label: '次数用尽', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    return { label: '生效中', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  }, []);

  const formatRelativeActive = useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚活跃';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前活跃`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前活跃`;
    return `${Math.floor(diff / 86400000)}天前活跃`;
  }, []);

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">成员管理</h1>
          <p className="text-sm text-muted-foreground">
            管理家庭成员、分配权限和创建临时访客凭证
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setFilterRole('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filterRole === 'all'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              )}
            >
              全部
            </button>
            {ROLE_ORDER.map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filterRole === role
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                {roleInfo[role].label}
              </button>
            ))}
          </div>
          <GradientButton
            variant="primary"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowInviteModal(true)}
          >
            邀请成员
          </GradientButton>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="总人数"
          value={stats.total}
          unit="人"
          icon={<Users className="w-4 h-4" />}
          trend={2}
          trendDirection="up"
        />
        <StatBlock
          title="在线人数"
          value={stats.online}
          unit="人"
          icon={<Wifi className="w-4 h-4" />}
          trend={stats.online > stats.total / 2 ? 15 : -5}
          trendDirection={stats.online > stats.total / 2 ? 'up' : 'down'}
        />
        <StatBlock
          title="管理员"
          value={stats.admins}
          unit="人"
          icon={<ShieldCheck className="w-4 h-4" />}
          trendDirection="neutral"
        />
        <StatBlock
          title="访客数"
          value={stats.guests}
          unit="人"
          icon={<Ticket className="w-4 h-4" />}
          trend={1}
          trendDirection="neutral"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-400" />
            家庭成员
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredMembers.length})
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const RoleIcon = roleIcons[member.role];
            const roleCfg = roleInfo[member.role];
            return (
              <GlassCard
                key={member.id}
                className="p-5 relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 opacity-20 pointer-events-none blur-3xl -translate-y-1/3 translate-x-1/3"
                  style={{ background: roleCfg.color }}
                />

                <div className="relative flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
                        'bg-gradient-to-br from-white/10 to-white/5 border border-white/15',
                        'shadow-lg'
                      )}
                      style={{
                        boxShadow: member.isOnline
                          ? `0 0 20px ${roleCfg.color}40`
                          : undefined,
                      }}
                    >
                      {member.avatar}
                    </div>
                    {member.isOnline ? (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-deepspace-600 flex items-center justify-center animate-pulse">
                        <Wifi className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-500 border-3 border-deepspace-600 flex items-center justify-center">
                        <WifiOff className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg truncate">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary-500/20 text-muted-foreground hover:text-primary-400 flex items-center justify-center transition-all border border-white/10">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {member.role !== 'owner' && (
                          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-danger-500/20 text-muted-foreground hover:text-danger-400 flex items-center justify-center transition-all border border-white/10">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                        style={{
                          background: `${roleCfg.color}20`,
                          borderColor: `${roleCfg.color}40`,
                          color: roleCfg.color,
                        }}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {roleCfg.label}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-3.5">
                      {member.permissions.slice(0, 4).map((p) => {
                        const Pl = permissionLabels[p];
                        const PIcon = Pl.icon;
                        return (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary-500/10 border border-primary-500/20 text-primary-300"
                            title={Pl.label}
                          >
                            <PIcon className="w-3 h-3" />
                            {Pl.label}
                          </span>
                        );
                      })}
                      {member.permissions.length > 4 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-muted-foreground">
                          +{member.permissions.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {member.isOnline ? '当前在线' : formatRelativeActive(member.lastActiveAt)}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dayjs(member.createdAt).format('YYYY/MM/DD')}加入
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {filteredMembers.length === 0 && (
            <GlassCard hover={false} className="p-16 text-center md:col-span-2 xl:col-span-3">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-white/70 mb-2">暂无成员</h3>
              <p className="text-sm text-muted-foreground mb-5">
                当前筛选条件下没有成员，邀请新成员加入吧
              </p>
              <GradientButton
                variant="primary"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => setShowInviteModal(true)}
              >
                邀请成员
              </GradientButton>
            </GlassCard>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-secondary-400" />
            访客临时权限
            <span className="text-sm font-normal text-muted-foreground">
              ({houseGuestPasses.filter((g) => !g.revoked && Date.now() <= g.validTo).length} 生效中)
            </span>
          </h2>
          <GradientButton
            variant="ghost"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowGuestModal(true)}
          >
            创建访客凭证
          </GradientButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {houseGuestPasses.map((gp) => {
            const status = getGuestStatus(gp);
            return (
              <GlassCard
                key={gp.id}
                hover={false}
                className="p-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 via-purple-500 to-primary-500" />

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500/20 to-purple-500/20 border border-secondary-500/30 flex items-center justify-center shrink-0">
                    <Ticket className="w-7 h-7 text-secondary-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-bold text-white">{gp.guestName}</h3>
                        {gp.guestPhone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {gp.guestPhone}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-md text-[11px] font-semibold shrink-0 border',
                          status.color
                        )}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3 p-3 rounded-xl bg-black/30 border border-white/5">
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">临时密码</div>
                        <div className="font-orbitron text-xl font-bold text-white tracking-widest flex items-center gap-2">
                          {gp.code}
                          <button
                            onClick={() => copyCode(gp.code)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
                          >
                            {copiedCode === gp.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex-1" />
                      {gp.maxUseCount !== undefined && (
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground mb-1">使用次数</div>
                          <div className="text-sm font-semibold text-white">
                            {gp.usedCount}
                            <span className="text-muted-foreground font-normal">/{gp.maxUseCount}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary-400" />
                        生效: {dayjs(gp.validFrom).format('MM/DD')}
                        <span className="mx-0.5">~</span>
                        {dayjs(gp.validTo).format('MM/DD')}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Key className="w-3.5 h-3.5 text-secondary-400" />
                        权限: {gp.permissions.length}项
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-white/5">
                      {gp.permissions.map((p) => {
                        const Pl = permissionLabels[p];
                        const PIcon = Pl.icon;
                        return (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary-500/10 border border-secondary-500/20 text-secondary-300"
                          >
                            <PIcon className="w-3 h-3" />
                            {Pl.label}
                          </span>
                        );
                      })}
                      <div className="flex-1" />
                      {!gp.revoked && Date.now() <= gp.validTo && (
                        <button
                          onClick={() => revokeGuestPass(gp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-danger-500/10 border border-danger-500/20 text-danger-300 hover:bg-danger-500/20 transition-all"
                        >
                          <Ban className="w-3 h-3" />
                          撤销
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {houseGuestPasses.length === 0 && (
            <GlassCard hover={false} className="p-12 text-center lg:col-span-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Ticket className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-base font-semibold text-white/70 mb-1">暂无访客凭证</h3>
              <p className="text-sm text-muted-foreground">
                创建临时凭证，方便家政、维修等访客进出
              </p>
            </GlassCard>
          )}
        </div>
      </div>

      <GlassCard hover={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">权限分级矩阵</h3>
              <p className="text-xs text-muted-foreground">各角色对应的功能权限一览</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 rounded-l-xl bg-white/5 border-y border-white/10 sticky left-0 z-10">
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-400" />
                    功能权限
                  </span>
                </th>
                {ROLE_ORDER.map((role) => {
                  const RoleIcon = roleIcons[role];
                  const cfg = roleInfo[role];
                  return (
                    <th
                      key={role}
                      className="text-center py-3 px-3 bg-white/5 border-y border-white/10 last:rounded-r-xl"
                    >
                      <div
                        className="inline-flex flex-col items-center gap-1 px-2 py-1 rounded-lg"
                        style={{ background: `${cfg.color}10` }}
                      >
                        <div className="flex items-center gap-1.5">
                          <RoleIcon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                          <span
                            className="text-xs font-bold"
                            style={{ color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionLabels).map(([key, cfg], idx) => {
                const PIcon = cfg.icon;
                return (
                  <tr
                    key={key}
                    className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}
                  >
                    <td className="py-3 px-4 border-b border-white/5 sticky left-0 bg-deepspace-600 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <PIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-white">{cfg.label}</span>
                      </div>
                    </td>
                    {ROLE_ORDER.map((role) => {
                      const rolePermMap: Record<MemberRole, PermissionKey[]> = {
                        owner: Object.keys(permissionLabels) as PermissionKey[],
                        admin: [
                          'device:control', 'device:pair', 'scene:execute', 'scene:edit',
                          'energy:view', 'alert:handle', 'member:invite', 'log:view',
                          'lock:unlock', 'camera:view',
                        ],
                        member: ['device:control', 'scene:execute', 'energy:view', 'log:view', 'lock:unlock', 'camera:view'],
                        guest: ['lock:unlock'],
                        property: ['alert:handle', 'camera:view', 'log:view', 'device:control'],
                      };
                      const has = rolePermMap[role].includes(key as PermissionKey);
                      return (
                        <td key={role} className="py-3 px-3 border-b border-white/5 text-center">
                          {has ? (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                              <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10">
                              <X className="w-4 h-4 text-muted-foreground/50" strokeWidth={3} />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-deepspace-600 border border-white/10 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-400" />
                邀请成员
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">成员姓名 *</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="请输入姓名"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">手机号码 *</label>
                <input
                  type="tel"
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="请输入手机号码"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">分配角色</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['admin', 'member', 'guest', 'property'] as MemberRole[]).map((role) => {
                    const RoleIcon = roleIcons[role];
                    const cfg = roleInfo[role];
                    return (
                      <button
                        key={role}
                        onClick={() => setInviteForm((p) => ({ ...p, role }))}
                        className={cn(
                          'p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5',
                          inviteForm.role === role
                            ? 'border-primary-500/50 bg-primary-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        )}
                      >
                        <RoleIcon
                          className="w-5 h-5"
                          style={{ color: inviteForm.role === role ? cfg.color : undefined }}
                        />
                        <span
                          className={cn(
                            'text-[11px] font-semibold',
                            inviteForm.role === role ? 'text-primary-300' : 'text-white/70'
                          )}
                        >
                          {cfg.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-medium text-white/80">功能权限</label>
                  <span className="text-[11px] text-muted-foreground">
                    已选 {inviteForm.permissions.length} 项
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                  {Object.entries(permissionLabels).map(([key, cfg]) => {
                    const PIcon = cfg.icon;
                    const checked = inviteForm.permissions.includes(key as PermissionKey);
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          togglePermission(setInviteForm, key as PermissionKey)
                        }
                        className={cn(
                          'p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5',
                          checked
                            ? 'border-primary-500/40 bg-primary-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        )}
                      >
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all',
                            checked ? 'bg-primary-500/30' : 'bg-white/10'
                          )}
                        >
                          <PIcon
                            className={cn(
                              'w-3.5 h-3.5',
                              checked ? 'text-primary-400' : 'text-muted-foreground'
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            'text-xs font-medium',
                            checked ? 'text-white' : 'text-white/70'
                          )}
                        >
                          {cfg.label}
                        </span>
                        {checked && (
                          <Check className="w-3.5 h-3.5 text-primary-400 ml-auto shrink-0" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
              <GradientButton variant="ghost" onClick={() => setShowInviteModal(false)}>
                取消
              </GradientButton>
              <GradientButton
                variant="primary"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={handleInviteSubmit}
              >
                发送邀请
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {showGuestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowGuestModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-deepspace-600 border border-white/10 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-secondary-400" />
                创建访客凭证
              </h2>
              <button
                onClick={() => setShowGuestModal(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">访客姓名 *</label>
                <input
                  type="text"
                  value={guestForm.guestName}
                  onChange={(e) => setGuestForm((p) => ({ ...p, guestName: e.target.value }))}
                  placeholder="请输入访客姓名，如：李阿姨、王师傅"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary-500/40"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">联系电话（选填）</label>
                <input
                  type="tel"
                  value={guestForm.guestPhone}
                  onChange={(e) => setGuestForm((p) => ({ ...p, guestPhone: e.target.value }))}
                  placeholder="用于发送凭证通知"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">开始日期</label>
                  <input
                    type="date"
                    value={guestForm.validFrom}
                    onChange={(e) => setGuestForm((p) => ({ ...p, validFrom: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">结束日期</label>
                  <input
                    type="date"
                    value={guestForm.validTo}
                    onChange={(e) => setGuestForm((p) => ({ ...p, validTo: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-medium text-white/80">授权权限</label>
                  <span className="text-[11px] text-muted-foreground">
                    已选 {guestForm.permissions.length} 项
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['lock:unlock', 'device:control', 'scene:execute'] as PermissionKey[]).map((key) => {
                    const cfg = permissionLabels[key];
                    const PIcon = cfg.icon;
                    const checked = guestForm.permissions.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => togglePermission(setGuestForm, key)}
                        className={cn(
                          'p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5',
                          checked
                            ? 'border-secondary-500/40 bg-secondary-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        )}
                      >
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all',
                            checked ? 'bg-secondary-500/30' : 'bg-white/10'
                          )}
                        >
                          <PIcon
                            className={cn(
                              'w-3.5 h-3.5',
                              checked ? 'text-secondary-400' : 'text-muted-foreground'
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            'text-xs font-medium',
                            checked ? 'text-white' : 'text-white/70'
                          )}
                        >
                          {cfg.label}
                        </span>
                        {checked && (
                          <Check className="w-3.5 h-3.5 text-secondary-400 ml-auto shrink-0" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
              <GradientButton variant="ghost" onClick={() => setShowGuestModal(false)}>
                取消
              </GradientButton>
              <GradientButton
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleGuestSubmit}
                className="!bg-gradient-to-r !from-secondary-500 !to-purple-500"
              >
                创建凭证
              </GradientButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
