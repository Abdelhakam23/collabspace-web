import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types";

export async function projectReports() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/projects`);
  return data;
}

export async function taskReportsProductivity() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/tasks`);
  return data;
}

export async function teamPerformanceReports() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/teams`);
  return data;
}

export async function personalProductivityReport() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/users`);
  return data;
}

export async function memberProductivityReport(userId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/reports/users/${encodeURIComponent(userId)}`);
  return data;
}
