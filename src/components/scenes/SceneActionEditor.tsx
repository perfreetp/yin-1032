import { useState, useCallback, useMemo } from 'react';
import {
  Cpu,
  Play,
  Clock,
  Bell,
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import GradientButton from '@/components/common/GradientButton';
import { useSceneStore } from '@/store/useSceneStore';
import { useAppStore } from '@/store/useAppStore';
import { useDeviceStore } from '@/store/useDeviceStore';
import type { Scene, SceneActionType, SceneAction } from '@/types/scene';

const actionTypeConfig: Record<
  SceneActionType,
  { label: string; icon: LucideIcon; color: string; description: string }
> = {
  setDeviceState: {
    label: '设备控制',
    icon: Cpu,
    color: '#3B82F6',
    description: '设置指定设备的状态',
  },
  runScene: {
    label: '执行场景',
    icon: Play,
    color: '#8B5CF6',
    description: '触发执行另一个场景',
  },
  delay: {
    label: '延时等待',
    icon: Clock,
    color: '#F59E0B',
    description: '等待指定时间后继续',
  },
  notify: {
    label: '发送通知',
    icon: Bell,
    color: '#10B981',
    description: '向用户推送通知消息',
  },
};

export interface SceneActionEditorProps {
  scene: Scene;
  className?: string;
}

interface DragState {
  isDragging: boolean;
  dragIndex: number | null;
  overIndex: number | null;
}

const SceneActionEditor = ({ scene, className }: SceneActionEditorProps) => {
  const { addAction, updateAction, removeAction, reorderActions, scenes } = useSceneStore();
  const currentHouseId = useAppStore((state) => state.currentHouseId);
  const { devices } = useDeviceStore();

  const currentDevices = useMemo(
    () => devices.filter((d) => d.houseId === currentHouseId),
    [devices, currentHouseId]
  );

  const currentScenes = useMemo(
    () => scenes.filter((s) => s.houseId === currentHouseId && s.id !== scene.id),
    [scenes, currentHouseId, scene.id]
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragIndex: null,
    overIndex: null,
  });

  const sortedActions = [...scene.actions].sort((a, b) => a.order - b.order);

  const toggleExpanded = useCallback((actionId: string) => {
    setExpanded((prev) => ({ ...prev, [actionId]: !prev[actionId] }));
  }, []);

  const handleAddAction = useCallback(
    (type: SceneActionType) => {
      const nextOrder = sortedActions.length + 1;
      const baseAction: Omit<SceneAction, 'id'> = {
        type,
        order: nextOrder,
        target: {},
        state: {},
      };

      if (type === 'setDeviceState') {
        baseAction.target = { deviceId: currentDevices[0]?.id };
        baseAction.state = { power: true };
      } else if (type === 'delay') {
        baseAction.delayMs = 5000;
      } else if (type === 'notify') {
        baseAction.state = { message: '场景执行通知' } as unknown as SceneAction['state'];
      } else if (type === 'runScene') {
        baseAction.target = { sceneId: scene.id };
      }

      addAction(scene.id, baseAction);
      setShowAddMenu(false);
    },
    [scene.id, addAction, sortedActions.length]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      setDragState({ isDragging: true, dragIndex: index, overIndex: index });
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragState.overIndex !== index) {
        setDragState((prev) => ({ ...prev, overIndex: index }));
      }
    },
    [dragState.overIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (dragState.dragIndex === null || dragState.overIndex === null) return;
      if (dragState.dragIndex === dragState.overIndex) {
        setDragState({ isDragging: false, dragIndex: null, overIndex: null });
        return;
      }

      const newOrder = [...sortedActions];
      const [removed] = newOrder.splice(dragState.dragIndex, 1);
      newOrder.splice(dragState.overIndex, 0, removed);
      const ids = newOrder.map((a) => a.id);
      reorderActions(scene.id, ids);

      setDragState({ isDragging: false, dragIndex: null, overIndex: null });
    },
    [scene.id, reorderActions, sortedActions, dragState.dragIndex, dragState.overIndex]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ isDragging: false, dragIndex: null, overIndex: null });
  }, []);

  const getActionSummary = (action: SceneAction): string => {
    switch (action.type) {
      case 'setDeviceState': {
        const device = currentDevices.find((d) => d.id === action.target.deviceId);
        const stateStr = Object.entries(action.state || {})
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(', ');
        return `${device?.name || action.target.deviceId || '未指定'}: ${stateStr || '无状态'}`;
      }
      case 'delay':
        return `等待 ${((action.delayMs || 0) / 1000).toFixed(1)} 秒`;
      case 'notify':
        return ((action.state as Record<string, unknown>)?.message as string) || '未设置消息';
      case 'runScene':
        return `执行场景: ${action.target.sceneId || '未指定'}`;
      default:
        return '';
    }
  };

  const renderActionConfig = (action: SceneAction) => {
    switch (action.type) {
      case 'setDeviceState':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                目标设备
              </label>
              <select
                value={action.target.deviceId || ''}
                onChange={(e) =>
                  updateAction(scene.id, action.id, {
                    target: { ...action.target, deviceId: e.target.value },
                  })
                }
                className="w-full glass-input text-sm"
              >
                {currentDevices.map((d) => (
                  <option key={d.id} value={d.id} className="bg-deepspace-600">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                目标状态 (JSON)
              </label>
              <textarea
                value={JSON.stringify(action.state || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateAction(scene.id, action.id, { state: parsed });
                  } catch {
                    // ignore parse errors while typing
                  }
                }}
                className="w-full glass-input font-mono text-xs min-h-[100px] resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                前置延时 (毫秒)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={action.delayMs || 0}
                onChange={(e) =>
                  updateAction(scene.id, action.id, { delayMs: Number(e.target.value) })
                }
                className="w-full glass-input text-sm"
              />
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                延时时间
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={((action.delayMs || 0) / 1000).toFixed(1)}
                  onChange={(e) =>
                    updateAction(scene.id, action.id, {
                      delayMs: Math.round(Number(e.target.value) * 1000),
                    })
                  }
                  className="flex-1 glass-input text-sm"
                />
                <span className="text-sm text-muted-foreground">秒</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '1秒', value: 1000 },
                { label: '5秒', value: 5000 },
                { label: '30秒', value: 30000 },
                { label: '1分钟', value: 60000 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => updateAction(scene.id, action.id, { delayMs: preset.value })}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    action.delayMs === preset.value
                      ? 'bg-warning-500/20 border border-warning-500/40 text-warning-300'
                      : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'notify': {
        const notifyState = action.state as Record<string, unknown>;
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                通知内容
              </label>
              <textarea
                value={(notifyState?.message as string) || ''}
                onChange={(e) =>
                  updateAction(scene.id, action.id, {
                    state: { ...notifyState, message: e.target.value } as SceneAction['state'],
                  })
                }
                className="w-full glass-input text-sm min-h-[80px] resize-y"
                placeholder="输入通知消息..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                '欢迎回家，主人！',
                '场景已执行完成',
                '检测到异常，请查看',
                '设备状态已更新',
              ].map((msg) => (
                <button
                  key={msg}
                  onClick={() =>
                    updateAction(scene.id, action.id, {
                      state: { ...notifyState, message: msg } as SceneAction['state'],
                    })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white transition-all truncate max-w-[200px]"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'runScene':
        return (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                目标场景
              </label>
              <select
                value={action.target.sceneId || ''}
                onChange={(e) =>
                  updateAction(scene.id, action.id, {
                    target: { ...action.target, sceneId: e.target.value },
                  })
                }
                className="w-full glass-input text-sm"
              >
                <option value="" className="bg-deepspace-600">
                  请选择场景
                </option>
                {currentScenes.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    className="bg-deepspace-600"
                  >
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                前置延时 (毫秒)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={action.delayMs || 0}
                onChange={(e) =>
                  updateAction(scene.id, action.id, { delayMs: Number(e.target.value) })
                }
                className="w-full glass-input text-sm"
              />
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
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-warning-400 to-danger-500" />
          执行动作
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/15 border border-primary-500/25 text-primary-300">
            {sortedActions.length} 步
          </span>
        </h3>
        <div className="relative">
          <GradientButton
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            添加动作
          </GradientButton>
          {showAddMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 animate-scale-in">
              {(Object.keys(actionTypeConfig) as SceneActionType[]).map((type) => {
                const cfg = actionTypeConfig[type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleAddAction(type)}
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
                      <div className="text-sm font-semibold group-hover:text-white">
                        {cfg.label}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{cfg.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {sortedActions.length === 0 ? (
          <GlassCard hover={false} className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">暂无执行动作</p>
            <p className="text-xs text-muted-foreground mt-1">点击上方按钮添加场景动作</p>
          </GlassCard>
        ) : (
          sortedActions.map((action, index) => {
            const cfg = actionTypeConfig[action.type];
            const Icon = cfg.icon;
            const isExpanded = expanded[action.id] ?? false;
            const isDragging = dragState.isDragging && dragState.dragIndex === index;
            const isOver = dragState.isDragging && dragState.overIndex === index;
            const isAbove =
              dragState.isDragging &&
              dragState.overIndex !== null &&
              dragState.dragIndex !== null &&
              dragState.overIndex < dragState.dragIndex &&
              index === dragState.overIndex;
            const isBelow =
              dragState.isDragging &&
              dragState.overIndex !== null &&
              dragState.dragIndex !== null &&
              dragState.overIndex > dragState.dragIndex &&
              index === dragState.overIndex;

            return (
              <div key={action.id}>
                {isAbove && (
                  <div className="h-1 rounded-full bg-primary-400 mx-2 mb-1 animate-pulse" />
                )}
                <GlassCard
                  hover={false}
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isDragging && 'opacity-50 scale-[0.98] rotate-[0.5deg]',
                    isOver && !isDragging && 'ring-2 ring-primary-500/50'
                  )}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className={cn(
                      'p-4 flex items-center gap-4 hover:bg-white/5 transition-all cursor-grab active:cursor-grabbing',
                      isExpanded && 'bg-white/5'
                    )}
                    onClick={() => toggleExpanded(action.id)}
                  >
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm font-orbitron bg-gradient-to-br from-primary-500/30 to-secondary-500/30 border border-primary-500/30 text-primary-200">
                        {action.order}
                      </span>
                      <GripVertical className="w-4 h-4 text-muted-foreground/60" />
                    </div>

                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
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
                        {action.delayMs && action.delayMs > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-warning-500/15 border border-warning-500/25 text-warning-300 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {(action.delayMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {getActionSummary(action)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAction(scene.id, action.id);
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
                  </div>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="px-4 pb-4 pt-1">{renderActionConfig(action)}</div>
                  </div>
                </GlassCard>
                {isBelow && (
                  <div className="h-1 rounded-full bg-primary-400 mx-2 mt-1 animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SceneActionEditor;
