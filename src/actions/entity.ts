"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateId } from "@/lib/cuid";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

type EntityModule = "locations" | "characters" | "factions" | "history" | "lore" | "bestiary" | "items" | "quests" | "sessions";

interface CreateEntityInput {
  name: string;
  publicContent?: string;
  privateContent?: string;
  tags?: string[];
}

// Generic create helper — module-specific fields handled in Phase 3
export async function createEntity(
  worldId: string,
  module: EntityModule,
  input: CreateEntityInput
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  // Verify world ownership
  const world = await db.world.findFirst({ where: { id: worldId, userId: session.user.id } });
  if (!world) return { success: false, error: "World not found" };

  const id = generateId();
  const baseData = {
    id,
    worldId,
    name: input.name.trim(),
    publicContent: input.publicContent || null,
    privateContent: input.privateContent || null,
    tags: JSON.stringify(input.tags || []),
  };

  switch (module) {
    case "locations":  await db.location.create({ data: baseData });     break;
    case "characters": await db.character.create({ data: baseData });    break;
    case "factions":   await db.faction.create({ data: baseData });      break;
    case "history":    await db.historyEvent.create({ data: baseData }); break;
    case "lore":       await db.loreEntry.create({ data: baseData });    break;
    case "bestiary":   await db.creature.create({ data: baseData });     break;
    case "items":      await db.item.create({ data: baseData });         break;
    case "quests":     await db.quest.create({ data: baseData });        break;
    case "sessions":   await db.gameSession.create({ data: baseData });  break;
    default: return { success: false, error: "Unknown module" };
  }

  revalidatePath(`/${worldId}/${module}`);
  revalidatePath(`/${worldId}/hub`);
  return { success: true, data: { id } };
}

export async function updateEntity(
  worldId: string,
  module: EntityModule,
  entityId: string,
  input: Partial<CreateEntityInput>
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const world = await db.world.findFirst({ where: { id: worldId, userId: session.user.id } });
  if (!world) return { success: false, error: "World not found" };

  const updateData = {
    ...(input.name && { name: input.name.trim() }),
    ...(input.publicContent !== undefined && { publicContent: input.publicContent }),
    ...(input.privateContent !== undefined && { privateContent: input.privateContent }),
    ...(input.tags && { tags: JSON.stringify(input.tags) }),
  };

  switch (module) {
    case "locations":  await db.location.updateMany({ where: { id: entityId, worldId }, data: updateData });     break;
    case "characters": await db.character.updateMany({ where: { id: entityId, worldId }, data: updateData });    break;
    case "factions":   await db.faction.updateMany({ where: { id: entityId, worldId }, data: updateData });      break;
    case "history":    await db.historyEvent.updateMany({ where: { id: entityId, worldId }, data: updateData }); break;
    case "lore":       await db.loreEntry.updateMany({ where: { id: entityId, worldId }, data: updateData });    break;
    case "bestiary":   await db.creature.updateMany({ where: { id: entityId, worldId }, data: updateData });     break;
    case "items":      await db.item.updateMany({ where: { id: entityId, worldId }, data: updateData });         break;
    case "quests":     await db.quest.updateMany({ where: { id: entityId, worldId }, data: updateData });        break;
    case "sessions":   await db.gameSession.updateMany({ where: { id: entityId, worldId }, data: updateData });  break;
    default: return { success: false, error: "Unknown module" };
  }

  revalidatePath(`/${worldId}/${module}`);
  revalidatePath(`/${worldId}/${module}/${entityId}`);
  return { success: true, data: undefined };
}

export async function deleteEntity(
  worldId: string,
  module: EntityModule,
  entityId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const world = await db.world.findFirst({ where: { id: worldId, userId: session.user.id } });
  if (!world) return { success: false, error: "World not found" };

  switch (module) {
    case "locations":  await db.location.deleteMany({ where: { id: entityId, worldId } });     break;
    case "characters": await db.character.deleteMany({ where: { id: entityId, worldId } });    break;
    case "factions":   await db.faction.deleteMany({ where: { id: entityId, worldId } });      break;
    case "history":    await db.historyEvent.deleteMany({ where: { id: entityId, worldId } }); break;
    case "lore":       await db.loreEntry.deleteMany({ where: { id: entityId, worldId } });    break;
    case "bestiary":   await db.creature.deleteMany({ where: { id: entityId, worldId } });     break;
    case "items":      await db.item.deleteMany({ where: { id: entityId, worldId } });         break;
    case "quests":     await db.quest.deleteMany({ where: { id: entityId, worldId } });        break;
    case "sessions":   await db.gameSession.deleteMany({ where: { id: entityId, worldId } });  break;
    default: return { success: false, error: "Unknown module" };
  }

  revalidatePath(`/${worldId}/${module}`);
  revalidatePath(`/${worldId}/hub`);
  return { success: true, data: undefined };
}

// ─── Entity Links ─────────────────────────────────────────────────────────────

/** Create a bi-directional link between two entities */
export async function createEntityLink(
  worldId: string,
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
  label?: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const world = await db.world.findFirst({ where: { id: worldId, userId: session.user.id } });
  if (!world) return { success: false, error: "World not found" };

  // Create both directions
  await db.$transaction([
    db.entityLink.upsert({
      where: { fromType_fromId_toType_toId: { fromType, fromId, toType, toId } },
      create: { id: generateId(), worldId, fromType, fromId, toType, toId, label },
      update: { label },
    }),
    db.entityLink.upsert({
      where: { fromType_fromId_toType_toId: { fromType: toType, fromId: toId, toType: fromType, toId: fromId } },
      create: { id: generateId(), worldId, fromType: toType, fromId: toId, toType: fromType, toId: fromId, label },
      update: { label },
    }),
  ]);

  return { success: true, data: undefined };
}
