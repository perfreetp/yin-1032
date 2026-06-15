import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  Filter,
  Search,
  Bell,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useAlertStore } from '@/store/useAlertStore';
import type { AlertLevel, AlertStatus } from '@/types/alert';
import { useAppStore } from '@/store/useAppStore';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import AlertCard from '@/components/alerts/AlertCard';
import AlertBanner from '@/components/alerts/AlertBanner';
import { cn } from '@/lib/utils';
import type { Alert } from '@/types/alert';

const PAGE_SIZE = 6;

const levelFilters: { key: AlertLevel | 'all'; label: string; color: string }[] = [
  { key: 'all', label: '全部', color: 'text-white' },
  { key: 'critical', label: '紧急', color: 'text-danger-400' },
  { key: 'warning', label: '警告', color: 'text-warning-400' },
  { key: 'info', label: '提示', color: 'text-primary-400' },
];

const statusFilters: { key: AlertStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部状态' },
  { key: 'pending', label: '待处理' },
  { key: 'handling', label: '处理中' },
  { key: 'resolved', label: '已解决' },
  { key: 'ignored', label: '已忽略' },
];

const timeRanges = [
  { key: 'all', label: '全部时间' },
  { key: 'today', label: '今日' },
  { key: '3days', label: '近3天' },
  { key: 'week', label: '近一周' },
  { key: 'month', label: '近一月' },
];

const AlertsPage = () => {
  const currentHouseId = useAppStore((state) => state.currentHouseId);
  const {
    alerts,
    unreadCount,
    filterLevel,
    filterStatus,
    fetchAlerts,
    setFilter,
    markResolved,
    ignoreAlert,
  } = useAlertStore();

  const [searchText, setSearchText] = useState('');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!currentHouseId) return;
    fetchAlerts(currentHouseId);
  }, [currentHouseId, fetchAlerts]);

  const stats = useMemo(() => {
    const pending = alerts.filter((a) => a.status === 'pending').length;
    const critical = alerts.filter((a) => a.level === 'critical').length;
    const warning = alerts.filter((a) => a.level === 'warning').length;
    const info = alerts.filter((a) => a.level === 'info').length;
    return { pending, critical, warning, info, total: alerts.length };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (filterLevel !== 'all' && alert.level !== filterLevel) return false;
      if (filterStatus !== 'all' && alert.status !== filterStatus) return false;

      if (timeRange !== 'all') {
        const now = Date.now();
        const diff = now - alert.createdAt;
        const dayMs = 86400000;
        if (timeRange === 'today' && diff > dayMs) return false;
        if (timeRange === '3days' && diff > dayMs * 3) return false;
        if (timeRange === 'week' && diff > dayMs * 7) return false;
        if (timeRange === 'month' && diff > dayMs * 30) return false;
      }

      if (searchText.trim()) {
        const keyword = searchText.toLowerCase();
        return (
          alert.title.toLowerCase().includes(keyword) ||
          alert.message.toLowerCase().includes(keyword)
        );
      }

      return true;
    });
  }, [alerts, filterLevel, filterStatus, timeRange, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PAGE_SIZE));
  const pagedAlerts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAlerts.slice(start, start + PAGE_SIZE);
  }, [filteredAlerts, page]);

  useEffect(() => {
    setPage(1);
  }, [filterLevel, filterStatus, timeRange, searchText]);

  const handleViewDetail = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  }, []);

  const handleBatchResolve = useCallback(() => {
    filteredAlerts
      .filter((a) => a.status === 'pending' || a.status === 'handling')
      .forEach((a) => markResolved(a.id));
  }, [filteredAlerts, markResolved]);

  const handleResetFilters = useCallback(() => {
    setFilter({ filterLevel: 'all', filterStatus: 'all' });
    setTimeRange('all');
    setSearchText('');
  }, [setFilter]);

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">告警中心</h1>
          <p className="text-sm text-muted-foreground">
            集中管理设备告警、安防异常和系统通知
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlassCard hover={false} className="py-2 px-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-muted-foreground">
              {dayjs().format('YYYY-MM-DD HH:mm')}
            </span>
          </GlassCard>
          <GradientButton
            variant="ghost"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleResetFilters}
          >
            重置筛选
          </GradientButton>
          <GradientButton
            variant="primary"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleBatchResolve}
          >
            全部处理
          </GradientButton>
        </div>
      </div>

      {alerts.some((a) => a.status === 'pending') && (
        <div className="relative">
          <AlertBanner autoRotate={true} rotateInterval={6000} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="未处理"
          value={stats.pending}
          unit="条"
          icon={<Bell className="w-4 h-4" />}
          className={stats.pending > 0 ? 'ring-1 ring-danger-500/30' : ''}
          trendDirection={stats.pending > 5 ? 'up' : stats.pending === 0 ? 'neutral' : 'down'}
        />
        <StatBlock
          title="紧急告警"
          value={stats.critical}
          unit="条"
          icon={<AlertOctagon className="w-4 h-4" />}
          trend={stats.critical > 0 ? 100 : 0}
          trendDirection={stats.critical > 0 ? 'up' : 'neutral'}
        />
        <StatBlock
          title="警告提醒"
          value={stats.warning}
          unit="条"
          icon={<AlertTriangle className="w-4 h-4" />}
          trend={stats.warning > stats.info ? 15 : 0}
          trendDirection="neutral"
        />
        <StatBlock
          title="提示通知"
          value={stats.info}
          unit="条"
          icon={<Info className="w-4 h-4" />}
          trend={stats.info > stats.warning ? 8 : 0}
          trendDirection="neutral"
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
              placeholder="搜索告警标题或内容..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-2" />
              {levelFilters.map((lf) => (
                <button
                  key={lf.key}
                  onClick={() => setFilter({ filterLevel: lf.key })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                    filterLevel === lf.key
                      ? 'bg-white/10 text-white shadow-inner'
                      : cn(lf.color, 'hover:bg-white/5 opacity-75 hover:opacity-100')
                  )}
                >
                  {lf.label}
                </button>
              ))}
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilter({ filterStatus: e.target.value as AlertStatus | 'all' })}
              className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 cursor-pointer appearance-none pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
            >
              {statusFilters.map((sf) => (
                <option key={sf.key} value={sf.key} className="bg-deepspace-600">
                  {sf.label}
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
                  <Calendar className="inline" />
                  {tr.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5 text-xs text-muted-foreground">
          <span>
            共找到 <span className="font-semibold text-white">{filteredAlerts.length}</span> 条告警
          </span>
          <span>
            已加载 <span className="font-semibold text-white">{pagedAlerts.length}</span> / {filteredAlerts.length}
          </span>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {pagedAlerts.map((alert, idx) => (
          <div
            key={alert.id}
            className={cn(
              alert.status === 'pending' && alert.level === 'critical' && 'animate-pulse-glow'
            )}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <AlertCard
              alert={alert}
              onViewDetail={handleViewDetail}
            />
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <GlassCard hover={false} className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Bell className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-white/70 mb-2">暂无告警记录</h3>
            <p className="text-sm text-muted-foreground">
              当前筛选条件下没有找到告警，调整筛选条件或稍后再查看
            </p>
          </GlassCard>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              page === 1
                ? 'bg-white/5 text-muted-foreground/50 cursor-not-allowed'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary-500/30'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all',
                page === p
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              )}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              page === totalPages
                ? 'bg-white/5 text-muted-foreground/50 cursor-not-allowed'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary-500/30'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {showDetailModal && selectedAlert && (
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
                    selectedAlert.level === 'critical'
                      ? 'bg-danger-500/20 border-danger-500/40'
                      : selectedAlert.level === 'warning'
                      ? 'bg-warning-500/20 border-warning-500/40'
                      : 'bg-primary-500/20 border-primary-500/40'
                  )}
                >
                  {selectedAlert.level === 'critical' ? (
                    <AlertOctagon className="w-7 h-7 text-danger-400" />
                  ) : selectedAlert.level === 'warning' ? (
                    <AlertTriangle className="w-7 h-7 text-warning-400" />
                  ) : (
                    <Info className="w-7 h-7 text-primary-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white',
                        selectedAlert.level === 'critical'
                          ? 'bg-gradient-to-r from-danger-500 to-rose-600'
                          : selectedAlert.level === 'warning'
                          ? 'bg-gradient-to-r from-warning-500 to-orange-500'
                          : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                      )}
                    >
                      {selectedAlert.level === 'critical'
                        ? '紧急'
                        : selectedAlert.level === 'warning'
                        ? '警告'
                        : '提示'}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-md text-[11px] font-semibold border',
                        selectedAlert.status === 'pending'
                          ? 'bg-danger-500/15 border-danger-500/30 text-danger-300'
                          : selectedAlert.status === 'handling'
                          ? 'bg-warning-500/15 border-warning-500/30 text-warning-300'
                          : selectedAlert.status === 'resolved'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-500/15 border-slate-500/30 text-slate-300'
                      )}
                    >
                      {selectedAlert.status === 'pending'
                        ? '待处理'
                        : selectedAlert.status === 'handling'
                        ? '处理中'
                        : selectedAlert.status === 'resolved'
                        ? '已解决'
                        : '已忽略'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedAlert.title}</h2>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all shrink-0"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/85 leading-relaxed">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-[11px] text-muted-foreground mb-1">触发时间</div>
                  <div className="text-sm font-medium text-white">
                    {dayjs(selectedAlert.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                {selectedAlert.handledAt && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1">处理时间</div>
                    <div className="text-sm font-medium text-white">
                      {dayjs(selectedAlert.handledAt).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>
                )}
                {selectedAlert.deviceId && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1">关联设备</div>
                    <div className="text-sm font-medium text-primary-300 break-all">
                      {selectedAlert.deviceId}
                    </div>
                  </div>
                )}
                {selectedAlert.roomId && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[11px] text-muted-foreground mb-1">关联房间</div>
                    <div className="text-sm font-medium text-secondary-300 break-all">
                      {selectedAlert.roomId}
                    </div>
                  </div>
                )}
              </div>

              {selectedAlert.snapshot && Object.keys(selectedAlert.snapshot).length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2.5 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    设备状态快照
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Object.entries(selectedAlert.snapshot).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 rounded-lg bg-black/30 border border-white/5"
                      >
                        <div className="text-[10px] text-muted-foreground capitalize mb-1">
                          {key}
                        </div>
                        <div className="text-sm font-mono font-medium text-white/85 break-all">
                          {typeof value === 'object'
                            ? JSON.stringify(value)
                            : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
              {(selectedAlert.status === 'pending' || selectedAlert.status === 'handling') && (
                <>
                  <GradientButton
                    variant="ghost"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      ignoreAlert(selectedAlert.id);
                      setShowDetailModal(false);
                    }}
                    className="!text-slate-400 hover:!text-slate-200 border-white/10"
                  >
                    忽略
                  </GradientButton>
                  <GradientButton
                    variant="primary"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => {
                      markResolved(selectedAlert.id);
                      setShowDetailModal(false);
                    }}
                  >
                    标记已处理
                  </GradientButton>
                </>
              )}
              {selectedAlert.status !== 'pending' && selectedAlert.status !== 'handling' && (
                <GradientButton
                  variant="ghost"
                  onClick={() => setShowDetailModal(false)}
                >
                  关闭
                </GradientButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
