import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  X,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { useAlertStore } from '@/store/useAlertStore';
import type { Alert, AlertLevel } from '@/types/alert';

export interface AlertBannerProps {
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
  onDismiss?: (alert: Alert) => void;
  onClick?: (alert: Alert) => void;
}

const levelConfig: Record<
  AlertLevel,
  {
    icon: LucideIcon;
    bg: string;
    border: string;
    glow: string;
    badge: string;
    label: string;
  }
> = {
  critical: {
    icon: AlertOctagon,
    bg: 'bg-gradient-to-r from-danger-500/25 via-danger-500/15 to-transparent',
    border: 'border-danger-500/40',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.25)]',
    badge: 'bg-gradient-to-r from-danger-500 to-rose-600',
    label: '紧急',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-gradient-to-r from-warning-500/25 via-warning-500/15 to-transparent',
    border: 'border-warning-500/40',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    badge: 'bg-gradient-to-r from-warning-500 to-orange-500',
    label: '警告',
  },
  info: {
    icon: Info,
    bg: 'bg-gradient-to-r from-primary-500/25 via-primary-500/15 to-transparent',
    border: 'border-primary-500/40',
    glow: 'shadow-[0_0_30px_rgba(22,119,255,0.25)]',
    badge: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    label: '提示',
  },
};

const AlertBanner = ({
  autoRotate = true,
  rotateInterval = 8000,
  className,
  onDismiss,
  onClick,
}: AlertBannerProps) => {
  const navigate = useNavigate();
  const { alerts, markRead, ignoreAlert } = useAlertStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const pendingAlerts = alerts.filter(
    (a) => a.status === 'pending' && !dismissed.has(a.id)
  );

  const currentAlert: Alert | null = pendingAlerts[currentIndex] || pendingAlerts[0] || null;

  useEffect(() => {
    if (currentIndex >= pendingAlerts.length) {
      setCurrentIndex(0);
    }
  }, [pendingAlerts.length, currentIndex]);

  useEffect(() => {
    if (!autoRotate || pendingAlerts.length <= 1) return;

    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % pendingAlerts.length);
        setVisible(true);
      }, 300);
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [autoRotate, rotateInterval, pendingAlerts.length]);

  const formatTime = useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return dayjs(timestamp).format('MM-DD HH:mm');
  }, []);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentAlert) return;
      setDismissed((prev) => new Set(prev).add(currentAlert.id));
      ignoreAlert(currentAlert.id);
      onDismiss?.(currentAlert);
      setTimeout(() => {
        if (pendingAlerts.length > 1) {
          setCurrentIndex((prev) => (prev + 1) % pendingAlerts.length);
        }
      }, 200);
    },
    [currentAlert, ignoreAlert, onDismiss, pendingAlerts.length]
  );

  const handleClick = useCallback(() => {
    if (!currentAlert) return;
    markRead(currentAlert.id);
    onClick?.(currentAlert);
    if (!onClick) {
      navigate('/alerts');
    }
  }, [currentAlert, markRead, onClick, navigate]);

  if (!currentAlert) {
    return (
      <div
        className={cn(
          'rounded-xl border border-white/10 bg-white/5 p-4 text-center',
          className
        )}
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>暂无待处理告警</span>
        </div>
      </div>
    );
  }

  const config = levelConfig[currentAlert.level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border backdrop-blur-xl',
        'transition-all duration-500 ease-out cursor-pointer group',
        config.bg,
        config.border,
        config.glow,
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        className
      )}
      onClick={handleClick}
      style={{
        animation: visible
          ? 'slideInRight 0.5s ease-out forwards'
          : undefined,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: `linear-gradient(180deg, ${
            currentAlert.level === 'critical'
              ? '#ef4444'
              : currentAlert.level === 'warning'
              ? '#f59e0b'
              : '#1677ff'
          }, transparent)`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background:
              currentAlert.level === 'critical'
                ? '#ef4444'
                : currentAlert.level === 'warning'
                ? '#f59e0b'
                : '#1677ff',
          }}
        />
      </div>

      <div className="relative flex items-start gap-4 p-4 pr-12">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            'animate-pulse-glow',
            config.badge
          )}
          style={{
            boxShadow:
              currentAlert.level === 'critical'
                ? '0 0 20px rgba(239,68,68,0.5)'
                : currentAlert.level === 'warning'
                ? '0 0 20px rgba(245,158,11,0.5)'
                : '0 0 20px rgba(22,119,255,0.5)',
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white',
                config.badge
              )}
            >
              {config.label}
            </span>
            <h4 className="font-bold text-white truncate">{currentAlert.title}</h4>
          </div>
          <p className="text-sm text-white/80 line-clamp-2 mb-2">
            {currentAlert.message}
          </p>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>{formatTime(currentAlert.createdAt)}</span>
            {currentAlert.deviceId && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                设备关联
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white',
              'transition-all duration-200 hover:scale-105'
            )}
          >
            <X className="w-4 h-4" />
          </button>

          {pendingAlerts.length > 1 && (
            <div className="flex items-center gap-1 mt-auto">
              {pendingAlerts.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setVisible(false);
                    setTimeout(() => {
                      setCurrentIndex(i);
                      setVisible(true);
                    }, 200);
                  }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    i === currentIndex
                      ? 'w-4 bg-white/80'
                      : 'bg-white/30 hover:bg-white/50'
                  )}
                />
              ))}
              {pendingAlerts.length > 5 && (
                <span className="text-[10px] text-white/50 ml-1">
                  +{pendingAlerts.length - 5}
                </span>
              )}
            </div>
          )}

          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity',
              currentAlert.level === 'critical'
                ? 'text-danger-300'
                : currentAlert.level === 'warning'
                ? 'text-warning-300'
                : 'text-primary-300'
            )}
          >
            <span>查看详情</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {currentAlert.level === 'critical' && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger-400/50 to-transparent animate-energy-flow"
        />
      )}

      <style>{`
        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AlertBanner;
