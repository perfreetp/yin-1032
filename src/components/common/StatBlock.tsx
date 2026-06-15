import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatBlockProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendDirection?: TrendDirection;
  icon?: ReactNode;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

const StatBlock = ({
  title,
  value,
  unit,
  trend,
  trendDirection,
  icon,
  className,
  valueClassName,
  onClick,
}: StatBlockProps) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-emerald-400";
      case "down":
        return "text-rose-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    const iconClass = "w-4 h-4 shrink-0";
    switch (trendDirection) {
      case "up":
        return <TrendingUp className={iconClass} />;
      case "down":
        return <TrendingDown className={iconClass} />;
      default:
        return <Minus className={iconClass} />;
    }
  };

  return (
    <GlassCard className={cn("p-5", className)} onClick={onClick}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)] flex items-center justify-center text-[hsl(var(--primary))]">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-3xl font-bold tracking-tight",
              "bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(280_70%_65%)]",
              "bg-clip-text text-transparent",
              "drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)]",
              valueClassName
            )}
            style={{
              textShadow: "0 0 30px hsl(var(--primary) / 0.3)",
            }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          )}
        </div>

        {(trend !== undefined || trendDirection) && (
          <div className={cn("flex items-center gap-1.5 text-sm", getTrendColor())}>
            {getTrendIcon()}
            {trend !== undefined && (
              <span className="font-medium">
                {trendDirection === "down" ? "-" : trendDirection === "up" ? "+" : ""}
                {Math.abs(trend)}%
              </span>
            )}
            <span className="text-muted-foreground text-xs">较上期</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatBlock;
