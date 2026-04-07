import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, MapPin, Users, Shield, Clock, BookOpen, Skull, Gem, Scroll, ClipboardList } from "lucide-react";
import { formatRelativeTime, kebabToTitle } from "@/lib/utils";
import { Metadata } from "next";
import { LucideIcon } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ worldId: string; module: string }> }): Promise<Metadata> {
  const { module } = await params;
  return { title: kebabToTitle(module) };
}

const MODULE_META: Record<
  string,
  { label: string; icon: LucideIcon; color: string; fetchFn: (worldId: string) => Promise<{ id: string; name: string; updatedAt: Date; createdAt: Date }[]> }
> = {
  locations:   { label: "Locations",      icon: MapPin,       color: "text-emerald-400", fetchFn: (wId) => db.location.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  characters:  { label: "Characters",     icon: Users,        color: "text-sky-400",     fetchFn: (wId) => db.character.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  factions:    { label: "Factions",       icon: Shield,       color: "text-amber-400",   fetchFn: (wId) => db.faction.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  history:     { label: "History",        icon: Clock,        color: "text-orange-400",  fetchFn: (wId) => db.historyEvent.findMany({ where: { worldId: wId }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  lore:        { label: "Lore & Magic",   icon: BookOpen,     color: "text-violet-400",  fetchFn: (wId) => db.loreEntry.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  bestiary:    { label: "Bestiary",       icon: Skull,        color: "text-red-400",     fetchFn: (wId) => db.creature.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  items:       { label: "Items",          icon: Gem,          color: "text-yellow-400",  fetchFn: (wId) => db.item.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  quests:      { label: "Quests",         icon: Scroll,       color: "text-rose-400",    fetchFn: (wId) => db.quest.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
  sessions:    { label: "Sessions",       icon: ClipboardList, color: "text-teal-400",  fetchFn: (wId) => db.gameSession.findMany({ where: { worldId: wId }, orderBy: { updatedAt: "desc" }, select: { id: true, name: true, updatedAt: true, createdAt: true } }) },
};

export default async function ModuleListPage({
  params,
}: {
  params: Promise<{ worldId: string; module: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { worldId, module: moduleKey } = await params;

  const meta = MODULE_META[moduleKey];
  if (!meta) redirect(`/${worldId}/hub`);

  const Icon = meta.icon;
  const entities = await meta.fetchFn(worldId);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title={meta.label}
        description={`${entities.length} ${entities.length === 1 ? "entry" : "entries"} in this world`}
        icon={Icon}
        iconColor={meta.color}
      >
        <Button variant="gold" size="sm" asChild>
          <Link href={`/${worldId}/${moduleKey}/new`}>
            <Plus className="w-4 h-4" />
            New {meta.label.replace(/ & .+/, "").slice(0, -1) || meta.label}
          </Link>
        </Button>
      </PageHeader>

      {entities.length === 0 ? (
        // Empty state
        <div className="forge-card border-dashed p-12 text-center">
          <Icon className={`w-10 h-10 ${meta.color} opacity-40 mx-auto mb-3`} />
          <p className="text-forge-parchment font-medium mb-1">No {meta.label.toLowerCase()} yet</p>
          <p className="text-forge-muted text-sm mb-5">
            Start building your world by adding your first {meta.label.toLowerCase().replace(/ & .+/, "")} entry.
          </p>
          <Button variant="gold" asChild>
            <Link href={`/${worldId}/${moduleKey}/new`}>
              <Plus className="w-4 h-4" />
              Create first entry
            </Link>
          </Button>
        </div>
      ) : (
        // Entity grid
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/${worldId}/${moduleKey}/${entity.id}`}
              className="forge-card hover:border-forge-gold/30 p-4 transition-all duration-150 hover:-translate-y-0.5 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-forge-raised border border-forge-border flex items-center justify-center flex-shrink-0 group-hover:border-forge-gold/30 transition-colors">
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forge-parchment truncate">{entity.name}</p>
                  <p className="text-xs text-forge-muted mt-0.5">Updated {formatRelativeTime(entity.updatedAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
