import { useState } from "react";
import {
  Lock,
  Unlock,
  AlertTriangle,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Clock,
  User,
  Shield,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  X,
  Check,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/useDeviceStore";
import type { Device, LockDeviceState, LockState } from "@/types/device";
import GlassCard from "@/components/common/GlassCard";
import { members } from "@/mock/members";

dayjs.extend(relativeTime);

interface LockStatusProps {
  device: Device;
  className?: string;
}

interface LockStateConfig {
  state: LockState;
  label: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  ShieldIcon: React.ComponentType<{ className?: string }>;
  color: string;
  glowClass: string;
  ringColor: string;
}

const lockStateConfigs: LockStateConfig[] = [
  {
    state: "locked",
    label: "已锁定",
    desc: "安全防护中",
    Icon: Lock,
    ShieldIcon: ShieldCheck,
    color: "#10b981",
    glowClass: "shadow-glow-success",
    ringColor: "ring-emerald-400/40",
  },
  {
    state: "unlocked",
    label: "已解锁",
    desc: "请注意安全",
    Icon: Unlock,
    ShieldIcon: Shield,
    color: "#f59e0b",
    glowClass: "shadow-glow-warning",
    ringColor: "ring-amber-400/40",
  },
  {
    state: "alarm",
    label: "报警中",
    desc: "异常情况！",
    Icon: AlertTriangle,
    ShieldIcon: ShieldAlert,
    color: "#ef4444",
    glowClass: "shadow-glow-danger",
    ringColor: "ring-red-400/40",
  },
];

const getBatteryIcon = (level: number) => {
  if (level <= 20) return BatteryLow;
  if (level <= 50) return BatteryMedium;
  return BatteryFull;
};

const getBatteryColor = (level: number) => {
  if (level <= 20) return "#ef4444";
  if (level <= 50) return "#f59e0b";
  return "#10b981";
};

const getUserName = (userId?: string) => {
  if (!userId) return "未知用户";
  const member = members.find((m) => m.id === userId);
  return member?.name || "访客";
};

const LockStatus = ({ device, className }: LockStatusProps) => {
  const state = device.state as LockDeviceState;
  const temporaryUnlock = useDeviceStore((s) => s.temporaryUnlock);
  const updateDeviceState = useDeviceStore((s) => s.updateDeviceState);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const config = lockStateConfigs.find((c) => c.state === state.state) || lockStateConfigs[0];
  const BatteryIcon = getBatteryIcon(state.battery);
  const batteryColor = getBatteryColor(state.battery);

  const handleTempUnlock = async () => {
    setIsUnlocking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    temporaryUnlock(device.id, 30000);
    setIsUnlocking(false);
    setShowConfirm(false);
  };

  const handleLockNow = () => {
    updateDeviceState(device.id, { state: "locked" } as Partial<LockDeviceState>);
  };

  return (
    <GlassCard className={cn("p-5 md:p-6", className)} hover={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center glass transition-all duration-500",
                config.glowClass
              )}
              style={{
                boxShadow: `0 0 30px ${config.color}44, inset 0 0 20px ${config.color}22`,
              }}
            >
              <div
                style={{
                  color: config.color,
                  filter: `drop-shadow(0 0 8px ${config.color})`,
                }}
              >
                <config.ShieldIcon
                  className="w-7 h-7 transition-all duration-500 scale-110"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">{device.name}</h3>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: config.color, boxShadow: `0 0 8px ${config.color}` }}
                />
                <span className="text-sm text-muted-foreground">{config.desc}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative rounded-3xl p-6 md:p-8 overflow-hidden glass",
            `ring-2 ${config.ringColor}`,
            config.glowClass
          )}
          style={{
            background: `radial-gradient(circle at 50% 30%, ${config.color}15 0%, transparent 60%)`,
          }}
        >
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-500",
              state.state === "alarm" && "animate-pulse opacity-40"
            )}
            style={{
              background: `radial-gradient(circle, ${config.color}22 0%, transparent 70%)`,
            }}
          />

          <div className="relative flex flex-col items-center">
            <div
              className={cn(
                "relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center",
                "transition-all duration-500",
                state.state === "alarm" && "animate-pulse"
              )}
              style={{
                background: `conic-gradient(from 0deg, ${config.color}44, ${config.color}11, ${config.color}44)`,
                boxShadow: `0 0 60px ${config.color}44, inset 0 0 40px ${config.color}22`,
              }}
            >
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, rgba(10,25,41,0.9), rgba(6,18,31,0.95))",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    color: config.color,
                    filter: `drop-shadow(0 0 16px ${config.color})`,
                  }}
                >
                  <config.Icon
                    className="w-14 h-14 md:w-18 md:h-18 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center space-y-1">
              <div
                className="text-2xl md:text-3xl font-black font-orbitron"
                style={{
                  color: config.color,
                  textShadow: `0 0 20px ${config.color}88`,
                }}
              >
                {config.label}
              </div>
              <div className="text-sm text-muted-foreground">{config.desc}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl glass space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" style={{ color: batteryColor }} />
                <span className="text-xs text-muted-foreground">电池电量</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <BatteryIcon className="w-8 h-8" style={{ color: batteryColor }} />
              <div className="flex-1">
                <div
                  className="text-xl md:text-2xl font-bold font-orbitron"
                  style={{ color: batteryColor }}
                >
                  {state.battery}%
                </div>
                <div className="h-1.5 mt-1.5 rounded-full bg-deepspace-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${state.battery}%`,
                      backgroundColor: batteryColor,
                      boxShadow: `0 0 8px ${batteryColor}88`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <span className="text-xs text-muted-foreground">最近开锁</span>
            </div>
            {state.lastUnlockTime ? (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {getUserName(state.lastUnlockUser)}
                </div>
                <div className="text-sm font-medium">
                  {dayjs(state.lastUnlockTime).fromNow()}
                </div>
                <div className="text-[10px] text-muted-foreground/70">
                  {dayjs(state.lastUnlockTime).format("MM-DD HH:mm")}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">暂无记录</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {state.state === "unlocked" ? (
            <button
              onClick={handleLockNow}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-white transition-all duration-300",
                "flex items-center justify-center gap-2",
                "bg-gradient-to-r from-emerald-500 to-primary-500",
                "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                "shadow-glow-success"
              )}
            >
              <Lock className="w-5 h-5" />
              立即上锁
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className={cn(
                "w-full py-4 rounded-xl font-bold transition-all duration-300",
                "flex items-center justify-center gap-2",
                "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
                "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                "shadow-glow-warning"
              )}
            >
              <KeyRound className="w-5 h-5" />
              临时开锁 (30秒)
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass rounded-3xl p-6 md:p-8 animate-scale-in shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(245,158,11,0.15)",
                    boxShadow: "0 0 20px rgba(245,158,11,0.3)",
                  }}
                >
                  <Unlock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">确认临时开锁</h3>
                  <p className="text-sm text-muted-foreground">{device.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl glass space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">安全提示</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>开锁后门将在 30 秒后自动重新锁定</li>
                  <li>请确保操作安全，防止陌生人进入</li>
                  <li>操作记录将被保存至日志系统</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className={cn(
                  "py-3.5 rounded-xl font-medium transition-all duration-200",
                  "glass hover:bg-white/10",
                  "flex items-center justify-center gap-2"
                )}
              >
                <X className="w-4 h-4" />
                取消
              </button>
              <button
                onClick={handleTempUnlock}
                disabled={isUnlocking}
                className={cn(
                  "py-3.5 rounded-xl font-bold text-white transition-all duration-300",
                  "flex items-center justify-center gap-2",
                  "bg-gradient-to-r from-amber-500 to-orange-500",
                  "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                  "shadow-glow-warning",
                  "disabled:opacity-60 disabled:cursor-wait"
                )}
              >
                {isUnlocking ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {isUnlocking ? "开锁中..." : "确认开锁"}
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default LockStatus;
