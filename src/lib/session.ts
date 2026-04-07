import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/** Get the current authenticated user or redirect to login */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user;
}

/** Get the current user's worlds */
export async function getUserWorlds(userId: string) {
  return db.world.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

/** Get a world by ID, verifying ownership */
export async function getWorld(worldId: string, userId: string) {
  const world = await db.world.findFirst({
    where: { id: worldId, userId },
  });
  if (!world) redirect("/");
  return world;
}

/** Get entity counts for a world (for the hub dashboard) */
export async function getWorldCounts(worldId: string) {
  const [locations, characters, factions, historyEvents, loreEntries, creatures, items, quests] =
    await Promise.all([
      db.location.count({ where: { worldId } }),
      db.character.count({ where: { worldId } }),
      db.faction.count({ where: { worldId } }),
      db.historyEvent.count({ where: { worldId } }),
      db.loreEntry.count({ where: { worldId } }),
      db.creature.count({ where: { worldId } }),
      db.item.count({ where: { worldId } }),
      db.quest.count({ where: { worldId } }),
    ]);

  return { locations, characters, factions, historyEvents, loreEntries, creatures, items, quests };
}
