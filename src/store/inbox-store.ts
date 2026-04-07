"use client";

import { create } from "zustand";

interface InboxItem {
  id: string;
  content: string;
  worldId: string;
  createdAt: number;
  processed: boolean;
}

interface InboxState {
  items: InboxItem[];
  isOpen: boolean;
  addItem: (content: string, worldId: string) => void;
  removeItem: (id: string) => void;
  markProcessed: (id: string) => void;
  toggleOpen: () => void;
  setOpen: (v: boolean) => void;
}

export const useInboxStore = create<InboxState>()((set) => ({
  items: [],
  isOpen: false,
  addItem: (content, worldId) =>
    set((s) => ({
      items: [
        { id: crypto.randomUUID(), content, worldId, createdAt: Date.now(), processed: false },
        ...s.items,
      ],
    })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  markProcessed: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, processed: true } : i)),
    })),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (v) => set({ isOpen: v }),
}));
