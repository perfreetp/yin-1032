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
  X,
  CheckSquare,
  Square,
  ChevronDown,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Check,
  Home,
  DoorOpen,
  ScanEye,
  MapPin,
  Hash,
  Cpu,
  Calendar,
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import GradientButton from '@/components/common/GradientButton';
import { useAppStore } from '@/store/useAppStore';
import { useDeviceStore } from '@/store/useDeviceStore';
import { useHouseStore } from '@/store/useHouseStore';
import { cn } from '@/lib/utils';
import type { Device, DeviceCategory } from '@/types/device';
import LightControl from '@/components/devices/LightControl';
import ACControl from '@/components/devices/ACControl';
import CurtainControl from '@/components/devices/CurtainControl';
import LockStatus from '@/components/devices/LockStatus';
import CameraPreview from '@/components/devices/CameraPreview';
import SensorReadings from '@/components/devices/SensorReadings';
import SimpleSwitchControl from '@/components/devices/SimpleSwitchControl';

const CATEGORY_TABS: { key: DeviceCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: '全部', icon: <Layers className="w-4 h-4" /> },
  { key: 'light', label: '灯光', icon: <Lightbulb className="w-4 h-4" /> },
  { key: 'ac', label: '空调', icon: <AirVent className="w-4 h-4" /> },
  { key: 'curtain', label: '窗帘', icon: <PanelLeftClose className="w-4 h-4" /> },
  { key: 'lock', label: '门锁', icon: <Lock className="w-4 h-4" /> },
  { key: 'camera', label: '摄像头', icon: <Camera className="w-4 h-4" /> },
  { key: 'sensor', label: '传感器', icon: <Thermometer className="w-4 h-4" /> },
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

const DeviceDetailDrawer = ({
  device,
  onClose,
}: {
  device: Device | null;
  onClose: () => void;
}) => {
  const { houses, rooms } = useHouseStore();
  const devices = useDeviceStore((state) => state.devices);

  const liveDevice = useMemo(() => {
    if (!device) return null;
    return devices.find((d) => d.id === device.id) || device;
  }, [device, devices]);

  if (!liveDevice) return null;

  const house = houses.find((h) => h.id === liveDevice.houseId);
  const room = rooms.find((r) => r.id === liveDevice.roomId);

  const hasPower = 'power' in liveDevice.state;
  const isOn = hasPower && (liveDevice.state as { power: boolean }).power;

  const statusConfig = {
    online: { color: 'bg-emerald-500', label: '在线', icon: <Wifi className="w-3 h-3" /> },
    offline: { color: 'bg-gray-500', label: '离线', icon: <WifiOff className="w-3 h-3" /> },
    fault: { color: 'bg-rose-500', label: '故障', icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const status = statusConfig[liveDevice.status];

  const renderControl = () => {
    switch (liveDevice.category) {
      case 'light':
        return <LightControl device={liveDevice} />;
      case 'ac':
        return <ACControl device={liveDevice} />;
      case 'curtain':
        return <CurtainControl device={liveDevice} />;
      case 'lock':
        return <LockStatus device={liveDevice} />;
      case 'camera':
        return <CameraPreview device={liveDevice} />;
      case 'sensor':
        return <SensorReadings device={liveDevice} />;
      case 'tv':
      case 'speaker':
        return <SimpleSwitchControl device={liveDevice} />;
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
              {categoryIcons[liveDevice.category]}
            </div>
            <div>
              <h3 className="font-semibold text-white">{liveDevice.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn('w-2 h-2 rounded-full', status.color)} />
                <p className="text-xs text-gray-400 capitalize">
                  {liveDevice.category} · {status.label}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-white">位置信息</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">房屋</p>
                  <p className="text-sm text-white font-medium flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-primary-400" />
                    {house?.name || '未知'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">房间</p>
                  <p className="text-sm text-white font-medium flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-secondary-400" />
                    {room?.name || '未知'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-white">设备信息</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    设备ID
                  </p>
                  <p className="text-xs text-white/80 font-mono truncate" title={liveDevice.id}>
                    {liveDevice.id}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    状态
                  </p>
                  <p className={cn(
                    'text-sm font-medium flex items-center gap-1.5',
                    liveDevice.status === 'online' ? 'text-emerald-400' :
                    liveDevice.status === 'fault' ? 'text-rose-400' : 'text-gray-400'
                  )}>
                    {status.icon}
                    {status.label}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    固件版本
                  </p>
                  <p className="text-sm text-white font-medium">{liveDevice.firmware || '-'}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    配对时间
                  </p>
                  <p className="text-sm text-white font-medium">
                    {new Date(liveDevice.pairedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>

            {renderControl()}
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
  const { getRoomsByHouse } = useHouseStore();
  const {
    devices,
    selectedDeviceIds,
    filterCategory,
    filterRoomId,
    searchQuery,
    fetchDevices,
    toggleDevice,
    batchToggle,
    toggleSelect,
    clearSelection,
    setFilter,
    setSearch,
  } = useDeviceStore();

  const [detailDevice, setDetailDevice] = useState<Device | null>(null);
  const [showPairModal, setShowPairModal] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);

  const currentRooms = useMemo(() => {
    if (!currentHouseId) return [];
    return getRoomsByHouse(currentHouseId);
  }, [currentHouseId, getRoomsByHouse]);

  const roomOptions = useMemo(() => {
    return [
      { id: 'all', name: '全部房间' },
      ...currentRooms.map((room) => ({ id: room.id, name: room.name })),
    ];
  }, [currentRooms]);

  useEffect(() => {
    if (filterRoomId !== 'all' && !currentRooms.find((r) => r.id === filterRoomId)) {
      setFilter({ filterRoomId: 'all' as never });
    }
  }, [currentRooms, filterRoomId, setFilter]);

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
              <span className="text-sm">{roomOptions.find((r) => r.id === filterRoomId)?.name || '全部房间'}</span>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', roomDropdownOpen && 'rotate-180')} />
            </button>
            {roomDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRoomDropdownOpen(false)} />
                <div className="absolute top-full mt-2 left-0 right-0 z-20 rounded-xl bg-deepspace-500/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
                  {roomOptions.map((room) => (
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
      />

      {showPairModal && <PairModal onClose={() => setShowPairModal(false)} />}
    </div>
  );
}
