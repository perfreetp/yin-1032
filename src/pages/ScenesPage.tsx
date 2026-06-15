import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Play,
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
  Sparkles,
  MapPin,
  Clock,
  Cpu,
  CalendarDays,
  Trash2,
  Edit3,
  Settings,
  MapPinOff,
  Zap,
  X,
  ChevronRight,
  TreePalm,
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import StatBlock from '@/components/common/StatBlock';
import GradientButton from '@/components/common/GradientButton';
import { useSceneStore } from '@/store/useSceneStore';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Scene } from '@/types/scene';

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="w-7 h-7" />,
  'log-out': <LogOut className="w-7 h-7" />,
  moon: <Moon className="w-7 h-7" />,
  sunrise: <Sun className="w-7 h-7" />,
  film: <Film className="w-7 h-7" />,
  'book-open': <BookOpen className="w-7 h-7" />,
  utensils: <Utensils className="w-7 h-7" />,
  users: <Users className="w-7 h-7" />,
  'shield-check': <ShieldCheck className="w-7 h-7" />,
  'alarm-clock': <AlarmClock className="w-7 h-7" />,
  bed: <Bed className="w-7 h-7" />,
  'palm-tree': <TreePalm className="w-7 h-7" />,
};

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

const SceneCard = ({
  scene,
  onRun,
  onToggle,
  onEdit,
  onDelete,
  isRunning,
}: {
  scene: Scene;
  onRun: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (scene: Scene) => void;
  onDelete: (id: string) => void;
  isRunning: boolean;
}) => {
  return (
    <GlassCard
      className={cn(
        'p-5 relative overflow-hidden group h-full',
        isRunning && 'ring-2 ring-emerald-400/50 shadow-glow-success'
      )}
    >
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-25 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: scene.color }}
      />

      <div
        className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: scene.color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
              isRunning && 'animate-pulse'
            )}
            style={{
              background: `linear-gradient(135deg, ${scene.color}44, ${scene.color}11)`,
              color: scene.color,
              boxShadow: `0 0 40px ${scene.color}33`,
            }}
          >
            {iconMap[scene.icon] || <Sparkles className="w-7 h-7" />}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(scene);
              }}
              className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              title="编辑场景"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(scene.id);
              }}
              className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-gray-400 hover:text-rose-400 transition-all"
              title="删除场景"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">
          {scene.name}
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          {scene.actions.length} 个设备联动 · {scene.triggers.length} 种触发方式
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {scene.triggers.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
              title={triggerLabels[t.type]}
            >
              {triggerIconMap[t.type]}
              {triggerLabels[t.type]}
            </span>
          ))}
        </div>

        {scene.lastRunAt && (
          <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            上次执行：{formatTimeAgo(scene.lastRunAt)}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(scene.id);
              }}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  'relative w-12 h-6 rounded-full transition-all duration-300',
                  scene.enabled
                    ? 'bg-gradient-to-r from-emerald-500 to-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center',
                    scene.enabled ? 'left-[26px]' : 'left-0.5'
                  )}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      scene.enabled ? 'bg-emerald-500' : 'bg-gray-400'
                    )}
                  />
                </div>
              </div>
              <span className={cn(
                'text-xs font-medium',
                scene.enabled ? 'text-emerald-400' : 'text-gray-500'
              )}>
                {scene.enabled ? '已启用' : '已停用'}
              </span>
            </button>
          </div>

          <GradientButton
            size="sm"
            variant={scene.enabled ? 'primary' : 'ghost'}
            icon={isRunning ? <Zap className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
            loading={isRunning}
            onClick={() => onRun(scene.id)}
            disabled={!scene.enabled}
            className={cn(!scene.enabled && 'opacity-50 cursor-not-allowed')}
          >
            {isRunning ? '执行中' : '执行'}
          </GradientButton>
        </div>
      </div>
    </GlassCard>
  );
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}

const LocationLinkSection = () => {
  const [arriveEnabled, setArriveEnabled] = useState(true);
  const [leaveEnabled, setLeaveEnabled] = useState(true);
  const [radius, setRadius] = useState(200);

  return (
    <GlassCard className="p-6 overflow-hidden relative">
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-secondary-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-secondary-500/30 flex items-center justify-center text-primary-300">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">到家离家联动</h3>
              <p className="text-sm text-gray-400">基于手机位置自动触发场景</p>
            </div>
          </div>
          <Settings className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">到家自动触发</p>
                  <p className="text-xs text-gray-400">到达时自动执行回家模式</p>
                </div>
              </div>
              <button
                onClick={() => setArriveEnabled(!arriveEnabled)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-all duration-300',
                  arriveEnabled ? 'bg-gradient-to-r from-emerald-500 to-primary-500' : 'bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300',
                    arriveEnabled ? 'left-[26px]' : 'left-0.5'
                  )}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-primary-500/10 text-primary-400 text-xs font-medium">回家模式</span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400 text-xs">关联 5 个设备</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <MapPinOff className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">离家自动触发</p>
                  <p className="text-xs text-gray-400">离开时自动执行离家布防</p>
                </div>
              </div>
              <button
                onClick={() => setLeaveEnabled(!leaveEnabled)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-all duration-300',
                  leaveEnabled ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300',
                    leaveEnabled ? 'left-[26px]' : 'left-0.5'
                  )}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-medium">离家布防</span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400 text-xs">关联 10 个设备</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-400" />
              触发半径
            </label>
            <span className="text-sm font-semibold text-primary-400">{radius} 米</span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50m</span>
            <span>500m</span>
            <span>1000m</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default function ScenesPage() {
  const navigate = useNavigate();
  const currentHouseId = useAppStore((state) => state.currentHouseId);
  const { scenes, activeSceneId, fetchScenes, runScene, toggleSceneEnabled, deleteScene } = useSceneStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (currentHouseId) {
      fetchScenes(currentHouseId);
    }
  }, [currentHouseId, fetchScenes]);

  const stats = useMemo(() => ({
    total: scenes.length,
    enabled: scenes.filter((s) => s.enabled).length,
    hasLocation: scenes.filter((s) => s.triggers.some((t) => t.type === 'location')).length,
    hasSchedule: scenes.filter((s) => s.triggers.some((t) => t.type === 'schedule')).length,
  }), [scenes]);

  const handleRunScene = async (id: string) => {
    await runScene(id);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteScene(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          title="场景总数"
          value={stats.total}
          unit="个"
          icon={<Sparkles className="w-5 h-5" />}
          trend={2}
          trendDirection="up"
        />
        <StatBlock
          title="已启用"
          value={stats.enabled}
          unit="个"
          icon={<Play className="w-5 h-5" />}
          trendDirection="neutral"
        />
        <StatBlock
          title="定时场景"
          value={stats.hasSchedule}
          unit="个"
          icon={<CalendarDays className="w-5 h-5" />}
        />
        <StatBlock
          title="位置联动"
          value={stats.hasLocation}
          unit="个"
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-400" />
            我的场景
          </h2>
          <p className="text-sm text-gray-400 mt-1">一键联动多个设备，打造智慧生活体验</p>
        </div>
        <GradientButton
          variant="primary"
          size="lg"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/scenes/editor')}
        >
          创建场景
        </GradientButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onRun={handleRunScene}
            onToggle={toggleSceneEnabled}
            onEdit={() => navigate(`/scenes/editor?id=${scene.id}`)}
            onDelete={handleDelete}
            isRunning={activeSceneId === scene.id}
          />
        ))}

        <GlassCard
          className="p-5 flex flex-col items-center justify-center min-h-[280px] border-dashed border-2 border-white/10 hover:border-primary-500/40 cursor-pointer transition-all group bg-white/[0.02]"
          onClick={() => navigate('/scenes/editor')}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-primary-500/10 flex items-center justify-center text-gray-500 group-hover:text-primary-400 transition-all mb-4 group-hover:scale-110">
            <Plus className="w-8 h-8" />
          </div>
          <h4 className="font-semibold text-gray-400 group-hover:text-white transition-colors mb-1">创建新场景</h4>
          <p className="text-xs text-gray-500">自定义设备联动规则</p>
        </GlassCard>
      </div>

      <LocationLinkSection />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <GlassCard className="relative z-10 w-full max-w-sm p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">确认删除</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              确定要删除这个场景吗？删除后将无法恢复，相关的联动规则也会失效。
            </p>
            <div className="flex gap-3">
              <GradientButton variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                取消
              </GradientButton>
              <GradientButton variant="danger" className="flex-1" icon={<Trash2 className="w-4 h-4" />} onClick={confirmDelete}>
                确认删除
              </GradientButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
