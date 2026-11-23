import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Team, TeamRole, Paginated } from "@/lib/types";

/** GET /api/v1/team-roles — List Team Roles (A3.1) */
export async function listTeamRoles() {
  const { data } = await apiClient.get<ApiEnvelope<{ roles: TeamRole[] }>>(`/api/v1/team-roles`);
  return data;
}

/** GET /api/v1/teams — List Teams (A3.2) */
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

/** POST /api/v1/teams — Create Team (A3.3) */
export async function createTeam(payload: CreateTeamPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ team: Team }>>(`/api/v1/teams`, payload);
  return data;
}

/** GET /api/v1/teams/1 — Get Team Details (A3.4) */
export async function getTeamDetails(teamId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ team: Team }>>(`/api/v1/teams/${encodeURIComponent(teamId)}`);
  return data;
}

export interface UpdateTeamPayload {
  name: string;
  description: string;
}

/** PUT /api/v1/teams/1 — Update Team (A3.5) */
export async function updateTeam(teamId: number | string, payload: UpdateTeamPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ team: Team }>>(`/api/v1/teams/${encodeURIComponent(teamId)}`, payload);
  return data;
}

export interface AssignMembersToTeamPayload {
  members: string;
  "members[].user_id": number;
  "members[].role_in_team": string;
}

/** POST /api/v1/teams/1/members — Assign Members to Team (A3.6) */
export async function assignMembersToTeam(teamId: number | string, payload: AssignMembersToTeamPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/teams/${encodeURIComponent(teamId)}/members`, payload);
  return data;
}

/** DELETE /api/v1/teams/1/members/5 — Remove Member from Team (A3.7) */
export async function removeMemberFromTeam(teamId: number | string, memberId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<unknown>>(`/api/v1/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(memberId)}`);
  return data;
}

/** DELETE /api/v1/teams/1 — Delete Team (A3.8) */
export async function deleteTeam(teamId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/teams/${encodeURIComponent(teamId)}`);
  return data;
}
