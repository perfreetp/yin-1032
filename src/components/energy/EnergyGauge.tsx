import { useEffect, useState, useMemo } from 'react';
import { Zap, TrendingUp, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import { useEnergyStore } from '@/store/useEnergyStore';

export interface EnergyGaugeProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const EnergyGauge = ({ size = 280, strokeWidth = 22, className }: EnergyGaugeProps) => {
  const { summary } = useEnergyStore();
  const [animatedUsage, setAnimatedUsage] = useState(0);
  const [animatedPower, setAnimatedPower] = useState(0);

  const todayUsage = summary.todayUsage;
  const currentPower = summary.peakPower;
  const maxUsage = 30;
  const percentage = Math.min((todayUsage / maxUsage) * 100, 100);
  const animatedPercentage = Math.min((animatedUsage / maxUsage) * 100, 100);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const startUsage = animatedUsage;
    const startPower = animatedPower;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      setAnimatedUsage(startUsage + (todayUsage - startUsage) * easeOutCubic);
      setAnimatedPower(startPower + (currentPower - startPower) * easeOutCubic);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [todayUsage, currentPower]);

  const { center, radius, circumference, dashOffset, gradientId, glowId } = useMemo(() => {
    const c = size / 2;
    const r = (size - strokeWidth * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (animatedPercentage / 100) * circ;
    return {
      center: c,
      radius: r,
      circumference: circ,
      dashOffset: offset,
      gradientId: `energy-gauge-gradient-${Math.random().toString(36).slice(2, 9)}`,
      glowId: `energy-gauge-glow-${Math.random().toString(36).slice(2, 9)}`,
    };
  }, [size, strokeWidth, animatedPercentage]);

  const statusColor = useMemo(() => {
    if (percentage < 50) return { from: '#10B981', to: '#34D399', name: '低' };
    if (percentage < 80) return { from: '#F59E0B', to: '#FBBF24', name: '中' };
    return { from: '#EF4444', to: '#F87171', name: '高' };
  }, [percentage]);

  return (
    <GlassCard hover={false} className={cn('p-6 relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${statusColor.from}15 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-energy-500/20 border border-energy-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-energy-400" />
            </div>
            <h3 className="font-bold">能耗监控</h3>
          </div>
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold',
              percentage < 50 && 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
              percentage >= 50 && percentage < 80 && 'bg-warning-500/15 text-warning-300 border border-warning-500/30',
              percentage >= 80 && 'bg-danger-500/15 text-danger-300 border border-danger-500/30'
            )}
          >
            负荷{statusColor.name}
          </span>
        </div>

        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
            style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))' }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="40%" stopColor="#3B82F6" />
                <stop offset="70%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor={statusColor.to} />
              </linearGradient>
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth={strokeWidth}
            />

            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              filter={`url(#${glowId})`}
              className="transition-all duration-100 ease-out"
              style={{
                transformOrigin: 'center',
              }}
            />

            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6 * Math.PI) / 180;
              const isMajor = i % 5 === 0;
              const innerR = radius - strokeWidth / 2 - (isMajor ? 12 : 8);
              const outerR = radius - strokeWidth / 2 - 2;
              const opacity = isMajor ? 0.5 : 0.2;
              const x1 = center + innerR * Math.cos(angle + Math.PI / 2);
              const y1 = center + innerR * Math.sin(angle + Math.PI / 2);
              const x2 = center + outerR * Math.cos(angle + Math.PI / 2);
              const y2 = center + outerR * Math.sin(angle + Math.PI / 2);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="white"
                  strokeWidth={isMajor ? 1.5 : 0.8}
                  opacity={opacity}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-1">
              <Sun className="w-3.5 h-3.5 text-warning-400" />
              <span>今日用电</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="font-orbitron font-bold bg-gradient-to-r from-energy-300 via-primary-300 to-secondary-300 bg-clip-text text-transparent leading-none"
                style={{
                  fontSize: size * 0.18,
                  textShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                }}
              >
                {animatedUsage.toFixed(1)}
              </span>
              <span
                className="font-medium text-muted-foreground"
                style={{ fontSize: size * 0.055 }}
              >
                kWh
              </span>
            </div>
            <div className="w-px h-5 bg-white/10 my-2" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">当前功率</span>
              <span className="font-orbitron font-semibold text-white text-sm">
                {animatedPower.toFixed(2)}
                <span className="text-xs text-muted-foreground ml-0.5">kW</span>
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400 font-medium">+{Math.abs(summary.monthTrend)}%</span>
              <span className="text-muted-foreground">较上月</span>
            </div>
          </div>
        </div>

        <div className="w-full mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
          {[
            { label: '峰值时间', value: summary.peakTime, icon: '⏱' },
            {
              label: '日均用电',
              value: `${summary.avgDailyUsage.toFixed(1)}kWh`,
              icon: '📊',
            },
            {
              label: '今日电费',
              value: `¥${summary.todayCost.toFixed(2)}`,
              icon: '💰',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="font-semibold text-sm">{item.value}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default EnergyGauge;
