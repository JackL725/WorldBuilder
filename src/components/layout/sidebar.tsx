"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";
import { MODULE_CONFIGS } from "@/types";
import {
  MapPin,
  Users,
  Shield,
  Clock,
  BookOpen,
  Skull,
  Gem,
  Scroll,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Home,
  Inbox,
  Swords,
  Settings,
  LucideIcon,
} from "lucide-react";

// Map icon name strings to actual components
const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  Users,
  Shield,
  Clock,
  BookOpen,
  Skull,
  Gem,
  Scroll,
  ClipboardList,
  Swords,
};

interface SidebarProps {
  worldId: string;
  worldName: string;
}

export function Sidebar({ worldId, worldName }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, dmMode, toggleDmMode } = useUIStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-forge-void border-r border-forge-border",
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-14" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-forge-border min-h-[60px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-forge-gold/10 border border-forge-gold/30 flex items-center justify-center">
          <span className="text-sm">🗺️</span>
        </div>
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0 animate-fade-in">
            <p className="text-xs text-forge-muted truncate">Your world</p>
            <p className="text-sm font-semibold text-forge-parchment truncate">{worldName}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
        {/* Hub */}
        <SidebarLink
          href={`/${worldId}/hub`}
          icon={Home}
          label="World Hub"
          pathname={pathname}
          collapsed={sidebarCollapsed}
          exactMatch
        />

        {/* Divider */}
        <div className={cn("my-2 border-t border-forge-border", sidebarCollapsed ? "mx-2" : "mx-1")} />

        {/* Module links */}
        {MODULE_CONFIGS.map((mod) => {
          const Icon = ICON_MAP[mod.icon] ?? MapPin;
          return (
            <SidebarLink
              key={mod.key}
              href={`/${worldId}/${mod.key}`}
              icon={Icon}
              label={mod.label}
              pathname={pathname}
              collapsed={sidebarCollapsed}
              colorClass={mod.color}
            />
          );
        })}

        {/* Divider */}
        <div className={cn("my-2 border-t border-forge-border", sidebarCollapsed ? "mx-2" : "mx-1")} />

        {/* Inbox */}
        <SidebarLink
          href={`/${worldId}/inbox`}
          icon={Inbox}
          label="Inbox"
          pathname={pathname}
          collapsed={sidebarCollapsed}
        />
      </nav>

      {/* Footer controls */}
      <div className="border-t border-forge-border px-1.5 py-2 space-y-0.5">
        {/* DM Mode toggle */}
        <button
          onClick={toggleDmMode}
          title={dmMode ? "Exit DM Mode" : "Enter DM Mode"}
          className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm",
            "transition-colors duration-150 cursor-pointer",
            dmMode
              ? "bg-forge-arcane/20 text-arcane-light border border-forge-arcane/40"
              : "text-forge-muted hover:bg-forge-raised hover:text-forge-parchment"
          )}
        >
          {dmMode ? (
            <Eye className="w-4 h-4 flex-shrink-0" />
          ) : (
            <EyeOff className="w-4 h-4 flex-shrink-0" />
          )}
          {!sidebarCollapsed && (
            <span className="animate-fade-in">
              {dmMode ? "DM Mode ON" : "DM Mode"}
            </span>
          )}
        </button>

        {/* Settings */}
        <SidebarLink
          href="/settings"
          icon={Settings}
          label="Settings"
          pathname={pathname}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-[72px] z-10",
          "w-6 h-6 rounded-full bg-forge-raised border border-forge-border",
          "flex items-center justify-center",
          "text-forge-muted hover:text-forge-parchment hover:bg-forge-border",
          "transition-colors duration-150 cursor-pointer"
        )}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  pathname: string;
  collapsed: boolean;
  colorClass?: string;
  exactMatch?: boolean;
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  pathname,
  collapsed,
  colorClass,
  exactMatch = false,
}: SidebarLinkProps) {
  const isActive = exactMatch ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm",
        "transition-colors duration-150",
        isActive
          ? "bg-forge-raised text-forge-parchment border border-forge-border"
          : "text-forge-muted hover:bg-forge-raised/60 hover:text-forge-parchment"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0",
          isActive ? (colorClass ?? "text-forge-gold") : ""
        )}
      />
      {!collapsed && (
        <span className="animate-slide-in-left truncate">{label}</span>
      )}
      {isActive && !collapsed && (
        <div className="ml-auto w-1 h-4 rounded-full bg-forge-gold opacity-60" />
      )}
    </Link>
  );
}
