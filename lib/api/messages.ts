import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Message, Paginated } from "@/lib/types";

function normalizeMessage(value: Message): Message {
  const raw = value as Message & { message?: string; sender?: Message["user"] };
  return { ...raw, body: raw.body ?? raw.message ?? "", user: raw.user ?? raw.sender };
}

export async function listProjectMessages(projectId: number | string, query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Message>>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages`, { params: query });
  return { ...data, data: { ...data.data, data: (data.data.data ?? []).map(normalizeMessage) } };
}

export interface SendMessagePayload {
  message: string;
  parent_id?: string;
  file_attachment_id?: string;
  mentions?: string;
}

export async function sendMessage(projectId: number | string, payload: SendMessagePayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ message: Message }>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages`, payload);
  return { ...data, data: { message: normalizeMessage(typeof data.data.message === "object" ? data.data.message : (data.data as unknown as Message)) } };
}

export interface SendThreadReplyPayload {
  message: string;
  parent_id: number;
}

export async function sendThreadReply(projectId: number | string, payload: SendThreadReplyPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ message: Message }>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages`, payload);
  return data;
}

export interface EditMessagePayload {
  message: string;
}

export async function editMessage(messageId: number | string, payload: EditMessagePayload) {
  const { data } = await apiClient.patch<ApiEnvelope<{ message: Message }>>(`/api/v1/messages/${encodeURIComponent(messageId)}`, payload);
  return data;
}

export async function deleteMessage(messageId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/messages/${encodeURIComponent(messageId)}`);
  return data;
}

export async function markAllMessagesAsRead(projectId: number | string) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages/mark-read`, {});
  return data;
}

export async function getUnreadMessagesCount(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ unread_count: number }>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages/unread-count`);
  return data;
}
