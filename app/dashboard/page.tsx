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
 * Card radii/borders are pixel-measured from the 100% frame render; the
 * view-only properties panel exposes no radius values for these containers.
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
  tasks: { items: { id: number; title: string; priority?: string; due_date?: string; progress?: number }[] };
  teams: { items: { id: number; name: string; members_count?: number; tasks_count?: number }[] };
  upcoming_meetings: { items: { id: number; title: string; starts_at?: string; time?: string }[] };
  recent_files: { items: { id: number; name: string; owner?: string; type?: string; updated_at?: string }[] };
};

function Card({ title, actions, children, className = "" }: { title: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-[240px] rounded-xl border border-[#ececec] bg-white p-5 shadow-[0_2px_12px_rgba(23,43,99,0.04)] ${className}`}>
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#191919]">{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}

function KpiCard({ label, value, bars }: { label: string; value: number; bars: number[] }) {
  return (
    <section className="rounded-xl border border-[#ececec] bg-white p-5 shadow-[0_2px_12px_rgba(23,43,99,0.04)]">
      <h2 className="font-[family-name:var(--font-rubik)] text-lg font-normal text-black">{label}</h2>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="font-[family-name:var(--font-rubik)] text-[32px] font-medium leading-none text-black">{value}</span>
        <span className="flex items-end gap-1" aria-hidden="true">
          {bars.map((h, i) => (
            <span key={i} className="w-2 rounded-sm bg-[#d9dee7]" style={{ height: `${Math.max(6, h)}px` }} />
          ))}
        </span>
      </div>
    </section>
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
  const pct = [t.pending_percentage ?? 0, t.in_progress_percentage ?? 0, t.in_review_percentage ?? 0, t.completed_percentage ?? 0];
  const chart = data?.project_overview.data ?? [];
  const maxChart = Math.max(1, ...chart.map((d) => Math.max(d.created_tasks, d.completed_tasks)));

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar userName={userName} userRole={userRole} />
      <main className="space-y-6 px-9 py-6">
        {error ? <p className="rounded-lg bg-[#fdecea] px-4 py-2 text-sm text-[#af2622]" role="alert">{error}</p> : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Task" value={t.total ?? 0} bars={pct} />
          <KpiCard label="Active Tasks" value={(t.in_progress ?? 0) + (t.in_review ?? 0)} bars={pct} />
          <KpiCard label="Completed Tasks" value={t.completed ?? 0} bars={pct} />
          <KpiCard label="Overdue Tasks" value={t.overdue ?? 0} bars={pct} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card title="Project overview" className="xl:col-span-5"
            actions={
              <span className="flex items-center gap-2">
                <span aria-disabled="true" className="rounded-md border border-[#ececec] px-2 py-1 text-xs font-medium text-[#525256]">All Projects</span>
                <span aria-disabled="true" className="rounded-md border border-[#ececec] px-2 py-1 text-xs font-medium text-[#525256]">This year</span>
              </span>
            }>
            <div className="flex h-48 items-stretch gap-2">
              <div className="flex flex-col justify-between py-1 text-right text-[10px] text-[#718096]" aria-hidden="true">
                {[maxChart, Math.round(maxChart * 0.66), Math.round(maxChart * 0.33), 0].map((v, i) => <span key={i}>{v}</span>)}
              </div>
              <div className="flex min-w-0 flex-1 items-end gap-3 overflow-x-auto">
              {chart.map((d) => (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-36 w-full items-end justify-center gap-1">
                    <span className="w-2.5 rounded-sm bg-[#1f2937]" style={{ height: `${(d.created_tasks / maxChart) * 100}%` }} />
                    <span className="w-2.5 rounded-sm bg-[#d9dee7]" style={{ height: `${(d.completed_tasks / maxChart) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[#718096]">{d.label}</span>
                </div>
              ))}
              </div>
            </div>
          </Card>

          <Card title="Active Projects" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.active_projects.items ?? []).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <div className="w-full">
                    <p className="text-sm text-black">{p.name}</p>
                    <p className="text-xs text-[#718096]">Task: {p.tasks_done ?? 0}/{p.tasks_total ?? 0}</p>
                  </div>
                </li>
              ))}
              {data && data.active_projects.items.length === 0 ? <li className="text-sm text-[#718096]">No active projects yet.</li> : null}
            </ul>
          </Card>

          <Card title="Recent Files" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-4">
            <ul className="space-y-4">
              {(data?.recent_files.items ?? []).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-black">{f.name}</p>
                    <p className="text-xs text-[#718096]">{[f.owner, f.updated_at].filter(Boolean).join(" · ")}</p>
                  </div>
                  {f.type ? <span className="rounded border border-[#ececec] px-1.5 py-0.5 text-[10px] text-[#525256]">{f.type}</span> : null}
                </li>
              ))}
              {data && data.recent_files.items.length === 0 ? <li className="text-sm text-[#718096]">No files yet.</li> : null}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card title="Deadlines & Tasks" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.tasks.items ?? []).map((task) => (
                <li key={task.id} className="rounded-lg border border-[#ececec] p-3">
                  <p className="text-sm text-black">{task.title}</p>
                  <p className="text-xs text-[#718096]">{[task.priority, task.due_date].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
              {data && data.tasks.items.length === 0 ? <li className="text-sm text-[#718096]">No tasks due.</li> : null}
            </ul>
          </Card>

          <Card title="Teams" className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.teams.items ?? []).map((team) => (
                <li key={team.id} className="flex items-center justify-between">
                  <span className="text-sm text-black">{team.name}</span>
                  <span className="text-xs text-[#718096]">{team.tasks_count ?? 0} tasks</span>
                </li>
              ))}
              {data && data.teams.items.length === 0 ? <li className="text-sm text-[#718096]">No teams yet.</li> : null}
            </ul>
          </Card>

          <Card title="Up coming meetings" actions={<span className="text-xs font-medium text-[#525256]">View All</span>} className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.upcoming_meetings.items ?? []).map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-black">{m.title}</p>
                    <p className="text-xs text-[#718096]">{m.time ?? m.starts_at ?? ""}</p>
                  </div>
                </li>
              ))}
              {data && data.upcoming_meetings.items.length === 0 ? <li className="text-sm text-[#718096]">No meetings scheduled.</li> : null}
            </ul>
          </Card>

          <Card title="Ask AI" className="xl:col-span-3">
            {/* POST /api/v1/ai/ask (A10.2) exists in the API; the textarea is
                wired in the AI milestone. Kept read-only here so this PR
                changes no server state. */}
            <p className="rounded-lg bg-[#f6f8fa] px-4 py-3 text-sm text-[#718096]">ask me anything about...</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
