import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Project, Paginated, ProjectOverview, ProjectTeamProgress } from "@/lib/types";

export async function listProjects(query?: { page: string | number; per_page: string | number; sort: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Project>>>(`/api/v1/projects`, { params: query });
  return data;
}

export interface CreateProjectPayload {
  name: string;
  start_date: string;
  deadline: string;
  priority: string;
  teams: string[];
  members: { user_id: number; role: string }[];
}

export async function createProject(payload: CreateProjectPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ project: Project }>>(`/api/v1/projects`, payload);
  return data;
}

export async function getProjectOverview(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<ProjectOverview>>(`/api/v1/projects/${encodeURIComponent(projectId)}/overview`);
  return data;
}

export async function getProjectTeamsTaskProgress(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<ProjectTeamProgress[]>>(`/api/v1/projects/${encodeURIComponent(projectId)}/teams`);
  return data;
}

export interface UpdateProjectPayload {
  name: string;
  priority: string;
  status: string;
}

export async function updateProject(projectId: number | string, payload: UpdateProjectPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ project: Project }>>(`/api/v1/projects/${encodeURIComponent(projectId)}`, payload);
  return data;
}

export interface AssignTeamsToProjectPayload {
  team_ids: string;
}

export async function assignTeamsToProject(projectId: number | string, payload: AssignTeamsToProjectPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/teams`, payload);
  return data;
}

export async function removeTeamFromProject(projectId: number | string, teamId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/teams/${encodeURIComponent(teamId)}`);
  return data;
}

export async function deleteProject(projectId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/projects/${encodeURIComponent(projectId)}`);
  return data;
}
