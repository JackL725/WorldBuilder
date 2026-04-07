// src/app/(app)/[worldId]/inbox/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, Plus } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { worldId } = await params;

  const items = await db.inboxItem.findMany({
    where: { worldId, processed: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <PageHeader
        title="Inbox"
        description="Quick-capture ideas. Drag them into any module when you're ready."
        icon={Inbox}
      />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Inbox className="w-8 h-8 text-forge-dim mx-auto mb-3" />
            <p className="text-forge-parchment font-medium mb-1">Inbox is empty</p>
            <p className="text-forge-muted text-sm">
              Use the quick-capture button to jot down ideas without interrupting your flow.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-3 px-4">
                <p className="text-sm text-forge-parchment">{item.content}</p>
                <p className="text-xs text-forge-muted mt-1">{formatRelativeTime(item.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
