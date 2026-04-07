"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateId } from "@/lib/cuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types";

export async function createWorld(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const genre = (formData.get("genre") as string) || "fantasy";

  if (!name?.trim()) return { success: false, error: "World name is required" };

  const world = await db.world.create({
    data: {
      id: generateId(),
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() || null,
      genre,
    },
  });

  revalidatePath("/worlds");
  return { success: true, data: { id: world.id } };
}

export async function updateWorld(
  worldId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const world = await db.world.findFirst({ where: { id: worldId, userId: session.user.id } });
  if (!world) return { success: false, error: "World not found" };

  await db.world.update({
    where: { id: worldId },
    data: {
      name: (formData.get("name") as string)?.trim() || world.name,
      description: (formData.get("description") as string)?.trim() || null,
      genre: (formData.get("genre") as string) || world.genre,
    },
  });

  revalidatePath(`/${worldId}/hub`);
  return { success: true, data: undefined };
}

export async function deleteWorld(worldId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await db.world.deleteMany({ where: { id: worldId, userId: session.user.id } });
  revalidatePath("/worlds");
  redirect("/worlds");
}
