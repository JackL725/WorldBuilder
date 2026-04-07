import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Plus, ArrowRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: "My Worlds" };

// Temporary shell for worlds list — before full worldId-based routing
export default async function WorldsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const worlds = await db.world.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  if (worlds.length === 1) {
    redirect(`/${worlds[0].id}/hub`);
  }

  return (
    <div className="min-h-screen bg-forge-base bg-forge-pattern flex items-start justify-center pt-16 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-forge-parchment">My Worlds</h1>
            <p className="text-forge-muted text-sm mt-0.5">{worlds.length} world{worlds.length !== 1 ? "s" : ""}</p>
          </div>
          <Button variant="gold" asChild>
            <Link href="/worlds/new">
              <Plus className="w-4 h-4" />
              New World
            </Link>
          </Button>
        </div>

        {worlds.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Globe className="w-12 h-12 text-forge-gold/30 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-forge-parchment mb-1">No worlds yet</h2>
              <p className="text-forge-muted text-sm mb-6">Create your first world to get started.</p>
              <Button variant="gold" asChild>
                <Link href="/worlds/new">
                  <Plus className="w-4 h-4" />
                  Create a world
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {worlds.map((world) => (
              <Link
                key={world.id}
                href={`/${world.id}/hub`}
                className="forge-card hover:border-forge-gold/30 p-4 flex items-center gap-4 transition-all duration-150 hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-forge-gold/10 border border-forge-gold/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-forge-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forge-parchment">{world.name}</p>
                  <p className="text-xs text-forge-muted mt-0.5">
                    {world.genre} · Updated {formatRelativeTime(world.updatedAt)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-forge-dim opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
