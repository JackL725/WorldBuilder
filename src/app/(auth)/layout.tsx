export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-forge-base bg-forge-pattern flex items-center justify-center p-4">
      {/* Ambient glows */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-forge-arcane/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-forge-gold/5 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
