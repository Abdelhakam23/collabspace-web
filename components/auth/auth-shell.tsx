import type { ReactNode } from "react";

/** Page chrome shared by the auth screens: top bar + centered card. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="text-lg font-semibold text-secondary-900">Collabspace</span>
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-secondary-600"
        >
          English
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </header>
      <main className="flex items-start justify-center px-4 pb-16 pt-6 sm:pt-10">
        <div className="w-full max-w-[440px] rounded-2xl bg-white px-6 py-10 shadow-[0_8px_40px_rgba(16,16,18,0.06)] sm:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
