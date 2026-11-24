import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, FileAttachment, Paginated } from "@/lib/types";

export async function listFiles(query?: { project_id: string | number; per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<FileAttachment>>>(`/api/v1/files`, { params: query });
  return data;
}

export interface UploadFileToProjectPayload {
  file: File;
  project_id: string;
  name: string;
}

export async function uploadFileToProject(payload: UploadFileToProjectPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v as string | Blob); });
  const { data } = await apiClient.post<ApiEnvelope<{ file: FileAttachment }>>(`/api/v1/files`, form, { headers: { "Content-Type": "multipart/form-data" } });
  return { ...data, data: { file: data.data.file ?? (data.data as unknown as FileAttachment) } };
}

export interface UploadFileToTaskPayload {
  file: File;
  task_id: string;
}

export async function uploadFileToTask(payload: UploadFileToTaskPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v as string | Blob); });
  const { data } = await apiClient.post<ApiEnvelope<{ file: FileAttachment }>>(`/api/v1/files`, form, { headers: { "Content-Type": "multipart/form-data" } });
  return { ...data, data: { file: data.data.file ?? (data.data as unknown as FileAttachment) } };
}

export async function getFileDetails(fileId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ file: FileAttachment }>>(`/api/v1/files/${encodeURIComponent(fileId)}`);
  return data;
}

export async function downloadFile(fileId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/files/${encodeURIComponent(fileId)}/download`);
  return data;
}

export async function saveFileDownload(file: FileAttachment) {
  const res = await apiClient.get(`/api/v1/files/${encodeURIComponent(file.id)}/download`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.original_name || file.name || "download";
  a.click();
  URL.revokeObjectURL(url);
}

export async function deleteFile(fileId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/files/${encodeURIComponent(fileId)}`);
  return data;
}
