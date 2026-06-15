import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Eye,
  XCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  MapPin,
  User,
  type LucideIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import GradientButton from '@/components/common/GradientButton';
import { useAlertStore } from '@/store/useAlertStore';
import type { Alert, AlertLevel, AlertStatus } from '@/types/alert';
import { devices } from '@/mock/devices';

export interface AlertCardProps {
  alert: Alert;
  className?: string;
  onViewDetail?: (alert: Alert) => void;
  onResolve?: (alert: Alert) => void;
  onIgnore?: (alert: Alert) => void;
}

const levelConfig: Record<
  AlertLevel,
  {
    icon: LucideIcon;
    bar: string;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    badge: string;
    label: string;
    pulse: string;
  }
> = {
  critical: {
    icon: AlertOctagon,
    bar: 'bg-gradient-to-b from-danger-400 via-danger-500 to-danger-600',
    iconBg: 'bg-gradient-to-br from-danger-500/30 to-rose-600/30',
    iconBorder: 'border-danger-500/40',
    iconColor: 'text-danger-400',
    badge: 'bg-gradient-to-r from-danger-500 to-rose-600',
    label: '紧急',
    pulse: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
  },
  warning: {
    icon: AlertTriangle,
    bar: 'bg-gradient-to-b from-warning-400 via-warning-500 to-orange-500',
    iconBg: 'bg-gradient-to-br from-warning-500/30 to-orange-500/30',
    iconBorder: 'border-warning-500/40',
    iconColor: 'text-warning-400',
    badge: 'bg-gradient-to-r from-warning-500 to-orange-500',
    label: '警告',
    pulse: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
  },
  info: {
    icon: Info,
    bar: 'bg-gradient-to-b from-primary-400 via-primary-500 to-secondary-500',
    iconBg: 'bg-gradient-to-br from-primary-500/30 to-secondary-500/30',
    iconBorder: 'border-primary-500/40',
    iconColor: 'text-primary-400',
    badge: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    label: '提示',
    pulse: 'shadow-[0_0_15px_rgba(22,119,255,0.5)]',
  },
};

const statusConfig: Record<
  AlertStatus,
  { bg: string; border: string; text: string; label: string }
> = {
  pending: {
    bg: 'bg-danger-500/15',
    border: 'border-danger-500/30',
    text: 'text-danger-300',
    label: '待处理',
  },
  handling: {
    bg: 'bg-warning-500/15',
    border: 'border-warning-500/30',
    text: 'text-warning-300',
    label: '处理中',
  },
  resolved: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    label: '已解决',
  },
  ignored: {
    bg: 'bg-slate-500/15',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    label: '已忽略',
  },
};

const AlertCard = ({
  alert,
  className,
  onViewDetail,
  onResolve,
  onIgnore,
}: AlertCardProps) => {
  const navigate = useNavigate();
  const { markResolved, ignoreAlert, markRead } = useAlertStore();
  const [expanded, setExpanded] = useState(false);

  const levelCfg = levelConfig[alert.level];
  const statusCfg = statusConfig[alert.status];
  const Icon = levelCfg.icon;

  const device = devices.find((d) => d.id === alert.deviceId);

  const formatTime = useCallback((timestamp: number) => {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
  }, []);

  const formatRelativeTime = useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 86400000 * 7) return `${Math.floor(diff / 86400000)}天前`;
    return dayjs(timestamp).format('MM-DD HH:mm');
  }, []);

  const handleResolve = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      markResolved(alert.id);
      onResolve?.(alert);
    },
    [alert, markResolved, onResolve]
  );

  const handleIgnore = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      ignoreAlert(alert.id);
      onIgnore?.(alert);
    },
    [alert, ignoreAlert, onIgnore]
  );

  const handleViewDetail = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      markRead(alert.id);
      onViewDetail?.(alert);
      if (!onViewDetail) {
        navigate('/alerts');
      }
    },
    [alert, markRead, onViewDetail, navigate]
  );

  const isActionable = alert.status === 'pending' || alert.status === 'handling';

  return (
    <GlassCard
      hover={false}
      className={cn(
        'relative overflow-hidden transition-all duration-300 group',
        'hover:shadow-xl hover:scale-[1.005]',
        !isActionable && 'opacity-75',
        className
      )}
      onClick={handleViewDetail}
    >
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1.5',
          levelCfg.bar
        )}
        style={{
          boxShadow:
            alert.status === 'pending'
              ? `2px 0 10px ${
                  alert.level === 'critical'
                    ? 'rgba(239,68,68,0.5)'
                    : alert.level === 'warning'
                    ? 'rgba(245,158,11,0.5)'
                    : 'rgba(22,119,255,0.5)'
                }`
              : undefined,
        }}
      />

      {alert.status === 'pending' && (
        <div
          className={cn(
            'absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none blur-3xl animate-pulse',
            alert.level === 'critical'
              ? 'bg-danger-500'
              : alert.level === 'warning'
              ? 'bg-warning-500'
              : 'bg-primary-500'
          )}
          style={{
            transform: 'translate(30%, -30%)',
          }}
        />
      )}

      <div className="flex flex-col p-5 pl-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border',
              levelCfg.iconBg,
              levelCfg.iconBorder,
              alert.status === 'pending' && levelCfg.pulse
            )}
          >
            <Icon className={cn('w-6 h-6', levelCfg.iconColor)} />
            {alert.status === 'pending' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-danger-500 border-2 border-deepspace-600 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shrink-0',
                    levelCfg.badge
                  )}
                >
                  {levelCfg.label}
                </span>
                <h4 className="font-bold text-white truncate">{alert.title}</h4>
              </div>

              <span
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 border',
                  statusCfg.bg,
                  statusCfg.border,
                  statusCfg.text
                )}
              >
                {statusCfg.label}
              </span>
            </div>

            <p className="text-sm text-white/75 leading-relaxed line-clamp-2 mb-3">
              {alert.message}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatRelativeTime(alert.createdAt)}</span>
              </span>

              {device && (
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-white/70">{device.name}</span>
                </span>
              )}

              {alert.roomId && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                  <span>位置关联</span>
                </span>
              )}

              {alert.handledAt && alert.handlerId && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    处理于 {formatRelativeTime(alert.handledAt)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {expanded && alert.snapshot && Object.keys(alert.snapshot).length > 0 && (
          <div className="mt-4 ml-16 p-4 rounded-xl bg-black/30 border border-white/10">
            <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              设备状态快照
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(alert.snapshot).map(([key, value]) => (
                <div
                  key={key}
                  className="p-2 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="text-[10px] text-muted-foreground capitalize mb-0.5">
                    {key}
                  </div>
                  <div className="text-xs font-mono font-medium text-white/80">
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                收起详情
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                展开详情
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <GradientButton
              size="sm"
              variant="ghost"
              icon={<Eye className="w-3.5 h-3.5" />}
              onClick={handleViewDetail}
            >
              详情
            </GradientButton>

            {isActionable && (
              <>
                <GradientButton
                  size="sm"
                  variant="ghost"
                  icon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={handleIgnore}
                  className="!text-slate-400 hover:!text-slate-200 border-white/10"
                >
                  忽略
                </GradientButton>

                <GradientButton
                  size="sm"
                  variant="primary"
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  onClick={handleResolve}
                >
                  {alert.status === 'handling' ? '完成' : '处理'}
                </GradientButton>
              </>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AlertCard;
