import { useState } from "react";
import {
  Camera,
  Camera as CameraIcon,
  Video,
  Mic,
  MicOff,
  Circle as Record,
  Square as Stop,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Wifi,
  WifiOff,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/useDeviceStore";
import type { Device, CameraState } from "@/types/device";
import GlassCard from "@/components/common/GlassCard";
import DeviceToggle from "./DeviceToggle";

interface CameraPreviewProps {
  device: Device;
  className?: string;
}

interface PTZButton {
  direction: "up" | "down" | "left" | "right";
  Icon: React.ComponentType<{ className?: string }>;
  position: string;
}

const ptzButtons: PTZButton[] = [
  { direction: "up", Icon: ChevronUp, position: "top-0 left-1/2 -translate-x-1/2" },
  { direction: "down", Icon: ChevronDown, position: "bottom-0 left-1/2 -translate-x-1/2" },
  { direction: "left", Icon: ChevronLeft, position: "left-0 top-1/2 -translate-y-1/2" },
  { direction: "right", Icon: ChevronRight, position: "right-0 top-1/2 -translate-y-1/2" },
];

const CameraPreview = ({ device, className }: CameraPreviewProps) => {
  const state = device.state as CameraState;
  const updateDeviceState = useDeviceStore((s) => s.updateDeviceState);
  const toggleDevice = useDeviceStore((s) => s.toggleDevice);

  const [isRecording, setIsRecording] = useState(state.recording || false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [ptzPosition, setPtzPosition] = useState<[number, number]>(state.panTilt || [0, 0]);
  const [flash, setFlash] = useState<"photo" | "record" | null>(null);

  const isOnline = device.status === "online" && state.power;

  const handleToggle = () => {
    toggleDevice(device.id);
  };

  const handlePTZ = (direction: PTZButton["direction"]) => {
    const step = 10;
    let [pan, tilt] = ptzPosition;
    switch (direction) {
      case "up":
        tilt = Math.min(90, tilt + step);
        break;
      case "down":
        tilt = Math.max(-90, tilt - step);
        break;
      case "left":
        pan = Math.max(-180, pan - step);
        break;
      case "right":
        pan = Math.min(180, pan + step);
        break;
    }
    setPtzPosition([pan, tilt]);
    updateDeviceState(device.id, { panTilt: [pan, tilt] } as Partial<CameraState>);
  };

  const handlePhoto = () => {
    if (!isOnline) return;
    setFlash("photo");
    setTimeout(() => setFlash(null), 200);
  };

  const handleRecord = () => {
    if (!isOnline) return;
    const newRecording = !isRecording;
    setIsRecording(newRecording);
    setFlash("record");
    setTimeout(() => setFlash(null), 300);
    updateDeviceState(device.id, { recording: newRecording } as Partial<CameraState>);
  };

  const handleMicToggle = () => {
    if (!isOnline) return;
    setIsMicOn(!isMicOn);
  };

  return (
    <GlassCard className={cn("p-5 md:p-6", className)} hover={false}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center glass transition-all duration-500",
                isOnline && "shadow-glow-primary"
              )}
              style={{
                boxShadow: isOnline
                  ? "0 0 30px rgba(22,119,255,0.3), inset 0 0 20px rgba(22,119,255,0.15)"
                  : undefined,
              }}
            >
              <CameraIcon
                className={cn(
                  "w-7 h-7 transition-all duration-500",
                  isOnline ? "scale-110" : "opacity-40"
                )}
                style={{
                  color: isOnline ? "#1677ff" : "#6b7280",
                  filter: isOnline ? "drop-shadow(0 0 8px rgba(22,119,255,0.6))" : undefined,
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <div className="flex items-center gap-1.5">
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-sm text-emerald-400">在线</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">离线</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <DeviceToggle checked={state.power} onChange={handleToggle} size="lg" />
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden glass ring-1 ring-white/10">
          {isOnline ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-deepspace-600 via-deepspace-700 to-deepspace-800" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(22,119,255,0.3), transparent 40%), radial-gradient(circle at 80% 70%, rgba(99,59,255,0.2), transparent 40%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(22,119,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(22,119,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute left-0 right-0 h-16 animate-scan-line"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(22,119,255,0.1) 40%, rgba(22,119,255,0.4) 50%, rgba(22,119,255,0.1) 60%, transparent 100%)",
                  }}
                />
              </div>

              <div className="absolute inset-x-0 top-0 p-3 md:p-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-sm">
                      <CircleDot className="w-3 h-3 text-white animate-pulse" />
                      <span className="text-xs font-bold text-white">REC</span>
                    </div>
                  )}
                  <div className="px-2.5 py-1 rounded-full bg-deepspace-800/80 backdrop-blur-sm flex items-center gap-1.5">
                    <Camera className="w-3 h-3 text-primary-400" />
                    <span className="text-[10px] font-medium text-white/80">LIVE</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-deepspace-800/80 backdrop-blur-sm">
                    <span className="text-[10px] font-mono text-white/80">HD 1080p</span>
                  </div>
                  <button className="p-1.5 rounded-lg bg-deepspace-800/80 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <Maximize2 className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex items-end justify-between">
                <div className="px-2.5 py-1 rounded-full bg-deepspace-800/80 backdrop-blur-sm">
                  <span className="text-[10px] font-mono text-white/80">
                    {new Date().toLocaleTimeString("zh-CN", { hour12: false })}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="px-2 py-0.5 rounded bg-deepspace-800/80 backdrop-blur-sm">
                    <span className="text-[9px] font-mono text-white/60">
                      H: {ptzPosition[0] > 0 ? "+" : ""}
                      {ptzPosition[0]}°
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-deepspace-800/80 backdrop-blur-sm">
                    <span className="text-[9px] font-mono text-white/60">
                      V: {ptzPosition[1] > 0 ? "+" : ""}
                      {ptzPosition[1]}°
                    </span>
                  </div>
                </div>
              </div>

              {flash === "photo" && (
                <div className="absolute inset-0 bg-white animate-pulse pointer-events-none" />
              )}
              {flash === "record" && (
                <div className="absolute inset-0 ring-4 ring-inset ring-red-500/60 pointer-events-none animate-pulse" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-deepspace-700/80">
              <WifiOff className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">设备离线或未开启</p>
              <p className="text-xs text-muted-foreground/60 mt-1">请检查设备电源和网络</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl glass">
            <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Video className="w-3.5 h-3.5" />
              云台控制
            </div>
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 ring-1 ring-white/5" />
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(22,119,255,0.15) 0%, transparent 70%)",
                }}
              >
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                  <div
                    className="w-3 h-3 rounded-full bg-primary-400"
                    style={{
                      boxShadow: "0 0 12px rgba(22,119,255,0.8)",
                      transform: `translate(${ptzPosition[0] / 12}px, ${-ptzPosition[1] / 12}px)`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {ptzButtons.map(({ direction, Icon, position }) => (
                <button
                  key={direction}
                  onClick={() => handlePTZ(direction)}
                  disabled={!isOnline}
                  className={cn(
                    "absolute w-8 h-8 rounded-lg flex items-center justify-center",
                    position,
                    "glass transition-all duration-200",
                    "hover:bg-primary-500/20 hover:scale-110 active:scale-95",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent"
                  )}
                >
                  <Icon className="w-4 h-4 text-primary-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl glass space-y-4">
            <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              操作控制
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handlePhoto}
                disabled={!isOnline}
                className={cn(
                  "relative group py-4 rounded-xl overflow-hidden",
                  "glass transition-all duration-200",
                  "hover:scale-[1.03] active:scale-[0.97]",
                  "flex flex-col items-center gap-2",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                )}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary-500/20 to-transparent transition-opacity duration-200" />
                <Camera className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-primary-400" />
                <span className="text-xs font-medium relative z-10">拍照</span>
              </button>

              <button
                onClick={handleRecord}
                disabled={!isOnline}
                className={cn(
                  "relative group py-4 rounded-xl overflow-hidden",
                  "transition-all duration-200",
                  "hover:scale-[1.03] active:scale-[0.97]",
                  "flex flex-col items-center gap-2",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                  isRecording
                    ? "bg-red-500/20 ring-1 ring-red-400/50 shadow-glow-danger"
                    : "glass"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    isRecording
                      ? "bg-gradient-to-br from-red-500/30 to-transparent"
                      : "bg-gradient-to-br from-red-500/20 to-transparent"
                  )}
                />
                {isRecording ? (
                  <Stop className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-red-400 fill-red-400" />
                ) : (
                  <Record className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-red-400 fill-red-400" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium relative z-10",
                    isRecording && "text-red-300"
                  )}
                >
                  {isRecording ? "停止" : "录制"}
                </span>
                {isRecording && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              <button
                onClick={handleMicToggle}
                disabled={!isOnline}
                className={cn(
                  "relative group py-4 rounded-xl overflow-hidden",
                  "transition-all duration-200",
                  "hover:scale-[1.03] active:scale-[0.97]",
                  "flex flex-col items-center gap-2",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                  isMicOn
                    ? "bg-emerald-500/20 ring-1 ring-emerald-400/50 shadow-glow-success"
                    : "glass"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "bg-gradient-to-br from-emerald-500/20 to-transparent"
                  )}
                />
                {isMicOn ? (
                  <Mic className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-emerald-400" />
                ) : (
                  <MicOff className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium relative z-10",
                    isMicOn && "text-emerald-300"
                  )}
                >
                  {isMicOn ? "对讲中" : "对讲"}
                </span>
                {isMicOn && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5">
                    <div className="w-0.5 h-2 rounded bg-emerald-400 animate-pulse" />
                    <div className="w-0.5 h-3 rounded bg-emerald-400 animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <div className="w-0.5 h-1.5 rounded bg-emerald-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default CameraPreview;
