import { World, Location, Character, Faction, HistoryEvent, LoreEntry, Creature, Item, Quest, GameSession } from "@prisma/client";

// Re-export Prisma types
export type { World, Location, Character, Faction, HistoryEvent, LoreEntry, Creature, Item, Quest, GameSession };

// ─── Module Config ───────────────────────────────────────────────────────────

export type ModuleKey =
  | "locations"
  | "characters"
  | "factions"
  | "history"
  | "lore"
  | "bestiary"
  | "items"
  | "quests"
  | "sessions";

export interface ModuleConfig {
  key: ModuleKey;
  label: string;
  icon: string;         // lucide icon name
  color: string;        // tailwind color class
  description: string;
  href: (worldId: string) => string;
}

export const MODULE_CONFIGS: ModuleConfig[] = [
  {
    key: "locations",
    label: "Locations",
    icon: "MapPin",
    color: "text-emerald-400",
    description: "Regions, cities, dungeons & points of interest",
    href: (wId) => `/${wId}/locations`,
  },
  {
    key: "characters",
    label: "Characters",
    icon: "Users",
    color: "text-sky-400",
    description: "PCs, NPCs, villains & deities",
    href: (wId) => `/${wId}/characters`,
  },
  {
    key: "factions",
    label: "Factions",
    icon: "Shield",
    color: "text-amber-400",
    description: "Guilds, kingdoms, cults & noble houses",
    href: (wId) => `/${wId}/factions`,
  },
  {
    key: "history",
    label: "History",
    icon: "Clock",
    color: "text-orange-400",
    description: "Eras, key events & the world timeline",
    href: (wId) => `/${wId}/history`,
  },
  {
    key: "lore",
    label: "Lore & Magic",
    icon: "BookOpen",
    color: "text-violet-400",
    description: "Magic systems, pantheons, prophecies & languages",
    href: (wId) => `/${wId}/lore`,
  },
  {
    key: "bestiary",
    label: "Bestiary",
    icon: "Skull",
    color: "text-red-400",
    description: "Creatures, monsters & encounter tables",
    href: (wId) => `/${wId}/bestiary`,
  },
  {
    key: "items",
    label: "Items & Artifacts",
    icon: "Gem",
    color: "text-yellow-400",
    description: "Weapons, relics, cursed objects & treasure",
    href: (wId) => `/${wId}/items`,
  },
  {
    key: "quests",
    label: "Quests",
    icon: "Scroll",
    color: "text-rose-400",
    description: "Plot threads, hooks & active story arcs",
    href: (wId) => `/${wId}/quests`,
  },
  {
    key: "sessions",
    label: "Sessions",
    icon: "ClipboardList",
    color: "text-teal-400",
    description: "Session prep, notes & recaps",
    href: (wId) => `/${wId}/sessions`,
  },
];

// Map module route segment to module key
export const MODULE_ROUTE_MAP: Record<string, ModuleKey> = {
  locations: "locations",
  characters: "characters",
  factions: "factions",
  history: "history",
  lore: "lore",
  bestiary: "bestiary",
  items: "items",
  quests: "quests",
  sessions: "sessions",
};

// ─── Entity types ──────────────────────────────────────────────────────────────

export type EntityType =
  | "location"
  | "character"
  | "faction"
  | "history-event"
  | "lore"
  | "creature"
  | "item"
  | "quest"
  | "session";

// Base shape shared by all entities
export interface BaseEntity {
  id: string;
  worldId: string;
  name: string;
  publicContent: string | null;
  privateContent: string | null;
  imageUrls: string;   // JSON array string
  tags: string;        // JSON array string
  createdAt: Date;
  updatedAt: Date;
}

// ─── Server Action result types ─────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
