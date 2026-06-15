import { forwardRef, ReactNode, MouseEvent, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  as?: "div" | "section" | "article";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, onClick, as: Component = "div", ...rest }, ref) => {
    return (
      <Component
        ref={ref as never}
        onClick={onClick}
        className={cn(
          "glass rounded-2xl overflow-hidden",
          hover && "glass-hover cursor-pointer",
          onClick && "cursor-pointer",
          className
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
