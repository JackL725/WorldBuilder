import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = "text-forge-gold",
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forge-raised border border-forge-border flex items-center justify-center">
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-forge-parchment">{title}</h1>
          {description && (
            <p className="text-sm text-forge-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
