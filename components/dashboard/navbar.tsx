"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarChart3, CheckSquare, Folder, LayoutDashboard, Menu, MessageSquare, Search, Video, X } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { NAV_ITEMS, ROUTES } from "@/constants/navigation";
import { logout } from "@/lib/api/auth";
import { clearStoredToken } from "@/lib/api-client";

const M = "font-[family-name:var(--font-rubik)]";
const DRAWER_WIDTH = 260;

const ICONS: Record<string, typeof Folder> = {
  Dashboard: LayoutDashboard,
  Projects: Folder,
  Tasks: CheckSquare,
  Chats: MessageSquare,
  Meetings: Video,
  Reports: BarChart3,
};

function AccountMenu({ userName, userRole, placement }: { userName: string; userRole?: string; placement: "bar" | "sidebar" }) {
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

  const side = placement === "sidebar";
<<<<<<< development
<<<<<<< feature/responsive-fixes
  return (
    <span className={`relative ${side ? "block w-full" : ""}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        title="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className={`flex items-center gap-2 ${side ? "w-full rounded-xl p-2 text-left hover:bg-[#F6F8FA]" : ""}`}
      >
        {side ? <span className="h-10 w-10 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" /> : null}
        <span className={`${M} min-w-0 text-xs leading-tight ${side ? "text-left" : "hidden text-right sm:block"}`}>
          <span className="block truncate font-medium text-[#000712]">{userName}</span>
          {userRole ? <span className="block truncate font-normal text-[#718096]">{userRole}</span> : null}
        </span>
        {side ? null : <span className="h-10 w-10 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" />}
      </button>
      {menuOpen ? (
        <span
          role="menu"
          aria-label="Account"
          className={`absolute z-50 flex w-40 flex-col overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white py-1 shadow-lg ${
            side ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"
          }`}
        >
          <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#000712] hover:bg-[#F6F8FA]`}>
            Profile
          </Link>
          <button type="button" role="menuitem" onClick={handleLogout} disabled={pending} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#af2622] hover:bg-[#F6F8FA] disabled:opacity-60`}>
            {pending ? "Logging out..." : "Log out"}
          </button>
        </span>
      ) : null}
    </span>
  );
}

export function DashboardNavbar({ userName, userRole, active = "Dashboard" }: { userName: string; userRole?: string; active?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
    <header className="hidden bg-white xl:block">
      <div className="flex min-h-[72px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 sm:px-8 lg:h-[72px] lg:px-16 lg:py-0">
        <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
        <nav className="order-3 flex basis-full min-w-0 lg:order-none lg:basis-auto">
          <div className="flex max-w-full flex-nowrap items-center gap-3 overflow-x-auto rounded-full bg-[#F6F8FA] p-1 pr-2 [scrollbar-width:none] sm:gap-[19px] [&>*]:shrink-0">
            {NAV_ITEMS.map((item) =>
              item === active ? (
                <Link
                  key={item}
                  href={ROUTES[item] ?? "#"}
                  aria-current="page"
                  className={`${M} flex h-9 items-center rounded-full bg-[#005AFB] p-2.5 text-xs font-normal text-white`}
                >
                  {item}
                </Link>
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
            <AccountMenu userName={userName} userRole={userRole} placement="bar" />
          </span>
        </div>
      </div>
            <div className="h-1 bg-[linear-gradient(to_bottom,rgba(9,30,66,0.13),rgba(9,30,66,0))]" aria-hidden="true" />
    </header>
      <header className="bg-white xl:hidden">
        <div className="flex h-[72px] items-center gap-3 px-4 sm:px-8">
          <button type="button" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full text-[#000712] hover:bg-[#F6F8FA]">
            <Menu size={22} />
          </button>
          <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
          <div className="ml-auto flex items-center gap-5">
            <NotificationBell />
            <AccountMenu userName={userName} userRole={userRole} placement="bar" />
          </div>
        </div>
        <div className="h-1 bg-[linear-gradient(to_bottom,rgba(9,30,66,0.13),rgba(9,30,66,0))]" aria-hidden="true" />
      </header>

      {drawerOpen ? <div className="fixed inset-0 z-40 bg-black/40 xl:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" /> : null}

      <aside
        aria-label="Main navigation"
        style={{ width: DRAWER_WIDTH }}
        className={`fixed inset-y-0 left-0 z-50 flex-col border-r border-[#E2E8F0] bg-white px-4 py-5 xl:hidden ${drawerOpen ? "flex" : "hidden"}`}
      >
        <div className="flex items-center justify-between px-2">
          <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
          <span className="flex items-center gap-3">
            <button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#000712] hover:bg-[#F6F8FA] xl:hidden">
              <X size={20} />
            </button>
          </span>
        </div>
=======
  return (
    <span className={`relative ${side ? "block w-full" : ""}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        title="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className={`flex items-center gap-2 ${side ? "w-full rounded-xl p-2 text-left hover:bg-[#F6F8FA]" : ""}`}
      >
        <span className="h-10 w-10 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
        <span className={`${M} min-w-0 text-xs leading-tight ${side ? "text-left" : "hidden text-right sm:block"}`}>
          <span className="block truncate font-medium text-[#000712]">{userName}</span>
          {userRole ? <span className="block truncate font-normal text-[#718096]">{userRole}</span> : null}
        </span>
      </button>
      {menuOpen ? (
        <span
          role="menu"
          aria-label="Account"
          className={`absolute z-50 flex w-40 flex-col overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white py-1 shadow-lg ${
            side ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"
          }`}
        >
          <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#000712] hover:bg-[#F6F8FA]`}>
            Profile
          </Link>
          <button type="button" role="menuitem" onClick={handleLogout} disabled={pending} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#af2622] hover:bg-[#F6F8FA] disabled:opacity-60`}>
            {pending ? "Logging out..." : "Log out"}
          </button>
        </span>
      ) : null}
    </span>
  );
}

export function DashboardNavbar({ userName, userRole, active = "Dashboard" }: { userName: string; userRole?: string; active?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reserve room for the fixed sidebar on wide screens only.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const apply = () => {
      document.body.style.paddingLeft = mq.matches ? `${SIDEBAR_WIDTH}px` : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingLeft = "";
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      <header className="bg-white xl:hidden">
        <div className="flex h-[72px] items-center gap-3 px-4 sm:px-8">
          <button type="button" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full text-[#000712] hover:bg-[#F6F8FA]">
            <Menu size={22} />
          </button>
          <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
          <div className="ml-auto flex items-center gap-5">
            <NotificationBell />
            <AccountMenu userName={userName} userRole={userRole} placement="bar" />
          </div>
        </div>
        <div className="h-1 bg-[linear-gradient(to_bottom,rgba(9,30,66,0.13),rgba(9,30,66,0))]" aria-hidden="true" />
      </header>

      {drawerOpen ? <div className="fixed inset-0 z-40 bg-black/40 xl:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" /> : null}

      <aside
        aria-label="Main navigation"
        style={{ width: SIDEBAR_WIDTH }}
        className={`fixed inset-y-0 left-0 z-50 flex-col border-r border-[#E2E8F0] bg-white px-4 py-5 xl:z-30 xl:flex ${drawerOpen ? "flex" : "hidden"}`}
      >
        <div className="flex items-center justify-between px-2">
          <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
          <span className="flex items-center gap-3">
            <span className="hidden xl:block">
              <NotificationBell />
            </span>
            <button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#000712] hover:bg-[#F6F8FA] xl:hidden">
              <X size={20} />
            </button>
          </span>
        </div>
>>>>>>> development
=======
  return (
    <span className={`relative ${side ? "block w-full" : ""}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        title="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className={`flex items-center gap-2 ${side ? "w-full rounded-xl p-2 text-left hover:bg-[#F6F8FA]" : ""}`}
      >
        <span className="h-10 w-10 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
        <span className={`${M} min-w-0 text-xs leading-tight ${side ? "text-left" : "hidden text-right sm:block"}`}>
          <span className="block truncate font-medium text-[#000712]">{userName}</span>
          {userRole ? <span className="block truncate font-normal text-[#718096]">{userRole}</span> : null}
        </span>
      </button>
      {menuOpen ? (
        <span
          role="menu"
          aria-label="Account"
          className={`absolute z-50 flex w-40 flex-col overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white py-1 shadow-lg ${
            side ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"
          }`}
        >
          <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#000712] hover:bg-[#F6F8FA]`}>
            Profile
          </Link>
          <button type="button" role="menuitem" onClick={handleLogout} disabled={pending} className={`${M} px-4 py-2.5 text-left text-xs font-normal text-[#af2622] hover:bg-[#F6F8FA] disabled:opacity-60`}>
            {pending ? "Logging out..." : "Log out"}
          </button>
        </span>
      ) : null}
    </span>
  );
}

export function DashboardNavbar({ userName, userRole, active = "Dashboard" }: { userName: string; userRole?: string; active?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reserve room for the fixed sidebar on wide screens only.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const apply = () => {
      document.body.style.paddingLeft = mq.matches ? `${SIDEBAR_WIDTH}px` : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingLeft = "";
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      <header className="bg-white xl:hidden">
        <div className="flex h-[72px] items-center gap-3 px-4 sm:px-8">
          <button type="button" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full text-[#000712] hover:bg-[#F6F8FA]">
            <Menu size={22} />
          </button>
          <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
          <div className="ml-auto flex items-center gap-5">
            <NotificationBell />
            <AccountMenu userName={userName} userRole={userRole} placement="bar" />
          </div>
        </div>
        <div className="h-1 bg-[linear-gradient(to_bottom,rgba(9,30,66,0.13),rgba(9,30,66,0))]" aria-hidden="true" />
      </header>

      {drawerOpen ? <div className="fixed inset-0 z-40 bg-black/40 xl:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" /> : null}

      <aside
        aria-label="Main navigation"
        style={{ width: SIDEBAR_WIDTH }}
        className={`fixed inset-y-0 left-0 z-50 flex-col border-r border-[#E2E8F0] bg-white px-4 py-5 xl:z-30 xl:flex ${drawerOpen ? "flex" : "hidden"}`}
      >
        <div className="flex items-center justify-between px-2">
          <span className={`${M} text-[20px] font-normal leading-[44px] text-[#000712]`}>Collabspace</span>
          <span className="flex items-center gap-3">
            <span className="hidden xl:block">
              <NotificationBell />
            </span>
            <button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#000712] hover:bg-[#F6F8FA] xl:hidden">
              <X size={20} />
            </button>
          </span>
        </div>
>>>>>>> main

        <label
          title="Global search is not documented in the API"
          className={`mt-4 flex h-9 cursor-not-allowed items-center gap-1 rounded-full bg-[#F6F8FA] p-1 pl-3 text-xs text-[#718096] opacity-60 ${M}`}
        >
          <Search size={14} />
          <input type="search" placeholder="Search" disabled className="w-full min-w-0 cursor-not-allowed bg-transparent outline-none" aria-label="Search (unavailable)" />
        </label>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item];
            const isActive = item === active;
            const cls = `${M} flex h-10 items-center gap-3 rounded-full px-4 text-sm font-normal ${isActive ? "bg-[#005AFB] text-white" : "text-[#000712] hover:bg-[#F6F8FA]"}`;
            const content = (
              <>
                {Icon ? <Icon size={18} /> : null}
                {item}
              </>
            );
            return ROUTES[item] ? (
              <Link key={item} href={ROUTES[item]} aria-current={isActive ? "page" : undefined} onClick={() => setDrawerOpen(false)} className={cls}>
                {content}
              </Link>
            ) : (
              <span key={item} aria-disabled="true" className={cls}>
                {content}
              </span>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#E2E8F0] pt-3">
          <AccountMenu userName={userName} userRole={userRole} placement="sidebar" />
        </div>
      </aside>
    </>
  );
}
