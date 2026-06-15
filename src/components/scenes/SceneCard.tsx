import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Home,
  LogOut,
  Moon,
  Sunrise,
  Film,
  BookOpen,
  Utensils,
  Users,
  ShieldCheck,
  AlarmClock,
  Bed,
  Palmtree,
  Zap,
  Clock,
  Cpu,
  Play,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/common/GlassCard';
import { useSceneStore } from '@/store/useSceneStore';
import type { Scene } from '@/types/scene';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  'log-out': LogOut,
  moon: Moon,
  sunrise: Sunrise,
  film: Film,
  'book-open': BookOpen,
  utensils: Utensils,
  users: Users,
  'shield-check': ShieldCheck,
  'alarm-clock': AlarmClock,
  bed: Bed,
  'palm-tree': Palmtree,
};

export interface SceneCardProps {
  scene: Scene;
  onClick?: (scene: Scene) => void;
  className?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const SceneCard = ({ scene, onClick, className }: SceneCardProps) => {
  const { toggleSceneEnabled, runScene, activeSceneId } = useSceneStore();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const isRunning = activeSceneId === scene.id;
  const Icon = iconMap[scene.icon] || Zap;

  const deviceCount = scene.actions.filter((a) => a.target.deviceId).length;

  const formatLastRun = useCallback((timestamp?: number) => {
    if (!timestamp) return '从未执行';
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return dayjs(timestamp).format('MM-DD HH:mm');
  }, []);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleSceneEnabled(scene.id);
    },
    [scene.id, toggleSceneEnabled]
  );

  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const handleRun = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      createRipple(e);
      await runScene(scene.id);
    },
    [scene.id, runScene, createRipple]
  );

  return (
    <GlassCard
      className={cn(
        'relative p-6 group transition-all duration-500',
        isRunning && 'ring-2 ring-offset-2 ring-offset-deepspace-500 animate-pulse-glow',
        !scene.enabled && 'opacity-60',
        className
      )}
      onClick={() => onClick?.(scene)}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${scene.color}15 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'relative w-16 h-16 rounded-2xl flex items-center justify-center',
              'transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1'
            )}
            style={{
              background: `linear-gradient(135deg, ${scene.color}40 0%, ${scene.color}15 100%)`,
              boxShadow: `0 8px 32px ${scene.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
              border: `1px solid ${scene.color}40`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse-glow"
              style={{ background: scene.color }}
            />
            <Icon
              className="w-8 h-8 relative z-10"
              style={{ color: scene.color, filter: `drop-shadow(0 0 8px ${scene.color}80)` }}
            />
          </div>

          <button
            onClick={handleToggle}
            className={cn(
              'relative w-14 h-7 rounded-full transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deepspace-500',
              scene.enabled
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 shadow-glow-primary'
                : 'bg-white/10 border border-white/10'
            )}
            style={{
              boxShadow: scene.enabled ? `0 0 20px ${scene.color}50` : undefined,
            }}
          >
            <div
              className={cn(
                'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg',
                'transition-all duration-300 ease-out',
                scene.enabled ? 'left-[29px]' : 'left-0.5'
              )}
            />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h3
            className="text-lg font-bold tracking-wide"
            style={{
              textShadow: `0 0 20px ${scene.color}40`,
            }}
          >
            {scene.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {formatLastRun(scene.lastRunAt)}
          </p>
        </div>

        <div className="flex items-center gap-4 py-2 border-t border-b border-white/5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="w-4 h-4 text-primary-400" />
            <span>
              <span className="text-white font-semibold">{deviceCount}</span> 个设备
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-warning-400" />
            <span>
              <span className="text-white font-semibold">{scene.triggers.length}</span> 个触发
            </span>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning || !scene.enabled}
          className={cn(
            'relative w-full h-11 rounded-xl font-semibold text-sm',
            'flex items-center justify-center gap-2 overflow-hidden',
            'transition-all duration-300 transform',
            'hover:brightness-110 active:scale-[0.98]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isRunning && 'animate-pulse'
          )}
          style={{
            background: `linear-gradient(135deg, ${scene.color} 0%, ${scene.color}cc 100%)`,
            boxShadow: `0 4px 20px ${scene.color}40`,
          }}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute bg-white/40 rounded-full animate-ripple pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)',
                width: 10,
                height: 10,
                animation: 'ripple 0.6s ease-out forwards',
              }}
            />
          ))}
          <Play
            className={cn(
              'w-4 h-4 relative z-10',
              isRunning && 'animate-spin'
            )}
          />
          <span className="relative z-10">
            {isRunning ? '执行中...' : '立即执行'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </GlassCard>
  );
};

export default SceneCard;
