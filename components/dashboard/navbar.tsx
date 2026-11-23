"use client";

/**
 * Dashboard top bar. Native Figma properties (Dashboard frame, node 75-1433):
 * bar 1440x72px, white fill; nav labels Rubik 400 12px #000000;
 * user name Rubik 500 12px. Active item is a light pill.
 * Items whose screens are not built yet stay inert so nothing routes to a 404.
 */
const NAV_ITEMS = ["Dashboard", "Projects", "Tasks", "Chats", "Meetings", "Reports"];

export function DashboardNavbar({ userName, userRole }: { userName: string; userRole?: string }) {
  return (
    <header className="flex h-[72px] items-center gap-8 border-b border-[#eeeeee] bg-white px-9">
      <span className="font-[family-name:var(--font-rubik)] text-lg font-semibold text-black">
        Collabspace
      </span>
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) =>
          item === "Dashboard" ? (
            <span
              key={item}
              aria-current="page"
              className="rounded-md bg-[#f0f0f0] px-3 py-1.5 font-[family-name:var(--font-rubik)] text-xs text-black"
            >
              {item}
            </span>
          ) : (
            <span
              key={item}
              aria-disabled="true"
              className="px-3 py-1.5 font-[family-name:var(--font-rubik)] text-xs text-black"
            >
              {item}
            </span>
          ),
        )}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <label className="flex h-9 w-56 items-center gap-2 rounded-md bg-[#f6f8fa] px-3 text-xs text-[#718096]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-transparent outline-none"
            aria-label="Search"
          />
        </label>
        <span className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
          <span className="font-[family-name:var(--font-rubik)] text-xs font-medium text-black">
            {userName}
            {userRole ? <span className="block font-normal text-[#718096]">({userRole})</span> : null}
          </span>
        </span>
      </div>
    </header>
  );
}
