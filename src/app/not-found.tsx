import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forge-base flex flex-col items-center justify-center text-center p-4">
      <div className="text-6xl mb-4">🗺️</div>
      <h1 className="text-4xl font-bold text-gradient-gold mb-2">404</h1>
      <p className="text-forge-parchment text-lg mb-1">Page not found</p>
      <p className="text-forge-muted text-sm mb-8">This corner of the world doesn&apos;t exist yet.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-gradient text-forge-void font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <Home className="w-4 h-4" />
        Return home
      </Link>
    </div>
  );
}
