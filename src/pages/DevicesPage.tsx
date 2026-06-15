import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Lightbulb,
  AirVent,
  PanelLeftClose,
  Lock,
  Camera,
  Thermometer,
  Tv,
  Volume2,
  Layers,
  Power,
  PowerOff,
  Settings,
  X,
  CheckSquare,
  Square,
  ChevronDown,
  Wifi,
  WifiOff,
  AlertTriangle,
  Sun,
  Moon,
  ThermometerSun,
  Wind,
  Battery,
  Clock,
  User,
  Play,
  RefreshCw,
  SlidersHorizontal,
  Check,
  Home,
  DoorOpen,
  ScanEye,
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import GradientButton from '@/components/common/GradientButton';
import { useAppStore } from '@/store/useAppStore';
import { useDeviceStore } from '@/store/useDeviceStore';
import { cn } from '@/lib/utils';
import type { Device, DeviceCategory } from '@/types/device';

const CATEGORY_TABS: { key: DeviceCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: '全部', icon: <Layers className="w-4 h-4" /> },
  { key: 'light', label: '灯光', icon: <Lightbulb className="w-4 h-4" /> },
  { key: 'ac', label: '空调', icon: <AirVent className="w-4 h-4" /> },
  { key: 'curtain', label: '窗帘', icon: <PanelLeftClose className="w-4 h-4" /> },
  { key: 'lock', label: '门锁', icon: <Lock className="w-4 h-4" /> },
  { key: 'camera', label: '摄像头', icon: <Camera className="w-4 h-4" /> },
  { key: 'sensor', label: '传感器', icon: <Thermometer className="w-4 h-4" /> },
];

const MOCK_ROOMS = [
  { id: 'all', name: '全部房间' },
  { id: 'room-villa-living', name: '客厅' },
  { id: 'room-villa-master', name: '主卧' },
  { id: 'room-villa-second', name: '次卧' },
  { id: 'room-villa-kitchen', name: '厨房' },
  { id: 'room-villa-bathroom', name: '卫生间' },
  { id: 'room-villa-study', name: '书房' },
  { id: 'room-villa-balcony', name: '阳台' },
];

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

const DeviceCard = ({
  device,
  isSelected,
  onToggle,
  onSelect,
  onOpenDetail,
}: {
  device: Device;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onOpenDetail: (device: Device) => void;
}) => {
  const hasPower = 'power' in device.state;
  const isOn = hasPower && (device.state as { power: boolean }).power;
  const isLocked = device.category === 'lock' && (device.state as { state: string }).state === 'locked';

  const statusConfig = {
    online: { color: 'bg-emerald-500', icon: <Wifi className="w-3 h-3" /> },
    offline: { color: 'bg-gray-500', icon: <WifiOff className="w-3 h-3" /> },
    fault: { color: 'bg-rose-500', icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const status = statusConfig[device.status];

  return (
    <GlassCard
      className={cn(
        'p-4 relative group cursor-pointer transition-all duration-300',
        isSelected && 'ring-2 ring-primary-500 shadow-glow-primary',
        isOn && !isSelected && 'ring-1 ring-primary-500/30'
      )}
      onClick={() => onOpenDetail(device)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(device.id);
        }}
        className={cn(
          'absolute top-3 left-3 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all z-10',
          isSelected
            ? 'bg-primary-500 border-primary-500 text-white'
            : 'border-white/20 opacity-0 group-hover:opacity-100 hover:border-primary-500'
        )}
      >
        {isSelected && <Check className="w-3 h-3" />}
      </button>

      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <span className={cn('w-2 h-2 rounded-full', status.color)} />
      </div>

      <div className="flex flex-col gap-3 pt-4">
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
            device.status === 'fault'
              ? 'bg-rose-500/20 text-rose-400'
              : device.status === 'offline'
                ? 'bg-gray-500/20 text-gray-400'
                : isOn || isLocked
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-gray-500/20 text-gray-400'
          )}>
            {device.status === 'fault' ? '故障' : device.status === 'offline' ? '离线' : device.category === 'lock' ? (isLocked ? '已锁定' : '已解锁') : isOn ? '运行中' : '已关闭'}
          </span>

          {(hasPower || device.category === 'curtain' || device.category === 'lock') && device.status === 'online' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(device.id);
              }}
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

const LightControl = ({ device, onUpdate }: { device: Device; onUpdate: (patch: Partial<Device['state']>) => void }) => {
  const state = device.state as { power: boolean; brightness: number; colorTemp: number; color?: string };
  const [brightness, setBrightness] = useState(state.brightness);
  const [colorTemp, setColorTemp] = useState(state.colorTemp);

  const handleBrightnessChange = (val: number) => {
    setBrightness(val);
    onUpdate({ brightness: val });
  };

  const handleColorTempChange = (val: number) => {
    setColorTemp(val);
    onUpdate({ colorTemp: val });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onUpdate({ power: true, brightness: 80, colorTemp: 4000 })}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
        >
          <Sun className="w-6 h-6 mx-auto text-amber-400 mb-2" />
          <p className="text-xs text-white font-medium">日常</p>
        </button>
        <button
          onClick={() => onUpdate({ power: true, brightness: 30, colorTemp: 2700 })}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
        >
          <Moon className="w-6 h-6 mx-auto text-indigo-400 mb-2" />
          <p className="text-xs text-white font-medium">夜灯</p>
        </button>
        <button
          onClick={() => onUpdate({ power: true, brightness: 100, colorTemp: 5500 })}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
        >
          <Lightbulb className="w-6 h-6 mx-auto text-primary-400 mb-2" />
          <p className="text-xs text-white font-medium">高亮</p>
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            亮度
          </label>
          <span className="text-sm text-primary-400 font-semibold">{brightness}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={brightness}
          onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <ThermometerSun className="w-4 h-4 text-orange-400" />
            色温
          </label>
          <span className="text-sm text-primary-400 font-semibold">{colorTemp}K</span>
        </div>
        <input
          type="range"
          min={2700}
          max={6500}
          step={100}
          value={colorTemp}
          onChange={(e) => handleColorTempChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #FFA500, #FFFFFF, #87CEEB)',
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>暖光</span>
          <span>冷光</span>
        </div>
      </div>
    </div>
  );
};

const ACControl = ({ device, onUpdate }: { device: Device; onUpdate: (patch: Partial<Device['state']>) => void }) => {
  const state = device.state as { power: boolean; mode: string; temperature: number; fanSpeed: number | string; swing: boolean };
  const [temperature, setTemperature] = useState(state.temperature);

  const modes = [
    { key: 'cool', label: '制冷', icon: <Snowflake className="w-4 h-4" /> },
    { key: 'heat', label: '制热', icon: <ThermometerSun className="w-4 h-4" /> },
    { key: 'auto', label: '自动', icon: <RefreshCw className="w-4 h-4" /> },
    { key: 'dry', label: '除湿', icon: <Droplets className="w-4 h-4" /> },
    { key: 'fan', label: '送风', icon: <Wind className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">设定温度</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
              {temperature}
            </span>
            <span className="text-2xl text-gray-400">°C</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              const t = Math.min(temperature + 1, 30);
              setTemperature(t);
              onUpdate({ temperature: t });
            }}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
          >
            +
          </button>
          <button
            onClick={() => {
              const t = Math.max(temperature - 1, 16);
              setTemperature(t);
              onUpdate({ temperature: t });
            }}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
          >
            -
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-white mb-3">运行模式</p>
        <div className="grid grid-cols-5 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => onUpdate({ mode: m.key as never })}
              className={cn(
                'p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all border',
                state.mode === m.key
                  ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              {m.icon}
              <span className="text-[10px] font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-white mb-3">风速</p>
        <div className="grid grid-cols-5 gap-2">
          {['auto', 1, 2, 3, 4].map((speed) => (
            <button
              key={String(speed)}
              onClick={() => onUpdate({ fanSpeed: speed as never })}
              className={cn(
                'py-2 rounded-xl text-xs font-medium transition-all border',
                state.fanSpeed === speed
                  ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              {speed === 'auto' ? 'AUTO' : `${speed}档`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-primary-400" />
          <span className="text-sm font-medium text-white">扫风</span>
        </div>
        <button
          onClick={() => onUpdate({ swing: !state.swing })}
          className={cn(
            'relative w-11 h-6 rounded-full transition-all duration-300',
            state.swing ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-white/10'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300',
              state.swing ? 'left-[22px]' : 'left-0.5'
            )}
          />
        </button>
      </div>
    </div>
  );
};

const CurtainControl = ({ device, onUpdate }: { device: Device; onUpdate: (patch: Partial<Device['state']>) => void }) => {
  const state = device.state as { position: number };
  const [position, setPosition] = useState(state.position);

  const handleChange = (val: number) => {
    setPosition(val);
    onUpdate({ position: val });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-6">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full border-8 border-white/5" />
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent"
            style={{
              background: `conic-gradient(from 225deg, #1677ff 0deg, #633bff ${(position / 100) * 270}deg, transparent ${(position / 100) * 270}deg)`,
              WebkitMask: 'radial-gradient(transparent 60px, black 61px)',
              mask: 'radial-gradient(transparent 60px, black 61px)',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <PanelLeftClose className="w-10 h-10 text-primary-400 mb-2" />
            <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {position}%
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {position === 0 ? '全关' : position === 100 ? '全开' : '半开'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary-500"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[0, 25, 50, 75, 100].map((p) => (
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={cn(
              'py-2 rounded-xl text-xs font-medium transition-all border col-span-1',
              position === p
                ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            )}
          >
            {p === 0 ? '全关' : p === 100 ? '全开' : `${p}%`}
          </button>
        ))}
      </div>
    </div>
  );
};

const LockStatus = ({ device }: { device: Device }) => {
  const state = device.state as { state: string; battery: number; lastUnlockUser?: string; lastUnlockTime?: number };
  const unlockHistory = [
    { user: '张明轩', method: '指纹', time: '2小时前' },
    { user: '李雨婷', method: '密码', time: '5小时前' },
    { user: '系统', method: '临时密码', time: '昨天 18:30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-4">
        <div
          className={cn(
            'w-28 h-28 rounded-2xl flex items-center justify-center shadow-glow-primary',
            state.state === 'locked'
              ? 'bg-gradient-to-br from-emerald-500/30 to-primary-500/30'
              : state.state === 'alarm'
                ? 'bg-gradient-to-br from-rose-500/30 to-amber-500/30 animate-pulse'
                : 'bg-gradient-to-br from-amber-500/30 to-rose-500/30'
          )}
        >
          {state.state === 'locked' ? (
            <Lock className="w-12 h-12 text-emerald-400" />
          ) : state.state === 'alarm' ? (
            <AlertTriangle className="w-12 h-12 text-rose-400" />
          ) : (
            <DoorOpen className="w-12 h-12 text-amber-400" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">状态</p>
          <p className={cn(
            'text-sm font-semibold',
            state.state === 'locked' ? 'text-emerald-400' : state.state === 'alarm' ? 'text-rose-400' : 'text-amber-400'
          )}>
            {state.state === 'locked' ? '已锁定' : state.state === 'alarm' ? '异常告警' : '已解锁'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">电量</p>
          <p className="text-sm font-semibold text-primary-400 flex items-center justify-center gap-1">
            <Battery className="w-3.5 h-3.5" />
            {state.battery}%
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">最近</p>
          <p className="text-sm font-semibold text-white">{state.lastUnlockTime ? '指纹' : '-'}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-400" />
          开锁记录
        </p>
        <div className="space-y-2">
          {unlockHistory.map((record, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{record.user}</p>
                  <p className="text-xs text-gray-400">{record.method}开锁</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{record.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CameraPreview = ({ device }: { device: Device }) => (
  <div className="space-y-6">
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">实时画面加载中...</p>
        </div>
      </div>
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-xs font-medium text-white">REC</span>
        <span className="text-xs text-white/70">HD 1080P</span>
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
        <span className="text-xs text-white font-mono">
          {new Date().toLocaleTimeString('zh-CN')}
        </span>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <Camera className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <Play className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-gray-400 mb-1">分辨率</p>
        <p className="text-sm font-medium text-white">1920 × 1080</p>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-gray-400 mb-1">夜视模式</p>
        <p className="text-sm font-medium text-emerald-400">红外夜视</p>
      </div>
    </div>
  </div>
);

const DeviceDetailDrawer = ({
  device,
  onClose,
  onUpdate,
  onToggle,
}: {
  device: Device | null;
  onClose: () => void;
  onUpdate: (patch: Partial<Device['state']>) => void;
  onToggle: () => void;
}) => {
  if (!device) return null;

  const hasPower = 'power' in device.state;
  const isOn = hasPower && (device.state as { power: boolean }).power;

  const renderControl = () => {
    switch (device.category) {
      case 'light':
        return <LightControl device={device} onUpdate={onUpdate} />;
      case 'ac':
        return <ACControl device={device} onUpdate={onUpdate} />;
      case 'curtain':
        return <CurtainControl device={device} onUpdate={onUpdate} />;
      case 'lock':
        return <LockStatus device={device} />;
      case 'camera':
        return <CameraPreview device={device} />;
      default:
        return (
          <div className="text-center py-12 text-gray-400">
            <ScanEye className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>该设备暂不支持详细控制</p>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-b from-deepspace-500 to-deepspace-600 border-l border-white/10 shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center',
                isOn
                  ? 'bg-gradient-to-br from-primary-500/30 to-secondary-500/30 text-primary-300'
                  : 'bg-white/5 text-gray-400'
              )}
            >
              {categoryIcons[device.category]}
            </div>
            <div>
              <h3 className="font-semibold text-white">{device.name}</h3>
              <p className="text-xs text-gray-400 capitalize">{device.category} · {device.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasPower && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
            <span className="text-sm text-white font-medium">设备开关</span>
            <button
              onClick={onToggle}
              className={cn(
                'relative w-14 h-7 rounded-full transition-all duration-300',
                isOn ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-white/10'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300',
                  isOn ? 'left-[29px]' : 'left-0.5'
                )}
              />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {renderControl()}
        </div>

        <div className="p-5 border-t border-white/5 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">固件版本</p>
              <p className="text-sm text-white font-medium">{device.firmware || '-'}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">配对时间</p>
              <p className="text-sm text-white font-medium">
                {new Date(device.pairedAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PairModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <GlassCard className="relative z-10 w-full max-w-md p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-6 h-6 text-primary-400" />
          添加新设备
        </h3>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-center py-10">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-spin-slow" />
          <div className="absolute inset-4 rounded-full border-2 border-secondary-500/40 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/30 to-secondary-500/30 flex items-center justify-center animate-pulse shadow-glow-primary">
              <ScanEye className="w-10 h-10 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-white mb-2">正在搜索附近设备...</h4>
        <p className="text-sm text-gray-400">请确保设备已通电并处于配对模式</p>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { name: '智能吸顶灯', signal: '强' },
          { name: '空调伴侣', signal: '中' },
          { name: '智能插座', signal: '弱' },
        ].map((dev, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{dev.name}</p>
                <p className="text-xs text-gray-400">信号强度：{dev.signal}</p>
              </div>
            </div>
            <GradientButton size="sm" variant="ghost" icon={<Plus className="w-3.5 h-3.5" />}>
              添加
            </GradientButton>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <GradientButton variant="ghost" className="flex-1" onClick={onClose}>
          取消
        </GradientButton>
        <GradientButton variant="primary" className="flex-1" icon={<RefreshCw className="w-4 h-4" />}>
          重新搜索
        </GradientButton>
      </div>
    </GlassCard>
  </div>
);

export default function DevicesPage() {
  const currentHouseId = useAppStore((state) => state.currentHouseId);
  const {
    devices,
    selectedDeviceIds,
    filterCategory,
    filterRoomId,
    searchQuery,
    fetchDevices,
    toggleDevice,
    updateDeviceState,
    batchToggle,
    toggleSelect,
    clearSelection,
    setFilter,
    setSearch,
  } = useDeviceStore();

  const [detailDevice, setDetailDevice] = useState<Device | null>(null);
  const [showPairModal, setShowPairModal] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);

  useEffect(() => {
    if (!currentHouseId) return;
    fetchDevices(currentHouseId);
  }, [currentHouseId]);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      if (filterCategory !== 'all' && d.category !== filterCategory) return false;
      if (filterRoomId !== 'all' && d.roomId !== filterRoomId) return false;
      if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [devices, filterCategory, filterRoomId, searchQuery]);

  const allSelected = filteredDevices.length > 0 && filteredDevices.every((d) => selectedDeviceIds.includes(d.id));

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      filteredDevices.forEach((d) => {
        if (!selectedDeviceIds.includes(d.id)) toggleSelect(d.id);
      });
    }
  };

  const handleBatchOn = () => batchToggle(selectedDeviceIds, true);
  const handleBatchOff = () => batchToggle(selectedDeviceIds, false);

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索设备名称..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 focus:shadow-glow-primary transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setRoomDropdownOpen(!roomDropdownOpen)}
              className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white flex items-center gap-2 hover:border-primary-500/30 transition-all min-w-[140px] justify-between"
            >
              <Home className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{MOCK_ROOMS.find((r) => r.id === filterRoomId)?.name}</span>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', roomDropdownOpen && 'rotate-180')} />
            </button>
            {roomDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRoomDropdownOpen(false)} />
                <div className="absolute top-full mt-2 left-0 right-0 z-20 rounded-xl bg-deepspace-500/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
                  {MOCK_ROOMS.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setFilter({ filterRoomId: room.id as never });
                        setRoomDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left text-sm transition-all flex items-center justify-between',
                        filterRoomId === room.id
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {room.name}
                      {filterRoomId === room.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <GradientButton
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowPairModal(true)}
          >
            添加设备
          </GradientButton>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter({ filterCategory: tab.key as never })}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                filterCategory === tab.key
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30 shadow-glow-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {tab.icon}
              {tab.label}
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-md',
                filterCategory === tab.key ? 'bg-white/20' : 'bg-white/5'
              )}>
                {tab.key === 'all'
                  ? devices.length
                  : devices.filter((d) => d.category === tab.key).length}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {selectedDeviceIds.length > 0 && (
        <GlassCard className="p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-white hover:text-primary-400 transition-colors"
              >
                {allSelected ? (
                  <CheckSquare className="w-5 h-5 text-primary-400" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">全选</span>
              </button>
              <span className="text-sm text-gray-400">
                已选择 <span className="text-primary-400 font-semibold">{selectedDeviceIds.length}</span> 台设备
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <GradientButton
                size="sm"
                variant="primary"
                icon={<Power className="w-4 h-4" />}
                onClick={handleBatchOn}
              >
                批量开启
              </GradientButton>
              <GradientButton
                size="sm"
                variant="ghost"
                icon={<PowerOff className="w-4 h-4" />}
                onClick={handleBatchOff}
              >
                批量关闭
              </GradientButton>
              <GradientButton
                size="sm"
                variant="secondary"
                icon={<SlidersHorizontal className="w-4 h-4" />}
              >
                批量设置
              </GradientButton>
              <button
                onClick={clearSelection}
                className="px-4 h-9 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                取消选择
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-400" />
            设备列表
            <span className="text-sm font-normal text-gray-400">({filteredDevices.length})</span>
          </h2>
        </div>

        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDeviceIds.includes(device.id)}
                onToggle={toggleDevice}
                onSelect={toggleSelect}
                onOpenDetail={setDetailDevice}
              />
            ))}
          </div>
        ) : (
          <GlassCard className="p-16 text-center">
            <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">暂无设备</h3>
            <p className="text-sm text-gray-400 mb-6">没有找到匹配的设备，请尝试其他筛选条件</p>
            <GradientButton icon={<Plus className="w-4 h-4" />} onClick={() => setShowPairModal(true)}>
              添加新设备
            </GradientButton>
          </GlassCard>
        )}
      </div>

      <DeviceDetailDrawer
        device={detailDevice}
        onClose={() => setDetailDevice(null)}
        onUpdate={(patch) => detailDevice && updateDeviceState(detailDevice.id, patch)}
        onToggle={() => detailDevice && toggleDevice(detailDevice.id)}
      />

      {showPairModal && <PairModal onClose={() => setShowPairModal(false)} />}
    </div>
  );
}

function Droplets(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function Snowflake(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="m20 16-4-4 4-4" />
      <path d="m4 8 4 4-4 4" />
      <path d="m16 4-4 4-4-4" />
      <path d="m8 20 4-4 4 4" />
    </svg>
  );
}
