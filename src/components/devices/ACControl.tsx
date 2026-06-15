import {
  Snowflake,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Fan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/useDeviceStore";
import type { Device, ACState, ACMode } from "@/types/device";
import DeviceToggle from "./DeviceToggle";
import GlassCard from "@/components/common/GlassCard";

interface ACControlProps {
  device: Device;
  className?: string;
}

interface ModeConfig {
  mode: ACMode;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

const modeConfigs: ModeConfig[] = [
  { mode: "cool", label: "制冷", Icon: Snowflake, color: "#38bdf8", gradient: "from-sky-500/30 to-blue-500/20" },
  { mode: "heat", label: "制热", Icon: Sun, color: "#fb923c", gradient: "from-orange-500/30 to-red-500/20" },
  { mode: "auto", label: "自动", Icon: RotateCcw, color: "#a78bfa", gradient: "from-violet-500/30 to-purple-500/20" },
  { mode: "dry", label: "除湿", Icon: Droplets, color: "#34d399", gradient: "from-emerald-500/30 to-teal-500/20" },
  { mode: "fan", label: "送风", Icon: Wind, color: "#94a3b8", gradient: "from-slate-500/30 to-gray-500/20" },
];

const fanSpeeds: Array<{ value: ACState["fanSpeed"]; label: string }> = [
  { value: "auto", label: "自动" },
  { value: 1, label: "1档" },
  { value: 2, label: "2档" },
  { value: 3, label: "3档" },
  { value: 4, label: "4档" },
];

const MIN_TEMP = 16;
const MAX_TEMP = 30;

const ACControl = ({ device, className }: ACControlProps) => {
  const state = device.state as ACState;
  const updateDeviceState = useDeviceStore((s) => s.updateDeviceState);
  const toggleDevice = useDeviceStore((s) => s.toggleDevice);

  const currentMode = modeConfigs.find((m) => m.mode === state.mode) || modeConfigs[2];
  const accentColor = currentMode.color;

  const handleModeChange = (mode: ACMode) => {
    updateDeviceState(device.id, { mode } as Partial<ACState>);
  };

  const adjustTemperature = (delta: number) => {
    const newTemp = Math.min(MAX_TEMP, Math.max(MIN_TEMP, state.temperature + delta));
    updateDeviceState(device.id, { temperature: newTemp } as Partial<ACState>);
  };

  const handleFanSpeedChange = (fanSpeed: ACState["fanSpeed"]) => {
    updateDeviceState(device.id, { fanSpeed } as Partial<ACState>);
  };

  const handleSwingToggle = () => {
    updateDeviceState(device.id, { swing: !state.swing } as Partial<ACState>);
  };

  const tempProgress = ((state.temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;

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
                  ? `0 0 30px ${accentColor}55, inset 0 0 20px ${accentColor}33`
                  : undefined,
              }}
            >
              <div
                style={{
                  color: state.power ? accentColor : "#6b7280",
                  filter: state.power ? `drop-shadow(0 0 8px ${accentColor})` : undefined,
                }}
              >
                <currentMode.Icon
                  className={cn(
                    "w-7 h-7 transition-all duration-500",
                    state.power ? "scale-110" : "opacity-40"
                  )}
                />
              </div>
              {state.power && state.mode === "fan" && (
                <Fan className="absolute inset-2 w-10 h-10 animate-spin-slow opacity-30" style={{ color: accentColor }} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                {state.power ? `${currentMode.label} · ${state.temperature}°C` : "已关闭"}
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
            "grid grid-cols-5 gap-2 p-1 rounded-xl glass",
            !state.power && "opacity-50 pointer-events-none"
          )}
        >
          {modeConfigs.map(({ mode, label, Icon, color, gradient }) => {
            const isActive = state.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={cn(
                  "relative group flex flex-col items-center gap-1 py-3 px-1 rounded-lg",
                  "transition-all duration-300",
                  isActive
                    ? `bg-gradient-to-br ${gradient} ring-1 ring-inset`
                    : "hover:bg-white/5"
                )}
                style={{
                  boxShadow: isActive ? `inset 0 0 20px ${color}22` : undefined,
                }}
              >
                <div
                  style={{
                    color: isActive ? color : "#9ca3af",
                    filter: isActive ? `drop-shadow(0 0 6px ${color}88)` : undefined,
                  }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive && "scale-110"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-medium transition-colors",
                    isActive ? "" : "text-muted-foreground"
                  )}
                  style={{ color: isActive ? color : undefined }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 md:gap-8">
          <button
            onClick={() => adjustTemperature(-1)}
            disabled={!state.power || state.temperature <= MIN_TEMP}
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-2xl glass flex items-center justify-center",
              "transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            <ChevronDown className="w-6 h-6 md:w-7 md:h-7 text-sky-400" />
          </button>

          <div className="flex-1 relative">
            <div
              className={cn(
                "relative py-4 md:py-6 rounded-2xl glass overflow-hidden",
                "transition-all duration-500"
              )}
              style={{
                boxShadow: state.power
                  ? `0 0 40px ${accentColor}22, inset 0 0 30px ${accentColor}11`
                  : undefined,
              }}
            >
              <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, ${accentColor}08 0%, ${accentColor}03 50%, transparent 100%)`,
                }}
              />
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-baseline justify-center font-orbitron",
                    "transition-all duration-500",
                    state.power ? "opacity-100" : "opacity-40"
                  )}
                >
                  <span
                    className="text-5xl md:text-7xl font-black tracking-tight transition-all duration-300"
                    style={{
                      color: state.power ? accentColor : "#6b7280",
                      textShadow: state.power ? `0 0 30px ${accentColor}88` : undefined,
                    }}
                  >
                    {state.temperature}
                  </span>
                  <span
                    className="text-2xl md:text-4xl font-bold ml-1"
                    style={{ color: state.power ? accentColor : "#6b7280" }}
                  >
                    °C
                  </span>
                </div>

                <div className="w-4/5 mt-4 md:mt-6">
                  <div className="relative h-1.5 md:h-2 rounded-full bg-deepspace-700 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                      style={{
                        width: `${tempProgress}%`,
                        background: `linear-gradient(90deg, #38bdf8, #a78bfa, #fb923c)`,
                        boxShadow: state.power ? `0 0 12px ${accentColor}88` : undefined,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] md:text-xs text-muted-foreground font-mono">
                    <span>{MIN_TEMP}°</span>
                    <span>{MAX_TEMP}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => adjustTemperature(1)}
            disabled={!state.power || state.temperature >= MAX_TEMP}
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-2xl glass flex items-center justify-center",
              "transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            <ChevronUp className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
          </button>
        </div>

        <div className={cn("space-y-4", !state.power && "opacity-50 pointer-events-none")}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">风速</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {fanSpeeds.map(({ value, label }) => {
                const isActive = state.fanSpeed === value;
                return (
                  <button
                    key={String(value)}
                    onClick={() => handleFanSpeedChange(value)}
                    className={cn(
                      "py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium",
                      "transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary-500/30 to-secondary-500/30 text-white ring-1 ring-primary-400/40 shadow-glow-primary"
                        : "glass hover:bg-white/10 text-muted-foreground"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 rounded-xl glass">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  state.swing ? "bg-primary-500/20" : "bg-deepspace-600"
                )}
              >
                <Wind
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    state.swing && "text-primary-400"
                  )}
                  style={{
                    filter: state.swing ? "drop-shadow(0 0 6px rgba(22,119,255,0.6))" : undefined,
                  }}
                />
              </div>
              <div>
                <div className="text-sm font-medium">摆风</div>
                <div className="text-xs text-muted-foreground">自动上下扫风</div>
              </div>
            </div>
            <DeviceToggle checked={state.swing} onChange={handleSwingToggle} size="sm" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ACControl;
