import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, User } from "@/types";

export async function listUsers(query?: { per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<User[]>>(`/api/v1/users`, { params: query });
  return data;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  job_title: string;
  years_of_experience: number;
  status: string;
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ user: User }>>(`/api/v1/users`, payload);
  return data;
}

export async function showUserDetails(userId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ user: User }>>(`/api/v1/users/${encodeURIComponent(userId)}`);
  return data;
}

export interface UpdateUserPayload {
  role: string;
  status: string;
  job_title: string;
}

export async function updateUser(userId: number | string, payload: UpdateUserPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ user: User }>>(`/api/v1/users/${encodeURIComponent(userId)}`, payload);
  return data;
}

export async function deleteUser(userId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/users/${encodeURIComponent(userId)}`);
  return data;
}
