import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, DashboardData } from "@/lib/types";

/** GET /api/v1/dashboard — Get Dashboard Overview (A10.1) */
export async function getDashboardOverview() {
  const { data } = await apiClient.get<ApiEnvelope<DashboardData>>(`/api/v1/dashboard`);
  return data;
}

export interface AskAiAssistantPayload {
  query: string;
}

/** POST /api/v1/ai/ask — Ask AI Assistant (General Workspace Q&A) (A10.2) */
export async function askAiAssistant(payload: AskAiAssistantPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/ai/ask`, payload);
  return data;
}

export interface AskAiAssistantPayload {
  query: string;
  project_id: number;
}

/** POST /api/v1/ai/ask — Ask AI Assistant (Project-Scoped) (A10.3) */
export async function askAiAssistantProject(payload: AskAiAssistantPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/ai/ask`, payload);
  return data;
}

export interface AskAiAssistantPayload {
  query: string;
}

/** POST /api/v1/ai/ask — Ask AI Assistant (Overdue Tasks Audit) (A10.4) */
export async function auditOverdueTasksWithAi(payload: AskAiAssistantPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/ai/ask`, payload);
  return data;
}
