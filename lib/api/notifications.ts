import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, AppNotification } from "@/types";

export async function listUserNotifications(query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<AppNotification[]>>(`/api/v1/notifications`, { params: query });
  return data;
}

export async function listUnreadNotifications(query?: { status: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<AppNotification[]>>(`/api/v1/notifications`, { params: query });
  return data;
}

export async function getUnreadNotificationsCount() {
  const { data } = await apiClient.get<ApiEnvelope<{ unread_count: number }>>(`/api/v1/notifications/unread-count`);
  return data;
}

export async function markNotificationAsRead(notification_id: number | string) {
  const { data } = await apiClient.patch<ApiEnvelope<null>>(`/api/v1/notifications/${encodeURIComponent(notification_id)}/read`, {});
  return data;
}

export async function markAllNotificationsAsRead() {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/notifications/mark-all-read`, {});
  return data;
}

export async function deleteNotification(notification_id: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/notifications/${encodeURIComponent(notification_id)}`);
  return data;
}
