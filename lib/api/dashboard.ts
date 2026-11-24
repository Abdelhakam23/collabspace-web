import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, DashboardData } from "@/lib/types";

export async function getDashboardOverview() {
  const { data } = await apiClient.get<ApiEnvelope<DashboardData>>(`/api/v1/dashboard`);
  return data;
}

export interface AskAiAssistantPayload {
  query: string;
}

export async function askAiAssistant(payload: AskAiAssistantPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/ai/ask`, payload);
  return data;
}

export interface AskAiAssistantPayload {
  query: string;
  project_id: number;
}

export async function askAiAssistantProject(payload: AskAiAssistantPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/ai/ask`, payload);
  return data;
}

export interface AskAiAssistantPayload {
  query: string;
}

export async function auditOverdueTasksWithAi(payload: AskAiAssistantPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/ai/ask`, payload);
  return data;
}
