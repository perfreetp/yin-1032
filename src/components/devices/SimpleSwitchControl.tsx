import { Tv, Volume2, Power, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeviceStore } from '@/store/useDeviceStore';
import type { Device } from '@/types/device';
import GlassCard from '@/components/common/GlassCard';
import DeviceToggle from './DeviceToggle';

interface SimpleSwitchControlProps {
  device: Device;
  className?: string;
}

interface DeviceStateWithPower {
  power: boolean;
  volume?: number;
}

const SimpleSwitchControl = ({ device, className }: SimpleSwitchControlProps) => {
  const state = device.state as DeviceStateWithPower;
  const updateDeviceState = useDeviceStore((s) => s.updateDeviceState);
  const toggleDevice = useDeviceStore((s) => s.toggleDevice);

  const hasVolume = 'volume' in state;
  const volume = state.volume ?? 50;

  const categoryConfig = {
    tv: {
      icon: Tv,
      color: '#6366f1',
      label: '电视',
    },
    speaker: {
      icon: Volume2,
      color: '#10b981',
      label: '音箱',
    },
  };

  const config = categoryConfig[device.category as keyof typeof categoryConfig] || {
    icon: Power,
    color: '#6b7280',
    label: '设备',
  };

  const Icon = config.icon;

  const handleVolumeChange = (delta: number) => {
    const newVolume = Math.min(100, Math.max(0, volume + delta));
    updateDeviceState(device.id, { volume: newVolume } as Partial<DeviceStateWithPower>);
  };

  return (
    <GlassCard className={cn('p-5 md:p-6', className)} hover={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'relative w-14 h-14 rounded-2xl flex items-center justify-center glass transition-all duration-500',
                state.power && 'shadow-glow-primary'
              )}
              style={{
                boxShadow: state.power
                  ? `0 0 30px ${config.color}44, inset 0 0 20px ${config.color}22`
                  : undefined,
              }}
            >
              <Icon
                className={cn(
                  'w-7 h-7 transition-all duration-500',
                  state.power ? 'scale-110' : 'opacity-40'
                )}
                style={{
                  color: state.power ? config.color : '#6b7280',
                  filter: state.power ? `drop-shadow(0 0 8px ${config.color}88)` : undefined,
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                {state.power ? '运行中' : '已关闭'}
              </p>
            </div>
          </div>
          <DeviceToggle
            checked={state.power}
            onChange={() => toggleDevice(device.id)}
            size="lg"
          />
        </div>

        <div
          className={cn(
            'relative rounded-2xl p-6 md:p-8 overflow-hidden glass transition-all duration-500',
            state.power ? 'ring-1 ring-white/10' : 'opacity-60'
          )}
          style={{
            background: state.power
              ? `radial-gradient(circle at 50% 30%, ${config.color}15 0%, transparent 60%)`
              : undefined,
          }}
        >
          <div className="relative flex flex-col items-center justify-center py-4">
            {device.category === 'tv' ? (
              <div
                className={cn(
                  'relative w-48 h-28 md:w-56 md:h-32 rounded-xl border-4 transition-all duration-500',
                  state.power ? 'border-primary-400/40' : 'border-gray-700'
                )}
                style={{
                  boxShadow: state.power
                    ? `0 0 30px ${config.color}44, inset 0 0 20px ${config.color}22`
                    : undefined,
                }}
              >
                {state.power ? (
                  <div className="absolute inset-1 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-deepspace-800 to-deepspace-900" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Tv className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-primary-400 animate-pulse" />
                        <p className="text-xs text-primary-300">HDMI 1</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-gray-600">待机中</p>
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-gray-700" />
              </div>
            ) : (
              <div
                className={cn(
                  'relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-500',
                  state.power && 'animate-pulse-slow'
                )}
                style={{
                  background: state.power
                    ? `conic-gradient(from 0deg, ${config.color}44, ${config.color}11, ${config.color}44)`
                    : undefined,
                  boxShadow: state.power
                    ? `0 0 40px ${config.color}44, inset 0 0 30px ${config.color}22`
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-3 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(10,25,41,0.9), rgba(6,18,31,0.95))',
                  }}
                >
                  <Volume2
                    className={cn(
                      'w-12 h-12 md:w-16 md:h-16 transition-all duration-500',
                      state.power ? 'scale-110' : 'opacity-30'
                    )}
                    style={{
                      color: state.power ? config.color : '#4b5563',
                      filter: state.power ? `drop-shadow(0 0 12px ${config.color}88)` : undefined,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {hasVolume && (
          <div
            className={cn(
              'p-4 rounded-xl glass space-y-3',
              !state.power && 'opacity-50 pointer-events-none'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">音量</span>
              </div>
              <span
                className="text-sm font-bold font-orbitron"
                style={{ color: config.color }}
              >
                {volume}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVolumeChange(-5)}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Minus className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex-1 relative h-2 rounded-full bg-deepspace-700 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${volume}%`,
                    background: `linear-gradient(90deg, ${config.color}66, ${config.color})`,
                    boxShadow: `0 0 10px ${config.color}88`,
                  }}
                />
              </div>
              <button
                onClick={() => handleVolumeChange(5)}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl glass">
            <p className="text-xs text-muted-foreground mb-1">设备类型</p>
            <p className="text-sm font-medium text-white capitalize">{config.label}</p>
          </div>
          <div className="p-3 rounded-xl glass">
            <p className="text-xs text-muted-foreground mb-1">状态</p>
            <p className={cn(
              'text-sm font-medium',
              state.power ? 'text-emerald-400' : 'text-gray-500'
            )}>
              {state.power ? '运行中' : '已关闭'}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SimpleSwitchControl;
