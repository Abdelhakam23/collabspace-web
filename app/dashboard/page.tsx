"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { getProfile } from "@/lib/api/profile";

/**
 * Dashboard from the Figma "Dashboard" frame (node 75-1433, 1440x1024, white),
 * wired to GET /api/v1/dashboard (A10.1) and GET /api/v1/auth/me (A2.1).
 * Native typography: KPI labels Rubik 400 18px, KPI numbers Rubik 500 32px,
 * section titles Inter 600 16px #191919, "View All" Inter 500 12px #525256,
 * list rows Inter 400 14px.
 * Card radii/borders are pixel-measured from the frame render; the view-only
 * properties panel exposes no radius values for these containers.
 * The frame's chart filter dropdowns (All Projects / This week) and its weekly
 * bars have no documented API parameters (A10.1 takes none and defaults to
 * period=year, group_by=month), so the controls render inert and the chart
 * shows the documented default response - see docs/design-api-gaps.md.
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
  active_projects: { items: { id: number; name: string; tasks_done?: number; tasks_total?: number; progress?: number }[] };
  tasks: { items: { id: number; title: string; priority?: string; due_date?: string; progress?: number; category?: string }[] };
  teams: { items: { id: number; name: string; members_count?: number; tasks_count?: number }[] };
  upcoming_meetings: { items: { id: number; title: string; starts_at?: string; time?: string; attendees_count?: number }[] };
  recent_files: { items: { id: number; name: string; owner?: string; type?: string; updated_at?: string; project?: string }[] };
};

function Card({ title, actions, children, className = "" }: { title: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-[240px] rounded-xl border border-[#ececec] bg-white p-5 shadow-[0_2px_12px_rgba(23,43,99,0.04)] ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-[#191919]">{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}

function TrackBar({ ratio, className = "" }: { ratio: number; className?: string }) {
  const width = `${Math.min(100, Math.max(0, Math.round(ratio * 100)))}%`;
  return (
    <span className={`block h-2 rounded-full bg-[#e8ebf0] ${className}`} aria-hidden="true">
      <span className="block h-full rounded-full bg-[#9aa3b2]" style={{ width }} />
    </span>
  );
}

function KpiCard({ label, value, ratio }: { label: string; value: number; ratio: number }) {
  return (
    <section className="flex min-h-[120px] flex-col justify-between rounded-xl border border-[#ececec] bg-white p-5 shadow-[0_2px_12px_rgba(23,43,99,0.04)]">
      <h2 className="font-[family-name:var(--font-rubik)] text-lg font-normal text-black">{label}</h2>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="font-[family-name:var(--font-rubik)] text-[32px] font-medium leading-none text-black">{value}</span>
        <TrackBar ratio={ratio} className="mb-1 w-24" />
      </div>
    </section>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

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
  const activeCount = (t.in_progress ?? 0) + (t.in_review ?? 0);
  const chart = data?.project_overview.data ?? [];
  const rawMax = Math.max(1, ...chart.map((d) => Math.max(d.created_tasks, d.completed_tasks)));
  const maxChart = Math.ceil(rawMax / 5) * 5;
  const yTicks = [maxChart, Math.round((maxChart * 2) / 3), Math.round(maxChart / 3), 0];
  const teams = data?.teams.items ?? [];
  const maxTeamTasks = Math.max(1, ...teams.map((tm) => tm.tasks_count ?? 0));

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar userName={userName} userRole={userRole} />
      <main className="space-y-6 px-4 py-6 sm:px-9">
        {error ? <p className="rounded-lg bg-[#fdecea] px-4 py-2 text-sm text-[#af2622]" role="alert">{error}</p> : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Task" value={total} ratio={total > 0 ? 1 : 0} />
          <KpiCard label="Active Tasks" value={activeCount} ratio={total > 0 ? activeCount / total : 0} />
          <KpiCard label="Completed Tasks" value={t.completed ?? 0} ratio={(t.completed_percentage ?? 0) / 100} />
          <KpiCard label="Overdue Tasks" value={t.overdue ?? 0} ratio={total > 0 ? (t.overdue ?? 0) / total : 0} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card title="Project overview" className="xl:col-span-5"
            actions={
              <span className="flex items-center gap-4 text-xs font-medium text-[#525256]">
                <span aria-disabled="true" className="flex items-center gap-1"><ChevronDown />All Projects</span>
                <span aria-disabled="true" className="flex items-center gap-1"><ChevronDown />This year</span>
              </span>
            }>
            <div className="relative flex h-48 items-stretch gap-2">
              <div className="pointer-events-none absolute inset-x-8 top-0 bottom-7 flex flex-col justify-between" aria-hidden="true">
                {[0, 1, 2].map((i) => <span key={i} className="border-t border-[#f1f3f7]" />)}
              </div>
              <div className="flex flex-col justify-between py-1 text-right text-[10px] text-[#718096]" aria-hidden="true">
                {yTicks.map((v, i) => <span key={i}>{v}</span>)}
              </div>
              <div className="relative flex min-w-0 flex-1 items-end gap-3 overflow-x-auto">
                {chart.map((d) => (
                  <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-36 w-full items-end justify-center gap-1">
                      <span className="w-2.5 rounded-sm bg-[#d9dee7]" style={{ height: `${(d.completed_tasks / maxChart) * 100}%` }} />
                      <span className="w-2.5 rounded-sm bg-[#4b5563]" style={{ height: `${(d.created_tasks / maxChart) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#718096]">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Active Projects" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-3">
            <ul className="space-y-3">
              {(data?.active_projects.items ?? []).map((p) => {
                const done = p.tasks_done ?? 0;
                const totalTasks = p.tasks_total ?? 0;
                return (
                  <li key={p.id} className="flex items-center gap-3 rounded-lg border border-[#ececec] p-3">
                    <span className="h-10 w-10 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                    <div className="w-full min-w-0">
                      <p className="text-sm text-black">{p.name}</p>
                      <TrackBar ratio={totalTasks > 0 ? done / totalTasks : 0} className="mt-1.5" />
                      <p className="mt-1 text-xs text-[#718096]">Task: {done} /{totalTasks}</p>
                    </div>
                  </li>
                );
              })}
              {data && data.active_projects.items.length === 0 ? <li className="text-sm text-[#718096]">No active projects yet.</li> : null}
            </ul>
          </Card>

          <Card title="Recent Files" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-4">
            <ul className="divide-y divide-[#f1f3f7]">
              {(data?.recent_files.items ?? []).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex min-w-0 items-center gap-3">
                    <FileIcon />
                    <span className="min-w-0">
                      <p className="truncate text-sm text-black">{f.name}</p>
                      <p className="text-xs text-[#718096]">{[f.owner, f.type, f.updated_at].filter(Boolean).join(" · ")}</p>
                    </span>
                  </span>
                  {f.project ? <span className="shrink-0 rounded-full border border-[#ececec] px-2 py-0.5 text-[10px] text-[#525256]">{f.project}</span> : null}
                </li>
              ))}
              {data && data.recent_files.items.length === 0 ? <li className="text-sm text-[#718096]">No files yet.</li> : null}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card title="Deadlines & Tasks" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-3">
            <ul className="space-y-3">
              {(data?.tasks.items ?? []).map((task) => (
                <li key={task.id} className="rounded-lg border border-[#ececec] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-black">{task.title}</p>
                    {task.category ? <span className="shrink-0 rounded-full border border-[#ececec] px-2 py-0.5 text-[10px] text-[#525256]">{task.category}</span> : null}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs text-[#718096]">
                      {task.priority ? <span className="rounded-full bg-[#f0f1f5] px-2 py-0.5 text-[10px] text-[#525256]">{task.priority}</span> : null}
                      {task.due_date ?? ""}
                    </span>
                    {typeof task.progress === "number" ? <span className="text-[10px] text-[#718096]">{task.progress}%</span> : null}
                  </div>
                </li>
              ))}
              {data && data.tasks.items.length === 0 ? <li className="text-sm text-[#718096]">No tasks due.</li> : null}
            </ul>
          </Card>

          <Card title="Teams" className="xl:col-span-3"
            actions={
              <span className="flex items-center gap-3 text-xs font-medium text-[#525256]">
                <span aria-disabled="true" className="flex items-center gap-1">{teams[0]?.name ?? "All"}<ChevronDown /></span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" aria-disabled="true">
                  <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                </svg>
              </span>
            }>
            <div className="flex justify-between text-[10px] uppercase tracking-wide text-[#a0a8b5]">
              <span>Name</span><span>Tasks</span>
            </div>
            <ul className="mt-2 space-y-3">
              {teams.map((team) => (
                <li key={team.id} className="flex items-center gap-3">
                  <span className="h-7 w-7 shrink-0 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <span className="w-full min-w-0">
                    <span className="block truncate text-sm text-black">{team.name}</span>
                    <TrackBar ratio={(team.tasks_count ?? 0) / maxTeamTasks} className="mt-1 h-1.5" />
                  </span>
                  <span className="shrink-0 text-xs text-[#718096]">{team.tasks_count ?? 0}/{team.members_count ?? 0}</span>
                </li>
              ))}
              {data && teams.length === 0 ? <li className="text-sm text-[#718096]">No teams yet.</li> : null}
            </ul>
          </Card>

          <Card title="Up coming meetings" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-3">
            <ul className="space-y-3">
              {(data?.upcoming_meetings.items ?? []).map((m) => (
                <li key={m.id} className="rounded-lg border border-[#ececec] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-black">{m.title}</p>
                    <span className="shrink-0 text-xs text-[#718096]">{m.time ?? m.starts_at ?? ""}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex -space-x-2" aria-hidden="true">
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#e2e8f0]" />
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#d5dbe5]" />
                      {typeof m.attendees_count === "number" && m.attendees_count > 2 ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#eef0f4] text-[9px] text-[#525256]">+{m.attendees_count - 2}</span>
                      ) : null}
                    </span>
                    <ArrowRight />
                  </div>
                </li>
              ))}
              {data && data.upcoming_meetings.items.length === 0 ? <li className="text-sm text-[#718096]">No meetings scheduled.</li> : null}
            </ul>
          </Card>

          <Card title="Ask AI" className="xl:col-span-3">
            {/* The frame shows an illustration above the prompt and a large
                input with a send button. POST /api/v1/ai/ask (A10.2) is wired
                in the AI milestone; kept read-only here so this PR changes no
                server state. The illustration asset cannot be exported from a
                view-only file, so a neutral placeholder block holds its space. */}
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="h-20 w-20 rounded-lg bg-[#eceef2]" aria-hidden="true" />
              <p className="text-sm text-[#718096]">ask me anything about...</p>
            </div>
            <p className="flex items-end justify-between rounded-lg bg-[#f6f8fa] px-4 py-3 text-sm text-[#718096]">
              ask me anything about...
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" aria-disabled="true">
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="M22 2 11 13" />
              </svg>
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
