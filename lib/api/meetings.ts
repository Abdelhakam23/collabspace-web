import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Meeting, MeetingSummary, Paginated } from "@/lib/types";

/** GET /api/v1/meetings — List Meetings (with filters) (A6.1) */
export async function listMeetings(query?: { project_id: string | number; time_filter: string | number; per_page: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Meeting>>>(`/api/v1/meetings`, { params: query });
  return data;
}

export interface ScheduleMeetingPayload {
  title: string;
  description: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  project_id: number;
  participants: string;
}

/** POST /api/v1/meetings — Schedule Meeting (A6.2) */
export async function scheduleMeeting(payload: ScheduleMeetingPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ meeting: Meeting }>>(`/api/v1/meetings`, payload);
  return data;
}

/** GET /api/v1/meetings/1 — Get Meeting Details (A6.3) */
export async function getMeetingDetails(meetingId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ meeting: Meeting }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}`);
  return data;
}

export interface UpdateMeetingReschedulePayload {
  title: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
}

/** PUT /api/v1/meetings/1 — Update Meeting / Reschedule (A6.4) */
export async function updateMeetingReschedule(meetingId: number | string, payload: UpdateMeetingReschedulePayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ meeting: Meeting }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}`, payload);
  return data;
}

export interface MarkAttendancePayload {
  attendance: string;
  "attendance[].user_id": number;
  "attendance[].attended": boolean;
}

/** PATCH /api/v1/meetings/1/attendance — Mark Attendance (A6.5) */
export async function markAttendance(meetingId: number | string, payload: MarkAttendancePayload) {
  const { data } = await apiClient.patch<ApiEnvelope<null>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/attendance`, payload);
  return data;
}

export interface GenerateAiMeetingSummaryPayload {
  transcript: string;
}

/** POST /api/v1/meetings/1/summary/generate — Generate AI Meeting Summary (A6.6) */
export async function generateAiMeetingSummary(meetingId: number | string, payload: GenerateAiMeetingSummaryPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary/generate`, payload);
  return data;
}

/** GET /api/v1/meetings/1/summary — Get Meeting Summary (A6.7) */
export async function getMeetingSummary(meetingId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ summary: MeetingSummary }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary`);
  return data;
}

export interface UpdateMeetingSummaryManuallyPayload {
  summary: string;
  decisions_made: string;
}

/** PUT /api/v1/meetings/1/summary — Update Meeting Summary Manually (A6.8) */
export async function updateMeetingSummaryManually(meetingId: number | string, payload: UpdateMeetingSummaryManuallyPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ summary: MeetingSummary }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary`, payload);
  return data;
}

export interface ConvertSummaryActionItemsToKanbanTasksPayload {
  default_priority: string;
  default_due_date: string;
}

/** POST /api/v1/meetings/1/summary/create-tasks — Convert Summary Action Items to Kanban Tasks (A6.9) */
export async function convertSummaryActionItemsToKanbanTasks(meetingId: number | string, payload: ConvertSummaryActionItemsToKanbanTasksPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary/create-tasks`, payload);
  return data;
}

/** DELETE /api/v1/meetings/1 — Delete Meeting (A6.10) */
export async function deleteMeeting(meetingId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}`);
  return data;
}
