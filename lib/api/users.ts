import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, User } from "@/lib/types";

/** GET /api/v1/users — List Users (A12.1) */
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

/** POST /api/v1/users — Create User (Admin Only) (A12.2) */
export async function createUser(payload: CreateUserPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ user: User }>>(`/api/v1/users`, payload);
  return data;
}

/** GET /api/v1/users/1 — Show User Details (A12.3) */
export async function showUserDetails(userId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ user: User }>>(`/api/v1/users/${encodeURIComponent(userId)}`);
  return data;
}

export interface UpdateUserPayload {
  role: string;
  status: string;
  job_title: string;
}

/** PUT /api/v1/users/1 — Update User (Admin Only) (A12.4) */
export async function updateUser(userId: number | string, payload: UpdateUserPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ user: User }>>(`/api/v1/users/${encodeURIComponent(userId)}`, payload);
  return data;
}

/** DELETE /api/v1/users/2 — Delete User (Admin Only) (A12.5) */
export async function deleteUser(userId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/users/${encodeURIComponent(userId)}`);
  return data;
}
