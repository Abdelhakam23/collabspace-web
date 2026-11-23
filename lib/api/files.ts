import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, FileAttachment, Paginated } from "@/lib/types";

/** GET /api/v1/files — List Files (with filters) (A7.1) */
export async function listFiles(query?: { project_id: string | number; per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<FileAttachment>>>(`/api/v1/files`, { params: query });
  return data;
}

export interface UploadFileToProjectPayload {
  file: File;
  project_id: string;
  name: string;
}

/** POST /api/v1/files — Upload File to Project (A7.2) */
export async function uploadFileToProject(payload: UploadFileToProjectPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v as string | Blob); });
  const { data } = await apiClient.post<ApiEnvelope<{ file: FileAttachment }>>(`/api/v1/files`, form, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}

export interface UploadFileToTaskPayload {
  file: File;
  task_id: string;
}

/** POST /api/v1/files — Upload File to Task (A7.3) */
export async function uploadFileToTask(payload: UploadFileToTaskPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v as string | Blob); });
  const { data } = await apiClient.post<ApiEnvelope<{ file: FileAttachment }>>(`/api/v1/files`, form, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}

/** GET /api/v1/files/1 — Get File Details (A7.4) */
export async function getFileDetails(fileId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ file: FileAttachment }>>(`/api/v1/files/${encodeURIComponent(fileId)}`);
  return data;
}

/** GET /api/v1/files/1/download — Download File (A7.5) */
export async function downloadFile(fileId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/files/${encodeURIComponent(fileId)}/download`);
  return data;
}

/** DELETE /api/v1/files/1 — Delete File (A7.6) */
export async function deleteFile(fileId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/files/${encodeURIComponent(fileId)}`);
  return data;
}
