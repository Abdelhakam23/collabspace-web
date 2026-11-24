import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f6f8fa]">
      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-12 pt-12">
        <span className="text-lg font-semibold text-secondary-900">Collabspace</span>
                <button
          type="button"
          aria-disabled="true"
          className="flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-secondary-600"
          title="English"
        >
          English
          <ChevronDown size={14} />
        </button>
      </header>
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-[601px] rounded-3xl bg-white px-6 py-10 shadow-[0_4px_16px_rgba(0,0,0,0.16)] sm:px-16 sm:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
