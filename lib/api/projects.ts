import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Project, Paginated } from "@/lib/types";

/** GET /api/v1/projects — List Projects (A4.1) */
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

/** POST /api/v1/projects — Create Project (A4.2) */
export async function createProject(payload: CreateProjectPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ project: Project }>>(`/api/v1/projects`, payload);
  return data;
}

/** GET /api/v1/projects/1/overview — Get Project Overview (A4.3) */
export async function getProjectOverview(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/overview`);
  return data;
}

/** GET /api/v1/projects/1/teams — Get Project Teams & Task Progress (Figma Screen) (A4.4) */
export async function getProjectTeamsTaskProgress(projectId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/teams`);
  return data;
}

export interface UpdateProjectPayload {
  name: string;
  priority: string;
  status: string;
}

/** PUT /api/v1/projects/1 — Update Project (A4.5) */
export async function updateProject(projectId: number | string, payload: UpdateProjectPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ project: Project }>>(`/api/v1/projects/${encodeURIComponent(projectId)}`, payload);
  return data;
}

export interface AssignTeamsToProjectPayload {
  team_ids: string;
}

/** POST /api/v1/projects/1/teams — Assign Teams to Project (A4.6) */
export async function assignTeamsToProject(projectId: number | string, payload: AssignTeamsToProjectPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/teams`, payload);
  return data;
}

/** DELETE /api/v1/projects/1/teams/2 — Remove Team from Project (A4.7) */
export async function removeTeamFromProject(projectId: number | string, teamId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<unknown>>(`/api/v1/projects/${encodeURIComponent(projectId)}/teams/${encodeURIComponent(teamId)}`);
  return data;
}

/** DELETE /api/v1/projects/1 — Delete Project (A4.8) */
export async function deleteProject(projectId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/projects/${encodeURIComponent(projectId)}`);
  return data;
}
