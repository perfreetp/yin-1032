import { useMemo } from "react";
import {
  Lightbulb,
  Lamp,
  AirVent,
  PanelLeftClose,
  LockKeyhole,
  Camera,
  DoorOpen,
  Thermometer,
  Flame,
  Droplets,
  DoorClosed,
  ScanEye,
  Tv,
  Volume2,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/useDeviceStore";
import type {
  Device,
  DeviceCategory,
  DeviceStatus,
  LightState,
  ACState,
  CurtainState,
  LockDeviceState,
  CameraState,
} from "@/types/device";
import DeviceToggle from "./DeviceToggle";
import { rooms } from "@/mock/houses";

interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
  selected?: boolean;
  showCheckbox?: boolean;
  onToggleSelect?: () => void;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  lamp: Lamp,
  "air-conditioning": AirVent,
  curtains: PanelLeftClose,
  "lock-keyhole": LockKeyhole,
  camera: Camera,
  "door-open": DoorOpen,
  thermometer: Thermometer,
  smoke: Flame,
  droplets: Droplets,
  "door-closed": DoorClosed,
  "scan-eye": ScanEye,
  tv: Tv,
  "volume-2": Volume2,
};

const categoryAccent: Record<DeviceCategory, { color: string; glow: string }> = {
  light: { color: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
  ac: { color: "#38bdf8", glow: "rgba(56,189,248,0.4)" },
  curtain: { color: "#10b981", glow: "rgba(16,185,129,0.4)" },
  lock: { color: "#a78bfa", glow: "rgba(167,139,250,0.4)" },
  camera: { color: "#f472b6", glow: "rgba(244,114,182,0.4)" },
  sensor: { color: "#60a5fa", glow: "rgba(96,165,250,0.4)" },
  tv: { color: "#c084fc", glow: "rgba(192,132,252,0.4)" },
  speaker: { color: "#34d399", glow: "rgba(52,211,153,0.4)" },
};

const statusConfig: Record<
  DeviceStatus,
  { dotClass: string; label: string; textClass: string }
> = {
  online: {
    dotClass: "status-dot-online",
    label: "在线",
    textClass: "text-emerald-400",
  },
  offline: {
    dotClass: "status-dot-offline",
    label: "离线",
    textClass: "text-muted-foreground",
  },
  fault: {
    dotClass: "status-dot-fault",
    label: "故障",
    textClass: "text-red-400",
  },
};

const getDeviceStateDescription = (device: Device): string => {
  if (device.status !== "online") return statusConfig[device.status].label;

  switch (device.category) {
    case "light": {
      const state = device.state as LightState;
      return state.power ? `${state.brightness}%` : "已关闭";
    }
    case "ac": {
      const state = device.state as ACState;
      return state.power ? `${state.temperature}°C` : "已关闭";
    }
    case "curtain": {
      const state = device.state as CurtainState;
      return state.position === 0
        ? "已关闭"
        : state.position === 100
        ? "已全开"
        : `${state.position}%`;
    }
    case "lock": {
      const state = device.state as LockDeviceState;
      return state.state === "locked"
        ? "已锁定"
        : state.state === "unlocked"
        ? "已解锁"
        : "报警中";
    }
    case "camera": {
      const state = device.state as CameraState;
      return state.power ? "监控中" : "已关闭";
    }
    default:
      return "在线";
  }
};

const getDeviceIsOn = (device: Device): boolean => {
  if (device.status !== "online") return false;

  if ("power" in device.state) return device.state.power;
  if ("position" in device.state) return device.state.position > 0;
  if ("state" in device.state && "battery" in device.state)
    return device.state.state !== "locked";

  return false;
};

const getDeviceIconColor = (device: Device): string => {
  const accent = categoryAccent[device.category];
  if (device.status === "offline") return "#6b7280";
  if (device.status === "fault") return "#ef4444";

  const isOn = getDeviceIsOn(device);
  return isOn ? accent.color : "#6b7280";
};

const DeviceCard = ({
  device,
  onClick,
  selected,
  showCheckbox = false,
  onToggleSelect,
  className,
}: DeviceCardProps) => {
  const toggleDevice = useDeviceStore((s) => s.toggleDevice);
  const toggleSelect = useDeviceStore((s) => s.toggleSelect);
  const isDeviceSelected = useDeviceStore((s) =>
    s.selectedDeviceIds.includes(device.id)
  );

  const isSelected = selected ?? isDeviceSelected;
  const Icon = iconMap[device.icon] || Lightbulb;
  const accent = categoryAccent[device.category];
  const status = statusConfig[device.status];
  const iconColor = getDeviceIconColor(device);
  const isOn = getDeviceIsOn(device);
  const stateDesc = getDeviceStateDescription(device);
  const hasPowerToggle =
    "power" in device.state || device.category === "curtain";

  const roomName = useMemo(() => {
    const room = rooms.find((r) => r.id === device.roomId);
    return room?.name || "未知房间";
  }, [device.roomId]);

  const handleToggle = (_checked: boolean) => {
    toggleDevice(device.id);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSelect) onToggleSelect();
    else toggleSelect(device.id);
  };

  const canQuickToggle =
    device.status === "online" &&
    (device.category === "light" ||
      device.category === "ac" ||
      device.category === "camera" ||
      device.category === "tv" ||
      device.category === "speaker" ||
      device.category === "curtain");

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group rounded-2xl overflow-hidden glass glass-hover cursor-pointer",
        "transition-all duration-300 ease-out",
        "animate-fade-in",
        isSelected && "ring-2 ring-primary-400/70 shadow-glow-primary scale-[1.01]",
        className
      )}
    >
      {showCheckbox && (
        <button
          onClick={handleSelectClick}
          className={cn(
            "absolute top-3 left-3 z-10 w-5 h-5 rounded-md flex items-center justify-center",
            "transition-all duration-200",
            "ring-1 ring-white/20",
            isSelected
              ? "bg-gradient-to-br from-primary-500 to-secondary-500 ring-primary-400/60"
              : "bg-deepspace-700/80 hover:bg-white/10"
          )}
        >
          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>
      )}

      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          isOn ? "opacity-40" : ""
        )}
        style={{
          background: `radial-gradient(circle at 20% 20%, ${accent.glow} 0%, transparent 60%)`,
        }}
      />

      <div className="p-4 md:p-5 relative z-0">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={cn(
              "relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center",
              "transition-all duration-500 ease-out",
              "bg-deepspace-700/60 ring-1 ring-white/10"
            )}
            style={{
              boxShadow:
                isOn && device.status === "online"
                  ? `0 0 24px ${accent.glow}, inset 0 0 16px ${accent.color}22`
                  : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <Icon
              className={cn(
                "w-6 h-6 md:w-7 md:h-7 transition-all duration-500 ease-out",
                isOn && "scale-110"
              )}
              style={{
                color: iconColor,
                filter:
                  isOn && device.status === "online"
                    ? `drop-shadow(0 0 6px ${accent.color})`
                    : undefined,
              }}
            />
            {isOn && device.status === "online" && device.category === "light" && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse-glow"
                style={{
                  background: `radial-gradient(circle, ${accent.color}22 0%, transparent 70%)`,
                }}
              />
            )}
          </div>

          {canQuickToggle && (
            <DeviceToggle
              checked={isOn}
              onChange={handleToggle}
              size="sm"
            />
          )}
        </div>

        <div className="space-y-1.5 mb-3">
          <h3
            className={cn(
              "text-sm md:text-base font-bold truncate transition-colors duration-300",
              isSelected && "text-primary-300"
            )}
            title={device.name}
          >
            {device.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{roomName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn("status-dot", status.dotClass)} />
            <span
              className={cn(
                "text-xs font-medium truncate",
                device.status === "online" && isOn
                  ? status.textClass
                  : "text-muted-foreground"
              )}
            >
              {stateDesc}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-300",
              device.status === "online" && isOn
                ? "bg-white/5"
                : "bg-transparent"
            )}
          >
            <span
              className={cn("text-[10px] font-medium", status.textClass)}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {device.status === "fault" && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500" />
        </div>
      )}
    </div>
  );
};

export default DeviceCard;
