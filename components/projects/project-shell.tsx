"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { getProjectOverview } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import { shortDate } from "@/lib/format";
import type { ProjectOverview } from "@/lib/types";

/**
 * Shared chrome of the "All Projects / Alpha" frame family (nodes 181-1158,
 * 181-1418, 181-1982, 181-2367): navbar, breadcrumb, title with completion
 * percentage, the Due Date card and the tab row. Every tab page fetches the
 * same A4.3 overview payload through this shell.
 */

const SANS = "font-[family-name:var(--font-sans)]";

const TABS = [
  { label: "Overview", path: "" },
  { label: "Tasks", path: "/tasks" },
  { label: "Teams", path: "/teams" },
  { label: "Files", path: "/files" },
];

export function ProjectShell({ projectId, children }: { projectId: string; children: ReactNode }) {
  const pathname = usePathname();
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ov, profile] = await Promise.all([getProjectOverview(projectId), getProfile()]);
        if (cancelled) return;
        setOverview(ov.data ?? null);
        const u = (profile.data as { user?: { name?: string; roles?: string[] } }).user;
        setUserName(u?.name ?? "");
        setUserRole(u?.roles?.[0]);
      } catch {
        if (!cancelled) setOverview(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const pct = overview?.progress_percentage ?? 0;
  const startDate = overview?.due_date_indicator?.start_date;
  const deadline = overview?.due_date_indicator?.deadline;

  // Due Date fill: elapsed fraction between the documented dates, clamped.
  let elapsed = 0;
  if (startDate && deadline) {
    const s = new Date(startDate).getTime();
    const e = new Date(deadline).getTime();
    if (e > s) elapsed = Math.min(1, Math.max(0, (Date.now() - s) / (e - s)));
  }

  const base = `/projects/${projectId}`;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={userName} userRole={userRole} active="Projects" />
      {/* Native layout: header block top 104 (navbar 76), left 65, 1311 wide,
          Hug 71: title column (Fill 955, vertical gap 16) beside the Due Date
          card (Fixed 324x71, radius 12, border #F3F4F6, padding 12, gap 16).
          Tabs row top 207, Hug 28, gap 30. */}
      <main className="px-4 pt-7 sm:px-8 lg:px-16 lg:pt-[32px]">
        <div className="flex items-start justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p className={`${SANS} text-sm leading-[16px] text-black/60`}>
              <Link href="/projects" className="hover:underline">Projects</Link>
              <span className="px-1">&gt;</span>
              {overview?.name ?? "…"}
            </p>
            <div className="flex h-[28px] items-center gap-4">
              <h1 className={`${SANS} text-[31px] font-semibold leading-[28px] text-black`}>
                {overview?.name ?? "…"}
              </h1>
              {overview ? <span className={`${SANS} text-xs text-[#2BA52E]`}>{pct}% Completed</span> : null}
            </div>
          </div>

          <section className="hidden w-[324px] shrink-0 flex-col gap-2 rounded-[12px] bg-white p-3 ring-1 ring-[#F3F4F6] lg:flex">
            <h2 className={`${SANS} text-[12px] font-medium leading-[15px] text-[#191919]`}>Due Date</h2>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#E6EFFF]">
              <div className="h-full rounded-full bg-[#005AFB]" style={{ width: `${Math.round(elapsed * 100)}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <p className={`${SANS} text-[11px] leading-[13px] text-[#383838]`}>
                Start Date: <span className="font-medium">{shortDate(startDate)}</span>
              </p>
              <p className={`${SANS} text-[11px] leading-[13px] text-[#383838]`}>
                Deadline: <span className="font-medium">{shortDate(deadline)}</span>
              </p>
            </div>
          </section>
        </div>

        <nav className="mt-8 flex h-[28px] items-start gap-[30px]">
          {TABS.map((t) => {
            const href = `${base}${t.path}`;
            const active = pathname === href;
            return (
              <Link
                key={t.label}
                href={href}
                {...(active ? { "aria-current": "page" as const } : {})}
                className={`${SANS} flex h-[28px] items-start gap-[10px] px-4 pb-4 text-[16px] font-normal leading-[12px] ${
                  active ? "border-b-[1.5px] border-[#005AFB] text-[#005AFB]" : "text-[#4A4A4A]"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </main>
    </div>
  );
}
