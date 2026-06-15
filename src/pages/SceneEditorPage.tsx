import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Home,
  LogOut,
  Moon,
  Sun,
  Film,
  BookOpen,
  Utensils,
  Users,
  ShieldCheck,
  AlarmClock,
  Bed,
  TreePalm,
  Zap,
  Sparkles,
  Clock,
  Cpu,
  CalendarDays,
  MapPin,
  AlertCircle,
  Check,
  X,
  Palette,
  Lightbulb,
  Music,
  Fan,
  Tv2,
  Wifi,
  Layers,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import GradientButton from '@/components/common/GradientButton';
import SceneTriggerEditor from '@/components/scenes/SceneTriggerEditor';
import SceneActionEditor from '@/components/scenes/SceneActionEditor';
import { useSceneStore } from '@/store/useSceneStore';
import { useAppStore } from '@/store/useAppStore';
import { useDeviceStore } from '@/store/useDeviceStore';
import { cn } from '@/lib/utils';
import type { Scene } from '@/types/scene';

const iconOptions: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'home', label: '家', Icon: Home },
  { key: 'log-out', label: '离家', Icon: LogOut },
  { key: 'moon', label: '月亮', Icon: Moon },
  { key: 'sunrise', label: '太阳', Icon: Sun },
  { key: 'film', label: '影院', Icon: Film },
  { key: 'book-open', label: '阅读', Icon: BookOpen },
  { key: 'utensils', label: '用餐', Icon: Utensils },
  { key: 'users', label: '会客', Icon: Users },
  { key: 'shield-check', label: '安防', Icon: ShieldCheck },
  { key: 'alarm-clock', label: '闹钟', Icon: AlarmClock },
  { key: 'bed', label: '睡眠', Icon: Bed },
  { key: 'palm-tree', label: '度假', Icon: TreePalm },
  { key: 'zap', label: '闪电', Icon: Zap },
  { key: 'sparkles', label: '魔法', Icon: Sparkles },
  { key: 'lightbulb', label: '灯泡', Icon: Lightbulb },
  { key: 'music', label: '音乐', Icon: Music },
  { key: 'fan', label: '风扇', Icon: Fan },
  { key: 'tv-2', label: '电视', Icon: Tv2 },
  { key: 'wifi', label: '网络', Icon: Wifi },
];

const colorOptions: { key: string; value: string }[] = [
  { key: 'blue', value: '#3B82F6' },
  { key: 'indigo', value: '#6366F1' },
  { key: 'violet', value: '#8B5CF6' },
  { key: 'purple', value: '#A855F7' },
  { key: 'pink', value: '#EC4899' },
  { key: 'rose', value: '#EF4444' },
  { key: 'red', value: '#DC2626' },
  { key: 'orange', value: '#F97316' },
  { key: 'amber', value: '#F59E0B' },
  { key: 'yellow', value: '#EAB308' },
  { key: 'lime', value: '#84CC16' },
  { key: 'green', value: '#10B981' },
  { key: 'emerald', value: '#14B8A6' },
  { key: 'teal', value: '#14B8A6' },
  { key: 'cyan', value: '#06B6D4' },
  { key: 'sky', value: '#0EA5E9' },
];

const triggerIconMap: Record<string, React.ReactNode> = {
  manual: <Sparkles className="w-3 h-3" />,
  schedule: <CalendarDays className="w-3 h-3" />,
  location: <MapPin className="w-3 h-3" />,
  device: <Cpu className="w-3 h-3" />,
  timeRange: <Clock className="w-3 h-3" />,
};

const triggerLabels: Record<string, string> = {
  manual: '手动触发',
  schedule: '定时触发',
  location: '位置触发',
  device: '设备触发',
  timeRange: '时段触发',
};

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  'log-out': LogOut,
  moon: Moon,
  sunrise: Sun,
  film: Film,
  'book-open': BookOpen,
  utensils: Utensils,
  users: Users,
  'shield-check': ShieldCheck,
  'alarm-clock': AlarmClock,
  bed: Bed,
  'palm-tree': TreePalm,
  zap: Zap,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  music: Music,
  fan: Fan,
  'tv-2': Tv2,
  wifi: Wifi,
};

function formatTimeAgo(timestamp?: number): string {
  if (!timestamp) return '从未执行';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}

export default function SceneEditorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sceneId = searchParams.get('id');
  const isEditMode = !!sceneId;
  const currentHouseId = useAppStore((state) => state.currentHouseId);

  const {
    scenes,
    createScene,
    updateScene,
    fetchScenes,
    setEditingScene,
    editingScene,
  } = useSceneStore();

  const [sceneName, setSceneName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('sparkles');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [enabled, setEnabled] = useState(true);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; triggers?: string; actions?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const editInitializedRef = useRef(false);
  const createInitializedRef = useRef(false);
  const editingSceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    editingSceneRef.current = editingScene;
  }, [editingScene]);

  useEffect(() => {
    if (currentHouseId) {
      fetchScenes(currentHouseId);
    }
  }, [currentHouseId, fetchScenes]);

  useEffect(() => {
    if (!isEditMode || !sceneId || scenes.length === 0) return;
    if (editInitializedRef.current && editingSceneRef.current) return;

    const existingScene = scenes.find((s) => s.id === sceneId);
    if (existingScene) {
      setSceneName(existingScene.name);
      setSelectedIcon(existingScene.icon);
      setSelectedColor(existingScene.color);
      setEnabled(existingScene.enabled);
      setEditingScene(existingScene);
      editInitializedRef.current = true;
    }
  }, [isEditMode, sceneId, scenes, setEditingScene]);

  useEffect(() => {
    if (isEditMode || !currentHouseId) return;
    if (createInitializedRef.current || editingSceneRef.current) return;

    const newScene: Scene = {
      id: `scene-temp-${Date.now()}`,
      name: '',
      icon: 'sparkles',
      color: '#3B82F6',
      houseId: currentHouseId,
      enabled: true,
      triggers: [],
      actions: [],
      createdAt: Date.now(),
    };
    setEditingScene(newScene);
    createInitializedRef.current = true;
  }, [isEditMode, currentHouseId, setEditingScene]);

  const currentScene = useMemo(() => {
    if (!editingScene) return null;
    return {
      ...editingScene,
      name: sceneName,
      icon: selectedIcon,
      color: selectedColor,
      enabled,
    };
  }, [editingScene, sceneName, selectedIcon, selectedColor, enabled]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!sceneName.trim()) {
      newErrors.name = '请输入场景名称';
    } else if (sceneName.trim().length > 20) {
      newErrors.name = '场景名称不能超过20个字符';
    }

    if (!currentScene || currentScene.triggers.length === 0) {
      newErrors.triggers = '请至少添加一个触发条件';
    }

    if (!currentScene || currentScene.actions.length === 0) {
      newErrors.actions = '请至少添加一个执行动作';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !currentScene || !editingScene) return;

    setIsSaving(true);

    try {
      if (isEditMode) {
        updateScene(sceneId!, {
          name: sceneName.trim(),
          icon: selectedIcon,
          color: selectedColor,
          enabled,
          triggers: editingScene.triggers,
          actions: editingScene.actions,
        });
      } else {
        createScene({
          name: sceneName.trim(),
          icon: selectedIcon,
          color: selectedColor,
          houseId: currentHouseId,
          enabled,
          triggers: editingScene.triggers,
          actions: editingScene.actions,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/scenes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/scenes');
  };

  const SelectedIconComponent = iconMap[selectedIcon] || Sparkles;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col animate-fade-in">
      <GlassCard hover={false} className="p-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleCancel}
            className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-px h-10 bg-white/10 shrink-0 hidden sm:block" />

          <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setShowIconPicker(!showIconPicker);
                  setShowColorPicker(false);
                }}
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105',
                  showIconPicker && 'ring-2 ring-primary-500 ring-offset-2 ring-offset-deepspace-500'
                )}
                style={{
                  background: `linear-gradient(135deg, ${selectedColor}44 0%, ${selectedColor}15 100%)`,
                  border: `1px solid ${selectedColor}40`,
                  boxShadow: `0 4px 20px ${selectedColor}30`,
                }}
              >
                <SelectedIconComponent
                  className="w-7 h-7"
                  style={{ color: selectedColor, filter: `drop-shadow(0 0 8px ${selectedColor}80)` }}
                />
              </button>

              {showIconPicker && (
                <div className="absolute left-0 top-full mt-2 z-50 w-80 p-3 rounded-2xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">选择图标</span>
                    <button
                      onClick={() => setShowIconPicker(false)}
                      className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                    {iconOptions.map(({ key, label, Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedIcon(key);
                          setShowIconPicker(false);
                        }}
                        className={cn(
                          'w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all',
                          selectedIcon === key
                            ? 'bg-primary-500/20 border border-primary-500/40 ring-2 ring-primary-500/20'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                        )}
                        title={label}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            selectedIcon === key ? 'text-primary-400' : 'text-muted-foreground'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowIconPicker(false);
                }}
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105 bg-white/5 border border-white/10',
                  showColorPicker && 'ring-2 ring-primary-500 ring-offset-2 ring-offset-deepspace-500'
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${selectedColor} 0%, ${selectedColor}88 100%)`,
                      boxShadow: `0 2px 10px ${selectedColor}50`,
                    }}
                  />
                  <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </button>

              {showColorPicker && (
                <div className="absolute left-0 top-full mt-2 z-50 w-72 p-3 rounded-2xl bg-deepspace-600/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">选择颜色</span>
                    <button
                      onClick={() => setShowColorPicker(false)}
                      className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {colorOptions.map(({ key, value }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedColor(value);
                          setShowColorPicker(false);
                        }}
                        className={cn(
                          'w-9 h-9 rounded-xl transition-all hover:scale-110',
                          selectedColor === value
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-deepspace-600 scale-110'
                            : ''
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${value} 0%, ${value}cc 100%)`,
                          boxShadow: `0 2px 10px ${value}40`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">场景名称</label>
              <div className="relative">
                <input
                  type="text"
                  value={sceneName}
                  onChange={(e) => {
                    setSceneName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder={isEditMode ? '修改场景名称...' : '输入场景名称，如：回家模式'}
                  className={cn(
                    'w-full glass-input text-base font-semibold pr-10',
                    errors.name && 'border-danger-500/50 focus:ring-danger-500/20'
                  )}
                  maxLength={20}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {sceneName.length}/20
                </div>
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-danger-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>
          </div>

          <GradientButton
            variant="primary"
            size="lg"
            icon={<Save className="w-5 h-5" />}
            onClick={handleSave}
            loading={isSaving}
            className="shrink-0"
          >
            {isEditMode ? '保存修改' : '创建场景'}
          </GradientButton>
        </div>
      </GlassCard>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 min-h-0">
        <GlassCard hover={false} className="p-5 flex flex-col min-h-0 overflow-hidden">
          {errors.triggers && (
            <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/30 flex items-center gap-2 text-danger-400 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.triggers}
            </div>
          )}
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1">
            {currentScene && <SceneTriggerEditor scene={currentScene} />}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5 flex flex-col min-h-0 overflow-hidden">
          {errors.actions && (
            <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/30 flex items-center gap-2 text-danger-400 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.actions}
            </div>
          )}
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-1">
            {currentScene && <SceneActionEditor scene={currentScene} />}
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-5 flex-shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center gap-6">
          <div className="flex-1 max-w-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              场景预览
            </h4>
            {currentScene && (
              <div className="transform scale-[0.92] origin-top-left">
                <PreviewSceneCard scene={currentScene} />
              </div>
            )}
          </div>

          <div className="w-px h-px xl:w-px xl:h-32 bg-white/10 shrink-0" />

          <div className="flex-1 space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <h5 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-warning-400" />
                  启用场景
                </h5>
                <p className="text-xs text-muted-foreground mt-1">
                  开启后场景将根据触发条件自动执行
                </p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={cn(
                  'relative w-14 h-7 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deepspace-500',
                  enabled
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 shadow-glow-primary'
                    : 'bg-white/10 border border-white/10'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg',
                    'transition-all duration-300 ease-out',
                    enabled ? 'left-[29px]' : 'left-0.5'
                  )}
                />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-orbitron font-bold text-primary-400">
                  {currentScene?.triggers.length || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">触发条件</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-orbitron font-bold text-warning-400">
                  {currentScene?.actions.length || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">执行动作</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-orbitron font-bold text-emerald-400">
                  {enabled ? (
                    <Check className="w-6 h-6 mx-auto" />
                  ) : (
                    <X className="w-6 h-6 mx-auto" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {enabled ? '已启用' : '已停用'}
                </div>
              </div>
            </div>
          </div>

          <div className="w-px h-px xl:w-px xl:h-32 bg-white/10 shrink-0" />

          <div className="flex xl:flex-col gap-3 shrink-0">
            <GradientButton
              variant="ghost"
              size="lg"
              icon={<X className="w-5 h-5" />}
              onClick={handleCancel}
              className="flex-1 xl:w-full"
            >
              取消
            </GradientButton>
            <GradientButton
              variant="primary"
              size="lg"
              icon={isSaving ? undefined : <Save className="w-5 h-5" />}
              onClick={handleSave}
              loading={isSaving}
              className="flex-1 xl:w-full"
            >
              {isEditMode ? '保存修改' : '创建场景'}
            </GradientButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function PreviewSceneCard({ scene }: { scene: Scene }) {
  const Icon = iconMap[scene.icon] || Sparkles;
  const { devices } = useDeviceStore();
  const [showDevices, setShowDevices] = useState(false);

  const deviceStats = useMemo(() => {
    const deviceIds = new Set<string>();
    const roomIds = new Set<string>();
    const affectedDevices: Array<{ id: string; name: string; roomId: string }> = [];

    scene.actions.forEach((action) => {
      if (action.target.deviceId) {
        const device = devices.find((d) => d.id === action.target.deviceId);
        if (device) {
          deviceIds.add(device.id);
          roomIds.add(device.roomId);
          affectedDevices.push({
            id: device.id,
            name: device.name,
            roomId: device.roomId,
          });
        }
      }
    });

    return {
      deviceCount: deviceIds.size,
      roomCount: roomIds.size,
      affectedDevices,
    };
  }, [scene.actions, devices]);

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-[rgba(10,25,41,0.75)] backdrop-blur-xl border border-[rgba(22,119,255,0.15)]',
        !scene.enabled && 'opacity-60'
      )}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${scene.color}15 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${scene.color}40 0%, ${scene.color}15 100%)`,
              boxShadow: `0 8px 32px ${scene.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
              border: `1px solid ${scene.color}40`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-50"
              style={{ background: scene.color }}
            />
            <Icon
              className="w-8 h-8 relative z-10"
              style={{ color: scene.color, filter: `drop-shadow(0 0 8px ${scene.color}80)` }}
            />
          </div>

          <div
            className={cn(
              'relative w-14 h-7 rounded-full',
              scene.enabled
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                : 'bg-white/10 border border-white/10'
            )}
            style={{
              boxShadow: scene.enabled ? `0 0 20px ${scene.color}50` : undefined,
            }}
          >
            <div
              className={cn(
                'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg',
                scene.enabled ? 'left-[29px]' : 'left-0.5'
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3
            className="text-lg font-bold tracking-wide truncate"
            style={{ textShadow: `0 0 20px ${scene.color}40` }}
          >
            {scene.name || '未命名场景'}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(scene.lastRunAt)}
          </p>
        </div>

        <div className="flex items-center gap-4 py-2 border-t border-b border-white/5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="w-4 h-4 text-primary-400" />
            <span>
              <span className="text-white font-semibold">{scene.actions.length}</span> 个动作
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-warning-400" />
            <span>
              <span className="text-white font-semibold">{scene.triggers.length}</span> 个触发
            </span>
          </div>
        </div>

        {deviceStats.deviceCount > 0 && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDevices(!showDevices);
              }}
              className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-white transition-colors py-2"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary-400" />
                <span>
                  控制 <span className="text-white font-semibold">{deviceStats.roomCount}</span> 个房间，
                  <span className="text-white font-semibold"> {deviceStats.deviceCount}</span> 台设备
                </span>
              </div>
              {showDevices ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showDevices && (
              <div className="mt-2 space-y-1 animate-fade-in">
                {deviceStats.affectedDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5 rounded-lg bg-white/5"
                  >
                    <Cpu className="w-3 h-3 text-warning-400" />
                    <span className="truncate">{device.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {scene.triggers.length > 0 ? (
            scene.triggers.slice(0, 3).map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
              >
                {triggerIconMap[t.type]}
                {triggerLabels[t.type]}
              </span>
            ))
          ) : (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">
              暂无触发条件
            </span>
          )}
          {scene.triggers.length > 3 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
              +{scene.triggers.length - 3}
            </span>
          )}
        </div>

        <button
          disabled
          className={cn(
            'relative w-full h-11 rounded-xl font-semibold text-sm',
            'flex items-center justify-center gap-2',
            'opacity-80'
          )}
          style={{
            background: `linear-gradient(135deg, ${scene.color} 0%, ${scene.color}cc 100%)`,
            boxShadow: `0 4px 20px ${scene.color}40`,
          }}
        >
          <span>立即执行</span>
        </button>
      </div>
    </div>
  );
}
