import {
  Thermometer,
  Droplets,
  Wind,
  CloudFog,
  Sun,
  AlertTriangle,
  Droplet,
  DoorOpen,
  DoorClosed,
  ScanEye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Device, SensorReading } from '@/types/device';
import GlassCard from '@/components/common/GlassCard';

interface SensorReadingsProps {
  device: Device;
  className?: string;
}

interface ReadingConfig {
  key: keyof SensorReading;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  unit?: string;
  color: string;
  getStatus?: (value: number | boolean | string) => { text: string; color: string };
}

const readingConfigs: ReadingConfig[] = [
  {
    key: 'temperature',
    label: '温度',
    Icon: Thermometer,
    unit: '°C',
    color: '#f97316',
    getStatus: (value) => {
      const v = value as number;
      if (v < 18) return { text: '偏冷', color: '#3b82f6' };
      if (v > 28) return { text: '偏热', color: '#ef4444' };
      return { text: '舒适', color: '#10b981' };
    },
  },
  {
    key: 'humidity',
    label: '湿度',
    Icon: Droplets,
    unit: '%',
    color: '#3b82f6',
    getStatus: (value) => {
      const v = value as number;
      if (v < 30) return { text: '干燥', color: '#f97316' };
      if (v > 70) return { text: '潮湿', color: '#6366f1' };
      return { text: '适宜', color: '#10b981' };
    },
  },
  {
    key: 'pm25',
    label: 'PM2.5',
    Icon: Wind,
    unit: 'μg/m³',
    color: '#8b5cf6',
    getStatus: (value) => {
      const v = value as number;
      if (v < 35) return { text: '优', color: '#10b981' };
      if (v < 75) return { text: '良', color: '#f59e0b' };
      return { text: '污染', color: '#ef4444' };
    },
  },
  {
    key: 'co2',
    label: 'CO₂',
    Icon: CloudFog,
    unit: 'ppm',
    color: '#f59e0b',
    getStatus: (value) => {
      const v = value as number;
      if (v < 800) return { text: '清新', color: '#10b981' };
      if (v < 1500) return { text: '一般', color: '#f59e0b' };
      return { text: '超标', color: '#ef4444' };
    },
  },
  {
    key: 'illumination',
    label: '照度',
    Icon: Sun,
    unit: 'lux',
    color: '#eab308',
    getStatus: (value) => {
      const v = value as number;
      if (v < 100) return { text: '昏暗', color: '#6b7280' };
      if (v < 500) return { text: '适中', color: '#10b981' };
      return { text: '明亮', color: '#eab308' };
    },
  },
  {
    key: 'smoke',
    label: '烟雾',
    Icon: AlertTriangle,
    color: '#ef4444',
    getStatus: (value) => {
      return value === true
        ? { text: '报警', color: '#ef4444' }
        : { text: '正常', color: '#10b981' };
    },
  },
  {
    key: 'waterLeak',
    label: '水浸',
    Icon: Droplet,
    color: '#3b82f6',
    getStatus: (value) => {
      return value === true
        ? { text: '漏水', color: '#ef4444' }
        : { text: '正常', color: '#10b981' };
    },
  },
  {
    key: 'doorContact',
    label: '门磁',
    Icon: DoorOpen,
    color: '#6366f1',
    getStatus: (value) => {
      return value === 'open'
        ? { text: '已打开', color: '#f59e0b' }
        : { text: '已关闭', color: '#10b981' };
    },
  },
  {
    key: 'motion',
    label: '人体感应',
    Icon: ScanEye,
    color: '#ec4899',
    getStatus: (value) => {
      return value === true
        ? { text: '有人', color: '#ec4899' }
        : { text: '无人', color: '#6b7280' };
    },
  },
];

const SensorReadings = ({ device, className }: SensorReadingsProps) => {
  const state = device.state as SensorReading;

  const availableReadings = readingConfigs.filter((config) => {
    const value = state[config.key];
    return value !== undefined && value !== null;
  });

  const renderReadingCard = (config: ReadingConfig) => {
    const value = state[config.key];
    const status = config.getStatus ? config.getStatus(value as never) : null;

    const isBoolean = typeof value === 'boolean';
    const isString = typeof value === 'string';

    let displayValue: string;
    if (isBoolean) {
      displayValue = value ? '是' : '否';
    } else if (isString) {
      displayValue = value === 'open' ? '打开' : '关闭';
    } else {
      displayValue = `${value}${config.unit || ''}`;
    }

    const Icon = config.key === 'doorContact'
      ? (value === 'open' ? DoorOpen : DoorClosed)
      : config.Icon;

    return (
      <div
        key={config.key}
        className="p-4 rounded-xl glass transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${config.color}20`,
              boxShadow: `0 0 15px ${config.color}22`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          {status && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${status.color}20`,
                color: status.color,
              }}
            >
              {status.text}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{config.label}</p>
        <p
          className="text-2xl font-bold font-orbitron"
          style={{ color: config.color, textShadow: `0 0 10px ${config.color}44` }}
        >
          {displayValue}
        </p>
      </div>
    );
  };

  return (
    <GlassCard className={cn('p-5 md:p-6', className)} hover={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center glass shadow-glow-primary">
              <ScanEye
                className="w-7 h-7 text-primary-400 scale-110"
                style={{ filter: 'drop-shadow(0 0 8px rgba(22,119,255,0.6))' }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                {availableReadings.length} 项指标监测中
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'grid gap-3',
            availableReadings.length <= 2
              ? 'grid-cols-2'
              : availableReadings.length <= 4
                ? 'grid-cols-2'
                : 'grid-cols-2 md:grid-cols-3'
          )}
        >
          {availableReadings.map(renderReadingCard)}
        </div>

        <div className="p-4 rounded-xl glass">
          <p className="text-xs text-muted-foreground mb-2">设备状态</p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                device.status === 'online'
                  ? 'bg-emerald-500'
                  : device.status === 'fault'
                    ? 'bg-rose-500'
                    : 'bg-gray-500'
              )}
            />
            <span className="text-sm text-white">
              {device.status === 'online'
                ? '在线监测中'
                : device.status === 'fault'
                  ? '设备故障'
                  : '离线'}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SensorReadings;
