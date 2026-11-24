import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, User, Task, FileAttachment, Paginated } from "@/types";

export interface ProfileStats {
  completed_tasks?: number;
  total_tasks?: number;
  hours_worked?: number;
}

export async function getProfile() {
  const { data } = await apiClient.get<ApiEnvelope<{ user: User; stats?: ProfileStats }>>(`/api/v1/auth/me`);
  return data;
}

export interface UpdateProfileWithAvatarPayload {
  avatar?: File;
  job_title?: string;
  years_of_experience?: string;
  phone?: string;
  name?: string;
}

export async function updateProfileWithAvatar(payload: UpdateProfileWithAvatarPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v as string | Blob); });
  const { data } = await apiClient.post<ApiEnvelope<{ user: User }>>(`/api/v1/auth/profile`, form, { headers: { "Content-Type": "multipart/form-data" } });
  // The update endpoint returns the user object directly in `data`, unlike GET /auth/me which nests it under `data.user`.
  const user = data.data?.user ?? (data.data as unknown as User);
  return { ...data, data: { user } };
}

export async function removeAvatar() {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/auth/profile/avatar`);
  return data;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await apiClient.put<ApiEnvelope<null>>(`/api/v1/auth/password`, payload);
  return data;
}

export async function getUserTasks() {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Task>>>(`/api/v1/auth/profile/tasks`);
  // The profile endpoint names the task field "name"; the rest of the app reads "title".
  const rows = (data.data?.data ?? []).map((t) => ({ ...t, title: t.title ?? (t as unknown as { name?: string }).name ?? "" }));
  return { ...data, data: { ...data.data, data: rows } } as typeof data;
}

export async function getUserFiles() {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<FileAttachment>>>(`/api/v1/auth/profile/files`);
  // The profile endpoint sends "file_size" instead of "size".
  const rows = (data.data?.data ?? []).map((f) => ({ ...f, size: f.size ?? (f as unknown as { file_size?: number }).file_size }));
  return { ...data, data: { ...data.data, data: rows } } as typeof data;
}
