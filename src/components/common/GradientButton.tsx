import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] hover:brightness-110",
  secondary:
    "bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--muted))] text-white border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
  ghost:
    "bg-transparent text-white border border-[hsl(var(--border))] hover:bg-[hsl(var(--primary)/0.1)] hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--primary))]",
  danger:
    "bg-gradient-to-r from-[hsl(var(--danger))] to-[hsl(20_84%_60%)] text-white hover:shadow-[0_0_30px_hsl(var(--danger)/0.5)] hover:brightness-110",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-2.5",
};

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className,
      children,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative inline-flex items-center justify-center font-semibold rounded-xl",
          "transition-all duration-300 ease-out transform",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
          "active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "opacity-60 cursor-not-allowed hover:shadow-none active:scale-100",
          className
        )}
        {...props}
      >
        {variant === "primary" && !isDisabled && (
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              animation: "shimmer 2s infinite",
            }}
          />
        )}
        {loading && (
          <Loader2 className="animate-spin h-4 w-4 shrink-0" />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )}
        <span className="relative z-10 whitespace-nowrap">{children}</span>
        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
