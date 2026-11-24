"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { NAV_ITEMS, ROUTES } from "@/constants/navigation";
import { logout } from "@/lib/api/auth";
import { clearStoredToken } from "@/lib/api-client";

const M = "font-[family-name:var(--font-rubik)]";

export function DashboardNavbar({ userName, userRole, active = "Dashboard" }: { userName: string; userRole?: string; active?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const menuRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      await logout();
    } catch {
      // The local session is cleared regardless of the server response.
    }
    clearStoredToken();
    router.replace("/login");
  }

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
                    <label
            title="Global search is not documented in the API"
            className={`hidden h-8 w-[206px] cursor-not-allowed items-center gap-1 rounded-full bg-[#F6F8FA] p-1 pl-3 text-xs text-[#718096] opacity-60 lg:flex ${M}`}
          >
            <Search size={14} />
            <input
              type="search"
              placeholder="Search"
              disabled
              className="w-full min-w-0 cursor-not-allowed bg-transparent outline-none"
              aria-label="Search (unavailable)"
            />
          </label>
          <span className="flex items-center gap-5">
            <NotificationBell />
            <span className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                title="Account menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2"
              >
                <span className={`${M} text-right text-xs leading-tight`}>
                  <span className="block font-medium text-[#000712]">{userName}</span>
                  {userRole ? <span className="block font-normal text-[#718096]">{userRole}</span> : null}
                </span>
                <span className="h-10 w-10 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
              </button>
              {menuOpen ? (
                <span role="menu" aria-label="Account" className="absolute right-0 top-full z-50 mt-2 flex w-40 flex-col overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white py-1 shadow-lg">
                  <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#000712] hover:bg-[#F6F8FA]`}>
                    Profile
                  </Link>
                  <button type="button" role="menuitem" onClick={handleLogout} disabled={pending} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#af2622] hover:bg-[#F6F8FA] disabled:opacity-60`}>
                    {pending ? "Logging out..." : "Log out"}
                  </button>
                </span>
              ) : null}
            </span>
          </span>
        </div>
      </div>
            <div className="h-1 bg-[linear-gradient(to_bottom,rgba(9,30,66,0.13),rgba(9,30,66,0))]" aria-hidden="true" />
    </header>
  );
}
