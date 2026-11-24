import Link from "next/link";
import { Search } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/notification-bell";

/**
 * Navbar component (native State variants, 1440x72 white bar over a 4px
 * #091E42/13% shadow strip; inner frame padding 64px, justify-between).
 * Left group (632x44, gap 24): Rubik 20px logo + links pill (#F6F8FA,
 * radius 100, padding T4 R8 B4 L4, gap 19). Link pills hug at 36px tall,
 * 10px padding, active = #005AFB. Right group (400x40, gap 24): search
 * (206x32, #F6F8FA, radius 100, padding 4), bell (18x20.77) and user
 * block (gap 20, inner gap 8). Items whose screens are not built yet
 * stay inert. Geometry details: docs/design-api-gaps.md.
 */
const NAV_ITEMS = ["Dashboard", "Projects", "Tasks", "Chats", "Meetings", "Reports"];
const M = "font-[family-name:var(--font-rubik)]";

const ROUTES: Record<string, string> = { Dashboard: "/dashboard", Projects: "/projects", Tasks: "/tasks" };

export function DashboardNavbar({ userName, userRole, active = "Dashboard" }: { userName: string; userRole?: string; active?: string }) {
  return (
    <header className="bg-white">
      <div className="flex min-h-[72px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 sm:px-8 lg:h-[72px] lg:px-16 lg:py-0">
        <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
        <nav className="order-3 flex basis-full min-w-0 lg:order-none lg:basis-auto">
          <div className="flex flex-wrap items-center gap-[19px] rounded-full bg-[#F6F8FA] pb-1 pl-1 pr-2 pt-1">
            {NAV_ITEMS.map((item) =>
              item === active ? (
                <span
                  key={item}
                  aria-current="page"
                  className={`${M} flex h-9 items-center rounded-full bg-[#005AFB] p-2.5 text-xs font-normal text-white`}
                >
                  {item}
                </span>
              ) : ROUTES[item] ? (
                <Link key={item} href={ROUTES[item]} className={`${M} flex h-9 items-center rounded-full p-2.5 text-xs font-normal text-[#000712]`}>
                  {item}
                </Link>
              ) : (
                <span
                  key={item}
                  aria-disabled="true"
                  className={`${M} flex h-9 items-center rounded-full p-2.5 text-xs font-normal text-[#000712]`}
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <label className={`hidden h-8 w-[206px] items-center gap-1 rounded-full bg-[#F6F8FA] p-1 pl-3 text-xs text-[#718096] lg:flex ${M}`}>
            <Search size={14} />
            <input
              type="search"
              placeholder="Search"
              className="w-full min-w-0 bg-transparent outline-none"
              aria-label="Search"
            />
          </label>
          <span className="flex items-center gap-5">
            <NotificationBell />
            <span className="flex items-center gap-2">
              <span className={`${M} text-right text-xs leading-tight`}>
                <span className="block font-medium text-[#000712]">{userName}</span>
                {userRole ? <span className="block font-normal text-[#718096]">{userRole}</span> : null}
              </span>
              <span className="h-10 w-10 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
            </span>
          </span>
        </div>
      </div>
      {/* Shadow strip under the bar (native: 1440x4 linear gradient #091E42 13%). */}
      <div className="h-1 bg-[linear-gradient(to_bottom,rgba(9,30,66,0.13),rgba(9,30,66,0))]" aria-hidden="true" />
    </header>
  );
}
