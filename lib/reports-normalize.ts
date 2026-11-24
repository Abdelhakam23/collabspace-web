export interface ReportMetric {
  value: number;
  delta: number | null;
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

function metricAt(payload: unknown, ...path: string[]): ReportMetric | null {
  const value = numberAt(envelopeData(payload), ...path);
  if (value === null) return null;
  return { value, delta: null };
}

export function taskCompletionMetric(payload: unknown): ReportMetric | null {
  return metricAt(payload, "summary", "completion_rate");
}

export function projectCompletionMetric(payload: unknown): ReportMetric | null {
  return metricAt(payload, "summary", "average_completion_rate");
}

export function teamActivityMetric(payload: unknown): ReportMetric | null {
  const summary = envelopeData(payload)?.summary;
  if (!isRecord(summary)) return null;
  const rateKey = Object.keys(summary).find((k) => /rate|percent/i.test(k) && typeof summary[k] === "number");
  return rateKey ? { value: summary[rateKey] as number, delta: null } : null;
}
