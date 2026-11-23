import type { ReactNode } from "react";

/**
 * Page chrome shared by the auth screens: top bar + centered card.
 * Native reads from the Figma UI Design frames: the logo/control row sits
 * with its center 68px from the frame top; the card's top edge is 202.5px on
 * Sign in and about 142px on Sign up (pixel-measured, the card's parent uses
 * auto layout so no absolute offset is exposed). Card: 601 wide, radius 24,
 * padding 64, white on Sign in, Text Color/50 #FAFAFA on Sign up, drop
 * shadow 0/4/16 at 16% black.
 */
export function AuthShell({
  children,
  cardTop = 202.5,
  cardBg = "#FFFFFF",
}: {
  children: ReactNode;
  cardTop?: number;
  cardBg?: string;
}) {
  const headerBlock = 104; // 32px offset + 72px row, centering the logo at 68px
  return (
    <div className="min-h-screen bg-[#f6f8fa]">
      <header className="mt-8 flex h-[72px] items-center justify-between px-6 sm:px-10">
        <span className="font-[family-name:var(--font-rubik)] text-[20px] font-normal text-[#000712]">Collabspace</span>
        {/* Language switcher: the design shows it, but there is no i18n API, so it
            stays visible and intentionally non-functional. See docs/design-api-gaps.md. */}
        <button
          type="button"
          aria-disabled="true"
          className="flex items-center gap-1 rounded-full border border-[#cbd5e0] px-3 py-1.5 text-sm text-secondary-600"
          title="English"
        >
          English
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </header>
      <main
        className="flex items-start justify-center px-4 pb-16"
        style={{ paddingTop: Math.max(0, cardTop - headerBlock) }}
      >
        <div
          className="w-full max-w-[601px] rounded-3xl px-6 py-10 shadow-[0_4px_16px_rgba(0,0,0,0.16)] sm:px-16 sm:py-16"
          style={{ backgroundColor: cardBg }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
