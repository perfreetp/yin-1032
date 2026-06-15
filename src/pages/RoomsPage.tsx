import { useEffect, useState, useMemo } from 'react';
import {
  Sofa,
  Bed,
  BedDouble,
  CookingPot,
  Bath,
  BookOpen as BookOpenIcon,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Lightbulb,
  AirVent,
  PanelLeftClose,
  Lock,
  Camera,
  Tv,
  Volume2,
  Power,
  PowerOff,
  Lamp,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Baby,
  ShowerHead,
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import { useAppStore } from '@/store/useAppStore';
import { useDeviceStore } from '@/store/useDeviceStore';
import { useSceneStore } from '@/store/useSceneStore';
import { useHouseStore } from '@/store/useHouseStore';
import { cn } from '@/lib/utils';
import type { Device, DeviceCategory } from '@/types/device';
import type { Scene } from '@/types/scene';

const roomIconMap: Record<string, React.ReactNode> = {
  sofa: <Sofa className="w-5 h-5" />,
  bed: <Bed className="w-5 h-5" />,
  'bed-double': <BedDouble className="w-5 h-5" />,
  'cooking-pot': <CookingPot className="w-5 h-5" />,
  bath: <Bath className="w-5 h-5" />,
  'book-open': <BookOpenIcon className="w-5 h-5" />,
  sun: <Sun className="w-5 h-5" />,
  baby: <Baby className="w-5 h-5" />,
  'shower-head': <ShowerHead className="w-5 h-5" />,
};

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

const SceneCard = ({ scene, onRun }: { scene: Scene; onRun: (id: string) => void }) => {
  const iconMap: Record<string, React.ReactNode> = {
    home: <Sofa className="w-5 h-5" />,
    'log-out': <PowerOff className="w-5 h-5" />,
    moon: <Bed className="w-5 h-5" />,
    sunrise: <Sun className="w-5 h-5" />,
    film: <Tv className="w-5 h-5" />,
    'book-open': <BookOpenIcon className="w-5 h-5" />,
    utensils: <CookingPot className="w-5 h-5" />,
  };

  return (
    <GlassCard className="p-4 min-w-[200px] shrink-0 group">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${scene.color}33, ${scene.color}11)`,
            color: scene.color,
          }}
        >
          {iconMap[scene.icon] || <Sparkles className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm text-white truncate">{scene.name}</h4>
          <p className="text-xs text-gray-400">{scene.actions.length} 个动作</p>
        </div>
      </div>

      <GradientButton
        size="sm"
        variant="ghost"
        icon={<Play className="w-3.5 h-3.5" />}
        onClick={() => onRun(scene.id)}
        className="w-full"
      >
        一键执行
      </GradientButton>
    </GlassCard>
  );
};

const EnvCard = ({ icon, label, value, unit, color, status }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  status?: string;
}) => (
  <GlassCard className="p-4">
    <div className="flex items-start gap-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold" style={{ color }}>{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
        {status && <p className="text-xs mt-1" style={{ color }}>{status}</p>}
      </div>
    </div>
  </GlassCard>
);

export default function RoomsPage() {
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const currentHouseId = useAppStore((state) => state.currentHouseId);
  const { getRoomsByHouse, rooms } = useHouseStore();
  const { devices, fetchDevices, toggleDevice, batchToggle } = useDeviceStore();
  const { scenes, fetchScenes, runScene } = useSceneStore();

  const currentRooms = useMemo(() => {
    if (!currentHouseId) return [];
    return getRoomsByHouse(currentHouseId);
  }, [currentHouseId, getRoomsByHouse]);

  useEffect(() => {
    if (currentRooms.length > 0 && !currentRooms.find((r) => r.id === activeRoomId)) {
      setActiveRoomId(currentRooms[0].id);
    }
  }, [currentRooms, activeRoomId]);

  useEffect(() => {
    if (!currentHouseId) return;
    fetchDevices(currentHouseId);
    fetchScenes(currentHouseId);
  }, [currentHouseId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || currentRooms[0];
  const roomDevices = useMemo(() => devices.filter((d) => d.roomId === activeRoomId), [devices, activeRoomId]);
  const roomScenes = useMemo(() => scenes.slice(0, 8), [scenes]);

  const sensors = useMemo(() => {
    const sensorDevice = devices.find((d) => d.category === 'sensor' && d.roomId === activeRoomId);
    if (sensorDevice && 'temperature' in sensorDevice.state) {
      return sensorDevice.state as {
        temperature?: number;
        humidity?: number;
        pm25?: number;
        illumination?: number;
      };
    }
    return { temperature: 25 + Math.random() * 3, humidity: 45 + Math.random() * 20, pm25: 15 + Math.random() * 10, illumination: 200 + Math.random() * 300 };
  }, [devices, activeRoomId]);

  const handleTurnAllOn = () => {
    const ids = roomDevices.filter((d) => 'power' in d.state || d.category === 'curtain').map((d) => d.id);
    batchToggle(ids, true);
  };

  const handleTurnAllOff = () => {
    const ids = roomDevices.filter((d) => 'power' in d.state || d.category === 'curtain').map((d) => d.id);
    batchToggle(ids, false);
  };

  const handleLightsOnly = () => {
    const ids = roomDevices.filter((d) => d.category === 'light').map((d) => d.id);
    batchToggle(ids, false);
  };

  const handleACOnly = () => {
    const ids = roomDevices.filter((d) => d.category === 'ac').map((d) => d.id);
    batchToggle(ids, true);
  };

  const getPm25Status = (val: number) => {
    if (val <= 35) return '优';
    if (val <= 75) return '良';
    return '轻度污染';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-2xl p-1.5 overflow-x-auto scrollbar-thin">
        <div className="flex gap-2 min-w-max">
          {currentRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoomId(room.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 whitespace-nowrap',
                activeRoomId === room.id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-primary'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              )}
            >
              {roomIconMap[room.icon] || roomIconMap['sofa']}
              <span className="font-medium text-sm">{room.name}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                activeRoomId === room.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-400'
              )}>
                {devices.filter((d) => d.roomId === room.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="p-6 relative overflow-hidden">
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #1677ff, #633bff)' }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/30 to-secondary-500/30 flex items-center justify-center text-primary-300 shadow-glow-primary">
              {roomIconMap[activeRoom?.icon || 'sofa']}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{activeRoom?.name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {roomDevices.length} 台设备 · {roomDevices.filter((d) => d.status === 'online').length} 台在线
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">环境正常</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EnvCard
          icon={<Thermometer className="w-5 h-5" />}
          label="温度"
          value={sensors.temperature?.toFixed(1) || '25.0'}
          unit="°C"
          color="#FB923C"
          status="舒适"
        />
        <EnvCard
          icon={<Droplets className="w-5 h-5" />}
          label="湿度"
          value={Math.round(sensors.humidity || 50)}
          unit="%"
          color="#60A5FA"
          status="适宜"
        />
        <EnvCard
          icon={<Wind className="w-5 h-5" />}
          label="PM2.5"
          value={Math.round(sensors.pm25 || 20)}
          unit="μg/m³"
          color="#34D399"
          status={getPm25Status(sensors.pm25 || 20)}
        />
        <EnvCard
          icon={<Eye className="w-5 h-5" />}
          label="照度"
          value={Math.round(sensors.illumination || 350)}
          unit="lux"
          color="#FBBF24"
          status="明亮"
        />
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            房间批量操作
          </h3>

          <div className="flex flex-wrap gap-2">
            <GradientButton
              size="sm"
              variant="primary"
              icon={<Power className="w-4 h-4" />}
              onClick={handleTurnAllOn}
            >
              全开设备
            </GradientButton>
            <GradientButton
              size="sm"
              variant="ghost"
              icon={<PowerOff className="w-4 h-4" />}
              onClick={handleTurnAllOff}
            >
              全关设备
            </GradientButton>
            <GradientButton
              size="sm"
              variant="secondary"
              icon={<Lamp className="w-4 h-4" />}
              onClick={handleLightsOnly}
            >
              仅关灯光
            </GradientButton>
            <GradientButton
              size="sm"
              variant="ghost"
              icon={<Snowflake className="w-4 h-4" />}
              onClick={handleACOnly}
            >
              仅开空调
            </GradientButton>
          </div>
        </div>
      </GlassCard>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            房间设备
            <span className="text-sm font-normal text-gray-400">({roomDevices.length})</span>
          </h2>
        </div>

        {roomDevices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {roomDevices.map((device) => (
              <DeviceCard key={device.id} device={device} onToggle={toggleDevice} />
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-500">
              <Sofa className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-white mb-2">暂无设备</h3>
            <p className="text-sm text-gray-400">该房间还没有添加设备，请前往设备管理添加</p>
          </GlassCard>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            推荐场景
          </h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {roomScenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} onRun={runScene} />
          ))}
        </div>
      </div>
    </div>
  );
}
