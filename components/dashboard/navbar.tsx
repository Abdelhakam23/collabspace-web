"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

/**
 * Navbar component (native 1440x72, white; active item = #005AFB pill,
 * text Rubik). Items whose screens are not built yet stay inert.
 * Geometry details: docs/design-api-gaps.md.
 */
const NAV_ITEMS = ["Dashboard", "Projects", "Tasks", "Chats", "Meetings", "Reports"];
const M = "font-[family-name:var(--font-rubik)]";

const ROUTES: Record<string, string> = { Dashboard: "/dashboard", Projects: "/projects" };

export function DashboardNavbar({ userName, userRole, active = "Dashboard" }: { userName: string; userRole?: string; active?: string }) {
  return (
    <header className="flex min-h-[72px] flex-wrap items-center gap-x-6 gap-y-2 bg-white px-4 py-2 sm:px-8 lg:h-[72px] lg:py-0">
      <span className={`${M} text-[20px] font-normal text-[#000712]`}>Collabspace</span>
      <nav className="order-3 flex basis-full min-w-0 flex-wrap items-center gap-1 lg:order-none lg:basis-auto">
        {NAV_ITEMS.map((item) =>
          item === active ? (
            <span
              key={item}
              aria-current="page"
              className={`${M} rounded-full bg-[#005AFB] p-2.5 text-xs font-normal text-white`}
            >
              {item}
            </span>
          ) : ROUTES[item] ? (
            <Link key={item} href={ROUTES[item]} className={`${M} px-3 py-1.5 text-xs font-normal text-[#000712]`}>
              {item}
            </Link>
          ) : (
            <span
              key={item}
              aria-disabled="true"
              className={`${M} px-3 py-1.5 text-xs font-normal text-[#000712]`}
            >
              {item}
            </span>
          ),
        )}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <label className={`hidden h-9 w-56 items-center gap-2 rounded-lg bg-[#F6F8FA] px-3 text-xs text-[#718096] lg:flex ${M}`}>
          <Search size={14} />
          <input
            type="search"
            placeholder="Search"
            className="w-full min-w-0 bg-transparent outline-none"
            aria-label="Search"
          />
        </label>
        {/* Bell icon from the frame; its screen is not built yet. */}
        <button type="button" aria-disabled="true" aria-label="Notifications (not available yet)" className="relative text-[#000712]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e5484d]" aria-hidden="true" />
        </button>
        <span className="flex items-center gap-2">
          <span className={`${M} text-right text-xs leading-tight`}>
            <span className="block font-medium text-[#000712]">{userName}</span>
            {userRole ? <span className="block font-normal text-[#718096]">{userRole}</span> : null}
          </span>
          <span className="h-9 w-9 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
        </span>
      </div>
    </header>
  );
}
