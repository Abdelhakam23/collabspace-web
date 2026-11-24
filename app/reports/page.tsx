"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { ReportAreaChart, ReportBarChart, ReportLineChart } from "@/components/reports/charts";
import { projectReports, taskReportsProductivity, teamPerformanceReports, personalProductivityReport } from "@/lib/api/reports";
import { ApiError } from "@/lib/api-client";
import { extractMetric, extractSeries, type ReportMetric, type ReportPoint } from "@/lib/reports-normalize";
import { getProfile } from "@/lib/api/profile";
import type { User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

/**
 * "Reports" frame (node 104-2653, 1440x1024, page background #F6F8FA):
 * navbar with the Reports pill active, three stat cards, two chart cards,
 * a worker-activity chart card, and the "Submit a detailed report" form.
 *
 * Scope notes:
 * - The A11 endpoints document no response fields, so metrics and series are
 *   read tolerantly (lib/reports-normalize.ts) and render as "Not available"
 *   when absent, never as zero. The drawn percentages imply a 0-100 scale.
 * - The drawn "All Projects" and "Monthly" dropdowns have no documented
 *   filter parameters, so they are disabled with reasons.
 * - The "Submit a detailed report" form has no POST endpoint in the API, so
 *   every control in it is disabled with a reason.
 * - Card geometry and chart colors are drawn; stat/label text styles are
 *   estimated (unmeasured).
 */

type LoadState<T> = { status: "loading" } | { status: "error"; forbidden: boolean } | { status: "ready"; value: T | null };

function metricState<T>(settled: PromiseSettledResult<unknown>, pick: (payload: unknown) => T | null): LoadState<T> {
  if (settled.status === "rejected") {
    return { status: "error", forbidden: settled.reason instanceof ApiError && settled.reason.status === 403 };
  }
  return { status: "ready", value: pick(settled.value) };
}

function StatCard({ title, state }: { title: string; state: LoadState<ReportMetric> }) {
  let body: ReactNode;
  if (state.status === "loading") {
    body = <p className={`${SANS} text-sm text-[#606C80]`}>Loading...</p>;
  } else if (state.status === "error") {
    body = (
      <p className={`${SANS} text-sm text-[#606C80]`}>{state.forbidden ? "Not available for your role." : "Not available."}</p>
    );
  } else if (state.value === null) {
    body = <p className={`${SANS} text-sm text-[#606C80]`}>Not available.</p>;
  } else {
    const { value, delta } = state.value;
    body = (
      <>
        <p className={`${SANS} text-[32px] font-semibold leading-tight text-[#000712]`}>
          {value} <span className="text-[20px]">%</span>
        </p>
        {delta !== null ? (
          <p className={`${SANS} text-[12px] ${delta >= 0 ? "text-[#22C55E]" : "text-[#E5484D]"}`}>
            {delta >= 0 ? "+" : ""}
            {delta}% From last month
          </p>
        ) : null}
      </>
    );
  }
  return (
    <div className="flex min-h-[120px] flex-1 flex-col gap-1 rounded-2xl bg-white p-5">
      <h2 className={`${SANS} text-[14px] text-[#606C80]`}>{title}</h2>
      {body}
    </div>
  );
}

function ChartCard({ title, trailing, children }: { title: string; trailing?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className={`${SANS} text-[15px] font-semibold text-[#000712]`}>{title}</h2>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function DisabledSelect({ label, reason }: { label: string; reason: string }) {
  return (
    <button
      type="button"
      disabled
      title={reason}
      className={`${SANS} flex cursor-not-allowed items-center gap-1 text-[12px] text-[#606C80] opacity-40`}
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export default function ReportsPage() {
  const [me, setMe] = useState<User | null>(null);
  const [taskMetric, setTaskMetric] = useState<LoadState<ReportMetric>>({ status: "loading" });
  const [projectMetric, setProjectMetric] = useState<LoadState<ReportMetric>>({ status: "loading" });
  const [teamMetric, setTeamMetric] = useState<LoadState<ReportMetric>>({ status: "loading" });
  const [workerMetric, setWorkerMetric] = useState<LoadState<ReportMetric>>({ status: "loading" });
  const [taskSeries, setTaskSeries] = useState<LoadState<ReportPoint[]>>({ status: "loading" });
  const [projectSeries, setProjectSeries] = useState<LoadState<ReportPoint[]>>({ status: "loading" });
  const [workerSeries, setWorkerSeries] = useState<LoadState<ReportPoint[]>>({ status: "loading" });

  useEffect(() => {
    getProfile()
      .then((res) => setMe(res.data.user))
      .catch(() => {});
    (async () => {
      const [tasks, projects, teams, users] = await Promise.allSettled([
        taskReportsProductivity(),
        projectReports(),
        teamPerformanceReports(),
        personalProductivityReport(),
      ]);
      setTaskMetric(metricState(tasks, (p) => extractMetric(p, /completion.*rate|rate/i)));
      setProjectMetric(metricState(projects, (p) => extractMetric(p, /completion.*rate|rate/i)));
      setTeamMetric(metricState(teams, (p) => extractMetric(p, /activ.*rate|rate/i)));
      setWorkerMetric(metricState(users, (p) => extractMetric(p, /activ.*rate|rate/i)));
      setTaskSeries(metricState(tasks, extractSeries));
      setProjectSeries(metricState(projects, extractSeries));
      setWorkerSeries(metricState(users, extractSeries));
    })();
  }, []);

  const noFilterReason = "Report filters are not documented in the API";
  const submitReason = "Report submission is not documented in the API";
  const fieldClass = `${SANS} w-full cursor-not-allowed rounded-lg border border-[#E6EBF0] bg-[#F6F8FA] px-3 py-2 text-[13px] text-[#606C80] opacity-60`;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Reports" />
      <main className="flex flex-col gap-6 px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[40px]">
        <div className="flex max-w-[1311px] gap-6">
          <StatCard title="Task Completion Rate" state={taskMetric} />
          <StatCard title="Projects Completion Rate" state={projectMetric} />
          <StatCard title="Teams Activity Rate" state={teamMetric} />
        </div>
        <div className="flex max-w-[1311px] gap-6">
          <ChartCard title="Task Completion Time vs Deadline">
            <ReportBarChart points={taskSeries.status === "ready" ? taskSeries.value : null} />
          </ChartCard>
          <ChartCard title="Projects Progress" trailing={<DisabledSelect label="All Projects" reason={noFilterReason} />}>
            <ReportAreaChart points={projectSeries.status === "ready" ? projectSeries.value : null} />
          </ChartCard>
        </div>
        <div className="flex max-w-[1311px] gap-6 pb-10">
          <ChartCard title="Worker Activity Rate" trailing={<DisabledSelect label="Monthly" reason={noFilterReason} />}>
            <ReportLineChart points={workerSeries.status === "ready" ? workerSeries.value : null} />
          </ChartCard>
          <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-white p-5" title={submitReason}>
            <h2 className={`${SANS} text-[15px] font-semibold text-[#000712]`}>Submit a detailed report</h2>
            <select disabled title={submitReason} className={fieldClass} aria-label="Select Report Type (unavailable)">
              <option>Select Report Type</option>
            </select>
            <input disabled title={submitReason} placeholder="Add Note" className={fieldClass} aria-label="Add Note (unavailable)" />
            <div className="flex gap-3">
              <input disabled title={submitReason} placeholder="Start Date" className={fieldClass} aria-label="Start Date (unavailable)" />
              <input disabled title={submitReason} placeholder="End Date" className={fieldClass} aria-label="End Date (unavailable)" />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                disabled
                title={submitReason}
                className={`${SANS} cursor-not-allowed rounded-lg bg-[#005AFB] px-4 py-2 text-[13px] font-medium text-white opacity-40`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
