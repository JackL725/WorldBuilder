import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ worldId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { worldId } = await params;

  const world = await db.world.findFirst({
    where: { id: worldId, userId: session.user.id },
  });

  if (!world) redirect("/worlds");

  return (
    <AppShell worldId={world.id} worldName={world.name}>
      {children}
    </AppShell>
  );
}
