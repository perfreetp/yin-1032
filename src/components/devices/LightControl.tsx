import { useCallback, useEffect, useRef, useState } from "react";
import { Sun, Lightbulb, Sparkles, BookOpen, Coffee, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/useDeviceStore";
import type { Device, LightState } from "@/types/device";
import DeviceToggle from "./DeviceToggle";
import ColorTempSlider from "@/components/common/ColorTempSlider";
import GlassCard from "@/components/common/GlassCard";

interface LightControlProps {
  device: Device;
  className?: string;
}

interface ScenePreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  brightness: number;
  colorTemp: number;
  accent: string;
}

const scenePresets: ScenePreset[] = [
  { id: "warm", name: "暖光", icon: Coffee, brightness: 60, colorTemp: 2700, accent: "from-amber-500/20 to-orange-500/10" },
  { id: "natural", name: "自然光", icon: Sun, brightness: 80, colorTemp: 4500, accent: "from-yellow-400/20 to-sky-400/10" },
  { id: "cool", name: "冷光", icon: Snowflake, brightness: 100, colorTemp: 6000, accent: "from-sky-400/20 to-blue-500/10" },
  { id: "reading", name: "阅读", icon: BookOpen, brightness: 85, colorTemp: 5000, accent: "from-emerald-400/20 to-primary-400/10" },
];

const kelvinToColor = (kelvin: number): string => {
  const temp = kelvin / 100;
  let red: number;
  let green: number;
  let blue: number;

  if (temp <= 66) {
    red = 255;
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    blue = 255;
  }

  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  return `rgb(${Math.round(clamp(red))}, ${Math.round(clamp(green))}, ${Math.round(clamp(blue))})`;
};

interface BrightnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  lightColor: string;
}

const BrightnessSlider = ({ value, onChange, disabled, lightColor }: BrightnessSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const pos = (clientX - rect.left) / rect.width;
      const clampedPos = Math.min(1, Math.max(0, pos));
      return Math.round(clampedPos * 100);
    },
    [value]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    onChange(getValueFromPosition(e.clientX));
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => onChange(getValueFromPosition(e.clientX));
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, getValueFromPosition, onChange]);

  useEffect(() => {
    if (!isDragging) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onChange(getValueFromPosition(e.touches[0].clientX));
    };
    const handleTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, getValueFromPosition, onChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    if (e.touches[0]) onChange(getValueFromPosition(e.touches[0].clientX));
  };

  return (
    <div className={cn("w-full space-y-3", disabled && "opacity-50 pointer-events-none")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-muted-foreground">亮度</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass">
          <Sparkles className="w-3.5 h-3.5" style={{ color: lightColor }} />
          <span className="text-sm font-bold" style={{ color: lightColor }}>
            {value}%
          </span>
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
          className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-150"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${lightColor}44 0%, ${lightColor}cc 100%)`,
            boxShadow: `0 0 16px ${lightColor}66`,
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
            left: `${value}%`,
            backgroundColor: lightColor,
            boxShadow: `0 0 0 4px ${lightColor}33, 0 0 20px ${lightColor}99, 0 4px 12px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 60%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const LightControl = ({ device, className }: LightControlProps) => {
  const state = device.state as LightState;
  const updateDeviceState = useDeviceStore((s) => s.updateDeviceState);
  const toggleDevice = useDeviceStore((s) => s.toggleDevice);

  const lightColor = kelvinToColor(state.colorTemp);
  const effectiveBrightness = state.power ? state.brightness : 0;

  const handleBrightnessChange = (brightness: number) => {
    updateDeviceState(device.id, { brightness } as Partial<LightState>);
  };

  const handleColorTempChange = (colorTemp: number) => {
    updateDeviceState(device.id, { colorTemp } as Partial<LightState>);
  };

  const applyScene = (scene: ScenePreset) => {
    updateDeviceState(device.id, {
      power: true,
      brightness: scene.brightness,
      colorTemp: scene.colorTemp,
    } as Partial<LightState>);
  };

  return (
    <GlassCard className={cn("p-5 md:p-6", className)} hover={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center",
                "glass transition-all duration-500"
              )}
              style={{
                boxShadow: state.power
                  ? `0 0 30px ${lightColor}66, inset 0 0 20px ${lightColor}33`
                  : undefined,
              }}
            >
              <Lightbulb
                className={cn(
                  "w-7 h-7 transition-all duration-500",
                  state.power ? "scale-110" : "opacity-40"
                )}
                style={{
                  color: state.power ? lightColor : "#6b7280",
                  filter: state.power ? `drop-shadow(0 0 8px ${lightColor})` : undefined,
                }}
              />
              {state.power && (
                <div
                  className="absolute inset-0 rounded-2xl animate-pulse-glow pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${lightColor}22 0%, transparent 70%)`,
                  }}
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                {state.power ? `${state.brightness}% · ${state.colorTemp}K` : "已关闭"}
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
            "h-1 rounded-full overflow-hidden transition-all duration-500",
            state.power ? "opacity-100" : "opacity-30"
          )}
          style={{
            background: `linear-gradient(90deg, transparent, ${lightColor}66, transparent)`,
            width: `${effectiveBrightness}%`,
            boxShadow: state.power ? `0 0 12px ${lightColor}88` : undefined,
          }}
        />

        <div className="space-y-5">
          <BrightnessSlider
            value={state.brightness}
            onChange={handleBrightnessChange}
            disabled={!state.power}
            lightColor={lightColor}
          />
          <ColorTempSlider
            value={state.colorTemp}
            onChange={handleColorTempChange}
            disabled={!state.power}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary-400" />
            <span className="text-sm font-medium text-muted-foreground">预设场景</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {scenePresets.map((scene) => {
              const Icon = scene.icon;
              const isActive =
                state.power &&
                state.brightness === scene.brightness &&
                state.colorTemp === scene.colorTemp;
              return (
                <button
                  key={scene.id}
                  onClick={() => applyScene(scene)}
                  disabled={!state.power && state.power === false}
                  className={cn(
                    "relative group p-3 md:p-4 rounded-xl overflow-hidden",
                    "glass transition-all duration-300",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "flex flex-col items-center gap-2",
                    isActive && "ring-2 ring-primary-400/60 shadow-glow-primary",
                    !state.power && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      `bg-gradient-to-br ${scene.accent}`
                    )}
                  />
                  <div
                    style={{
                      color: isActive ? kelvinToColor(scene.colorTemp) : "#9ca3af",
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${kelvinToColor(scene.colorTemp)})`
                        : undefined,
                    }}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 md:w-6 md:h-6 relative z-10 transition-all duration-300",
                        isActive ? "scale-110" : ""
                      )}
                    />
                  </div>
                  <span className="text-xs md:text-sm font-medium relative z-10">{scene.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default LightControl;
