import { useState, useCallback } from 'react';
import {
  Hand,
  Clock,
  MapPin,
  Cpu,
  Timer,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import GradientButton from '@/components/common/GradientButton';
import { useSceneStore } from '@/store/useSceneStore';
import type { Scene, SceneTriggerType, SceneTrigger, SceneTriggerConfig } from '@/types/scene';
import { devices } from '@/mock/devices';

const triggerTypeConfig: Record<
  SceneTriggerType,
  { label: string; icon: LucideIcon; color: string; description: string }
> = {
  manual: {
    label: '手动触发',
    icon: Hand,
    color: '#3B82F6',
    description: '点击场景卡片或语音指令时触发',
  },
  schedule: {
    label: '定时触发',
    icon: Clock,
    color: '#F59E0B',
    description: '按设定的时间定时执行',
  },
  location: {
    label: '位置触发',
    icon: MapPin,
    color: '#10B981',
    description: '到达或离开指定位置时触发',
  },
  device: {
    label: '设备触发',
    icon: Cpu,
    color: '#8B5CF6',
    description: '设备状态满足条件时触发',
  },
  timeRange: {
    label: '时间段触发',
    icon: Timer,
    color: '#EC4899',
    description: '进入指定时间段时触发',
  },
};

export interface SceneTriggerEditorProps {
  scene: Scene;
  className?: string;
}

interface ExpandedTrigger {
  [triggerId: string]: boolean;
}

const SceneTriggerEditor = ({ scene, className }: SceneTriggerEditorProps) => {
  const { addTrigger, updateTrigger, removeTrigger } = useSceneStore();
  const [expanded, setExpanded] = useState<ExpandedTrigger>({});
  const [addingType, setAddingType] = useState<SceneTriggerType | null>(null);

  const toggleExpanded = useCallback((triggerId: string) => {
    setExpanded((prev) => ({ ...prev, [triggerId]: !prev[triggerId] }));
  }, []);

  const handleAddTrigger = useCallback(
    (type: SceneTriggerType) => {
      const config: SceneTriggerConfig = {};
      if (type === 'schedule') config.cronExpression = '0 8 * * *';
      if (type === 'location') config.location = 'arrive';
      if (type === 'device') {
        config.deviceId = devices[0]?.id;
        config.condition = 'power == true';
      }
      addTrigger(scene.id, { type, config });
      setAddingType(null);
    },
    [scene.id, addTrigger]
  );

  const handleUpdateConfig = useCallback(
    (triggerId: string, key: keyof SceneTriggerConfig, value: unknown) => {
      updateTrigger(scene.id, triggerId, {
        config: { ...scene.triggers.find((t) => t.id === triggerId)?.config, [key]: value },
      });
    },
    [scene.id, scene.triggers, updateTrigger]
  );

  const renderTriggerConfig = (trigger: SceneTrigger) => {
    const config = trigger.config;

    switch (trigger.type) {
      case 'manual':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-muted-foreground">
              手动触发无需额外配置，用户可通过点击场景卡片、语音指令或快捷方式执行此场景。
            </p>
          </div>
        );

      case 'schedule':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Cron 表达式
              </label>
              <input
                type="text"
                value={config.cronExpression || ''}
                onChange={(e) => handleUpdateConfig(trigger.id, 'cronExpression', e.target.value)}
                className="w-full glass-input font-mono text-sm"
                placeholder="0 8 * * *"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                格式: 分 时 日 月 周 &nbsp;|&nbsp; 示例: "0 8 * * 1-5" 表示工作日8:00
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '每天8点', value: '0 8 * * *' },
                { label: '工作日7:30', value: '30 7 * * 1-5' },
                { label: '周末9点', value: '0 9 * * 6,7' },
                { label: '每小时', value: '0 * * * *' },
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleUpdateConfig(trigger.id, 'cronExpression', preset.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    config.cronExpression === preset.value
                      ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300'
                      : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-3">
                触发条件
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleUpdateConfig(trigger.id, 'location', 'arrive')}
                  className={cn(
                    'p-4 rounded-xl border transition-all text-left',
                    config.location === 'arrive'
                      ? 'bg-emerald-500/15 border-emerald-500/40 ring-2 ring-emerald-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  )}
                >
                  <MapPin
                    className={cn(
                      'w-6 h-6 mb-2',
                      config.location === 'arrive' ? 'text-emerald-400' : 'text-muted-foreground'
                    )}
                  />
                  <div className="text-sm font-semibold">到达位置</div>
                  <div className="text-xs text-muted-foreground mt-1">回家时触发</div>
                </button>
                <button
                  onClick={() => handleUpdateConfig(trigger.id, 'location', 'leave')}
                  className={cn(
                    'p-4 rounded-xl border transition-all text-left',
                    config.location === 'leave'
                      ? 'bg-orange-500/15 border-orange-500/40 ring-2 ring-orange-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  )}
                >
                  <MapPin
                    className={cn(
                      'w-6 h-6 mb-2',
                      config.location === 'leave' ? 'text-orange-400' : 'text-muted-foreground'
                    )}
                  />
                  <div className="text-sm font-semibold">离开位置</div>
                  <div className="text-xs text-muted-foreground mt-1">离家时触发</div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'device':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                触发设备
              </label>
              <select
                value={config.deviceId || ''}
                onChange={(e) => handleUpdateConfig(trigger.id, 'deviceId', e.target.value)}
                className="w-full glass-input text-sm"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id} className="bg-deepspace-600">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                条件表达式
              </label>
              <input
                type="text"
                value={config.condition || ''}
                onChange={(e) => handleUpdateConfig(trigger.id, 'condition', e.target.value)}
                className="w-full glass-input font-mono text-sm"
                placeholder="power == true && temperature > 28"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                支持的运算符: ==, !=, &gt;, &lt;, &amp;&amp;, ||
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['power == true', 'temperature > 28', 'motion == true', 'battery < 20'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleUpdateConfig(trigger.id, 'condition', c)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        );

      case 'timeRange':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  开始时间
                </label>
                <input
                  type="time"
                  value={(config as unknown as { startTime?: string }).startTime || '08:00'}
                  onChange={(e) =>
                    handleUpdateConfig(trigger.id, 'startTime' as keyof SceneTriggerConfig, e.target.value)
                  }
                  className="w-full glass-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  结束时间
                </label>
                <input
                  type="time"
                  value={(config as unknown as { endTime?: string }).endTime || '22:00'}
                  onChange={(e) =>
                    handleUpdateConfig(trigger.id, 'endTime' as keyof SceneTriggerConfig, e.target.value)
                  }
                  className="w-full glass-input text-sm"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-400 to-secondary-500" />
          触发条件
        </h3>
        <div className="relative">
          <GradientButton
            size="sm"
            variant="ghost"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddingType(addingType ? null : 'manual')}
          >
            添加触发
          </GradientButton>
          {addingType !== null && (
            <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 animate-scale-in">
              {(Object.keys(triggerTypeConfig) as SceneTriggerType[]).map((type) => {
                const cfg = triggerTypeConfig[type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleAddTrigger(type)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all text-left group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${cfg.color}20`,
                        border: `1px solid ${cfg.color}30`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold group-hover:text-white">{cfg.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{cfg.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {scene.triggers.length === 0 ? (
          <GlassCard hover={false} className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Timer className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">暂无触发条件</p>
            <p className="text-xs text-muted-foreground mt-1">点击上方按钮添加触发方式</p>
          </GlassCard>
        ) : (
          scene.triggers.map((trigger) => {
            const cfg = triggerTypeConfig[trigger.type];
            const Icon = cfg.icon;
            const isExpanded = expanded[trigger.id] ?? false;

            return (
              <GlassCard
                key={trigger.id}
                hover={false}
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleExpanded(trigger.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-all text-left"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.color}30 0%, ${cfg.color}10 100%)`,
                      border: `1px solid ${cfg.color}30`,
                      boxShadow: `0 4px 16px ${cfg.color}20`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{cfg.label}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: `${cfg.color}15`,
                          color: cfg.color,
                          border: `1px solid ${cfg.color}25`,
                        }}
                      >
                        已启用
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{cfg.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrigger(scene.id, trigger.id);
                      }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-danger-400 hover:bg-danger-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-4 pb-4">{renderTriggerConfig(trigger)}</div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SceneTriggerEditor;
