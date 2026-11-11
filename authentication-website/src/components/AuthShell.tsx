import type { ReactNode } from "react";

const CURRENT_YEAR = new Date().getFullYear();

interface AuthShellProps {
  children: ReactNode;
  // Optional info panel. It is shown next to the form on medium screens and up
  aside?: ReactNode;
}

// Shared page background and glass card for all authentication pages
export default function AuthShell({ children, aside }: AuthShellProps) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#777FF0] via-[#929AF5] to-[#B0A7FF] px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-400/40 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-purple-400/40 blur-[120px]" />

      <section
        className={`relative z-10 w-full overflow-hidden rounded-[28px] border border-white/40 bg-white/25 shadow-[0_25px_80px_rgba(42,48,130,0.2)] backdrop-blur-2xl ${
          aside ? "max-w-5xl" : "max-w-lg"
        }`}
      >
        <div
          className={
            aside
              ? "grid gap-10 p-6 sm:p-10 md:grid-cols-[1.2fr_0.8fr] lg:p-12"
              : "p-6 sm:p-10"
          }
        >
          <div>{children}</div>

          {aside && (
            <aside className="hidden flex-col justify-center md:flex">
              {aside}
            </aside>
          )}
        </div>
      </section>

      {/* Part of the normal flow, so it never overlaps the card on small screens */}
      <p className="relative z-10 mt-8 text-center text-xs font-medium text-indigo-950/60">
        © {CURRENT_YEAR} Authentication. All rights reserved.
      </p>
    </main>
  );
}

interface AuthAsideProps {
  title: string;
  description: string;
  points: string[];
}

// Info panel with a shield icon, used next to the login and signup forms
export function AuthAside({ title, description, points }: AuthAsideProps) {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/20 p-8 text-center backdrop-blur-md">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-900">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#171A3B]">{title}</h2>

      <p className="mt-4 text-sm leading-7 text-[#343A69]/80">{description}</p>

      <ul className="mt-8 space-y-4 text-left text-sm text-indigo-950/80">
        {points.map((point) => (
          <li key={point}>✓ {point}</li>
        ))}
      </ul>
    </div>
  );
}
