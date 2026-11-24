import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Task, KanbanColumn, Paginated } from "@/types";

export async function listTasks(query?: { project_id: string | number; status: string | number; per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Task>>>(`/api/v1/tasks`, { params: query });
  return data;
}

export async function getKanbanBoardForProject(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<KanbanColumn[]>>(`/api/v1/projects/${encodeURIComponent(projectId)}/tasks/kanban`);
  const raw = data.data as unknown as { columns?: Record<string, { name: string; tasks: Task[] }> } | KanbanColumn[];
  const columns = Array.isArray(raw) ? raw : Object.entries(raw.columns ?? {}).map(([status, column]) => ({
    status: status as Task["status"],
    tasks: column.tasks.map((task) => ({ ...task, title: task.title ?? (task as Task & { name?: string }).name ?? "" })),
  }));
  return { ...data, data: columns };
}

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

export async function createTask(payload: CreateTaskPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks`, payload);
  return { ...data, data: { task: data.data.task ?? (data.data as unknown as Task) } };
}

export async function getTaskDetails(taskId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}`);
  return data;
}

export interface UpdateTaskPayload {
  name: string;
  priority: string;
  status: string;
}

export async function updateTask(taskId: number | string, payload: UpdateTaskPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}`, payload);
  return data;
}

export interface UpdateTaskStatusPayload {
  status: string;
}

export async function updateTaskStatus(taskId: number | string, payload: UpdateTaskStatusPayload) {
  const { data } = await apiClient.patch<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}/status`, payload);
  return data;
}

export interface AssignTaskPayload {
  assigned_to: number;
  team_id: number;
}

export async function assignTask(taskId: number | string, payload: AssignTaskPayload) {
  const { data } = await apiClient.patch<ApiEnvelope<{ task: Task }>>(`/api/v1/tasks/${encodeURIComponent(taskId)}/assign`, payload);
  return data;
}

export async function deleteTask(taskId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/tasks/${encodeURIComponent(taskId)}`);
  return data;
}
