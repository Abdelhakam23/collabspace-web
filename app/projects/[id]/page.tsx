"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { getProjectOverview, getProjectTeamsTaskProgress } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import type { ProjectOverview, ProjectTeamProgress } from "@/lib/types";

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
 * the Project overview chart card consumes the A4.3 chart array; earlier
 * are undocumented, so they are omitted rather than parsed with guessed
 * keys. Tasks/Teams/Files tabs stay inert until their sibling frames ship.
 */

const SANS = "font-[family-name:var(--font-sans)]";
const TABS = ["Overview", "Tasks", "Teams", "Files"];
// Dot colors are pixel-sampled from the 46% capture (docs/design-api-gaps.md).
const STATUS_LEGEND = [
  { status: "Pending", label: "Pending tasks", color: "#191919" },
  { status: "In Progress", label: "In progress tasks", color: "#005AFB" },
  { status: "Completed", label: "Completed tasks", color: "#2BA52E" },
];

// Short "Mon D" presentation of an ISO date as drawn in the frame.
function shortDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Card({ title, children, className = "", gap = 20, aside, asideInline = false }: { title: string; children: React.ReactNode; className?: string; gap?: number; aside?: React.ReactNode; asideInline?: boolean }) {
  return (
    <section className={`rounded-2xl bg-white p-5 ring-1 ring-[#F3F4F6] ${className}`}>
      <div className="flex flex-col" style={{ gap }}>
        <div className={asideInline ? "flex items-center gap-4" : "flex items-start justify-between"}>
          <h2 className={`${SANS} text-[20px] font-medium leading-[15px] text-[#191919]`}>{title}</h2>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Needle gauge (Group 1171275875, 178x178 native): track is a 225-degree
 *  arc starting at 155deg (screen coords, clockwise from 3 o'clock) so the
 *  135-degree gap sits centered at the bottom; the dark progress arc starts
 *  at the track start. Ellipse 177.61px, stroke 11px (#27272B on #E9E9EA).
 *  Needle pivot ~29.5px below ring center with a white ring dot (1.89px
 *  #27272B border). Geometry from native ellipse reads plus pixel analysis
 *  of the zoomed capture (docs/design-api-gaps.md). */
function Gauge({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const c = 89, r = 83.3, C = 2 * Math.PI * r;
  const trackLen = (225 / 360) * C;
  const pivotY = c + 29.5;
  // Needle angle: degrees clockwise from straight up, anchored to the drawn
  // sample (78% -> 22.09deg, Rectangle 40109) sweeping 2.25deg per point.
  const deg = 22.09 + 2.25 * (clamped - 78);
  const rad = (deg * Math.PI) / 180;
  const tipX = c + 54.32 * Math.sin(rad);
  const tipY = pivotY - 54.32 * Math.cos(rad);
  return (
    <svg viewBox="0 0 178 178" className="absolute inset-0 h-full w-full">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E9E9EA" strokeWidth="11"
        strokeDasharray={`${trackLen} ${C}`} transform={`rotate(155 ${c} ${c})`} />
      {clamped > 0 ? (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#27272B" strokeWidth="11"
          strokeDasharray={`${(trackLen * clamped) / 100} ${C}`} transform={`rotate(155 ${c} ${c})`} />
      ) : null}
      <line x1={c} y1={pivotY} x2={tipX} y2={tipY} stroke="#27272B" strokeWidth="9.45" strokeLinecap="round" />
      <circle cx={c} cy={pivotY} r="7.5" fill="#FFFFFF" stroke="#27272B" strokeWidth="1.89" />
    </svg>
  );
}

/** Monthly area chart for the Project overview card: same smoothing and
 *  visual language as the dashboard chart (Catmull-Rom curve, blue gradient
 *  area). Series is the A4.3 chart array's created_tasks; the frame draws a
 *  single line and the response carries no second style for completed_tasks,
 *  so only created_tasks is plotted (docs/design-api-gaps.md). */
function AreaChart({ points, maxChart }: { points: number[]; maxChart: number }) {
  const w = 560, h = 180, pad = 4;
  const n = Math.max(2, points.length);
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / (n - 1));
  const ys = points.map((v) => h - pad - (v / maxChart) * (h - pad * 2));
  const seg = (i: number) => {
    const p0 = i > 0 ? i - 1 : 0, p1 = i, p2 = i + 1 < n ? i + 1 : n - 1, p3 = i + 2 < n ? i + 2 : n - 1;
    const c1x = xs[p1] + (xs[p2] - xs[p0]) / 6, c1y = ys[p1] + (ys[p2] - ys[p0]) / 6;
    const c2x = xs[p2] - (xs[p3] - xs[p1]) / 6, c2y = ys[p2] - (ys[p3] - ys[p1]) / 6;
    return `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${xs[p2].toFixed(1)},${ys[p2].toFixed(1)}`;
  };
  const path = `M${xs[0].toFixed(1)},${ys[0].toFixed(1)} ${Array.from({ length: n - 1 }, (_, i) => seg(i)).join(" ")}`;
  const area = `${path} L${xs[n - 1].toFixed(1)},${h} L${xs[0].toFixed(1)},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[218px] w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="alphaOverviewArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2692FF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2692FF" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#alphaOverviewArea)" />
      <path d={path} fill="none" stroke="#2692FF" strokeWidth="2.5" strokeLinecap="round" />
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
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [teamsProgress, setTeamsProgress] = useState<ProjectTeamProgress[]>([]);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // A4.3 overview + A4.4 teams drive the whole screen: header, dates,
      // priority, gauge, status legend and member list all come from their
      // observed response shapes (docs/design-api-gaps.md).
      try {
        const [ov, tp, profile] = await Promise.all([
          getProjectOverview(id),
          getProjectTeamsTaskProgress(id),
          getProfile(),
        ]);
        if (cancelled) return;
        setOverview(ov.data ?? null);
        setTeamsProgress(Array.isArray(tp.data) ? tp.data : []);
        const u = (profile.data as { user?: { name?: string; roles?: string[] } }).user;
        setUserName(u?.name ?? "");
        setUserRole(u?.roles?.[0]);
      } catch {
        if (!cancelled) {
          setOverview(null);
          setTeamsProgress([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const members = teamsProgress.flatMap((tm) => tm.members ?? []);
  const stats = overview?.tasks_statistics;
  const totalTasks = stats?.total ?? null;
  const statusTotals = stats ? [stats.pending, stats.in_progress, stats.completed] : STATUS_LEGEND.map(() => null);
  const pct = overview?.progress_percentage ?? 0;
  const startDate = overview?.due_date_indicator?.start_date;
  const deadline = overview?.due_date_indicator?.deadline;
  const chartData = overview?.chart?.data ?? [];
  const series = chartData.map((d) => d.created_tasks);
  const yMax = Math.max(1, Math.ceil(Math.max(1, ...series) / 5) * 5);

  // Due Date track fill: elapsed fraction between the documented start and
  // deadline dates, clamped; the frame draws the track without stating its
  // semantics (docs/design-api-gaps.md).
  let elapsed = 0;
  if (startDate && deadline) {
    const s = new Date(startDate).getTime();
    const e = new Date(deadline).getTime();
    if (e > s) elapsed = Math.min(1, Math.max(0, (Date.now() - s) / (e - s)));
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={userName} userRole={userRole} active="Projects" />
      {/* Native layout (frame 181-1158): header block top 104 (navbar 76),
          left 65, 1311 wide, Hug 71: title column (Fill 955, vertical gap 16:
          breadcrumb + title row) beside the Due Date card (Fixed 324x71,
          radius 12, border #F3F4F6, padding 12, gap 16). Content frame top
          207: tabs row (Hug 28, gap 30), gap 32, cards grid (707 tall): left
          column Fixed 864, right column Fixed 416, separated 32. */}
      <main className="px-4 pt-7 sm:px-8 lg:px-16 lg:pt-[32px]">
        <div className="flex items-start justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p className={`${SANS} text-sm leading-[16px] text-black/60`}>
              <Link href="/projects" className="hover:underline">Projects</Link>
              <span className="px-1">&gt;</span>
              {overview?.name ?? "…"}
            </p>
            <div className="flex h-[28px] items-center gap-4">
              <h1
                className={`${SANS} text-[31px] font-semibold leading-[28px] text-black`}
              >
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
          {TABS.map((t, i) => (
            <span
              key={t}
              {...(i === 0 ? { "aria-current": "page" as const } : { "aria-disabled": "true" as const, title: "This tab is not built yet" })}
              className={`${SANS} flex h-[28px] items-start gap-[10px] px-4 pb-4 text-[16px] font-normal leading-[12px] ${
                i === 0 ? "border-b-[1.5px] border-[#005AFB] text-[#005AFB]" : "text-[#4A4A4A]"
              }`}
            >
              {t}
            </span>
          ))}
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[864px_416px] lg:justify-between">
          <div className="flex flex-col gap-8">
            <Card title="Description" gap={20}>
              <p className={`${SANS} -my-[6px] text-[16px] leading-6 text-[#525256]`}>
                {overview?.description ?? ""}
              </p>
            </Card>

            <Card
              title="Project overview"
              aside={
                <span className={`${SANS} flex items-center gap-4 text-xs font-medium text-[#000712]`}>
                  {/* Period/grouping filters: the collection documents no query
                      parameters for A4.3, so both stay inert
                      (docs/design-api-gaps.md). */}
                  <span aria-disabled="true" title="Filtering is not available from the API" className="flex h-6 items-center gap-1">
                    <svg viewBox="0 0 10 5" className="h-[5px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l4 3 4-3" /></svg>
                    All Projects
                  </span>
                  <span aria-disabled="true" title="Filtering is not available from the API" className="flex h-6 items-center gap-1">
                    <svg viewBox="0 0 10 5" className="h-[5px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l4 3 4-3" /></svg>
                    This Year
                  </span>
                </span>
              }
            >
              {series.length ? (
                <div className="flex h-[241px] items-stretch gap-3">
                  <div className="flex h-[218px] flex-col justify-between py-1 text-right text-[10px] text-[#718096]" aria-hidden="true">
                    {[yMax, Math.round((yMax * 2) / 3), Math.round(yMax / 3), 0].map((v, i) => (
                      <span key={i}>{v >= 1000 ? `${Math.round(v / 100) / 10}k` : v}</span>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <AreaChart points={series} maxChart={yMax} />
                    <div className="mt-[11px] flex h-3 justify-between text-[10px] leading-[12px] text-[#718096]">
                      {/* The frame draws six axis labels; all twelve monthly
                          points stay plotted - labels are representative,
                          data is not dropped. */}
                      {chartData.map((d, i) => <span key={d.label}>{i % 2 === 0 ? d.month : ""}</span>)}
                    </div>
                  </div>
                </div>
              ) : (
                <p className={`${SANS} text-sm text-[#718096]`}>No chart data yet.</p>
              )}
            </Card>

            <Card title="Product Details" gap={24}>
              <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                {/* Project Type: no field in the documented Project model; its
                    cell stays empty so the supported items keep their drawn
                    positions (docs/design-api-gaps.md). */}
                <span aria-hidden="true" />
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#F2EAF2" color="#BF75A9"><CalendarIcon /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Start Date</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#FFEDE6" color="#FB743A"><CalendarIcon /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Deadline</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(deadline)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#FBEAEA" color="#DB302A"><TargetIcon /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Priority</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{overview?.priority ?? ""}</p>
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

          <div className="flex flex-col gap-8 lg:h-[707px]">
            <Card title="Project Progress" gap={43}>
              <div className="relative mx-auto h-[178px] w-[178px]">
                <Gauge pct={pct} />
                <div className="absolute left-[36px] top-[133px] w-[106px] text-center">
                  <p className={`${SANS} text-[16px] font-medium leading-[12px] text-black`}>{pct}%</p>
                  <p className={`${SANS} mt-[9px] whitespace-nowrap text-[12px] leading-[9px] text-black`}>Project Completed</p>
                </div>
              </div>
              {/* Legend row (native: Hug 407 x 37, gap 43, centered; items are
                  value over dot+label with gap 16). Counts come from A5.1 with
                  its documented status filter, shown only when the response
                  actually carries a numeric pagination total; a dash marks a
                  count the API did not supply - never an invented number. */}
              <div className="mx-auto flex w-fit items-start gap-[43px]">
                {STATUS_LEGEND.map((item, i) => (
                  <div key={item.label} className="flex flex-col items-center gap-4">
                    <span className={`${SANS} text-[16px] font-medium leading-[12px] text-black`}>
                      {statusTotals[i] !== null && totalTasks !== null ? `${statusTotals[i]}/${totalTasks}` : "\u2013"}
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: item.color }} />
                      <span className={`${SANS} whitespace-nowrap text-[12px] leading-[9px] text-[#4A4A4A]`}>{item.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Team Members"
              className="lg:flex-1"
              asideInline
              aside={
                <span aria-disabled="true" title="Team filtering is not built yet" className={`${SANS} flex h-[15px] items-center gap-[12px] text-[12px] leading-[9px] text-[#4A4A4A]`}>
                  UI/UX
                  <svg viewBox="0 0 10 5" className="h-[5px] w-[10px]" fill="none" stroke="#4A4A4A" strokeWidth="1.5"><path d="M1 1l4 3 4-3" /></svg>
                </span>
              }
            >
              {members.length ? (
                <ul className="flex flex-col gap-[12.5px]">
                  {members.map((m, mi) => (
                    <li key={`${m.id}-${mi}`} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-[#E9E9EA] bg-[#F6F8FA] text-xs text-[#000712]">
                        {m.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.avatar_url} alt={m.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          m.name.split(" ").map((x) => x[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
                        )}
                      </span>
                      <span className={`${SANS} text-sm text-[#525256]`}>{m.name}</span>
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
