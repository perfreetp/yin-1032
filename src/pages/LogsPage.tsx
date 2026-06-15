import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Cpu,
  Bell,
  Users,
  Play,
  Search,
  Filter,
  Calendar,
  User,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Monitor,
  CheckCircle2,
  XCircle,
  X,
  RotateCcw,
  Download,
  Network,
  type LucideIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useLogStore } from '@/store/useLogStore';
import type { LogType } from '@/mock/logs';
import { useMemberStore } from '@/store/useMemberStore';
import { useAppStore } from '@/store/useAppStore';
import { type LogEntry } from '@/mock/logs';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import { cn } from '@/lib/utils';

const typeConfig: Record<
  LogType | 'all',
  {
    label: string;
    icon: LucideIcon;
    color: string;
    dot: string;
    glow: string;
  }
> = {
  all: {
    label: '全部',
    icon: FileText,
    color: 'text-primary-400',
    dot: 'bg-primary-400',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.6)]',
  },
  operation: {
    label: '用户操作',
    icon: User,
    color: 'text-blue-400',
    dot: 'bg-blue-400',
    glow: 'shadow-[0_0_12px_rgba(96,165,250,0.6)]',
  },
  device: {
    label: '设备事件',
    icon: Cpu,
    color: 'text-cyan-400',
    dot: 'bg-cyan-400',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.6)]',
  },
  alert: {
    label: '告警事件',
    icon: Bell,
    color: 'text-danger-400',
    dot: 'bg-danger-400',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]',
  },
  member: {
    label: '成员变更',
    icon: Users,
    color: 'text-emerald-400',
    dot: 'bg-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]',
  },
  scene: {
    label: '场景执行',
    icon: Play,
    color: 'text-purple-400',
    dot: 'bg-purple-400',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.6)]',
  },
};

const timeRanges = [
  { key: 'all', label: '全部' },
  { key: 'today', label: '今日' },
  { key: '3days', label: '近3天' },
  { key: 'week', label: '近一周' },
];

const LogsPage = () => {
  const { logs, filterType, filterUserId, setFilters, fetchLogs } = useLogStore();
  const { members, fetchMembers } = useMemberStore();
  const currentHouseId = useAppStore((state) => state.currentHouseId);

  const [searchText, setSearchText] = useState('');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentHouseId) return;
    fetchLogs(currentHouseId);
    fetchMembers(currentHouseId);
  }, [currentHouseId, fetchLogs, fetchMembers]);

  const houseLogs = useMemo(
    () => logs.filter((l) => l.houseId === currentHouseId),
    [logs, currentHouseId]
  );

  const houseMembers = useMemo(
    () => members.filter((m) => m.houseId === currentHouseId),
    [members, currentHouseId]
  );

  const stats = useMemo(() => {
    const today = dayjs().startOf('day').valueOf();
    const todayCount = houseLogs.filter((l) => l.timestamp >= today).length;
    const deviceCount = houseLogs.filter((l) => l.type === 'device').length;
    const alertCount = houseLogs.filter((l) => l.type === 'alert').length;
    return {
      total: houseLogs.length,
      today: todayCount,
      device: deviceCount,
      alert: alertCount,
    };
  }, [houseLogs]);

  const filteredLogs = useMemo(() => {
    return houseLogs.filter((log) => {
      if (filterType !== 'all' && log.type !== filterType) return false;
      if (filterUserId !== 'all' && log.userId !== filterUserId) return false;

      if (timeRange !== 'all') {
        const now = Date.now();
        const diff = now - log.timestamp;
        const dayMs = 86400000;
        if (timeRange === 'today' && diff > dayMs) return false;
        if (timeRange === '3days' && diff > dayMs * 3) return false;
        if (timeRange === 'week' && diff > dayMs * 7) return false;
      }

      if (searchText.trim()) {
        const keyword = searchText.toLowerCase();
        return (
          log.action.toLowerCase().includes(keyword) ||
          (log.targetName && log.targetName.toLowerCase().includes(keyword)) ||
          (log.userName && log.userName.toLowerCase().includes(keyword)) ||
          (log.detail && log.detail.toLowerCase().includes(keyword)) ||
          (log.ip && log.ip.includes(keyword))
        );
      }

      return true;
    });
  }, [houseLogs, filterType, filterUserId, timeRange, searchText]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, LogEntry[]> = {};
    filteredLogs.forEach((log) => {
      const dayKey = dayjs(log.timestamp).format('YYYY-MM-DD');
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(log);
    });
    return groups;
  }, [filteredLogs]);

  const handleReset = useCallback(() => {
    setFilters({ filterType: 'all', filterUserId: 'all' });
    setTimeRange('all');
    setSearchText('');
  }, [setFilters]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleViewDetail = useCallback((log: LogEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  }, []);

  const getAvatarForUser = useCallback(
    (userId?: string, userName?: string) => {
      if (userId) {
        const member = houseMembers.find((m) => m.id === userId);
        if (member) return member.avatar;
      }
      if (userName?.includes('系统')) return '🤖';
      if (userName?.includes('物业')) return '🧰';
      return '👤';
    },
    [houseMembers]
  );

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">系统日志</h1>
          <p className="text-sm text-muted-foreground">
            完整记录用户操作、设备事件、告警处理和系统运行轨迹
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlassCard hover={false} className="py-2 px-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-muted-foreground">
              {dayjs().format('YYYY年MM月DD日')}
            </span>
          </GlassCard>
          <GradientButton
            variant="ghost"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleReset}
          >
            重置
          </GradientButton>
          <GradientButton
            variant="ghost"
            icon={<Download className="w-4 h-4" />}
          >
            导出日志
          </GradientButton>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="总日志数"
          value={stats.total}
          unit="条"
          icon={<FileText className="w-4 h-4" />}
          trendDirection="neutral"
        />
        <StatBlock
          title="今日操作"
          value={stats.today}
          unit="条"
          icon={<User className="w-4 h-4" />}
          trend={stats.today > 30 ? 18 : -5}
          trendDirection={stats.today > 30 ? 'up' : 'down'}
        />
        <StatBlock
          title="设备事件"
          value={stats.device}
          unit="条"
          icon={<Cpu className="w-4 h-4" />}
          trendDirection="neutral"
        />
        <StatBlock
          title="告警触发"
          value={stats.alert}
          unit="次"
          icon={<Bell className="w-4 h-4" />}
          trend={stats.alert > 10 ? 25 : 0}
          trendDirection={stats.alert > 10 ? 'up' : 'neutral'}
        />
      </div>

      <GlassCard hover={false} className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索操作、设备、用户、IP..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-2" />
              {(Object.keys(typeConfig) as (LogType | 'all')[]).map((type) => {
                const cfg = typeConfig[type];
                const TIcon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setFilters({ filterType: type })}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5',
                      filterType === type
                        ? 'bg-white/10 text-white shadow-inner'
                        : cn(cfg.color, 'opacity-70 hover:opacity-100 hover:bg-white/5')
                    )}
                  >
                    <TIcon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            <select
              value={filterUserId}
              onChange={(e) => setFilters({ filterUserId: e.target.value })}
              className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 cursor-pointer appearance-none pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
            >
              <option value="all" className="bg-deepspace-600">全部用户</option>
              {houseMembers.map((m) => (
                <option key={m.id} value={m.id} className="bg-deepspace-600">
                  {m.name}（{roleShort(m.role)}）
                </option>
              ))}
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 cursor-pointer appearance-none pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cline x1='16' y1='2' x2='16' y2='6'/%3E%3Cline x1='8' y1='2' x2='8' y2='6'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
            >
              {timeRanges.map((tr) => (
                <option key={tr.key} value={tr.key} className="bg-deepspace-600">
                  {tr.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5 text-xs text-muted-foreground">
          <span>
            共找到 <span className="font-semibold text-white">{filteredLogs.length}</span> 条日志记录
          </span>
          <div className="flex items-center gap-4">
            {(Object.keys(typeConfig) as (LogType | 'all')[]).filter(k => k !== 'all').map((type) => {
              const cfg = typeConfig[type];
              const count = filteredLogs.filter(l => l.type === type).length;
              return (
                <span key={type} className="flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                  <span>{cfg.label}:</span>
                  <span className="font-semibold text-white">{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-8">
        {Object.entries(groupedLogs).map(([dayKey, dayLogs]) => {
          const today = dayjs().format('YYYY-MM-DD');
          const yday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
          const dayLabel = dayKey === today ? '今天' : dayKey === yday ? '昨天' : dayKey;
          const isWeekend = dayjs(dayKey).day() === 0 || dayjs(dayKey).day() === 6;

          return (
            <div key={dayKey} className="relative">
              <div className="sticky top-0 z-20 -mx-2 mb-4 px-2 py-2 backdrop-blur-xl bg-deepspace-700/70 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-primary-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {dayLabel}
                      {isWeekend && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-secondary-500/15 border border-secondary-500/20 text-secondary-300">
                          周末
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {dayjs(dayKey).format('dddd')} · 共 {dayLogs.length} 条记录
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-20">
                <div className="absolute left-7 top-2 bottom-2 w-px bg-gradient-to-b from-primary-500/30 via-secondary-500/30 to-transparent" />

                {dayLogs.map((log, idx) => {
                  const tCfg = typeConfig[log.type];
                  const TIcon = tCfg.icon;
                  const isExpanded = expandedIds.has(log.id);
                  const avatar = getAvatarForUser(log.userId, log.userName);

                  return (
                    <div key={log.id} className="relative pb-6 last:pb-0 group">
                      <div
                        className={cn(
                          'absolute left-0 top-4 w-10 h-10 -translate-x-1/2 rounded-full flex items-center justify-center border-4 border-deepspace-700 transition-all',
                          tCfg.dot,
                          tCfg.glow,
                          'group-hover:scale-110'
                        )}
                        style={{ zIndex: 5 }}
                      >
                        <TIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>

                      <GlassCard
                        hover={false}
                        className={cn(
                          'p-5 cursor-pointer transition-all duration-300 overflow-hidden relative',
                          'hover:shadow-lg hover:scale-[1.005]',
                          log.result === 'failed' && 'ring-1 ring-danger-500/20'
                        )}
                        onClick={() => handleViewDetail(log)}
                      >
                        <div
                          className={cn(
                            'absolute left-0 top-0 bottom-0 w-1',
                            tCfg.dot
                          )}
                          style={{ opacity: 0.6 }}
                        />

                        <div className="flex items-start gap-4 pl-1">
                          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                            {avatar}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                <span
                                  className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
                                    log.type === 'operation' && 'bg-blue-500/15 text-blue-300 border border-blue-500/20',
                                    log.type === 'device' && 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
                                    log.type === 'alert' && 'bg-danger-500/15 text-danger-300 border border-danger-500/20',
                                    log.type === 'member' && 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
                                    log.type === 'scene' && 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                                  )}
                                >
                                  <TIcon className="w-3 h-3" />
                                  {tCfg.label}
                                </span>
                                <h4 className="font-semibold text-white truncate flex items-center gap-1.5">
                                  {log.userName && (
                                    <>
                                      <span>{log.userName}</span>
                                      <span className="text-muted-foreground font-normal">·</span>
                                    </>
                                  )}
                                  <span>{log.action}</span>
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {log.result === 'success' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" />
                                    成功
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-danger-500/15 border border-danger-500/20 text-danger-300">
                                    <XCircle className="w-3 h-3" />
                                    失败
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(log.id);
                                  }}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white flex items-center justify-center transition-all"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {log.targetName && (
                              <div className="mb-2 flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">目标:</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/85 font-medium">
                                  {log.targetType && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/15 text-primary-300 mr-1">
                                      {log.targetType}
                                    </span>
                                  )}
                                  {log.targetName}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {dayjs(log.timestamp).format('HH:mm:ss')}
                              </span>
                              {log.ip && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                                  IP: {log.ip}
                                </span>
                              )}
                              {log.userAgent && (
                                <span className="flex items-center gap-1.5">
                                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                                  Web端
                                </span>
                              )}
                            </div>

                            {isExpanded && log.detail && (
                              <div
                                className="mt-4 p-4 rounded-xl bg-black/30 border border-white/5 animate-fade-in"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="text-[11px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" />
                                  详细信息
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed font-mono">
                                  {log.detail}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <GlassCard hover={false} className="p-20 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-white/70 mb-2">暂无日志记录</h3>
            <p className="text-sm text-muted-foreground">
              当前筛选条件下没有找到日志记录，调整筛选条件或稍后再查看
            </p>
          </GlassCard>
        )}
      </div>

      {showDetailModal && selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-deepspace-600 border border-white/10 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border',
                    selectedLog.type === 'operation' && 'bg-blue-500/20 border-blue-500/40',
                    selectedLog.type === 'device' && 'bg-cyan-500/20 border-cyan-500/40',
                    selectedLog.type === 'alert' && 'bg-danger-500/20 border-danger-500/40',
                    selectedLog.type === 'member' && 'bg-emerald-500/20 border-emerald-500/40',
                    selectedLog.type === 'scene' && 'bg-purple-500/20 border-purple-500/40'
                  )}
                >
                  {(() => {
                    const CfgIcon = typeConfig[selectedLog.type].icon;
                    return (
                      <CfgIcon
                        className={cn(
                          'w-7 h-7',
                          selectedLog.type === 'operation' && 'text-blue-400',
                          selectedLog.type === 'device' && 'text-cyan-400',
                          selectedLog.type === 'alert' && 'text-danger-400',
                          selectedLog.type === 'member' && 'text-emerald-400',
                          selectedLog.type === 'scene' && 'text-purple-400'
                        )}
                      />
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white'
                      )}
                      style={{
                        background:
                          selectedLog.type === 'operation'
                            ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                            : selectedLog.type === 'device'
                            ? 'linear-gradient(90deg, #06b6d4, #22d3ee)'
                            : selectedLog.type === 'alert'
                            ? 'linear-gradient(90deg, #ef4444, #f87171)'
                            : selectedLog.type === 'member'
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'linear-gradient(90deg, #a855f7, #c084fc)',
                      }}
                    >
                      {typeConfig[selectedLog.type].label}
                    </span>
                    {selectedLog.result === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        执行成功
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-danger-500/15 border border-danger-500/20 text-danger-300">
                        <XCircle className="w-3 h-3" />
                        执行失败
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedLog.userName ? `${selectedLog.userName} · ` : ''}
                    {selectedLog.action}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    发生时间
                  </div>
                  <div className="text-sm font-medium text-white">
                    {dayjs(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                {selectedLog.userId && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      用户ID
                    </div>
                    <div className="text-sm font-mono font-medium text-primary-300 break-all">
                      {selectedLog.userId}
                    </div>
                  </div>
                )}
                {selectedLog.targetId && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      目标ID
                    </div>
                    <div className="text-sm font-mono font-medium text-secondary-300 break-all">
                      {selectedLog.targetId}
                    </div>
                  </div>
                )}
                {selectedLog.targetType && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      目标类型
                    </div>
                    <div className="text-sm font-medium text-white capitalize">
                      {selectedLog.targetType}
                    </div>
                  </div>
                )}
                {selectedLog.ip && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5" />
                      IP地址
                    </div>
                    <div className="text-sm font-mono font-medium text-cyan-300">
                      {selectedLog.ip}
                    </div>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5" />
                      来源端
                    </div>
                    <div className="text-sm font-medium text-white">
                      Web浏览器
                    </div>
                  </div>
                )}
              </div>

              {selectedLog.targetName && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    目标对象名称
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {selectedLog.targetName}
                  </div>
                </div>
              )}

              {selectedLog.detail && (
                <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <div className="text-[11px] text-muted-foreground mb-2.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    详细信息
                  </div>
                  <div className="text-sm text-white/85 leading-relaxed font-mono bg-black/30 p-3 rounded-lg border border-white/5">
                    {selectedLog.detail}
                  </div>
                </div>
              )}

              {selectedLog.userAgent && (
                <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <div className="text-[11px] text-muted-foreground mb-2.5 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    User-Agent
                  </div>
                  <div className="text-xs text-white/70 leading-relaxed font-mono break-all">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
              <GradientButton
                variant="ghost"
                icon={<CopyIcon className="w-4 h-4" />}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
                }}
              >
                复制JSON
              </GradientButton>
              <GradientButton
                variant="ghost"
                onClick={() => setShowDetailModal(false)}
              >
                关闭
              </GradientButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function roleShort(role: string) {
  switch (role) {
    case 'owner': return '户主';
    case 'admin': return '管理员';
    case 'member': return '成员';
    case 'guest': return '访客';
    case 'property': return '物业';
    default: return role;
  }
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default LogsPage;
