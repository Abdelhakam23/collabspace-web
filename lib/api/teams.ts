import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Team, TeamRole, Paginated } from "@/lib/types";

export async function listTeamRoles() {
  const { data } = await apiClient.get<ApiEnvelope<{ roles: TeamRole[] }>>(`/api/v1/team-roles`);
  return data;
}

export async function listTeams(query?: { page: string | number; per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Team>>>(`/api/v1/teams`, { params: query });
  return data;
}

export interface CreateTeamPayload {
  name: string;
  description: string;
  members: string;
  "members[].user_id": number;
  "members[].role_in_team": string;
}

export async function createTeam(payload: CreateTeamPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ team: Team }>>(`/api/v1/teams`, payload);
  return data;
}

export async function getTeamDetails(teamId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ team: Team }>>(`/api/v1/teams/${encodeURIComponent(teamId)}`);
  return data;
}

export interface UpdateTeamPayload {
  name: string;
  description: string;
}

export async function updateTeam(teamId: number | string, payload: UpdateTeamPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ team: Team }>>(`/api/v1/teams/${encodeURIComponent(teamId)}`, payload);
  return data;
}

export interface AssignMembersToTeamPayload {
  members: string;
  "members[].user_id": number;
  "members[].role_in_team": string;
}

export async function assignMembersToTeam(teamId: number | string, payload: AssignMembersToTeamPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/teams/${encodeURIComponent(teamId)}/members`, payload);
  return data;
}

export async function removeMemberFromTeam(teamId: number | string, memberId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<unknown>>(`/api/v1/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(memberId)}`);
  return data;
}

export async function deleteTeam(teamId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/teams/${encodeURIComponent(teamId)}`);
  return data;
}
