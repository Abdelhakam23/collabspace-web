import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, AiSetting, AuditLog, Paginated } from "@/types";

export async function askAi(query: string): Promise<string> {
  const { data } = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(`/api/v1/ai/ask`, { query });
  const body = data?.data ?? (data as unknown as Record<string, unknown>);
  for (const key of ["answer", "response", "reply", "message", "text"]) {
    const value = body?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return typeof data?.message === "string" && data.message ? data.message : "";
}

export async function getAiConfigurationSettings() {
  const { data } = await apiClient.get<ApiEnvelope<AiSetting[]>>(`/api/v1/ai/settings`);
  return data;
}

export interface UpdateAiSettingsPayload {
  settings: string;
  "settings[].key": string;
  "settings[].value": string;
}

export async function updateAiSettings(payload: UpdateAiSettingsPayload) {
  const { data } = await apiClient.put<ApiEnvelope<AiSetting>>(`/api/v1/ai/settings`, payload);
  return data;
}

export async function listAuditLogs(query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<AuditLog>>>(`/api/v1/audit-logs`, { params: query });
  return data;
}
