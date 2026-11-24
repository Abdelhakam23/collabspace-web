import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Page chrome shared by the auth screens: top bar + centered card.
 * Measurements taken from the Figma UI Design frames at 100% zoom:
 * page background #F6F8FA, card 600px wide, white, 24px radius, 64px side padding.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f6f8fa]">
      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="text-lg font-semibold text-secondary-900">Collabspace</span>
        {/* Language switcher: the design shows it, but there is no i18n API, so it
            stays visible and intentionally non-functional. See docs/design-api-gaps.md. */}
        <button
          type="button"
          aria-disabled="true"
          className="flex items-center gap-1 text-sm text-secondary-600"
          title="English"
        >
          English
          <ChevronDown size={14} />
        </button>
      </header>
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-[600px] rounded-3xl bg-white px-6 py-10 shadow-[0_16px_48px_rgba(23,43,99,0.08)] sm:px-16 sm:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
