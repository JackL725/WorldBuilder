import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface AppShellProps {
  worldId: string;
  worldName: string;
  children: React.ReactNode;
}

export function AppShell({ worldId, worldName, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-forge-base">
      {/* Sidebar */}
      <Sidebar worldId={worldId} worldName={worldName} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar worldId={worldId} worldName={worldName} />
        <main className="flex-1 overflow-y-auto p-6 bg-forge-pattern">
          {children}
        </main>
      </div>
    </div>
  );
}
