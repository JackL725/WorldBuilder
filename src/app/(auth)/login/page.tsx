import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  const params = await searchParams;
  const isVerify = params.verify === "true";
  const hasError = params.error === "true";

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forge-gold/10 border border-forge-gold/30 mb-4">
          <span className="text-3xl">🗺️</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-gradient-gold">Realm Forge</h1>
        <p className="text-forge-muted mt-1 text-sm">
          Build worlds that breathe.
        </p>
      </div>

      {/* Card */}
      <div className="forge-card p-6 shadow-2xl">
        {isVerify ? (
          // Magic link sent state
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-xl font-semibold text-forge-parchment mb-2">
              Check your email
            </h2>
            <p className="text-forge-muted text-sm">
              We sent a magic link to your email. Click it to sign in — no
              password needed.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-forge-parchment mb-1">
              Welcome back, worldbuilder
            </h2>
            <p className="text-forge-muted text-sm mb-6">
              Sign in to continue crafting your worlds.
            </p>

            {hasError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            {/* Google OAuth */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5
                           bg-forge-raised hover:bg-forge-border border border-forge-border
                           rounded-lg text-sm font-medium text-forge-parchment
                           transition-colors duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-forge-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-forge-muted bg-forge-surface">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email magic link */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const email = formData.get("email") as string;
                await signIn("resend", { email, redirectTo: "/" });
              }}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-forge-muted mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-forge-raised border border-forge-border
                             text-forge-parchment placeholder:text-forge-dim text-sm
                             focus:outline-none focus:ring-2 focus:ring-forge-gold/50 focus:border-forge-gold/50
                             transition-colors duration-150"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg bg-gold-gradient text-forge-void
                           text-sm font-semibold transition-opacity hover:opacity-90
                           cursor-pointer"
              >
                Send magic link
              </button>
            </form>
          </>
        )}
      </div>

      <p className="text-center text-xs text-forge-dim mt-4">
        By signing in, you agree to our Terms of Service &amp; Privacy Policy.
      </p>
    </div>
  );
}
