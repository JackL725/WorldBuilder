import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createWorld } from "@/actions/world";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Create World" };

export default async function NewWorldPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const GENRES = [
    { value: "fantasy", label: "High Fantasy", emoji: "✨" },
    { value: "dark-fantasy", label: "Dark Fantasy", emoji: "🔮" },
    { value: "sci-fi", label: "Sci-Fi", emoji: "🚀" },
    { value: "horror", label: "Horror", emoji: "🕷️" },
    { value: "historical", label: "Historical", emoji: "🏰" },
    { value: "custom", label: "Custom", emoji: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-forge-base bg-forge-pattern flex items-start justify-center pt-16 p-4">
      <div className="w-full max-w-lg">
        <Link
          href="/worlds"
          className="inline-flex items-center gap-1.5 text-sm text-forge-muted hover:text-forge-parchment mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to worlds
        </Link>

        <div className="forge-card p-6">
          <h1 className="text-xl font-bold text-forge-parchment mb-1">Create a new world</h1>
          <p className="text-forge-muted text-sm mb-6">Every great story starts with a single name.</p>

          <form
            action={async (formData: FormData) => {
              "use server";
              const result = await createWorld(formData);
              if (result.success) {
                redirect(`/${result.data.id}/hub`);
              }
            }}
            className="space-y-4"
          >
            {/* World name */}
            <div>
              <label className="block text-sm font-medium text-forge-muted mb-1.5" htmlFor="name">
                World name <span className="text-forge-gold">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                placeholder="e.g. The Sunken Realm"
                className="w-full px-3 py-2.5 rounded-lg bg-forge-raised border border-forge-border
                           text-forge-parchment placeholder:text-forge-dim text-sm
                           focus:outline-none focus:ring-2 focus:ring-forge-gold/50 focus:border-forge-gold/50
                           transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-forge-muted mb-1.5" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="A brief description of your world..."
                className="w-full px-3 py-2.5 rounded-lg bg-forge-raised border border-forge-border
                           text-forge-parchment placeholder:text-forge-dim text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-forge-gold/50 focus:border-forge-gold/50
                           transition-colors"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-forge-muted mb-1.5">
                Genre
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENRES.map((genre) => (
                  <label key={genre.value} className="cursor-pointer">
                    <input type="radio" name="genre" value={genre.value} defaultChecked={genre.value === "fantasy"} className="sr-only peer" />
                    <div className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-forge-border
                                    text-forge-muted text-xs text-center
                                    peer-checked:border-forge-gold/50 peer-checked:bg-forge-gold/10 peer-checked:text-forge-gold
                                    hover:border-forge-border/80 hover:bg-forge-raised
                                    transition-colors">
                      <span className="text-lg">{genre.emoji}</span>
                      {genre.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gold-gradient text-forge-void font-semibold text-sm
                         hover:opacity-90 transition-opacity cursor-pointer"
            >
              Create world →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
