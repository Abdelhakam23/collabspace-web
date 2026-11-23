"use client";

/**
 * Final hi-fi navbar (UI Design page, Navbar component in the Dashboard frame):
 * 1440x72, white fill; active item is a Primary #005AFB pill with white text;
 * other items dark; right side search, settings, bell with red dot, user name
 * + role and avatar. Text is Montserrat (native: user name 400 14px).
 * Items whose screens are not built yet stay inert so nothing routes to a 404.
 */
const NAV_ITEMS = ["Dashboard", "Projects", "Tasks", "Chats", "Meetings", "Reports"];
const M = "font-[family-name:var(--font-montserrat)]";

export function DashboardNavbar({ userName, userRole }: { userName: string; userRole?: string }) {
  return (
    <header className="flex min-h-[72px] flex-wrap items-center gap-x-6 gap-y-2 bg-white px-4 py-2 sm:px-8 lg:h-[72px] lg:py-0">
      <span className={`${M} text-lg font-bold text-[#000712]`}>Collabspace</span>
      <nav className="order-3 flex basis-full min-w-0 flex-wrap items-center gap-1 lg:order-none lg:basis-auto">
        {NAV_ITEMS.map((item) =>
          item === "Dashboard" ? (
            <span
              key={item}
              aria-current="page"
              className={`${M} rounded-full bg-[#005AFB] px-4 py-1.5 text-xs font-medium text-white`}
            >
              {item}
            </span>
          ) : (
            <span
              key={item}
              aria-disabled="true"
              className={`${M} px-3 py-1.5 text-xs font-medium text-[#000712]`}
            >
              {item}
            </span>
          ),
        )}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <label className={`hidden h-9 w-56 items-center gap-2 rounded-lg bg-[#F6F8FA] px-3 text-xs text-[#718096] lg:flex ${M}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="w-full min-w-0 bg-transparent outline-none"
            aria-label="Search"
          />
        </label>
        {/* Settings and bell icons from the frame; their screens are not built yet. */}
        <button type="button" aria-disabled="true" aria-label="Settings (not available yet)" className="text-[#000712]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button type="button" aria-disabled="true" aria-label="Notifications (not available yet)" className="relative text-[#000712]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e5484d]" aria-hidden="true" />
        </button>
        <span className="flex items-center gap-2">
          <span className={`${M} text-right text-xs leading-tight`}>
            <span className="block font-semibold text-[#000712]">{userName}</span>
            {userRole ? <span className="block font-normal text-[#718096]">{userRole}</span> : null}
          </span>
          <span className="h-9 w-9 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
        </span>
      </div>
    </header>
  );
}
