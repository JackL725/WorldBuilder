import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Edit, Lock, Eye, MapPin, Users, Shield, Clock, BookOpen, Skull, Gem, Scroll, ClipboardList } from "lucide-react";
import { formatRelativeTime, stripHtml, truncate, kebabToTitle } from "@/lib/utils";
import { Metadata } from "next";
import { LucideIcon } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ worldId: string; module: string; entityId: string }>;
}): Promise<Metadata> {
  const { worldId, module: moduleKey, entityId } = await params;
  const entity = await fetchEntity(moduleKey, worldId, entityId);
  return { title: entity?.name ?? kebabToTitle(moduleKey) };
}

const ICON_MAP: Record<string, LucideIcon> = {
  locations: MapPin,
  characters: Users,
  factions: Shield,
  history: Clock,
  lore: BookOpen,
  bestiary: Skull,
  items: Gem,
  quests: Scroll,
  sessions: ClipboardList,
};

const COLOR_MAP: Record<string, string> = {
  locations: "text-emerald-400",
  characters: "text-sky-400",
  factions: "text-amber-400",
  history: "text-orange-400",
  lore: "text-violet-400",
  bestiary: "text-red-400",
  items: "text-yellow-400",
  quests: "text-rose-400",
  sessions: "text-teal-400",
};

async function fetchEntity(
  moduleKey: string,
  worldId: string,
  entityId: string
): Promise<{ id: string; name: string; publicContent: string | null; privateContent: string | null; tags: string; updatedAt: Date; createdAt: Date } | null> {
  const base = { where: { id: entityId, worldId } };
  const select = { id: true, name: true, publicContent: true, privateContent: true, tags: true, updatedAt: true, createdAt: true };

  switch (moduleKey) {
    case "locations":  return db.location.findFirst({ ...base, select });
    case "characters": return db.character.findFirst({ ...base, select });
    case "factions":   return db.faction.findFirst({ ...base, select });
    case "history":    return db.historyEvent.findFirst({ ...base, select });
    case "lore":       return db.loreEntry.findFirst({ ...base, select });
    case "bestiary":   return db.creature.findFirst({ ...base, select });
    case "items":      return db.item.findFirst({ ...base, select });
    case "quests":     return db.quest.findFirst({ ...base, select });
    case "sessions":   return db.gameSession.findFirst({ ...base, select });
    default:           return null;
  }
}

export default async function EntityDetailPage({
  params,
}: {
  params: Promise<{ worldId: string; module: string; entityId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { worldId, module: moduleKey, entityId } = await params;

  const entity = await fetchEntity(moduleKey, worldId, entityId);
  if (!entity) notFound();

  const Icon = ICON_MAP[moduleKey] ?? MapPin;
  const color = COLOR_MAP[moduleKey] ?? "text-forge-gold";
  const tags: string[] = JSON.parse(entity.tags || "[]");
  const hasPrivate = !!entity.privateContent;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        href={`/${worldId}/${moduleKey}`}
        className="inline-flex items-center gap-1.5 text-sm text-forge-muted hover:text-forge-parchment mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {kebabToTitle(moduleKey)}
      </Link>

      <PageHeader
        title={entity.name}
        icon={Icon}
        iconColor={color}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${worldId}/${moduleKey}/${entityId}/edit`}>
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Link>
        </Button>
      </PageHeader>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mb-5 -mt-3">
        <Badge variant="muted">
          <Clock className="w-3 h-3" />
          Updated {formatRelativeTime(entity.updatedAt)}
        </Badge>
        {tags.map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
        {hasPrivate && (
          <Badge variant="arcane">
            <Lock className="w-3 h-3" />
            Has private content
          </Badge>
        )}
      </div>

      {/* Public content */}
      {entity.publicContent ? (
        <Card className="mb-4">
          <CardContent className="pt-5">
            <div
              className="prose prose-sm max-w-none text-forge-parchment"
              dangerouslySetInnerHTML={{ __html: entity.publicContent }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-4 border-dashed">
          <CardContent className="py-8 text-center">
            <Eye className="w-8 h-8 text-forge-dim mx-auto mb-2" />
            <p className="text-forge-muted text-sm">No public content yet.</p>
            <Link
              href={`/${worldId}/${moduleKey}/${entityId}/edit`}
              className="text-forge-gold text-sm hover:underline mt-1 inline-block"
            >
              Add content →
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Private content (DM only — shown conditionally client-side) */}
      {hasPrivate && (
        <Card className="border-forge-arcane/30 bg-forge-arcane/5">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 text-arcane-light" />
              <span className="text-xs font-medium text-arcane-light uppercase tracking-wider">
                DM Only — Private Content
              </span>
            </div>
            <div
              className="prose prose-sm max-w-none text-forge-parchment"
              dangerouslySetInnerHTML={{ __html: entity.privateContent! }}
            />
          </CardContent>
        </Card>
      )}

      {/* Linked entities placeholder */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-forge-muted uppercase tracking-wider mb-2">Connections</h3>
        <Card className="border-dashed">
          <CardContent className="py-6 text-center">
            <p className="text-forge-muted text-sm">
              Bi-directional linking coming in Phase 4.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
