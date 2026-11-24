import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, AppNotification } from "@/lib/types";

/** GET /api/v1/notifications — List User Notifications (A9.1) */
export async function listUserNotifications(query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<AppNotification[]>>(`/api/v1/notifications`, { params: query });
  return data;
}

/** GET /api/v1/notifications — List Unread Notifications (A9.2) */
export async function listUnreadNotifications(query?: { status: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<AppNotification[]>>(`/api/v1/notifications`, { params: query });
  return data;
}

/** GET /api/v1/notifications/unread-count — Get Unread Notifications Count (A9.3) */
export async function getUnreadNotificationsCount() {
  const { data } = await apiClient.get<ApiEnvelope<{ unread_count: number }>>(`/api/v1/notifications/unread-count`);
  return data;
}

/** PATCH /api/v1/notifications/{{notification_id}}/read — Mark Notification as Read (A9.4) */
export async function markNotificationAsRead(notification_id: number | string) {
  const { data } = await apiClient.patch<ApiEnvelope<null>>(`/api/v1/notifications/${encodeURIComponent(notification_id)}/read`, {});
  return data;
}

/** POST /api/v1/notifications/mark-all-read — Mark All Notifications as Read (A9.5) */
export async function markAllNotificationsAsRead() {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/notifications/mark-all-read`, {});
  return data;
}

/** DELETE /api/v1/notifications/{{notification_id}} — Delete Notification (A9.6) */
export async function deleteNotification(notification_id: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/notifications/${encodeURIComponent(notification_id)}`);
  return data;
}
