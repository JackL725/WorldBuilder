import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-forge-base bg-forge-pattern flex items-start justify-center pt-16 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-forge-parchment mb-6">Settings</h1>

        <div className="forge-card p-5 mb-4">
          <h2 className="font-semibold text-forge-parchment mb-1">Account</h2>
          <p className="text-forge-muted text-sm mb-4">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-red-800 text-red-400 text-sm
                         hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="forge-card p-5">
          <h2 className="font-semibold text-forge-parchment mb-1">About</h2>
          <p className="text-forge-muted text-sm">
            Realm Forge — Phase 0 — Foundation complete.
          </p>
        </div>
      </div>
    </div>
  );
}
