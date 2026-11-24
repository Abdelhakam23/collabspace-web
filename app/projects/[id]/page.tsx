"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, CircleCheck, Target } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { AreaChart } from "@/components/charts/area-chart";
import { getProjectOverview, getProjectTeamsTaskProgress } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import type { ProjectOverview, ProjectTeamProgress } from "@/lib/types";

/**
 * Project detail "All Projects / Alpha" frame (UI Design page, node 181-1158),
 * wired to A4.1/A4.3/A4.4 (+ A5.1 total when the response carries one).
 * Design fields with no API backing ("Project Type", status fractions) are
 * omitted, not guessed. Native geometry and disclosures:
 * docs/design-api-gaps.md. Tasks/Teams/Files tabs stay inert until their
 * sibling frames ship.
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

/** Needle gauge, geometry measured from the native file
 *  (docs/design-api-gaps.md). The drawn arc is decorative (~63% of the
 *  track, not the labeled 78%): runtime maps pct truthfully, the
 *  visual-fixture harness reproduces the drawn state verbatim. */
function Gauge({ pct, drawn = false }: { pct: number; drawn?: boolean }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const c = 89, r = 82.5, C = 2 * Math.PI * r;
  // Vector endpoints include the round caps (~3.1deg at r 82.5).
  const trackLen = (192 / 360) * C;
  const pivotX = 88.06, pivotY = 97.51;
  // Truthful mapping: arc end and needle at 172.5 + 1.92 * pct degrees.
  const trueDeg = 1.92 * clamped - 97.5;
  const needleDeg = drawn ? 22.09 : trueDeg;
  const progLen = drawn ? (120 / 360) * C : (trackLen * clamped) / 100;
  return (
    <svg viewBox="0 0 178 178" className="absolute inset-0 h-full w-full">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E9E9EA" strokeWidth="9"
        strokeLinecap="round" strokeDasharray={`${trackLen} ${C}`} transform={`rotate(172.5 ${c} ${c})`} />
      {progLen > 0 ? (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#27272B" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={`${progLen} ${C}`} transform={`rotate(172.5 ${c} ${c})`} />
      ) : null}
      <g transform={`rotate(${needleDeg - 22.09} ${pivotX} ${pivotY})`}>
        {/* Figma reports the rotated bounding box for the needle, so place
            by its center (99.5,69.1) and tilt 22.09deg clockwise. */}
        <rect x={94.78} y={41.94} width={9.45} height={54.32} rx={4.725} fill="#27272B"
          transform="rotate(22.09 99.5 69.1)" />
      </g>
      {/* Dot stroke draws inside the 17.01 box, so r = 8.505 - 1.89/2. */}
      <circle cx={pivotX} cy={pivotY} r={7.56} fill="#FFFFFF" stroke="#27272B" strokeWidth="1.89" />
    </svg>
  );
}

/** Icon-in-tinted-circle marker for the Product Details grid. */
function DetailIcon({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bg, color }}>
      {children}
    </span>
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
  // Set only by the visual-fixture harness, never in production.
  const [visualFixture] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("collabspace_visual_fixture") === "1",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // A4.3 + A4.4 drive the whole screen (docs/design-api-gaps.md).
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

  // Due Date fill: elapsed fraction between the documented dates, clamped.
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
                    <AreaChart points={series} maxChart={yMax} className="h-[218px] w-full" />
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
                  <DetailIcon bg="#F2EAF2" color="#BF75A9"><Calendar className="h-6 w-6" strokeWidth={1.6} /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Start Date</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#FFEDE6" color="#FB743A"><Calendar className="h-6 w-6" strokeWidth={1.6} /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Deadline</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{shortDate(deadline)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DetailIcon bg="#FBEAEA" color="#DB302A"><Target className="h-6 w-6" strokeWidth={1.6} /></DetailIcon>
                  <div>
                    <p className={`${SANS} text-xs text-[#4A4A4A]/80`}>Priority</p>
                    <p className={`${SANS} text-base font-medium text-[#000712]`}>{overview?.priority ?? ""}</p>
                  </div>
                </div>
                {totalTasks !== null ? (
                  <div className="flex items-center gap-3">
                    <DetailIcon bg="#F3F4F6" color="#191919"><CircleCheck className="h-6 w-6" strokeWidth={1.6} /></DetailIcon>
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
                <Gauge pct={pct} drawn={visualFixture} />
                <div className="absolute left-[35px] top-[129px] w-[106px] text-center">
                  <p className={`${SANS} text-[16px] font-medium leading-[12px] text-black`}>{pct}%</p>
                  <p className={`${SANS} mt-[12px] whitespace-nowrap text-[12px] leading-[9px] text-black`}>Project Completed</p>
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
