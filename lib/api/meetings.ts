import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, Meeting, MeetingSummary, Paginated } from "@/types";

function normalizeMeeting(value: Meeting): Meeting {
  const raw = value as Meeting & { meeting_date?: string; participants?: Meeting["attendees"]; meeting_link?: string };
  const timestamp = (time: string) => raw.meeting_date && /^\d{2}:\d{2}/.test(time) ? `${raw.meeting_date}T${time}` : time;
  return { ...raw, start_time: timestamp(raw.start_time), end_time: timestamp(raw.end_time), attendees: raw.attendees ?? raw.participants, location: raw.location ?? raw.meeting_link ?? null };
}

function normalizeSummary(value: MeetingSummary): MeetingSummary {
  const raw = value as MeetingSummary & { summary?: string; decisions_made?: string[]; action_items?: string[]; created_at?: string };
  const points = [...(raw.decisions_made ?? []), ...(raw.action_items ?? [])];
  return { ...raw, content: raw.content ?? [raw.summary, ...points.map((point) => `- ${point}`)].filter(Boolean).join("\n"), generated_at: raw.generated_at ?? raw.created_at ?? null };
}

export async function listMeetings(query?: { page?: string | number; project_id?: string | number; time_filter?: string | number; per_page?: string | number }) {
  const { data } = await apiClient.get<ApiEnvelope<Paginated<Meeting>>>(`/api/v1/meetings`, { params: query });
  return { ...data, data: { ...data.data, data: (data.data.data ?? []).map(normalizeMeeting) } };
}

export interface ScheduleMeetingPayload {
  title: string;
  description: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  project_id?: number;
  participants?: number[];
}

export async function scheduleMeeting(payload: ScheduleMeetingPayload) {
  const { data } = await apiClient.post<ApiEnvelope<{ meeting: Meeting }>>(`/api/v1/meetings`, payload);
  return data;
}

export async function getMeetingDetails(meetingId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ meeting: Meeting }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}`);
  return { ...data, data: { meeting: normalizeMeeting(data.data.meeting ?? (data.data as unknown as Meeting)) } };
}

export interface UpdateMeetingReschedulePayload {
  title: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
}

export async function updateMeetingReschedule(meetingId: number | string, payload: UpdateMeetingReschedulePayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ meeting: Meeting }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}`, payload);
  return data;
}

export interface MarkAttendancePayload {
  attendance: string;
  "attendance[].user_id": number;
  "attendance[].attended": boolean;
}

export async function markAttendance(meetingId: number | string, payload: MarkAttendancePayload) {
  const { data } = await apiClient.patch<ApiEnvelope<null>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/attendance`, payload);
  return data;
}

export interface GenerateAiMeetingSummaryPayload {
  transcript: string;
}

export async function generateAiMeetingSummary(meetingId: number | string, payload: GenerateAiMeetingSummaryPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary/generate`, payload);
  return data;
}

export async function getMeetingSummary(meetingId: number | string) {
  const { data } = await apiClient.get<ApiEnvelope<{ summary: MeetingSummary }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary`);
  return { ...data, data: { summary: normalizeSummary(typeof data.data.summary === "object" ? data.data.summary : (data.data as unknown as MeetingSummary)) } };
}

export interface UpdateMeetingSummaryManuallyPayload {
  summary: string;
  decisions_made: string;
}

export async function updateMeetingSummaryManually(meetingId: number | string, payload: UpdateMeetingSummaryManuallyPayload) {
  const { data } = await apiClient.put<ApiEnvelope<{ summary: MeetingSummary }>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary`, payload);
  return data;
}

export interface ConvertSummaryActionItemsToKanbanTasksPayload {
  default_priority: string;
  default_due_date: string;
}

export async function convertSummaryActionItemsToKanbanTasks(meetingId: number | string, payload: ConvertSummaryActionItemsToKanbanTasksPayload) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}/summary/create-tasks`, payload);
  return data;
}

export async function deleteMeeting(meetingId: number | string) {
  const { data } = await apiClient.delete<ApiEnvelope<null>>(`/api/v1/meetings/${encodeURIComponent(meetingId)}`);
  return data;
}
