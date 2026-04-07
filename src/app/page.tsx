import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Find the user's most recent world and redirect to its hub
  const world = await db.world.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  if (world) {
    redirect(`/${world.id}/hub`);
  }

  // No worlds yet — redirect to world creation
  redirect("/worlds/new");
}
