import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/types";

/** GET /api/v1/reports/projects — Project Reports (A11.1) */
export async function projectReports() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/projects`);
  return data;
}

/** GET /api/v1/reports/tasks — Task Reports & Productivity (A11.2) */
export async function taskReportsProductivity() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/tasks`);
  return data;
}

/** GET /api/v1/reports/teams — Team Performance Reports (A11.3) */
export async function teamPerformanceReports() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/teams`);
  return data;
}

/** GET /api/v1/reports/users — Personal Productivity Report (A11.4) */
export async function personalProductivityReport() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/users`);
  return data;
}

/** GET /api/v1/reports/users/1 — Member Productivity Report (Admin/PM) (A11.5) */
export async function memberProductivityReport(userId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/users/${encodeURIComponent(userId)}`);
  return data;
}
