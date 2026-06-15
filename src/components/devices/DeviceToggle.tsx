import { cn } from "@/lib/utils";

export interface DeviceToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DeviceToggle = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
}: DeviceToggleProps) => {
  const sizes = {
    sm: {
      track: "w-10 h-6",
      thumb: "w-4 h-4",
      translate: "translate-x-5",
      translateOff: "translate-x-1",
    },
    md: {
      track: "w-14 h-8",
      thumb: "w-6 h-6",
      translate: "translate-x-7",
      translateOff: "translate-x-1",
    },
    lg: {
      track: "w-18 h-10",
      thumb: "w-8 h-8",
      translate: "translate-x-9",
      translateOff: "translate-x-1",
    },
  };

  const s = sizes[size];

  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative rounded-full cursor-pointer select-none",
        "transition-all duration-300 ease-out",
        "ring-1 ring-inset",
        s.track,
        checked
          ? "bg-gradient-to-r from-primary-500 to-secondary-500 ring-primary-400/50 shadow-glow-primary"
          : "bg-deepspace-600 ring-white/10",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full overflow-hidden opacity-0 transition-opacity duration-500",
          checked && "opacity-100"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r from-primary-400/40 via-secondary-400/40 to-primary-400/40",
            "animate-pulse-glow"
          )}
          style={{ filter: "blur(8px)" }}
        />
      </div>

      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full",
          "transition-all duration-300 ease-out cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          "shadow-lg",
          s.thumb,
          checked
            ? cn(s.translate, "bg-white")
            : cn(s.translateOff, "bg-white/80")
        )}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 40%, rgba(200,200,200,0.8) 100%)",
          }}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-opacity duration-300",
            checked
              ? "opacity-100 shadow-[0_0_12px_rgba(22,119,255,0.6)]"
              : "opacity-0"
          )}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 rounded-full pointer-events-none",
          "ring-1 ring-inset ring-white/20"
        )}
      />
    </div>
  );
};

export default DeviceToggle;
