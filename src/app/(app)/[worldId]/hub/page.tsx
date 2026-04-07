import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getWorldCounts } from "@/lib/session";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Users, Shield, Clock, BookOpen,
  Skull, Gem, Scroll, ClipboardList, Home,
  ArrowRight, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ worldId: string }> }): Promise<Metadata> {
  const { worldId } = await params;
  const world = await db.world.findFirst({ where: { id: worldId } });
  return { title: world ? `${world.name} — Hub` : "Hub" };
}

const MODULE_CARDS = [
  { key: "locations", label: "Locations", icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { key: "characters", label: "Characters", icon: Users, color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20" },
  { key: "factions", label: "Factions", icon: Shield, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { key: "history", label: "History", icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { key: "lore", label: "Lore & Magic", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
  { key: "bestiary", label: "Bestiary", icon: Skull, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  { key: "items", label: "Items", icon: Gem, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { key: "quests", label: "Quests", icon: Scroll, color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
  { key: "sessions", label: "Sessions", icon: ClipboardList, color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20" },
] as const;

export default async function WorldHubPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { worldId } = await params;
  const world = await db.world.findFirst({
    where: { id: worldId, userId: session.user.id },
  });
  if (!world) redirect("/worlds");

  const counts = await getWorldCounts(worldId);

  // Recent activity: last 6 updated entities across all modules
  const [recentLocations, recentChars, recentFactions, recentQuests] = await Promise.all([
    db.location.findMany({ where: { worldId }, orderBy: { updatedAt: "desc" }, take: 2, select: { id: true, name: true, updatedAt: true } }),
    db.character.findMany({ where: { worldId }, orderBy: { updatedAt: "desc" }, take: 2, select: { id: true, name: true, updatedAt: true } }),
    db.faction.findMany({ where: { worldId }, orderBy: { updatedAt: "desc" }, take: 1, select: { id: true, name: true, updatedAt: true } }),
    db.quest.findMany({ where: { worldId }, orderBy: { updatedAt: "desc" }, take: 1, select: { id: true, name: true, updatedAt: true } }),
  ]);

  const countMap: Record<string, number> = {
    locations: counts.locations,
    characters: counts.characters,
    factions: counts.factions,
    history: counts.historyEvents,
    lore: counts.loreEntries,
    bestiary: counts.creatures,
    items: counts.items,
    quests: counts.quests,
  };

  const totalEntities = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={world.name}
        description={world.description ?? "Your world awaits. Start building."}
        icon={Home}
      >
        <Badge variant="gold">{world.genre}</Badge>
        {totalEntities > 0 && (
          <Badge variant="muted">{totalEntities} entries</Badge>
        )}
      </PageHeader>

      {/* Stats banner */}
      {totalEntities === 0 ? (
        // Empty state
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-10 h-10 text-forge-gold/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-forge-parchment mb-1">Your world is empty</h3>
            <p className="text-forge-muted text-sm max-w-sm mx-auto mb-6">
              Every great world starts somewhere. Pick a module below to add your first entry.
            </p>
          </CardContent>
        </Card>
      ) : (
        // Quick stats
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Locations", value: counts.locations },
            { label: "Characters", value: counts.characters },
            { label: "Factions", value: counts.factions },
            { label: "Quests", value: counts.quests },
          ].map((stat) => (
            <Card key={stat.label} variant="raised">
              <CardContent className="py-3 px-4">
                <p className="text-2xl font-bold text-forge-parchment">{stat.value}</p>
                <p className="text-xs text-forge-muted">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Module grid */}
      <div>
        <h2 className="text-sm font-medium text-forge-muted uppercase tracking-wider mb-3">
          Modules
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {MODULE_CARDS.map((mod) => {
            const Icon = mod.icon;
            const count = countMap[mod.key] ?? 0;
            return (
              <Link
                key={mod.key}
                href={`/${worldId}/${mod.key}`}
                className="group forge-card hover:border-forge-gold/30 p-4 flex items-start gap-3 transition-all duration-150 hover:-translate-y-0.5"
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${mod.bg}`}>
                  <Icon className={`w-4 h-4 ${mod.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-forge-parchment">{mod.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-forge-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-forge-muted mt-0.5">
                    {count === 0 ? "No entries yet" : `${count} ${count === 1 ? "entry" : "entries"}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      {totalEntities > 0 && (
        <div>
          <h2 className="text-sm font-medium text-forge-muted uppercase tracking-wider mb-3">
            Recently Updated
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-forge-border">
                {[
                  ...recentLocations.map((e) => ({ ...e, type: "locations", icon: MapPin, color: "text-emerald-400" })),
                  ...recentChars.map((e) => ({ ...e, type: "characters", icon: Users, color: "text-sky-400" })),
                  ...recentFactions.map((e) => ({ ...e, type: "factions", icon: Shield, color: "text-amber-400" })),
                  ...recentQuests.map((e) => ({ ...e, type: "quests", icon: Scroll, color: "text-rose-400" })),
                ]
                  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                  .slice(0, 6)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={`/${worldId}/${item.type}/${item.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-forge-raised transition-colors"
                      >
                        <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                        <span className="text-sm text-forge-parchment flex-1 truncate">{item.name}</span>
                        <span className="text-xs text-forge-muted">{formatRelativeTime(item.updatedAt)}</span>
                      </Link>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
