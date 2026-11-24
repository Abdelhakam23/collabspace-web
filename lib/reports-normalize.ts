/**
 * Tolerant readers for the A11 report endpoints. api.json documents no
 * response fields for them, so each reader walks the payload for the metric
 * the drawn Reports screen shows and returns null when it is absent. Null
 * renders as "Not available" (never as zero), per the plan guidance to keep
 * zero and unavailable distinct. If the live payloads use other key names,
 * only this file changes.
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

/** Finds the first numeric field whose key matches, walking nested objects. */
function findNumber(payload: unknown, keyPattern: RegExp): number | null {
  if (!isRecord(payload)) return null;
  for (const [key, value] of Object.entries(payload)) {
    if (keyPattern.test(key) && typeof value === "number" && Number.isFinite(value)) return value;
  }
  for (const value of Object.values(payload)) {
    if (isRecord(value)) {
      const found = findNumber(value, keyPattern);
      if (found !== null) return found;
    }
  }
  return null;
}

export function extractMetric(payload: unknown, valuePattern: RegExp): ReportMetric | null {
  const value = findNumber(payload, valuePattern);
  if (value === null) return null;
  const delta = findNumber(payload, /delta|change|growth|from_last/i);
  return { value, delta };
}

/** Finds the first array of { label-ish, number } points in the payload. */
export function extractSeries(payload: unknown): ReportPoint[] | null {
  if (!isRecord(payload)) return null;
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
      if (points.length === value.length && points.length > 0) return points;
    }
  }
  for (const value of Object.values(payload)) {
    if (isRecord(value)) {
      const found = extractSeries(value);
      if (found) return found;
    }
  }
  return null;
}
