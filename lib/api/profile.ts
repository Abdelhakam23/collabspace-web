import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, User, Task, FileAttachment, Paginated } from "@/lib/types";

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
  return data;
}

export async function getUserFiles() {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<FileAttachment>>>(`/api/v1/auth/profile/files`);
  return data;
}
