/**
 * Tolerant readers for the A11 report endpoints. api.json documents no
 * response fields for them, so each reader walks the payload for the metric
 * the drawn Reports screen shows. Binding fails closed: when more than one
 * candidate key matches, the metric is ambiguous and returns null, which
 * renders as "Not available" (never as zero, never as a guessed binding).
 * A unique match is still schema-unverified (see docs/screen-coverage.md);
 * live payload grounding has not been possible, so these bindings are a
 * documented integration debt.
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

/**
 * Collects every numeric field whose key matches, walking nested objects.
 * More than one distinct matching key means the schema is ambiguous for the
 * metric the screen wants, so the caller fails closed instead of guessing.
 */
function findNumbers(payload: unknown, keyPattern: RegExp, hits: { key: string; value: number }[]): void {
  if (!isRecord(payload)) return;
  for (const [key, value] of Object.entries(payload)) {
    if (keyPattern.test(key) && typeof value === "number" && Number.isFinite(value)) hits.push({ key, value });
  }
  for (const value of Object.values(payload)) {
    if (isRecord(value)) findNumbers(value, keyPattern, hits);
  }
}

function findUniqueNumber(payload: unknown, keyPattern: RegExp): number | null {
  const hits: { key: string; value: number }[] = [];
  findNumbers(payload, keyPattern, hits);
  const keys = new Set(hits.map((h) => h.key));
  if (keys.size !== 1) return null;
  return hits[0].value;
}

export function extractMetric(payload: unknown, valuePattern: RegExp): ReportMetric | null {
  const value = findUniqueNumber(payload, valuePattern);
  if (value === null) return null;
  // A delta is rendered only when uniquely present; a missing delta is never
  // shown as zero.
  const delta = findUniqueNumber(payload, /delta|change|growth|from_last/i);
  return { value, delta };
}

/**
 * Finds arrays of { label-ish, number } points in the payload. More than one
 * candidate array means the schema is ambiguous for the chart, so the result
 * is null and the chart renders its empty state instead of guessed data.
 */
export function extractSeries(payload: unknown): ReportPoint[] | null {
  const candidates: ReportPoint[][] = [];
  collectSeries(payload, candidates);
  if (candidates.length !== 1) return null;
  return candidates[0];
}

function collectSeries(payload: unknown, out: ReportPoint[][]): void {
  if (!isRecord(payload)) return;
  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && value.length > 0 && isRecord(value[0])) {
      const points: ReportPoint[] = [];
      for (const item of value) {
        if (!isRecord(item)) break;
        const labelKey = Object.keys(item).find((k) => /label|month|name|date|day|period/i.test(k));
        const valueKey = Object.keys(item).find((k) => /value|count|total|rate|amount|percent/i.test(k) && typeof item[k] === "number");
        if (!labelKey || !valueKey) break;
        points.push({ label: String(item[labelKey]), value: item[valueKey] as number });
      }
      if (points.length === value.length && points.length > 0) out.push(points);
    } else if (isRecord(value)) {
      collectSeries(value, out);
    }
  }
}
