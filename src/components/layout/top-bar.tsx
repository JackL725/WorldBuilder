"use client";

import { useUIStore } from "@/store";
import { Search, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TopBarProps {
  worldId: string;
  worldName: string;
}

export function TopBar({ worldId, worldName }: TopBarProps) {
  const { dmMode, toggleCmdK, toggleSidebar } = useUIStore();

  return (
    <header className="flex items-center gap-3 px-4 h-[60px] border-b border-forge-border bg-forge-void/80 backdrop-blur-sm shrink-0">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-forge-muted hover:text-forge-parchment transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Cmd+K search trigger */}
      <button
        onClick={toggleCmdK}
        className={cn(
          "flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 rounded-lg",
          "bg-forge-raised border border-forge-border text-forge-muted",
          "hover:border-forge-gold/40 hover:text-forge-parchment",
          "transition-colors duration-150 cursor-pointer text-sm text-left"
        )}
      >
        <Search className="w-4 h-4" />
        <span>Search your world…</span>
        <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-forge-border text-forge-dim font-mono">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* DM mode badge */}
        {dmMode && (
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-forge-arcane/20 text-forge-arcane-light border border-forge-arcane/30">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-arcane-light animate-pulse" />
            DM Mode
          </span>
        )}

        {/* Worlds switcher */}
        <Link
          href="/worlds"
          className="text-xs text-forge-muted hover:text-forge-parchment transition-colors"
        >
          All worlds
        </Link>

        {/* Notifications placeholder */}
        <button className="relative text-forge-muted hover:text-forge-parchment transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
