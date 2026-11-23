import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, AiSetting, AuditLog, Paginated } from "@/lib/types";

/** GET /api/v1/ai/settings — Get AI Configuration Settings (A13.1) */
export async function getAiConfigurationSettings() {
  const { data } = await apiClient.get<ApiEnvelope<AiSetting[]>>(`/api/v1/ai/settings`);
  return data;
}

export interface UpdateAiSettingsPayload {
  settings: string;
  "settings[].key": string;
  "settings[].value": string;
}

/** PUT /api/v1/ai/settings — Update AI Settings (Admin Only) (A13.2) */
export async function updateAiSettings(payload: UpdateAiSettingsPayload) {
  const { data } = await apiClient.put<ApiEnvelope<AiSetting>>(`/api/v1/ai/settings`, payload);
  return data;
}

/** GET /api/v1/audit-logs — List Audit Logs (Admin/PM) (A13.3) */
export async function listAuditLogs(query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<AuditLog>>>(`/api/v1/audit-logs`, { params: query });
  return data;
}
