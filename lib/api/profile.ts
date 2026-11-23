import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, User, Task, FileAttachment, Paginated } from "@/lib/types";

/** GET /api/v1/auth/me — Get Profile (/me) (A2.1) */
export async function getProfile() {
  const { data } = await apiClient.get<ApiEnvelope<{ user: User }>>(`/api/v1/auth/me`);
  return data;
}

export interface UpdateProfileWithAvatarPayload {
  avatar: File;
  job_title: string;
  years_of_experience: string;
  phone: string;
  name: string;
}

/** POST /api/v1/auth/profile — Update Profile with Avatar (form-data) (A2.2) */
export async function updateProfileWithAvatar(payload: UpdateProfileWithAvatarPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v as string | Blob); });
  const { data } = await apiClient.post<ApiEnvelope<{ user: User }>>(`/api/v1/auth/profile`, form, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}

/** DELETE /api/v1/auth/profile/avatar — Remove Avatar (A2.3) */
export async function removeAvatar() {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/auth/profile/avatar`);
  return data;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/** PUT /api/v1/auth/password — Change Password (A2.4) */
export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await apiClient.put<ApiEnvelope<null>>(`/api/v1/auth/password`, payload);
  return data;
}

/** GET /api/v1/auth/profile/tasks — Get User Tasks (A2.5) */
export async function getUserTasks() {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Task>>>(`/api/v1/auth/profile/tasks`);
  return data;
}

/** GET /api/v1/auth/profile/files — Get User Files (A2.6) */
export async function getUserFiles() {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<FileAttachment>>>(`/api/v1/auth/profile/files`);
  return data;
}
