import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "arcane" | "success" | "danger" | "muted";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-forge-raised border border-forge-border text-forge-parchment": variant === "default",
          "bg-forge-gold/15 border border-forge-gold/30 text-forge-gold": variant === "gold",
          "bg-forge-arcane/15 border border-forge-arcane/30 text-arcane-light": variant === "arcane",
          "bg-emerald-900/30 border border-emerald-800/40 text-emerald-400": variant === "success",
          "bg-red-900/30 border border-red-800/40 text-red-400": variant === "danger",
          "bg-forge-raised border border-forge-border text-forge-muted": variant === "muted",
        },
        className
      )}
      {...props}
    />
  );
}
