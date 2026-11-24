import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Task, KanbanColumn, Paginated } from "@/lib/types";

/** GET /api/v1/tasks — List Tasks (with filters) (A5.1) */
export async function listTasks(query?: { project_id: string | number; status: string | number; per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Task>>>(`/api/v1/tasks`, { params: query });
  return data;
}

/** GET /api/v1/projects/1/tasks/kanban — Get Kanban Board for Project (A5.2) */
export async function getKanbanBoardForProject(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<KanbanColumn[]>>(`/api/v1/projects/${encodeURIComponent(projectId)}/tasks/kanban`);
  return data;
}

// Only the fields also present in the Create Task overlay frame (141-2397)
// are required; API-only extras stay optional instead of being invented.
export interface CreateTaskPayload {
  name: string;
  project_id: number;
  status: string;
  due_date: string;
  description?: string;
  team_id?: number;
  assigned_to?: number;
  priority?: string;
}

/** POST /api/v1/tasks — Create Task (A5.3) */
export async function createTask(payload: CreateTaskPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks`, payload);
  return data;
}

/** GET /api/v1/tasks/1 — Get Task Details (A5.4) */
export async function getTaskDetails(taskId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}`);
  return data;
}

export interface UpdateTaskPayload {
  name: string;
  priority: string;
  status: string;
}

/** PUT /api/v1/tasks/1 — Update Task (A5.5) */
export async function updateTask(taskId: number | string, payload: UpdateTaskPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}`, payload);
  return data;
}

export interface UpdateTaskStatusPayload {
  status: string;
}

/** PATCH /api/v1/tasks/1/status — Update Task Status (Kanban Drag & Drop) (A5.6) */
export async function updateTaskStatus(taskId: number | string, payload: UpdateTaskStatusPayload) {
  const { data } = await apiClient.patch<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}/status`, payload);
  return data;
}

export interface AssignTaskPayload {
  assigned_to: number;
  team_id: number;
}

/** PATCH /api/v1/tasks/1/assign — Assign Task (A5.7) */
export async function assignTask(taskId: number | string, payload: AssignTaskPayload) {
  const { data } = await apiClient.patch<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}/assign`, payload);
  return data;
}

/** DELETE /api/v1/tasks/1 — Delete Task (A5.8) */
export async function deleteTask(taskId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/tasks/${encodeURIComponent(taskId)}`);
  return data;
}
