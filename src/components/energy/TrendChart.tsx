import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  type TooltipProps,
} from 'recharts';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import { useEnergyStore, type TimeRange } from '@/store/useEnergyStore';

export interface TrendChartProps {
  className?: string;
  height?: number;
  data?: { label: string; value: number; power?: number }[];
  title?: string;
  subtitle?: string;
  showTimeRange?: boolean;
}

const timeRanges: { key: TimeRange; label: string }[] = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  const energyData = payload.find((p) => p.dataKey === 'value');
  const powerData = payload.find((p) => p.dataKey === 'power');

  return (
    <div className="px-4 py-3 rounded-xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-scale-in">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
        <Calendar className="w-4 h-4 text-primary-400" />
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      {energyData && (
        <div className="flex items-center justify-between gap-6 py-1">
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-500" />
            用电量
          </span>
          <span className="font-orbitron font-semibold text-white text-sm">
            {energyData.value as number}
            <span className="text-xs text-muted-foreground ml-1">kWh</span>
          </span>
        </div>
      )}
      {powerData && (
        <div className="flex items-center justify-between gap-6 py-1">
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-warning-400 to-danger-500" />
            功率
          </span>
          <span className="font-orbitron font-semibold text-white text-sm">
            {powerData.value as number}
            <span className="text-xs text-muted-foreground ml-1">W</span>
          </span>
        </div>
      )}
    </div>
  );
};

const TrendChart = ({
  className,
  height = 360,
  data,
  title = '能耗趋势',
  subtitle,
  showTimeRange = true,
}: TrendChartProps) => {
  const store = useEnergyStore();
  const trendData = data || store.trendData;
  const { timeRange, setTimeRange, summary } = store;

  const total = useMemo(
    () => trendData.reduce((acc, d) => acc + (d.value || 0), 0).toFixed(1),
    [trendData]
  );

  const avg = useMemo(
    () => (trendData.length > 0 ? (Number(total) / trendData.length).toFixed(2) : '0'),
    [total, trendData.length]
  );

  const max = useMemo(
    () => trendData.reduce((acc, d) => Math.max(acc, d.value || 0), 0).toFixed(1),
    [trendData]
  );

  const areaGradientId = `trend-area-gradient-${Math.random().toString(36).slice(2, 9)}`;
  const barGradientId = `trend-bar-gradient-${Math.random().toString(36).slice(2, 9)}`;
  const lineGradientId = `trend-line-gradient-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <GlassCard hover={false} className={cn('p-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {subtitle || (
                <>
                  <span className="text-muted-foreground/50">
                    总计{timeRanges.find((r) => r.key === timeRange)?.label}度:{' '}
                  </span>
                  <span className="font-orbitron font-semibold text-primary-300">{total}</span>
                  <span className="text-xs text-muted-foreground ml-1">kWh</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-secondary-500" />
              <span className="text-muted-foreground">能耗</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-warning-400 to-danger-500" />
              <span className="text-muted-foreground">功率</span>
            </div>
          </div>

          {showTimeRange && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {timeRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                    timeRange === range.key
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: '总用电量',
            value: `${total}`,
            unit: 'kWh',
            icon: TrendingUp,
            trend: summary.monthTrend,
            color: 'from-primary-400 to-secondary-500',
          },
          {
            label: '平均数值',
            value: `${avg}`,
            unit: 'kWh',
            icon: Activity,
            trend: 0,
            color: 'from-emerald-400 to-cyan-500',
          },
          {
            label: '峰值数值',
            value: `${max}`,
            unit: 'kWh',
            icon: TrendingUp,
            trend: 5.2,
            color: 'from-warning-400 to-danger-500',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  'bg-gradient-to-br',
                  stat.color
                )}
                style={{
                  boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-orbitron font-bold text-lg leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{stat.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                  {stat.trend !== 0 && (
                    <span
                      className={cn(
                        'text-[10px] font-medium',
                        stat.trend > 0 ? 'text-rose-400' : 'text-emerald-400'
                      )}
                    >
                      {stat.trend > 0 ? '+' : ''}
                      {stat.trend}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="40%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              interval={Math.floor(trendData.length / 8)}
              dy={10}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              dx={-5}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              dx={5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#${areaGradientId})`}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke={`url(#${lineGradientId})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#fff',
                stroke: '#3B82F6',
                strokeWidth: 2,
              }}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
              }}
            />

            <Bar
              yAxisId="right"
              dataKey="power"
              fill={`url(#${barGradientId})`}
              radius={[4, 4, 0, 0]}
              opacity={0.7}
              barSize={timeRange === 'day' ? 6 : 12}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default TrendChart;
