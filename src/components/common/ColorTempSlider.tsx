import { useCallback, useEffect, useRef, useState } from "react";
import { Sun, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorTempSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  showLabels?: boolean;
  disabled?: boolean;
}

const ColorTempSlider = ({
  value,
  onChange,
  min = 2700,
  max = 6500,
  step = 100,
  className,
  showLabels = true,
  disabled = false,
}: ColorTempSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

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

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const pos = (clientX - rect.left) / rect.width;
      const clampedPos = Math.min(1, Math.max(0, pos));
      const rawValue = min + clampedPos * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.min(max, Math.max(min, steppedValue));
    },
    [min, max, step, value]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    onChange(getValueFromPosition(e.clientX));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onChange(getValueFromPosition(e.clientX));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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
      if (e.touches[0]) {
        onChange(getValueFromPosition(e.touches[0].clientX));
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

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
    if (e.touches[0]) {
      onChange(getValueFromPosition(e.touches[0].clientX));
    }
  };

  const thumbColor = kelvinToColor(value);

  const getTempLabel = (kelvin: number): string => {
    if (kelvin < 3300) return "暖光";
    if (kelvin < 4500) return "暖白";
    if (kelvin < 5500) return "自然光";
    return "冷白光";
  };

  return (
    <div className={cn("w-full space-y-3", disabled && "opacity-50 pointer-events-none", className)}>
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-muted-foreground">{min}K</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass">
            <Thermometer className="w-3.5 h-3.5" style={{ color: thumbColor }} />
            <span className="text-sm font-bold" style={{ color: thumbColor }}>
              {value}K
            </span>
            <span className="text-xs text-muted-foreground">{getTempLabel(value)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{max}K</span>
            <Sun className="w-4 h-4 text-sky-300" />
          </div>
        </div>
      )}

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          "relative h-4 rounded-full cursor-pointer select-none",
          "color-temp-gradient",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
          "ring-1 ring-[hsl(var(--border))]"
        )}
      >
        <div
          className="absolute top-0 bottom-0 left-0 rounded-full pointer-events-none opacity-30"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, transparent 0%, ${thumbColor} 100%)`,
            filter: "blur(4px)",
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
            left: `${percentage}%`,
            backgroundColor: thumbColor,
            boxShadow: `0 0 0 4px ${thumbColor}33, 0 0 20px ${thumbColor}88, 0 4px 12px rgba(0,0,0,0.4)`,
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

export default ColorTempSlider;
