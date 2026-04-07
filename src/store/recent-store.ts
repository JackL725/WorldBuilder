"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentItem {
  id: string;
  worldId: string;
  type: string;  // 'location' | 'character' | etc.
  name: string;
  href: string;
  visitedAt: number;
}

interface RecentState {
  items: RecentItem[];
  addRecent: (item: Omit<RecentItem, "visitedAt">) => void;
  clearRecent: (worldId?: string) => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      items: [],
      addRecent: (item) =>
        set((s) => {
          const filtered = s.items.filter((i) => i.id !== item.id);
          return {
            items: [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, 30),
          };
        }),
      clearRecent: (worldId) =>
        set((s) => ({
          items: worldId ? s.items.filter((i) => i.worldId !== worldId) : [],
        })),
    }),
    { name: "realm-forge-recent" }
  )
);
