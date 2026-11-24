import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Message, Paginated } from "@/lib/types";

/** GET /api/v1/projects/1/messages — List Project Messages (A8.1) */
export async function listProjectMessages(projectId: number | string, query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Message>>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages`, { params: query });
  return data;
}

export interface SendMessagePayload {
  message: string;
  parent_id?: string;
  file_attachment_id?: string;
  mentions?: string;
}

/** POST /api/v1/projects/1/messages — Send Message (with Mentions & Attachment) (A8.2) */
export async function sendMessage(projectId: number | string, payload: SendMessagePayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ message: Message }>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages`, payload);
  return data;
}

export interface SendThreadReplyPayload {
  message: string;
  parent_id: number;
}

/** POST /api/v1/projects/1/messages — Send Thread Reply (A8.3) */
export async function sendThreadReply(projectId: number | string, payload: SendThreadReplyPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ message: Message }>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages`, payload);
  return data;
}

export interface EditMessagePayload {
  message: string;
}

/** PATCH /api/v1/messages/1 — Edit Message (A8.4) */
export async function editMessage(messageId: number | string, payload: EditMessagePayload) {
  const { data } = await apiClient.patch<ApiEnvelope<{ message: Message }>>(`/api/v1/messages/${encodeURIComponent(messageId)}`, payload);
  return data;
}

/** DELETE /api/v1/messages/1 — Delete Message (A8.5) */
export async function deleteMessage(messageId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/messages/${encodeURIComponent(messageId)}`);
  return data;
}

/** POST /api/v1/projects/1/messages/mark-read — Mark All Messages as Read (A8.6) */
export async function markAllMessagesAsRead(projectId: number | string) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages/mark-read`, {});
  return data;
}

/** GET /api/v1/projects/1/messages/unread-count — Get Unread Messages Count (A8.7) */
export async function getUnreadMessagesCount(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ unread_count: number }>>(`/api/v1/projects/${encodeURIComponent(projectId)}/messages/unread-count`);
  return data;
}
