"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { listProjects, getProjectOverview, getProjectTeamsTaskProgress } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import type { Project } from "@/lib/types";

/**
 * Project detail "All Projects / Alpha" frame (UI Design page, node 181-1158,
 * 1440x1024, BG #F6F8FA). Breadcrumb small Body 14 #000000@60% ("Projects"
 * navigates back to All Projects); title Team C Text/H4 (Inter 600 31px);
 * tabs Body Me 16px, active tab Primary #005AFB; card titles H6 (Inter 500
 * 20px); description body Body Re 16px Secondary #525256; member names small
 * Body 14px #525256, Leader tag Inter 400 10px #27272B; member avatars 40px
 * radius 30 with 2.5px #E9E9EA border; card geometry pixel-measured at 46%
 * zoom (left column x64 w642/862, right column x962 w414).
 *
 * Scope (design x API): title, dates, priority, progress and team members
 * come from the documented Project model (A4.1). "Project Type" and "Total
 * Tasks" in Product Details have no field in the model and are omitted; the
 * pending/in-progress/completed fractions and the Project overview chart
 * depend on A4.3/A4.4 whose response shapes the collection does not
 * document - they render only when the responses actually carry them
 * (docs/design-api-gaps.md). Tasks/Teams/Files tabs stay inert until their
 * sibling frames are implemented.
 */

const SANS = "font-[family-name:var(--font-sans)]";

// Short "Mon D" presentation of an ISO date as drawn in the Due Date card.
function shortDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
const TABS = ["Overview", "Tasks", "Teams", "Files"];

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[#F3F4F6] bg-white p-5 ${className}`}>
      <h2 className={`${SANS} mb-3 text-[20px] font-medium leading-[150%] text-[#191919]`}>{title}</h2>
      {children}
    </section>
  );
}

function Gauge({ pct }: { pct: number }) {
  // Same needle-gauge geometry as the dashboard completion card.
  const angle = Math.PI * (1 - Math.min(100, Math.max(0, pct)) / 100);
  const nx = 60 + 34 * Math.cos(angle);
  const ny = 60 - 34 * Math.sin(angle);
  return (
    <svg viewBox="0 0 120 70" className="mx-auto w-56">
      <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
      <path
        d={`M10 60 A50 50 0 0 1 ${60 + 50 * Math.cos(angle)} ${60 - 50 * Math.sin(angle)}`}
        fill="none"
        stroke="#000000"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <line x1="60" y1="60" x2={nx} y2={ny} stroke="#000000" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="60" r="4" fill="#000000" />
    </svg>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense>
      <ProjectDetailContent />
    </Suspense>
  );
}

function ProjectDetailContent() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [counts, setCounts] = useState<{ pending?: number; in_progress?: number; completed?: number; total?: number } | null>(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, profile] = await Promise.all([
          listProjects({ page: 1, per_page: 50, sort: "newest" }),
          getProfile(),
        ]);
        if (cancelled) return;
        setProject(list.data.data.find((p) => String(p.id) === String(id)) ?? null);
        const u = (profile.data as { user?: { name?: string; roles?: string[] } }).user;
        setUserName(u?.name ?? "");
        setUserRole(u?.roles?.[0]);
      } catch {
        if (!cancelled) setProject(null);
      }
      // A4.3/A4.4 response shapes are undocumented; pick up task counts only
      // if the response actually carries them, never invented.
      try {
        const ov = await getProjectOverview(id);
        const d = ov.data as Record<string, unknown>;
        const t = (d?.tasks ?? d) as Record<string, unknown>;
        if (t && typeof t === "object" && ("pending" in t || "completed" in t)) {
          if (!cancelled) {
            setCounts({
              pending: typeof t.pending === "number" ? t.pending : undefined,
              in_progress: typeof t.in_progress === "number" ? t.in_progress : undefined,
              completed: typeof t.completed === "number" ? t.completed : undefined,
              total: typeof t.total === "number" ? t.total : undefined,
            });
          }
        }
      } catch {}
      try {
        await getProjectTeamsTaskProgress(id);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const members = (project?.teams ?? []).flatMap((t) => t.members ?? []);
  const pct = project?.progress ?? 0;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={userName} userRole={userRole} active="Projects" />
      <main className="px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[61px]">
        <p className={`${SANS} text-sm text-black/60`}>
          <Link href="/projects" className="hover:underline">Projects</Link>
          <span className="px-1">&gt;</span>
          {project?.name ?? "…"}
        </p>
        <div className="mt-1 flex items-baseline gap-3">
          <h1
            className={`${SANS} text-[31px] font-semibold leading-[150%] text-black`}
            style={{ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as React.CSSProperties}
          >
            {project?.name ?? "…"}
          </h1>
          {project ? <span className={`${SANS} text-xs text-[#2BA52E]`}>{pct}% Completed</span> : null}
        </div>

        <nav className="mt-4 flex items-center gap-8">
          {TABS.map((t, i) =>
            i === 0 ? (
              <span key={t} aria-current="page" className={`${SANS} border-b-2 border-[#005AFB] pb-1 text-base font-medium text-[#005AFB]`}>
                {t}
              </span>
            ) : (
              <span key={t} aria-disabled="true" title="This tab is not built yet" className={`${SANS} pb-1 text-base font-medium text-[#000712]`}>
                {t}
              </span>
            ),
          )}
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[642px_414px] lg:justify-between">
          <div className="flex flex-col gap-6">
            <Card title="Description">
              <p className={`${SANS} text-base leading-[150%] text-[#525256]`}>
                {project?.description ?? ""}
              </p>
            </Card>

            <Card title="Product Details">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={`${SANS} text-xs text-[#4A4A4A]`}>Start Date</p>
                  <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(project?.start_date)}</p>
                </div>
                <div>
                  <p className={`${SANS} text-xs text-[#4A4A4A]`}>Deadline</p>
                  <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(project?.deadline)}</p>
                </div>
                <div>
                  <p className={`${SANS} text-xs text-[#4A4A4A]`}>Priority</p>
                  <p className={`${SANS} text-base font-medium text-[#000712]`}>{project?.priority ?? ""}</p>
                </div>
                {/* "Project Type" and "Total Tasks" appear in the frame but have
                    no field in the documented Project model - omitted, see
                    docs/design-api-gaps.md. */}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            {/* Due Date card drawn top-right in the frame: title, a decorative
                two-segment track, and the start/deadline values (Caption 13px
                #383838). Track segment colors are as drawn (primary + amber);
                the track carries no documented semantics. */}
            <section className="rounded-2xl border border-[#F3F4F6] bg-white p-5">
              <h2 className={`${SANS} mb-3 text-[20px] font-medium leading-[150%] text-[#191919]`}>Due Date</h2>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full">
                <span className="w-1/2 bg-[#005AFB]" />
                <span className="w-1/2 bg-[#E6BA0E]" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className={`${SANS} text-[13px] text-[#383838]`}>
                  Start Date: <span className="font-medium">{shortDate(project?.start_date)}</span>
                </p>
                <p className={`${SANS} text-[13px] text-[#383838]`}>
                  Deadline: <span className="font-medium">{shortDate(project?.deadline)}</span>
                </p>
              </div>
            </section>

            <Card title="Project Progress">
              <Gauge pct={pct} />
              <p className={`${SANS} mt-1 text-center text-base font-medium text-black`}>{pct}%</p>
              <p className={`${SANS} text-center text-xs text-black`}>Project Completed</p>
              {counts ? (
                <div className="mt-3 flex items-center justify-between text-center">
                  {(
                    [
                      ["Pending tasks", counts.pending, "#525256"],
                      ["In progress tasks", counts.in_progress, "#005AFB"],
                      ["Completed tasks", counts.completed, "#2BA52E"],
                    ] as const
                  ).map(([label, value, color]) => (
                    <div key={label}>
                      <p className={`${SANS} text-base font-medium text-black`}>
                        {value ?? "–"}
                        {counts.total ? <span className="text-sm font-normal text-[#525256]">/{counts.total}</span> : null}
                      </p>
                      <p className={`${SANS} text-xs`} style={{ color }}>{label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card title="Team Members">
              {members.length ? (
                <ul className="flex flex-col gap-[12.5px]">
                  {members.map((m) => (
                    <li key={m.id} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-[#E9E9EA] bg-[#F6F8FA] text-xs text-[#000712]">
                        {m.user.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.user.avatar_url} alt={m.user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          m.user.name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
                        )}
                      </span>
                      <span className={`${SANS} text-sm text-[#525256]`}>{m.user.name}</span>
                      {m.is_leader ? <span className={`${SANS} text-[10px] text-[#27272B]`}>Leader</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`${SANS} text-sm text-[#718096]`}>No team members yet.</p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
