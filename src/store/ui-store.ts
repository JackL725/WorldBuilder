"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  dmMode: boolean;
  cmdKOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleDmMode: () => void;
  setCmdKOpen: (v: boolean) => void;
  toggleCmdK: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      dmMode: false,
      cmdKOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleDmMode: () => set((s) => ({ dmMode: !s.dmMode })),
      setCmdKOpen: (v) => set({ cmdKOpen: v }),
      toggleCmdK: () => set((s) => ({ cmdKOpen: !s.cmdKOpen })),
    }),
    { name: "realm-forge-ui" }
  )
);
