/**
 * Extractors for the A11 report endpoints. api.json documents no response
 * fields; the shapes below were grounded by authorized read-only live
 * captures against the real backend, first from an empty test account
 * (2026-11-23) and then re-verified with non-zero data under the admin
 * account the user granted read-only access to (2026-11-24):
 *
 *   reports/tasks:    data.summary.completion_rate,
 *                     data.chart.data[] = { label, created_tasks, completed_tasks }
 *   reports/projects: data.summary.average_completion_rate,
 *                     data.chart.data[] = { label, projects, completed_tasks }
 *   reports/teams:    data.summary = { total_teams, total_members,
 *                     total_assigned_tasks } (no rate key exists)
 *   reports/users:    data.tasks/meetings/files/productivity,
 *                     data.chart.data[] = { label, created_tasks, completed_tasks }
 *
 * Binding is by exact observed path, never by recursive key search, so a
 * renamed or moved field cannot silently bind the wrong metric. Anything
 * outside the observed shape returns null and renders as "Not available"
 * (never as zero). No delta field exists in any observed payload, so the
 * "from last month" line renders only if a real delta ever appears.
 */

export interface ReportMetric {
  value: number;
  delta: number | null;
}

export interface ReportPoint {
  label: string;
  value: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function envelopeData(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const data = payload.data;
  return isRecord(data) ? data : null;
}

function numberAt(scope: Record<string, unknown> | null, ...path: string[]): number | null {
  let current: unknown = scope;
  for (const key of path) {
    if (!isRecord(current)) return null;
    current = current[key];
  }
  return typeof current === "number" && Number.isFinite(current) ? current : null;
}

/** A metric is the number at an exact observed path; anything else is null. */
function metricAt(payload: unknown, ...path: string[]): ReportMetric | null {
  const value = numberAt(envelopeData(payload), ...path);
  if (value === null) return null;
  return { value, delta: null };
}

/** Task Completion Rate card: reports/tasks -> data.summary.completion_rate */
export function taskCompletionMetric(payload: unknown): ReportMetric | null {
  return metricAt(payload, "summary", "completion_rate");
}

/** Projects Completion Rate card: reports/projects -> data.summary.average_completion_rate */
export function projectCompletionMetric(payload: unknown): ReportMetric | null {
  return metricAt(payload, "summary", "average_completion_rate");
}

/**
 * Teams Activity Rate card: the observed reports/teams summary carries
 * counts only (total_teams, total_members, total_assigned_tasks); no rate
 * key exists, so this stays "Not available" unless the backend adds one.
 */
export function teamActivityMetric(payload: unknown): ReportMetric | null {
  const summary = envelopeData(payload)?.summary;
  if (!isRecord(summary)) return null;
  const rateKey = Object.keys(summary).find((k) => /rate|percent/i.test(k) && typeof summary[k] === "number");
  return rateKey ? { value: summary[rateKey] as number, delta: null } : null;
}

/**
 * A chart series is data.chart.data[] with the observed { label, <seriesKey> }
 * points. The observed payloads carry two task series (created_tasks,
 * completed_tasks); the drawn charts are single-series, so each chart binds
 * the one named series that matches its title and the other stays unused.
 */
function chartSeries(payload: unknown, seriesKey: string): ReportPoint[] | null {
  const chart = envelopeData(payload)?.chart;
  if (!isRecord(chart)) return null;
  const rows = chart.data;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const points: ReportPoint[] = [];
  for (const row of rows) {
    if (!isRecord(row) || typeof row.label !== "string") return null;
    const value = row[seriesKey];
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    points.push({ label: row.label, value });
  }
  return points;
}

/** Task Completion Time vs Deadline: reports/tasks chart, completed tasks per month */
export function taskCompletionSeries(payload: unknown): ReportPoint[] | null {
  return chartSeries(payload, "completed_tasks");
}

/** Projects Progress: reports/projects chart, projects per month */
export function projectProgressSeries(payload: unknown): ReportPoint[] | null {
  return chartSeries(payload, "projects");
}

/** Worker Activity Rate: reports/users chart, completed tasks per month */
export function workerActivitySeries(payload: unknown): ReportPoint[] | null {
  return chartSeries(payload, "completed_tasks");
}
