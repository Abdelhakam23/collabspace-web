import type { ReactNode } from "react";

/**
 * Page chrome shared by the auth screens: top bar + centered card.
 * Measurements taken from the Figma UI Design frames at 100% zoom:
 * page background #F6F8FA, card 600px wide, white, 24px radius, 64px side padding.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8fa]">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="font-[family-name:var(--font-rubik)] text-[20px] font-normal text-[#000712]">Collabspace</span>
        {/* Language switcher: the design shows it, but there is no i18n API, so it
            stays visible and intentionally non-functional. See docs/design-api-gaps.md. */}
        <button
          type="button"
          aria-disabled="true"
          className="flex items-center gap-1 text-sm text-secondary-600"
          title="English"
        >
          English
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </header>
      <main className="flex items-start justify-center px-4 pb-16 pt-4 sm:pt-8">
        <div className="w-full max-w-[600px] rounded-3xl bg-white px-6 py-10 shadow-[0_4px_16px_rgba(0,0,0,0.16)] sm:px-16 sm:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
