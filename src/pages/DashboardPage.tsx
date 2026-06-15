import { useEffect, useMemo } from 'react';
import {
  Home,
  Wifi,
  Power,
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  Zap,
  Gauge,
  TrendingUp,
  TrendingDown,
  Play,
  Sun,
  Moon,
  Film,
  BookOpen,
  Utensils,
  LogOut,
  Lightbulb,
  AirVent,
  PanelLeftClose,
  Camera,
  Tv,
  Volume2,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import { useAppStore } from '@/store/useAppStore';
import { useHouseStore } from '@/store/useHouseStore';
import { useDeviceStore } from '@/store/useDeviceStore';
import { useSceneStore } from '@/store/useSceneStore';
import { useEnergyStore } from '@/store/useEnergyStore';
import { useAlertStore } from '@/store/useAlertStore';
import { cn } from '@/lib/utils';
import type { Device, DeviceCategory } from '@/types/device';
import type { Scene } from '@/types/scene';
import type { Alert, AlertLevel } from '@/types/alert';

const categoryIcons: Record<DeviceCategory, React.ReactNode> = {
  light: <Lightbulb className="w-5 h-5" />,
  ac: <AirVent className="w-5 h-5" />,
  curtain: <PanelLeftClose className="w-5 h-5" />,
  lock: <Lock className="w-5 h-5" />,
  camera: <Camera className="w-5 h-5" />,
  sensor: <Thermometer className="w-5 h-5" />,
  tv: <Tv className="w-5 h-5" />,
  speaker: <Volume2 className="w-5 h-5" />,
};

const DeviceCard = ({ device, onToggle }: { device: Device; onToggle: (id: string) => void }) => {
  const hasPower = 'power' in device.state;
  const isOn = hasPower && (device.state as { power: boolean }).power;
  const isLocked = device.category === 'lock' && (device.state as { state: string }).state === 'locked';

  const statusColor = device.status === 'online' ? 'bg-emerald-500' : device.status === 'fault' ? 'bg-rose-500' : 'bg-gray-500';

  return (
    <GlassCard
      className={cn(
        'p-4 relative group',
        isOn && 'ring-2 ring-primary-500/30 shadow-glow-primary'
      )}
    >
      <div className="absolute top-3 right-3">
        <span className={cn('w-2 h-2 rounded-full inline-block', statusColor)} />
      </div>

      <div className="flex flex-col gap-3">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
            isOn
              ? 'bg-gradient-to-br from-primary-500/30 to-secondary-500/30 text-primary-300 shadow-glow-primary'
              : 'bg-white/5 text-gray-400'
          )}
        >
          {categoryIcons[device.category]}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-white truncate">{device.name}</h4>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{device.category}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            isOn || isLocked
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-gray-500/20 text-gray-400'
          )}>
            {device.category === 'lock' ? (isLocked ? '已锁定' : '已解锁') : isOn ? '运行中' : '已关闭'}
          </span>

          {(hasPower || device.category === 'curtain' || device.category === 'lock') && (
            <button
              onClick={() => onToggle(device.id)}
              className={cn(
                'relative w-11 h-6 rounded-full transition-all duration-300',
                isOn || isLocked
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                  : 'bg-white/10'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300',
                  isOn || isLocked ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

const SceneCard = ({ scene, onRun, onToggle, isRunning }: {
  scene: Scene;
  onRun: (id: string) => void;
  onToggle: (id: string) => void;
  isRunning: boolean;
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    home: <Home className="w-6 h-6" />,
    'log-out': <LogOut className="w-6 h-6" />,
    moon: <Moon className="w-6 h-6" />,
    sunrise: <Sun className="w-6 h-6" />,
    film: <Film className="w-6 h-6" />,
    'book-open': <BookOpen className="w-6 h-6" />,
    utensils: <Utensils className="w-6 h-6" />,
  };

  const triggerLabels: Record<string, string> = {
    manual: '手动',
    schedule: '定时',
    location: '位置',
    device: '设备',
    timeRange: '时段',
  };

  return (
    <GlassCard
      className={cn(
        'p-5 relative overflow-hidden group',
        isRunning && 'ring-2 ring-emerald-400/50 animate-pulse-glow'
      )}
    >
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: scene.color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${scene.color}33, ${scene.color}11)`,
              color: scene.color,
              boxShadow: `0 0 30px ${scene.color}22`,
            }}
          >
            {iconMap[scene.icon] || <Play className="w-6 h-6" />}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(scene.id);
            }}
            className={cn(
              'relative w-11 h-6 rounded-full transition-all duration-300',
              scene.enabled
                ? 'bg-gradient-to-r from-emerald-500 to-primary-500'
                : 'bg-white/10'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300',
                scene.enabled ? 'left-[22px]' : 'left-0.5'
              )}
            />
          </button>
        </div>

        <h3 className="font-semibold text-white text-lg mb-1">{scene.name}</h3>
        <p className="text-xs text-gray-400 mb-4">{scene.actions.length} 个设备联动</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {scene.triggers.slice(0, 3).map((t) => (
            <span
              key={t.id}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
            >
              {triggerLabels[t.type] || t.type}
            </span>
          ))}
        </div>

        <GradientButton
          size="sm"
          variant={scene.enabled ? 'primary' : 'ghost'}
          icon={<Play className="w-4 h-4" />}
          loading={isRunning}
          onClick={() => onRun(scene.id)}
          className="w-full"
        >
          {isRunning ? '执行中' : '执行场景'}
        </GradientButton>
      </div>
    </GlassCard>
  );
};

const EnergyGauge = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180;

  const data = [
    { name: '已用', value: percentage },
    { name: '剩余', value: 100 - percentage },
  ];

  const COLORS = ['#10B981', 'rgba(255,255,255,0.1)'];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          {label}
        </h3>
      </div>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <ReTooltip
              contentStyle={{
                background: 'rgba(10,25,41,0.95)',
                border: '1px solid rgba(22,119,255,0.3)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-primary-400 bg-clip-text text-transparent">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400">kWh / {max} kWh</div>
        </div>
      </div>
    </GlassCard>
  );
};

const AlertBanner = ({ alert, onHandle }: { alert: Alert; onHandle: (id: string) => void }) => {
  const levelConfig: Record<AlertLevel, { icon: React.ReactNode; border: string; bg: string; text: string }> = {
    critical: {
      icon: <AlertTriangle className="w-5 h-5" />,
      border: 'border-rose-500/50',
      bg: 'from-rose-500/20 to-rose-500/5',
      text: 'text-rose-400',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      border: 'border-amber-500/50',
      bg: 'from-amber-500/20 to-amber-500/5',
      text: 'text-amber-400',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      border: 'border-primary-500/50',
      bg: 'from-primary-500/20 to-primary-500/5',
      text: 'text-primary-400',
    },
  };

  const config = levelConfig[alert.level];
  const timeAgo = Math.floor((Date.now() - alert.createdAt) / 3600000);

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl border bg-gradient-to-r backdrop-blur-sm transition-all hover:scale-[1.01]',
        config.border,
        config.bg,
        alert.level === 'critical' && 'animate-pulse'
      )}
    >
      <div className={cn('shrink-0 mt-0.5', config.text)}>
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-white">{alert.title}</h4>
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium',
            `bg-${alert.level === 'critical' ? 'rose' : alert.level === 'warning' ? 'amber' : 'primary'}-500/20`,
            config.text
          )}>
            {alert.level === 'critical' ? '紧急' : alert.level === 'warning' ? '警告' : '提示'}
          </span>
        </div>
        <p className="text-sm text-gray-300 line-clamp-2">{alert.message}</p>
        <p className="text-xs text-gray-500 mt-2">{timeAgo}小时前</p>
      </div>

      <button
        onClick={() => onHandle(alert.id)}
        className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1"
      >
        处理 <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const currentHouseId = useAppStore((state) => state.currentHouseId);
  const { houses, getHouses, getRoomsByHouse } = useHouseStore();
  const { devices, fetchDevices, toggleDevice } = useDeviceStore();
  const { scenes, activeSceneId, fetchScenes, runScene, toggleSceneEnabled } = useSceneStore();
  const { summary, fetchEnergy } = useEnergyStore();
  const { alerts, unreadCount, fetchAlerts, markRead } = useAlertStore();

  useEffect(() => {
    if (!currentHouseId) return;
    getHouses();
    fetchDevices(currentHouseId);
    fetchScenes(currentHouseId);
    fetchEnergy(currentHouseId);
    fetchAlerts(currentHouseId);
  }, [currentHouseId]);

  const house = houses.find((h) => h.id === currentHouseId) || houses[0];
  const rooms = currentHouseId ? getRoomsByHouse(currentHouseId) : [];

  const stats = useMemo(() => {
    const onlineCount = devices.filter((d) => d.status === 'online').length;
    const poweredCount = devices.filter((d) => {
      if ('power' in d.state) return (d.state as { power: boolean }).power;
      return false;
    }).length;
    const lockDevice = devices.find((d) => d.category === 'lock');
    const isSecured = lockDevice && 'state' in lockDevice.state
      ? (lockDevice.state as { state: string }).state === 'locked'
      : true;
    const lockState = lockDevice && 'state' in lockDevice.state
      ? (lockDevice.state as { state: string }).state
      : 'unknown';

    return {
      online: onlineCount,
      total: devices.length,
      powered: poweredCount,
      secured: isSecured,
      lockState,
    };
  }, [devices]);

  const quickScenes = useMemo(() => scenes.slice(0, 6), [scenes]);
  const frequentDevices = useMemo(() => devices.filter((d) => d.category !== 'sensor').slice(0, 8), [devices]);
  const recentAlerts = useMemo(() => alerts.filter((a) => a.status === 'pending' || a.status === 'handling').slice(0, 3), [alerts]);

  const handleRunScene = async (id: string) => {
    await runScene(id);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-emerald-500/10" />
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-secondary-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{getGreeting()}，欢迎回家 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Home className="w-8 h-8 text-primary-400" />
              {house?.name || '智能家居'}
            </h1>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                全屋系统运行正常
              </span>
              {house?.address && <span>· {house.address}</span>}
              {rooms.length > 0 && <span>· {rooms.length} 个房间</span>}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-xs text-gray-400">客厅温度</p>
                <p className="font-semibold text-white">25.8°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Droplets className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">湿度</p>
                <p className="font-semibold text-white">52%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Wind className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-gray-400">PM2.5</p>
                <p className="font-semibold text-emerald-400">18 优</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="设备在线"
          value={`${stats.online}/${stats.total}`}
          unit="台"
          icon={<Wifi className="w-5 h-5" />}
          trend={5}
          trendDirection="up"
        />
        <StatBlock
          title="开启设备"
          value={stats.powered}
          unit="台"
          icon={<Power className="w-5 h-5" />}
          trend={2}
          trendDirection="neutral"
        />
        <StatBlock
          title="安防状态"
          value={stats.secured ? '布防' : '撤防'}
          icon={<Shield className="w-5 h-5" />}
          valueClassName={cn(
            stats.secured
              ? '!bg-gradient-to-r !from-emerald-400 !to-primary-400'
              : '!bg-gradient-to-r !from-rose-400 !to-amber-400'
          )}
        />
        <StatBlock
          title="门锁状态"
          value={stats.lockState === 'locked' ? '已锁定' : stats.lockState === 'unlocked' ? '已解锁' : '异常'}
          icon={stats.lockState === 'locked' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          valueClassName={cn(
            stats.lockState === 'locked'
              ? '!bg-gradient-to-r !from-emerald-400 !to-primary-400'
              : stats.lockState === 'unlocked'
                ? '!bg-gradient-to-r !from-amber-400 !to-rose-400'
                : '!bg-gradient-to-r !from-rose-500 !to-rose-400'
          )}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-primary-400" />
            快捷场景
          </h2>
          <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onRun={handleRunScene}
              onToggle={toggleSceneEnabled}
              isRunning={activeSceneId === scene.id}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              常用设备
            </h2>
            <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              管理设备 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {frequentDevices.map((device) => (
              <DeviceCard key={device.id} device={device} onToggle={toggleDevice} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <EnergyGauge value={summary.todayUsage} max={20} label="今日能耗速览" />

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">能耗对比</h3>
              <span className="text-xs text-gray-400">较昨日</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">今日用电</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{summary.todayCost} 元</span>
                  {summary.monthTrend < 0 ? (
                    <span className="flex items-center gap-0.5 text-xs text-emerald-400">
                      <TrendingDown className="w-3 h-3" />
                      {Math.abs(summary.monthTrend)}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-xs text-rose-400">
                      <TrendingUp className="w-3 h-3" />
                      +{summary.monthTrend}%
                    </span>
                  )}
                </div>
              </div>

              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-primary-500 transition-all duration-1000"
                  style={{ width: `${(summary.todayUsage / 20) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-gray-400">峰时功率</p>
                  <p className="text-lg font-semibold text-emerald-400 flex items-center gap-1">
                    <Gauge className="w-4 h-4" />
                    {summary.peakPower} kW
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">峰时时间</p>
                  <p className="text-lg font-semibold text-white">{summary.peakTime}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {recentAlerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              最近告警
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-medium">
                  {unreadCount} 条待处理
                </span>
              )}
            </h2>
            <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertBanner key={alert.id} alert={alert} onHandle={markRead} />
            ))}
          </div>
        </div>
      )}

      <GlassCard className="p-5 bg-gradient-to-r from-emerald-500/10 to-primary-500/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">节能小贴士</h3>
            <p className="text-sm text-gray-300">{summary.savingTip}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">本月预计节省</p>
            <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-primary-400 bg-clip-text text-transparent">
              {summary.carbonReduction} kg
            </p>
            <p className="text-xs text-gray-400">CO₂减排</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
