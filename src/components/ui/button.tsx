import { cn } from "@/lib/utils";
import React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "gold" | "arcane";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-gold/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Size
        {
          "h-7 px-2.5 text-xs": size === "sm",
          "h-9 px-4 text-sm": size === "md",
          "h-11 px-6 text-base": size === "lg",
          "h-9 w-9 p-0": size === "icon",
        },
        // Variant
        {
          "bg-forge-raised border border-forge-border text-forge-parchment hover:bg-forge-border":
            variant === "default",
          "border border-forge-border text-forge-parchment hover:bg-forge-raised":
            variant === "outline",
          "text-forge-muted hover:text-forge-parchment hover:bg-forge-raised":
            variant === "ghost",
          "bg-red-900/80 border border-red-800 text-red-200 hover:bg-red-900":
            variant === "destructive",
          "bg-gold-gradient text-forge-void font-semibold hover:opacity-90 shadow-md":
            variant === "gold",
          "bg-arcane-gradient text-white font-semibold hover:opacity-90 shadow-md":
            variant === "arcane",
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        children
      )}
    </Comp>
  );
}
