import { useMemo, useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import { useEnergyStore } from '@/store/useEnergyStore';
import type { EnergyRankItem } from '@/mock/energy';

export interface RankBarProps {
  className?: string;
  limit?: number;
}

const rankGradient: Record<number, { bg: string; text: string; border: string; badge: string }> = {
  1: {
    bg: 'bg-gradient-to-r from-amber-400/30 via-yellow-400/20 to-transparent',
    text: 'from-amber-300 to-yellow-400',
    border: 'border-amber-400/30',
    badge: 'bg-gradient-to-br from-amber-400 to-yellow-600 text-amber-950',
  },
  2: {
    bg: 'bg-gradient-to-r from-slate-300/30 via-slate-400/20 to-transparent',
    text: 'from-slate-200 to-slate-400',
    border: 'border-slate-400/30',
    badge: 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900',
  },
  3: {
    bg: 'bg-gradient-to-r from-amber-700/30 via-orange-600/20 to-transparent',
    text: 'from-amber-500 to-orange-600',
    border: 'border-orange-500/30',
    badge: 'bg-gradient-to-br from-orange-400 to-amber-700 text-amber-50',
  },
};

const RankBar = ({ className, limit = 10 }: RankBarProps) => {
  const { rankList } = useEnergyStore();
  const [animated, setAnimated] = useState<Record<string, number>>({});

  const sortedList = useMemo(
    () => [...rankList].sort((a, b) => a.rank - b.rank).slice(0, limit),
    [rankList, limit]
  );

  const maxValue = useMemo(
    () => Math.max(...sortedList.map((item) => item.value), 1),
    [sortedList]
  );

  const totalValue = useMemo(
    () => sortedList.reduce((acc, item) => acc + item.value, 0),
    [sortedList]
  );

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const next: Record<string, number> = {};
      sortedList.forEach((item) => {
        next[item.deviceId] = item.value * easeOutCubic;
      });
      setAnimated(next);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [sortedList]);

  const renderTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="w-3.5 h-3.5 text-rose-400" />;
    }
    if (trend < 0) {
      return <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />;
    }
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const renderTrendValue = (trend: number) => {
    if (trend === 0) return null;
    const sign = trend > 0 ? '+' : '';
    return (
      <span
        className={cn(
          'text-xs font-medium',
          trend > 0 ? 'text-rose-400' : 'text-emerald-400'
        )}
      >
        {sign}
        {Math.abs(trend).toFixed(1)}%
      </span>
    );
  };

  return (
    <GlassCard hover={false} className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-500/20 to-danger-500/20 border border-warning-500/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-warning-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">能耗排行</h3>
            <p className="text-xs text-muted-foreground">
              TOP {sortedList.length} 设备
              <span className="mx-1.5">·</span>
              合计 {totalValue.toFixed(1)} kWh
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600" />
            <span className="text-muted-foreground">第1名</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-slate-300 to-slate-500" />
            <span className="text-muted-foreground">第2名</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-amber-700" />
            <span className="text-muted-foreground">第3名</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sortedList.map((item: EnergyRankItem, index: number) => {
          const gradient = rankGradient[item.rank];
          const percentage = (item.value / maxValue) * 100;
          const animatedValue = animated[item.deviceId] || 0;
          const animatedPercentage = (animatedValue / maxValue) * 100;
          const sharePercentage = ((item.value / totalValue) * 100).toFixed(1);

          return (
            <div
              key={item.deviceId}
              className={cn(
                'relative p-4 rounded-xl border transition-all duration-500 group',
                'hover:scale-[1.01] hover:shadow-lg',
                gradient
                  ? cn(gradient.bg, gradient.border)
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              )}
              style={{
                animationDelay: `${index * 80}ms`,
                animation: 'fade-in 0.5s ease-out forwards',
                opacity: 0,
              }}
            >
              <div className="relative flex items-center gap-4">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-orbitron shrink-0',
                    gradient
                      ? gradient.badge
                      : 'bg-white/10 text-muted-foreground border border-white/10'
                  )}
                  style={
                    gradient
                      ? {
                          boxShadow:
                            item.rank === 1
                              ? '0 4px 20px rgba(251, 191, 36, 0.4)'
                              : item.rank === 2
                              ? '0 4px 20px rgba(148, 163, 184, 0.3)'
                              : '0 4px 20px rgba(251, 146, 60, 0.3)',
                        }
                      : undefined
                  }
                >
                  {item.rank <= 3 ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    item.rank
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          'font-semibold truncate',
                          gradient && `bg-gradient-to-r bg-clip-text text-transparent ${gradient.text}`
                        )}
                      >
                        {item.deviceName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {renderTrendValue(item.trend)}
                      {renderTrendIcon(item.trend)}
                    </div>
                  </div>

                  <div className="relative h-6 rounded-lg overflow-hidden bg-white/5">
                    <div
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2',
                        item.rank <= 3
                          ? item.rank === 1
                            ? 'bg-gradient-to-r from-amber-500/60 to-yellow-400/40'
                            : item.rank === 2
                            ? 'bg-gradient-to-r from-slate-400/60 to-slate-300/40'
                            : 'bg-gradient-to-r from-orange-500/60 to-amber-500/40'
                          : 'bg-gradient-to-r from-primary-500/60 to-secondary-500/40'
                      )}
                      style={{
                        width: `${animatedPercentage}%`,
                        boxShadow:
                          item.rank <= 3
                            ? `inset 0 0 10px rgba(255,255,255,0.2)`
                            : 'inset 0 0 10px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className="text-xs font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-white/80" />
                        <span className="font-orbitron">{animatedValue.toFixed(1)}</span>
                        <span className="text-[10px] text-white/70">{item.unit}</span>
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          percentage > 70
                            ? 'bg-danger-500/30 text-danger-200'
                            : percentage > 40
                            ? 'bg-warning-500/30 text-warning-200'
                            : 'bg-white/10 text-white/80'
                        )}
                      >
                        占 {sharePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {item.rank <= 3 && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      item.rank === 1
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, transparent 50%)'
                        : item.rank === 2
                        ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, transparent 50%)'
                        : 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, transparent 50%)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {sortedList.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">暂无能耗数据</p>
        </div>
      )}
    </GlassCard>
  );
};

export default RankBar;
