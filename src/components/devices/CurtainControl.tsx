import { useCallback, useEffect, useRef, useState } from "react";
import {
  PanelLeftClose,
  Maximize2,
  Minimize2,
  SplitSquareHorizontal,
  MoveHorizontal,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/useDeviceStore";
import type { Device, CurtainState } from "@/types/device";
import GlassCard from "@/components/common/GlassCard";

interface CurtainControlProps {
  device: Device;
  className?: string;
}

const presetPositions = [
  { id: "close", label: "全关", position: 0, Icon: Minimize2 },
  { id: "half", label: "半开", position: 50, Icon: SplitSquareHorizontal },
  { id: "open", label: "全开", position: 100, Icon: Maximize2 },
];

const CurtainControl = ({ device, className }: CurtainControlProps) => {
  const state = device.state as CurtainState;
  const updateDeviceState = useDeviceStore((s) => s.updateDeviceState);

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animFrameRef = useRef<number>();
  const targetPosRef = useRef<number>(state.position);
  const currentPosRef = useRef<number>(state.position);

  useEffect(() => {
    targetPosRef.current = state.position;
    setIsAnimating(true);

    const animate = () => {
      const diff = targetPosRef.current - currentPosRef.current;
      if (Math.abs(diff) < 0.5) {
        currentPosRef.current = targetPosRef.current;
        setIsAnimating(false);
        return;
      }
      currentPosRef.current += diff * 0.08;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state.position]);

  const [displayPosition, setDisplayPosition] = useState(state.position);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setDisplayPosition(currentPosRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setPosition = (position: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(position)));
    updateDeviceState(device.id, { position: clamped } as Partial<CurtainState>);
  };

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return state.position;
      const rect = trackRef.current.getBoundingClientRect();
      const pos = (clientX - rect.left) / rect.width;
      return Math.min(100, Math.max(0, Math.round(pos * 100)));
    },
    [state.position]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setPosition(getValueFromPosition(e.clientX));
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => setPosition(getValueFromPosition(e.clientX));
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, getValueFromPosition]);

  useEffect(() => {
    if (!isDragging) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setPosition(getValueFromPosition(e.touches[0].clientX));
    };
    const handleTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, getValueFromPosition]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) setPosition(getValueFromPosition(e.touches[0].clientX));
  };

  const leftCurtainWidth = displayPosition / 2;
  const rightCurtainWidth = displayPosition / 2;

  return (
    <GlassCard className={cn("p-5 md:p-6", className)} hover={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center glass",
                "transition-all duration-500"
              )}
              style={{
                boxShadow:
                  displayPosition > 0
                    ? "0 0 30px rgba(16,185,129,0.3), inset 0 0 20px rgba(16,185,129,0.15)"
                    : undefined,
              }}
            >
              <PanelLeftClose
                className={cn(
                  "w-7 h-7 transition-all duration-500",
                  displayPosition === 0 ? "opacity-40" : "scale-110"
                )}
                style={{
                  color: displayPosition > 0 ? "#10b981" : "#6b7280",
                  filter:
                    displayPosition > 0
                      ? "drop-shadow(0 0 8px rgba(16,185,129,0.6))"
                      : undefined,
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                {displayPosition === 0
                  ? "已关闭"
                  : displayPosition === 100
                  ? "已全开"
                  : `开启 ${Math.round(displayPosition)}%`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            <MoveHorizontal className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold font-orbitron text-emerald-400 glow-text-success">
              {Math.round(displayPosition)}%
            </span>
          </div>
        </div>

        <div className="relative h-32 md:h-40 rounded-2xl overflow-hidden glass scan-line">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-amber-500/5" />

          <div
            className="absolute inset-x-0 bottom-0 h-1 transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)`,
              opacity: displayPosition > 0 ? 1 : 0,
              filter: "blur(2px)",
            }}
          />

          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-primary-500/40 to-transparent" />

          <div
            className={cn(
              "absolute top-1.5 bottom-0 left-0 transition-[width] duration-100 ease-linear",
              isAnimating || isDragging ? "duration-75" : "duration-700"
            )}
            style={{
              width: `${50 - leftCurtainWidth}%`,
              background:
                "linear-gradient(90deg, rgba(148,163,184,0.5) 0%, rgba(203,213,225,0.35) 50%, rgba(148,163,184,0.5) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(100,116,139,0.3) 0px, rgba(100,116,139,0.3) 2px, transparent 2px, transparent 12px)",
              }}
            />
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-r from-slate-400/30 to-white/40 shadow-lg" />
          </div>

          <div
            className={cn(
              "absolute top-1.5 bottom-0 right-0 transition-[width] duration-100 ease-linear",
              isAnimating || isDragging ? "duration-75" : "duration-700"
            )}
            style={{
              width: `${50 - rightCurtainWidth}%`,
              background:
                "linear-gradient(270deg, rgba(148,163,184,0.5) 0%, rgba(203,213,225,0.35) 50%, rgba(148,163,184,0.5) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(100,116,139,0.3) 0px, rgba(100,116,139,0.3) 2px, transparent 2px, transparent 12px)",
              }}
            />
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-l from-slate-400/30 to-white/40 shadow-lg" />
          </div>

          <div
            className={cn(
              "absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center",
              "pointer-events-none transition-opacity duration-500",
              displayPosition > 30 ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="px-4 py-2 rounded-xl bg-deepspace-700/60 backdrop-blur-sm glass">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-amber-200">自然光进入</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">开合度</span>
            </div>
          </div>

          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={cn(
              "relative h-4 rounded-full cursor-pointer select-none",
              "bg-deepspace-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]",
              "ring-1 ring-[hsl(var(--border))]"
            )}
          >
            <div
              className={cn(
                "absolute top-0 bottom-0 left-0 rounded-full transition-all duration-150"
              )}
              style={{
                width: `${state.position}%`,
                background:
                  "linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.7) 100%)",
                boxShadow: "0 0 16px rgba(16,185,129,0.4)",
              }}
            />
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
                "w-7 h-7 rounded-full",
                "transition-transform duration-150 ease-out",
                "border-2 border-white/80",
                isDragging ? "scale-110" : "hover:scale-105"
              )}
              style={{
                left: `${state.position}%`,
                backgroundColor: "#10b981",
                boxShadow:
                  "0 0 0 4px rgba(16,185,129,0.2), 0 0 20px rgba(16,185,129,0.6), 0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {presetPositions.map(({ id, label, position, Icon }) => {
            const isActive = state.position === position;
            return (
              <button
                key={id}
                onClick={() => setPosition(position)}
                className={cn(
                  "relative group py-3 md:py-4 rounded-xl overflow-hidden",
                  "glass transition-all duration-300",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "flex flex-col items-center gap-2",
                  isActive && "ring-2 ring-emerald-400/60 shadow-glow-success"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-br from-emerald-500/20 to-primary-500/10"
                  )}
                />
                <Icon
                  className={cn(
                    "w-5 h-5 md:w-6 md:h-6 relative z-10 transition-all duration-300",
                    isActive && "scale-110 text-emerald-400"
                  )}
                  style={{
                    color: isActive ? "#10b981" : undefined,
                    filter: isActive ? "drop-shadow(0 0 6px rgba(16,185,129,0.6))" : undefined,
                  }}
                />
                <span className="text-xs md:text-sm font-medium relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

export default CurtainControl;
