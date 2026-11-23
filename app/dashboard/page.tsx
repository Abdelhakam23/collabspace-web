"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { getProfile } from "@/lib/api/profile";

/**
 * Dashboard from the FINAL hi-fi "Dashboard" frame (UI Design page,
 * SectionDashboard, node 285-12895, 1440x1024), wired to GET /api/v1/dashboard
 * (A10.1) and GET /api/v1/auth/me (A2.1).
 *
 * Native properties read in Figma: page fill style "BG color" #F6F8FA; color
 * styles Text Color #000712, secodary-500 #27272B, Secondary #525256, BG label
 * #F3F4F6, White #FFFFFF, Primary color-500 #005AFB; text styles "Team C Text"
 * (H1 61 ... H6 20, Body 16, small body 14, Caption 13, Small Caption 12, all
 * line-height 150%); font Montserrat (verified on the navbar user name,
 * 400 14px); navbar component 1440x72 white.
 * Accent palette (orange/teal/purple/chart blue, priority pills) is
 * pixel-sampled from the final frame render - approximate, disclosed in
 * docs/design-api-gaps.md.
 * The frame's "from last month" KPI deltas have no field in the API payload,
 * so they are omitted, not invented. Chart filter dropdowns remain inert:
 * A10.1 documents no query parameters (default period=year, group_by=month).
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

const M = "font-[family-name:var(--font-montserrat)]";

function Card({ title, actions, children, className = "" }: { title: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-white p-5 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className={`${M} text-base font-semibold text-[#000712]`}>{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}

function ViewAll() {
  return <span aria-disabled="true" className={`${M} text-xs font-medium text-[#005AFB]`}>View All</span>;
}

function Bar({ ratio, color, className = "" }: { ratio: number; color: string; className?: string }) {
  const width = `${Math.min(100, Math.max(0, Math.round(ratio * 100)))}%`;
  return (
    <span className={`block h-1.5 rounded-full bg-[#f0f2f5] ${className}`} aria-hidden="true">
      <span className="block h-full rounded-full" style={{ width, backgroundColor: color }} />
    </span>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function KpiIcon({ tone }: { tone: "orange" | "blue" | "green" }) {
  const tones = { orange: ["#FEF3DE", "#FF9226"], blue: ["#E5EFFF", "#005AFB"], green: ["#E7F6EC", "#22B14C"] } as const;
  const [bg, fg] = tones[tone];
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: bg }} aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    </span>
  );
}

function KpiCard({ label, value, tone, ratio, fraction }: { label: string; value: number; tone: "orange" | "blue" | "green"; ratio: number; fraction: string }) {
  const colors = { orange: "#FF9226", blue: "#005AFB", green: "#22B14C" } as const;
  return (
    <section className="rounded-2xl bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className={`${M} text-base font-medium text-[#000712]`}>{label}</h2>
        <KpiIcon tone={tone} />
      </div>
      <p className={`${M} mt-1 text-[28px] font-bold leading-tight text-[#000712]`}>{value}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <Bar ratio={ratio} color={colors[tone]} className="w-2/3" />
        <span className={`${M} text-xs text-[#718096]`}>{fraction}</span>
      </div>
    </section>
  );
}

function Gauge({ ratio }: { ratio: number }) {
  const r = 34;
  const c = Math.PI * r;
  const filled = Math.min(1, Math.max(0, ratio)) * c;
  return (
    <svg width="84" height="48" viewBox="0 0 84 48" aria-hidden="true">
      <path d="M8 44 A34 34 0 0 1 76 44" fill="none" stroke="#eef1f5" strokeWidth="8" strokeLinecap="round" />
      <path d="M8 44 A34 34 0 0 1 76 44" fill="none" stroke="#005AFB" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${filled} ${c * 2}`} />
    </svg>
  );
}

function AreaChart({ points, maxChart }: { points: number[]; maxChart: number }) {
  const w = 560, h = 180, pad = 4;
  const n = Math.max(2, points.length);
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / (n - 1));
  const ys = points.map((v) => h - pad - (v / maxChart) * (h - pad * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${path} L${xs[n - 1].toFixed(1)},${h} L${xs[0].toFixed(1)},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={area} fill="rgba(38,146,255,0.10)" />
      <path d={path} fill="none" stroke="#2692FF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

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
      <main className="space-y-5 px-4 py-5 sm:px-8">
        {error ? <p className="rounded-lg bg-[#fdecea] px-4 py-2 text-sm text-[#af2622]" role="alert">{error}</p> : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Pending Tasks" value={pending} tone="orange" ratio={total > 0 ? pending / total : 0} fraction={`${pending}/${total}`} />
          <KpiCard label="In Progress" value={inProgress} tone="blue" ratio={total > 0 ? inProgress / total : 0} fraction={`${inProgress}/${total}`} />
          <KpiCard label="Completed" value={completed} tone="green" ratio={total > 0 ? completed / total : 0} fraction={`${completed}/${total}`} />
          <section className="rounded-2xl bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`${M} text-base font-medium text-[#000712]`}>Completion Rate</h2>
                <p className={`${M} mt-1 text-[28px] font-bold leading-tight text-[#000712]`}>{rate}%</p>
              </div>
              <Gauge ratio={rate / 100} />
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card title="Project overview" className="xl:col-span-5"
            actions={
              <span className={`${M} flex items-center gap-4 text-xs font-medium text-[#000712]`}>
                <span aria-disabled="true" className="flex items-center gap-1"><ChevronDown />All Projects</span>
                <span aria-disabled="true" className="flex items-center gap-1"><ChevronDown />This year</span>
              </span>
            }>
            <div className="flex items-stretch gap-2">
              <div className="flex h-44 flex-col justify-between py-1 text-right text-[10px] text-[#718096]" aria-hidden="true">
                {[yMax, Math.round((yMax * 2) / 3), Math.round(yMax / 3), 0].map((v, i) => <span key={i}>{v}</span>)}
              </div>
              <div className="min-w-0 flex-1">
                <AreaChart points={series.length ? series : [0, 0]} maxChart={yMax} />
                <div className="mt-1 flex justify-between text-[10px] text-[#718096]">
                  {chart.map((d) => <span key={d.label}>{d.label.split(" ")[0]}</span>)}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Active Projects" actions={<ViewAll />} className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.active_projects.items ?? []).map((p, idx) => {
                const color = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                const done = p.tasks_done ?? 0;
                const totalTasks = p.tasks_total ?? 0;
                return (
                  <li key={p.id} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}1A` }} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
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

          <Card title="Recent Files" actions={<ViewAll />} className="xl:col-span-4">
            <ul className="space-y-4">
              {(data?.recent_files.items ?? []).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDE8E8]" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E5484D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <p className={`${M} truncate text-sm font-medium text-[#000712]`}>{f.name}</p>
                      <p className={`${M} text-xs text-[#718096]`}>By {[f.owner, f.updated_at].filter(Boolean).join(" • ")}</p>
                    </span>
                  </span>
                  {/* Download affordance per the frame; file download endpoints are
                      not part of the dashboard payload, so it stays inert here. */}
                  <span aria-disabled="true" aria-label="Download (not wired yet)"><DownloadIcon /></span>
                </li>
              ))}
              {data && data.recent_files.items.length === 0 ? <li className={`${M} text-sm text-[#718096]`}>No files yet.</li> : null}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card title="Tasks" actions={<ViewAll />} className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.tasks.items ?? []).map((task) => {
                const tone = PRIORITY_TONES[(task.priority ?? "").toLowerCase()];
                return (
                  <li key={task.id}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`${M} text-sm font-medium text-[#000712]`}>{task.title}</p>
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

          <Card title="Teams" className="xl:col-span-3"
            actions={
              <span aria-disabled="true" className={`${M} flex items-center gap-1 text-xs font-medium text-[#000712]`}>
                {teams[0]?.name ?? "All"}<ChevronDown />
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

          <Card title="Up coming meetings" actions={<ViewAll />} className="xl:col-span-3">
            <ul className="space-y-4">
              {(data?.upcoming_meetings.items ?? []).map((m) => (
                <li key={m.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`${M} text-sm font-medium text-[#000712]`}>{m.title}</p>
                    {m.date_label ? (
                      <span className={`${M} flex shrink-0 items-center gap-1 rounded-md bg-[#f0f2f5] px-2 py-0.5 text-[10px] text-[#525256]`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg>
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

          <Card title="Ask AI" className="xl:col-span-3">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005AFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" aria-disabled="true">
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
