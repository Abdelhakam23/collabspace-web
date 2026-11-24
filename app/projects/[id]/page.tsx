"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, CircleCheck, Target } from "lucide-react";
import { AreaChart } from "@/components/charts/area-chart";
import { Card, DetailIcon } from "@/components/projects/detail/card";
import { Gauge } from "@/components/projects/detail/gauge";
import { ProjectShell } from "@/components/projects/project-shell";
import { TinyChevron } from "@/components/projects/tiny-chevron";
import { initials, shortDate } from "@/lib/format";
import { getProjectOverview, getProjectTeamsTaskProgress } from "@/lib/api/projects";
import type { ProjectOverview, ProjectTeamProgress } from "@/lib/types";

/**
 * Project detail "All Projects / Alpha" frame (UI Design page, node 181-1158),
 * wired to A4.1/A4.3/A4.4 (+ A5.1 total when the response carries one).
 * Design fields with no API backing ("Project Type", status fractions) are
 * omitted, not guessed. Native geometry and disclosures:
 * docs/design-api-gaps.md. The page chrome (navbar, header, tabs) lives in
 * components/projects/project-shell.tsx, shared with the sibling tabs.
 */

const SANS = "font-[family-name:var(--font-sans)]";
// Dot colors are pixel-sampled from the 46% capture (docs/design-api-gaps.md).
const STATUS_LEGEND = [
  { status: "Pending", label: "Pending tasks", color: "#191919" },
  { status: "In Progress", label: "In progress tasks", color: "#005AFB" },
  { status: "Completed", label: "Completed tasks", color: "#2BA52E" },
];

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
  // Set only by the visual-fixture harness, never in production.
  const [visualFixture] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("collabspace_visual_fixture") === "1",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // A4.3 + A4.4 drive the whole screen (docs/design-api-gaps.md).
      try {
        const [ov, tp] = await Promise.all([
          getProjectOverview(id),
          getProjectTeamsTaskProgress(id),
        ]);
        if (cancelled) return;
        setOverview(ov.data ?? null);
        setTeamsProgress(Array.isArray(tp.data) ? tp.data : []);
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

  return (
    <ProjectShell projectId={id}>
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
                    <TinyChevron />
                    All Projects
                  </span>
                  <span aria-disabled="true" title="Filtering is not available from the API" className="flex h-6 items-center gap-1">
                    <TinyChevron />
                    This Year
                  </span>
                </span>
              }
            >
              {series.length ? (
                <div className="flex h-[241px] items-stretch gap-3">
                  <div className="flex h-[218px] flex-col justify-between py-1 text-right text-[10px] text-[#718096]" aria-hidden="true">
                    {[yMax, Math.round((yMax * 4) / 5), Math.round((yMax * 3) / 5), Math.round((yMax * 2) / 5), Math.round(yMax / 5), 0].map((v, i) => (
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
              {/* Centered with justify-center, not auto margins: the drawn
                  row (407px natively) is wider than the card's padding box,
                  and auto margins clamp an overflowing item to the start edge
                  while justify-center overflows symmetrically, as the frame does. */}
              <div className="flex justify-center">
                <div className="flex w-fit items-start gap-[43px]">
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
              </div>
            </Card>

            <Card
              title="Team Members"
              className="lg:flex-1"
              asideInline
              aside={
                <span aria-disabled="true" title="Team filtering is not built yet" className={`${SANS} flex h-[15px] items-center gap-[12px] text-[12px] leading-[9px] text-[#4A4A4A]`}>
                  UI/UX
                  <TinyChevron />
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
                          initials(m.name)
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
    </ProjectShell>
  );
}
