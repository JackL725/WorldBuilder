# 🗺️ Realm Forge

**The fantasy worldbuilding app for authors and dungeon masters.**

Build living, interconnected worlds — characters, factions, locations, history, lore, creatures, items, and quests — all linked together in one purpose-built creative tool.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Prisma + SQLite → Postgres |
| Auth | NextAuth.js v5 (Email magic link + Google OAuth) |
| Styling | Tailwind CSS + shadcn/ui (Dark Fantasy theme) |
| AI | Anthropic Claude API |
| State | Zustand |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Set up the database
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, verify routes
│   ├── (app)/           # Authenticated app shell
│   │   └── [worldId]/
│   │       ├── hub/     # World Hub dashboard
│   │       └── [module]/
│   │           ├── page.tsx          # Module list
│   │           └── [entityId]/page.tsx  # Entity detail
│   └── api/
│       └── auth/        # NextAuth handlers
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── layout/          # Sidebar, AppShell
│   └── modules/         # Module-specific components
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── db.ts            # Prisma client
│   └── utils.ts         # Helpers
├── store/               # Zustand stores
├── actions/             # Server actions
└── types/               # TypeScript types
```

## Modules

1. **Locations** — Regions, cities, districts, POIs
2. **Characters** — PCs, NPCs, villains, deities
3. **Factions** — Guilds, kingdoms, cults, noble houses
4. **History** — Visual timeline of eras and events
5. **Lore & Magic** — Magic systems, pantheons, languages
6. **Bestiary** — Creatures with D&D 5e stat blocks
7. **Items & Artifacts** — Weapons, relics, cursed objects
8. **Stories & Quests** — Plot threads, session notes

## Roadmap

See the [Notion Roadmap](https://notion.so) for full phase breakdown.
