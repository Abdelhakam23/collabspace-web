"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { listProjects } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import { apiClient } from "@/lib/api-client";
import type { Project } from "@/lib/types";

/**
 * Project detail "All Projects / Alpha" frame (UI Design page, node 181-1158,
 * 1440x1024, BG #F6F8FA). Breadcrumb small Body 14 #000000@60% ("Projects"
 * navigates back to All Projects); title Team C Text/H4 (Inter 600 31px);
 * tabs Body Me 16px, active tab Primary #005AFB; card titles H6 (Inter 500
 * 20px); description body Body Re 16px Secondary #525256; member names small
 * Body 14px #525256, Leader tag Inter 400 10px #27272B; member avatars 40px
 * radius 30 with 2.5px #E9E9EA border; Due Date card sits in the top header
 * right of the title, with its track drawn #005AFB on #E6EFFF.
 *
 * Scope (design x API): title, dates, priority, progress and team members
 * come from the documented Project model (A4.1). "Project Type" in Product
 * Details has no field in the model and is omitted. "Total Tasks" is read
 * from A5.1 (List Tasks, project_id filter documented) via the pagination
 * total; the collection documents no response shape for A5.1, so the item
 * renders only when the response actually carries a numeric total
 * (docs/design-api-gaps.md). The pending/in-progress/completed fractions and
 * the Project overview chart card depend on A4.3/A4.4 whose response shapes
 * are undocumented, so they are omitted rather than parsed with guessed
 * keys. Tasks/Teams/Files tabs stay inert until their sibling frames ship.
 */

const SANS = "font-[family-name:var(--font-sans)]";
const TABS = ["Overview", "Tasks", "Teams", "Files"];

// Short "Mon D" presentation of an ISO date as drawn in the frame.
function shortDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[#F3F4F6] bg-white p-5 ${className}`}>
      <h2 className={`${SANS} mb-3 text-[20px] font-medium leading-[150%] text-[#191919]`}>{title}</h2>
      {children}
    </section>
  );
}

/** Needle gauge: the frame draws the dark arc as a 177.61px ellipse #27272B
 *  (native read); remainder #E9E9EA and the 6px track are pixel-sampled and
 *  remain disclosed as sampled in docs/design-api-gaps.md. */
function Gauge({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const angle = Math.PI * (1 - clamped / 100);
  return (
    <svg viewBox="0 0 190 112" className="mx-auto w-[190px]">
      <path d="M6.2 105 A88.8 88.8 0 0 1 183.8 105" fill="none" stroke="#E9E9EA" strokeWidth="6" strokeLinecap="round" />
      <path
        d={`M6.2 105 A88.8 88.8 0 0 1 ${95 + 88.8 * Math.cos(angle)} ${105 - 88.8 * Math.sin(angle)}`}
        fill="none"
        stroke="#27272B"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line x1="95" y1="105" x2={95 + 53 * Math.cos(angle)} y2={105 - 53 * Math.sin(angle)} stroke="#27272B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="95" cy="105" r="5" fill="#FFFFFF" stroke="#27272B" strokeWidth="3" />
    </svg>
  );
}

/** Icon-in-tinted-circle marker used by the Product Details grid. Tints and
 *  icon colors pixel-sampled from the 46% capture (disclosed in
 *  docs/design-api-gaps.md); circle 40px, icon ~20px. */
function DetailIcon({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bg, color }}>
      {children}
    </span>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
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
  const [totalTasks, setTotalTasks] = useState<number | null>(null);
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
      // Total Tasks from A5.1 (project_id filter documented). The collection
      // documents no response shape for A5.1; the value is picked up only
      // when the response actually carries a numeric pagination total, never
      // invented (docs/design-api-gaps.md).
      try {
        const { data } = await apiClient.get(`/api/v1/tasks`, { params: { project_id: id, per_page: 1 } });
        const body = data as { meta?: { total?: unknown }; data?: { meta?: { total?: unknown } } };
        const total = body?.data?.meta?.total ?? body?.meta?.total;
        if (!cancelled && typeof total === "number") setTotalTasks(total);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const members = (project?.teams ?? []).flatMap((t) => t.members ?? []);
  const pct = project?.progress ?? 0;

  // Due Date track fill: elapsed fraction between the documented start and
  // deadline dates, clamped; the frame draws the track without stating its
  // semantics (docs/design-api-gaps.md).
  let elapsed = 0;
  if (project?.start_date && project?.deadline) {
    const s = new Date(project.start_date).getTime();
    const e = new Date(project.deadline).getTime();
    if (e > s) elapsed = Math.min(1, Math.max(0, (Date.now() - s) / (e - s)));
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={userName} userRole={userRole} active="Projects" />
      <main className="relative px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[43px]">
        <div>
          <div>
            <p className={`${SANS} text-sm text-black/60`}>
              <Link href="/projects" className="hover:underline">Projects</Link>
              <span className="px-1">&gt;</span>
              {project?.name ?? "…"}
            </p>
            <div className="mt-[10px] flex items-baseline gap-3">
              <h1
                className={`${SANS} text-[31px] font-semibold leading-[150%] text-black`}
                style={{ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as React.CSSProperties}
              >
                {project?.name ?? "…"}
              </h1>
              {project ? <span className={`${SANS} text-xs text-[#2BA52E]`}>{pct}% Completed</span> : null}
            </div>
          </div>

          {/* Due Date card drawn in the top header, right of the title.
              Absolutely positioned so it does not push the tabs row down;
              the source's title/tabs flow is unchanged. */}
          <section className="absolute right-4 top-8 hidden w-[284px] rounded-2xl border border-[#F3F4F6] bg-white p-5 sm:right-8 lg:right-16 lg:top-[38px] lg:block">
            <h2 className={`${SANS} mb-3 text-[20px] font-medium leading-[150%] text-[#191919]`}>Due Date</h2>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6EFFF]">
              <div className="h-full rounded-full bg-[#005AFB]" style={{ width: `${Math.round(elapsed * 100)}%` }} />
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
        </div>

        <nav className="mt-[40px] flex items-center gap-8">
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

        <div className="mt-[46px] grid gap-6 lg:grid-cols-[862px_416px] lg:justify-between">
          <div className="flex flex-col gap-6">
            <Card title="Description">
              <p className={`${SANS} text-base leading-[150%] text-[#525256]`}>
                {project?.description ?? ""}
              </p>
            </Card>

            <Card title="Product Details">
              <div className="grid grid-cols-3 gap-x-6 gap-y-8">
                {/* Project Type: no field in the documented Project model; its
                    cell stays empty so the supported items keep their drawn
                    positions (docs/design-api-gaps.md). */}
                <span aria-hidden="true" />
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#F2EAF2" color="#BF75A9"><CalendarIcon /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Start Date</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(project?.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#FFEDE6" color="#FB743A"><CalendarIcon /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Deadline</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(project?.deadline)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#FBEAEA" color="#DB302A"><TargetIcon /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Priority</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{project?.priority ?? ""}</p>
                  </div>
                </div>
                {totalTasks !== null ? (
                  <div className="flex items-center gap-3">
                    <DetailIcon bg="#F3F4F6" color="#191919"><CheckCircleIcon /></DetailIcon>
                    <div>
                      <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Total Tasks</p>
                      <p className={`${SANS} text-base font-medium text-[#000712]`}>{totalTasks}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card title="Project Progress">
              <Gauge pct={pct} />
              <p className={`${SANS} mt-1 text-center text-base font-medium text-black`}>{pct}%</p>
              <p className={`${SANS} text-center text-xs text-black`}>Project Completed</p>
              {/* The pending / in progress / completed fractions drawn below the
                  gauge depend on A4.3/A4.4, whose response shapes the collection
                  does not document; omitted rather than parsed with guessed keys
                  (docs/design-api-gaps.md). */}
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
