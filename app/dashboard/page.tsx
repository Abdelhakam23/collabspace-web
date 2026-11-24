"use client";

import { useEffect, useState } from "react";
import { Briefcase, Calendar, ChevronDown, Download, File, Send } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { AreaChart } from "@/components/charts/area-chart";
import { Bar } from "@/components/dashboard/bar";
import { Card, ViewAll } from "@/components/dashboard/card";
import { Gauge } from "@/components/dashboard/gauge";
import { KpiCard } from "@/components/dashboard/kpi";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { getProfile } from "@/lib/api/profile";

/**
 * Dashboard from the "Dashboard" frame (UI Design page, node 285-12895),
 * wired to GET /api/v1/dashboard (A10.1) and GET /api/v1/auth/me (A2.1).
 * Native reads and sampled-value disclosures: docs/design-api-gaps.md.
 * KPI deltas and chart filters have no API backing, so they are omitted
 * or inert rather than invented.
 */

type Overview = {
  projects: { total: number; active: number; completed: number; average_progress: number };
  tasks: Record<string, number>;
  meetings: { upcoming_count: number };
  teams: { total: number };
};

type DashboardPayload = {
  overview: Overview;
  project_overview: { data: { label: string; projects: number; created_tasks: number; completed_tasks: number }[] };
  active_projects: { items: { id: number; name: string; tasks_done?: number; tasks_total?: number; color?: string }[] };
  tasks: { items: { id: number; title: string; priority?: string; due_date?: string; progress?: number }[] };
  teams: { items: { id: number; name: string; members_count?: number; tasks_count?: number }[] };
  upcoming_meetings: { items: { id: number; title: string; starts_at?: string; time?: string; date_label?: string; attendees_count?: number }[] };
  recent_files: { items: { id: number; name: string; owner?: string; type?: string; updated_at?: string }[] };
};

const M = "font-[family-name:var(--font-sans)]";

const PRIORITY_TONES: Record<string, { text: string; bg: string }> = {
  high: { text: "#D92D20", bg: "#FEE4E2" },
  medium: { text: "#B54708", bg: "#FEF0C7" },
  low: { text: "#067647", bg: "#D1FADF" },
};

const PROJECT_COLORS = ["#7B2C7E", "#0DB0A8", "#005AFB", "#FF9226"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [userName, setUserName] = useState("Account");
  const [userRole, setUserRole] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardOverview()
      .then((res) => setData(res.data as unknown as DashboardPayload))
      .catch(() => setError("Could not load the dashboard right now."));
    getProfile()
      .then((res) => {
        setUserName(res.data?.user?.name ?? "Account");
        setUserRole(res.data?.user?.roles?.[0] ? String(res.data.user.roles[0]) : undefined);
      })
      .catch(() => {});
  }, []);

  const t = data?.overview.tasks ?? {};
  const total = t.total ?? 0;
  const pending = t.pending ?? 0;
  const inProgress = (t.in_progress ?? 0) + (t.in_review ?? 0);
  const completed = t.completed ?? 0;
  const rate = t.completion_rate ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
  const chart = data?.project_overview.data ?? [];
  const series = chart.map((d) => d.created_tasks);
  const maxChart = Math.max(1, ...series);
  const yMax = Math.ceil(maxChart / 5) * 5;
  const teams = data?.teams.items ?? [];
  const maxTeamTasks = Math.max(1, ...teams.map((tm) => tm.tasks_count ?? 0));

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={userName} userRole={userRole} />
      <main className="space-y-6 px-4 py-6 sm:px-8 xl:px-16 xl:py-10">
        {error ? <p className="rounded-lg bg-[#fdecea] px-4 py-2 text-sm text-[#af2622]" role="alert">{error}</p> : null}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Pending Tasks" value={pending} tone="orange" ratio={total > 0 ? pending / total : 0} fraction={`${pending}/${total}`} />
          <KpiCard label="In Progress" value={inProgress} tone="blue" ratio={total > 0 ? inProgress / total : 0} fraction={`${inProgress}/${total}`} />
          <KpiCard label="Completed" value={completed} tone="green" ratio={total > 0 ? completed / total : 0} fraction={`${completed}/${total}`} />
          <section className="rounded-2xl border border-[#F3F4F6] bg-white p-5 xl:h-[160px]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`${M} text-[20px] font-medium leading-[150%] text-[#000000]`}>Completion Rate</h2>
                <p className={`${M} mt-1 text-[31px] font-semibold leading-[150%] text-[#000000]`}>{rate}%</p>
              </div>
              <Gauge ratio={rate / 100} />
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card title="Project overview" className="xl:col-span-6 xl:h-[285px]"
            actions={
              <span className={`${M} flex items-center gap-4 text-xs font-medium text-[#000712]`}>
                <span aria-disabled="true" className="flex items-center gap-1"><ChevronDown size={12} />All Projects</span>
                <span aria-disabled="true" className="flex items-center gap-1"><ChevronDown size={12} />This year</span>
              </span>
            }>
            <div className="flex items-stretch gap-2">
              <div className="flex h-44 flex-col justify-between py-1 text-right text-[10px] text-[#718096]" aria-hidden="true">
                {[yMax, Math.round((yMax * 2) / 3), Math.round(yMax / 3), 0].map((v, i) => (
                  <span key={i}>{v >= 1000 ? `${Math.round(v / 100) / 10}k` : v}</span>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <AreaChart points={series.length ? series : [0, 0]} maxChart={yMax} />
                <div className="mt-1 flex justify-between text-[10px] text-[#718096]">
                  {chart.map((d) => <span key={d.label}>{d.label.split(" ")[0]}</span>)}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Active Projects" actions={<ViewAll />} className="xl:col-span-3 xl:h-[285px] xl:overflow-hidden">
            <ul className="space-y-4">
              {(data?.active_projects.items ?? []).map((p, idx) => {
                const color = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                const done = p.tasks_done ?? 0;
                const totalTasks = p.tasks_total ?? 0;
                return (
                  <li key={p.id} className="flex items-start gap-3 rounded-xl border border-[#eef1f5] p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}1A`, color }} aria-hidden="true">
                      <Briefcase size={16} />
                    </span>
                    <span className="w-full min-w-0">
                      <span className={`${M} block truncate text-sm font-medium text-[#000712]`}>{p.name}</span>
                      <Bar ratio={totalTasks > 0 ? done / totalTasks : 0} color={color} className="mt-2" />
                      <span className={`${M} mt-1 block text-xs text-[#718096]`}>Task: {done} /{totalTasks}</span>
                    </span>
                  </li>
                );
              })}
              {data && data.active_projects.items.length === 0 ? <li className={`${M} text-sm text-[#718096]`}>No active projects yet.</li> : null}
            </ul>
          </Card>

          <Card title="Recent Files" actions={<ViewAll />} className="xl:col-span-3 xl:h-[285px] xl:overflow-hidden">
            <ul className="space-y-4">
              {(data?.recent_files.items ?? []).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDE8E8] text-[#E5484D]" aria-hidden="true">
                      <File size={14} />
                    </span>
                    <span className="min-w-0">
                      <p className={`${M} truncate text-sm font-medium text-[#000712]`}>{f.name}</p>
                      <p className={`${M} text-xs text-[#718096]`}>By {[f.owner, f.updated_at].filter(Boolean).join(" • ")}</p>
                    </span>
                  </span>
                  {/* Download affordance per the frame; file download endpoints are
                      not part of the dashboard payload, so it stays inert here. */}
                  <span aria-disabled="true" aria-label="Download (not wired yet)"><Download size={16} /></span>
                </li>
              ))}
              {data && data.recent_files.items.length === 0 ? <li className={`${M} text-sm text-[#718096]`}>No files yet.</li> : null}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card title="Tasks" actions={<ViewAll />} className="xl:col-span-3 xl:h-[414px] xl:overflow-hidden">
            <ul className="space-y-4">
              {(data?.tasks.items ?? []).map((task) => {
                const tone = PRIORITY_TONES[(task.priority ?? "").toLowerCase()];
                return (
                  <li key={task.id} className="rounded-xl border border-[#eef1f5] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`${M} text-sm font-normal text-[#252525]`}>{task.title}</p>
                      {task.priority && tone ? (
                        <span className={`${M} shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold`} style={{ color: tone.text, backgroundColor: tone.bg }}>{task.priority}</span>
                      ) : null}
                    </div>
                    <div className={`${M} mt-1 flex items-center justify-between text-xs text-[#718096]`}>
                      <span>{task.due_date ?? ""}</span>
                      {typeof task.progress === "number" ? <span>{task.progress}%</span> : null}
                    </div>
                    <Bar ratio={(task.progress ?? 0) / 100} color="#2692FF" className="mt-1.5" />
                  </li>
                );
              })}
              {data && data.tasks.items.length === 0 ? <li className={`${M} text-sm text-[#718096]`}>No tasks due.</li> : null}
            </ul>
          </Card>

          <Card title="Teams" className="xl:col-span-3 xl:h-[414px] xl:overflow-hidden"
            actions={
              <span aria-disabled="true" className={`${M} flex items-center gap-1 text-xs font-medium text-[#000712]`}>
                {teams[0]?.name ?? "All"}<ChevronDown size={12} />
              </span>
            }>
            {/* The source panel heads its member list "Name"/"Tasks"; the payload
                carries teams only, so these rows are teams and the header says so. */}
            <div className={`${M} flex justify-between text-[10px] font-medium uppercase tracking-wide text-[#a0a8b5]`}>
              <span>Team</span><span>Tasks</span>
            </div>
            <ul className="mt-3 space-y-4">
              {teams.map((team) => (
                <li key={team.id} className="flex items-center gap-3">
                  <span className="h-8 w-8 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <span className="w-full min-w-0">
                    <span className={`${M} block truncate text-sm font-medium text-[#000712]`}>{team.name}</span>
                    <Bar ratio={(team.tasks_count ?? 0) / maxTeamTasks} color="#2692FF" className="mt-1.5" />
                  </span>
                  <span className={`${M} shrink-0 text-xs text-[#718096]`}>{team.tasks_count ?? 0}/{team.members_count ?? 0}</span>
                </li>
              ))}
              {data && teams.length === 0 ? <li className={`${M} text-sm text-[#718096]`}>No teams yet.</li> : null}
            </ul>
          </Card>

          <Card title="Up coming meetings" actions={<ViewAll />} className="xl:col-span-3 xl:h-[414px] xl:overflow-hidden">
            <ul className="space-y-4">
              {(data?.upcoming_meetings.items ?? []).map((m) => (
                <li key={m.id} className="rounded-xl border border-[#eef1f5] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`${M} text-sm font-normal text-[#000000]`}>{m.title}</p>
                    {m.date_label ? (
                      <span className={`${M} flex shrink-0 items-center gap-1 rounded-md bg-[#f0f2f5] px-2 py-0.5 text-[10px] text-[#525256]`}>
                        <Calendar size={10} />
                        {m.date_label}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex -space-x-2" aria-hidden="true">
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#e2e8f0]" />
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#d5dbe5]" />
                      {typeof m.attendees_count === "number" && m.attendees_count > 2 ? (
                        <span className={`${M} flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#eef0f4] text-[9px] text-[#525256]`}>+{m.attendees_count - 2}</span>
                      ) : null}
                    </span>
                    <span className={`${M} text-xs text-[#718096]`}>{m.time ?? m.starts_at ?? ""}</span>
                  </div>
                </li>
              ))}
              {data && data.upcoming_meetings.items.length === 0 ? <li className={`${M} text-sm text-[#718096]`}>No meetings scheduled.</li> : null}
            </ul>
          </Card>

          <Card title="Ask AI" className="xl:col-span-3 xl:h-[414px] xl:overflow-hidden">
            {/* The frame shows a blue robot illustration. Export from the
                view-only file is being verified separately; until the asset is
                in the repo a neutral block holds its geometry. POST /ai/ask is
                wired in the AI milestone - read-only here. */}
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E5EFFF]" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#005AFB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="8" width="14" height="11" rx="3" />
                  <path d="M12 5v3M9 13h.01M15 13h.01M9 16h6" />
                  <circle cx="12" cy="4" r="1.4" />
                </svg>
              </span>
              <p className={`${M} text-sm text-[#525256]`}>ask me anything about...</p>
            </div>
            <p className={`${M} flex items-center justify-between rounded-xl bg-[#F6F8FA] px-4 py-3 text-sm text-[#718096]`}>
              ask me anything about...
              <span className="text-[#005AFB]" aria-hidden="true" aria-disabled="true">
                <Send size={16} />
              </span>
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
