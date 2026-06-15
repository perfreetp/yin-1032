import { useEffect, useMemo } from 'react';
import {
  Zap,
  Calendar,
  TrendingUp,
  Lightbulb,
  Leaf,
  Thermometer,
  Tv,
  Fan,
  PlugZap,
  Battery,
  ArrowRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import dayjs from 'dayjs';
import { useEnergyStore } from '@/store/useEnergyStore';
import { useHouseStore } from '@/store/useHouseStore';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import EnergyGauge from '@/components/energy/EnergyGauge';
import TrendChart from '@/components/energy/TrendChart';
import RankBar from '@/components/energy/RankBar';
import { cn } from '@/lib/utils';

const DEFAULT_HOUSE_ID = 'house-villa-001';

const savingTips = [
  {
    icon: Thermometer,
    title: '空调温度优化',
    desc: '将客厅空调温度从24°C调整为26°C，每月可节省约18%的制冷能耗。',
    saving: '约 ¥42/月',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Lightbulb,
    title: '照明智能控制',
    desc: '启用自然光感应功能，白天自动关闭非必要照明，避免能源浪费。',
    saving: '约 ¥18/月',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: Leaf,
    title: '睡眠模式联动',
    desc: '建议在22:00后启用睡眠模式，自动关闭客厅设备并调至节能温度。',
    saving: '约 ¥28/月',
    color: 'from-emerald-500/20 to-green-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Tv,
    title: '待机功耗管理',
    desc: '影音设备待机功耗约占总能耗6%，建议不使用时彻底关闭电源。',
    saving: '约 ¥12/月',
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Fan,
    title: '新风换气策略',
    desc: '利用早晚低温时段开窗通风，减少空调运行时间，同时改善室内空气质量。',
    saving: '约 ¥22/月',
    color: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-400',
  },
];

const categoryIcons: Record<string, typeof Zap> = {
  ac: Thermometer,
  light: Lightbulb,
  tv: Tv,
  water: PlugZap,
  speaker: Battery,
  sensor: Zap,
  other: PlugZap,
};

const EnergyPage = () => {
  const { summary, categoryStats, roomStats, fetchEnergy } = useEnergyStore();
  const { currentHouseId, getHouses } = useHouseStore();

  useEffect(() => {
    const init = async () => {
      const houses = await getHouses();
      const houseId = currentHouseId || houses[0]?.id || DEFAULT_HOUSE_ID;
      await fetchEnergy(houseId);
    };
    init();
  }, [fetchEnergy, getHouses, currentHouseId]);

  const totalSaving = useMemo(() => {
    return savingTips.reduce((acc, tip) => {
      const match = tip.saving.match(/¥(\d+)/);
      return acc + (match ? Number(match[1]) : 0);
    }, 0);
  }, []);

  const carbonKg = useMemo(() => {
    return (summary.monthUsage * 0.785).toFixed(1);
  }, [summary.monthUsage]);

  const renderCategoryTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;
    return (
      <div className="px-4 py-3 rounded-xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-scale-in">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: data.color }}
          />
          <span className="text-sm font-semibold text-white">{data.name}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-muted-foreground">用电量</span>
            <span className="font-orbitron font-semibold text-white">
              {data.value} kWh
            </span>
          </div>
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-muted-foreground">占比</span>
            <span className="font-orbitron font-semibold text-primary-300">
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderRoomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;
    return (
      <div className="px-4 py-3 rounded-xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-scale-in">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: data.color }}
          />
          <span className="text-sm font-semibold text-white">{data.name}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-muted-foreground">用电量</span>
            <span className="font-orbitron font-semibold text-white">
              {data.value} kWh
            </span>
          </div>
          <div className="flex justify-between gap-6 text-xs">
            <span className="text-muted-foreground">占比</span>
            <span className="font-orbitron font-semibold text-primary-300">
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">能耗管理</h1>
          <p className="text-sm text-muted-foreground">
            实时监控用电数据，发现节能潜力，降低家庭能耗支出
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlassCard hover={false} className="py-2 px-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-muted-foreground">
              {dayjs().format('YYYY年MM月DD日')}
            </span>
          </GlassCard>
          <GradientButton variant="ghost" icon={<Leaf className="w-4 h-4" />}>
            导出报告
          </GradientButton>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="今日用电"
          value={summary.todayUsage.toFixed(1)}
          unit="kWh"
          trend={summary.monthTrend}
          trendDirection={summary.monthTrend > 0 ? 'up' : 'down'}
          icon={<Zap className="w-4 h-4" />}
        />
        <StatBlock
          title="本周用电"
          value={summary.weekUsage.toFixed(1)}
          unit="kWh"
          trend={3.2}
          trendDirection="up"
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatBlock
          title="本月用电"
          value={summary.monthUsage.toFixed(1)}
          unit="kWh"
          trend={summary.monthTrend}
          trendDirection={summary.monthTrend > 0 ? 'up' : 'down'}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatBlock
          title="年度累计"
          value={(summary.monthUsage * 6.5).toFixed(0)}
          unit="kWh"
          trend={-8.4}
          trendDirection="down"
          icon={<Zap className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <EnergyGauge className="xl:col-span-1" />
        <div className="xl:col-span-2">
          <TrendChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 flex items-center justify-center">
                <PlugZap className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">按设备类型分类</h3>
                <p className="text-xs text-muted-foreground">本月各品类用电占比</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center gap-4">
            <div className="w-56 h-56 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: `drop-shadow(0 0 8px ${entry.color}40)`,
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={renderCategoryTooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground mb-0.5">总用电</span>
                <span className="font-orbitron font-bold text-2xl text-white">
                  {summary.monthUsage.toFixed(0)}
                </span>
                <span className="text-xs text-muted-foreground">kWh</span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-2.5">
              {categoryStats.map((cat) => {
                const Icon = categoryIcons[cat.category] || PlugZap;
                return (
                  <div
                    key={cat.category}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${cat.color}20` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: cat.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white truncate">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-orbitron text-sm text-white/80">
                            {cat.value}kWh
                          </span>
                          <span
                            className="text-xs font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              background: `${cat.color}20`,
                              color: cat.color,
                            }}
                          >
                            {cat.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${cat.percentage}%`,
                            background: `linear-gradient(90deg, ${cat.color}, ${cat.color}80)`,
                            boxShadow: `0 0 10px ${cat.color}40`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500/20 to-purple-500/20 border border-secondary-500/30 flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-secondary-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">按房间分类</h3>
                <p className="text-xs text-muted-foreground">本月各房间用电对比</p>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roomStats}
                margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
              >
                <defs>
                  {roomStats.map((room, i) => (
                    <linearGradient
                      key={`grad-${i}`}
                      id={`room-bar-grad-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={room.color} stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor={room.color}
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <Tooltip content={renderRoomTooltip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                >
                  {roomStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#room-bar-grad-${index})`}
                      style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
            {roomStats.slice(0, 3).map((room) => (
              <div
                key={room.category}
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: room.color }}
                  />
                  <span className="text-xs font-medium text-white/80">
                    {room.name}
                  </span>
                </div>
                <div className="font-orbitron font-bold text-lg text-white">
                  {room.value}
                  <span className="text-[10px] text-muted-foreground ml-0.5 font-normal">
                    kWh
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RankBar limit={10} />
        </div>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">节能建议</h3>
                <p className="text-xs text-muted-foreground">
                  预计每月可节省 <span className="text-emerald-400 font-semibold">¥{totalSaving}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-2 scrollbar-thin">
            {savingTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div
                  key={i}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-300 group cursor-pointer',
                    'hover:scale-[1.01] hover:shadow-lg',
                    'bg-gradient-to-r border-white/10',
                    tip.color
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        'bg-white/10 border border-white/10',
                        tip.iconColor
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">
                          {tip.title}
                        </h4>
                        <span className="text-xs font-bold text-emerald-400 shrink-0 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20">
                          {tip.saving}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {tip.desc}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <GradientButton
                          size="sm"
                          variant="ghost"
                          className="!py-1 !px-2 !text-xs"
                        >
                          一键启用
                        </GradientButton>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-300">
                    本月环保贡献
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  相当于种植了 <span className="font-bold text-emerald-400">
                    {(summary.monthUsage * 0.014).toFixed(1)}
                  </span> 棵树
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-orbitron font-bold text-2xl text-emerald-400">
                  {carbonKg}
                </div>
                <div className="text-[10px] text-emerald-400/70">kg CO₂ 排放</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

function HomeIcon(props: any) {
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
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default EnergyPage;
