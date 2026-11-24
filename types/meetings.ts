import type { User } from "./users";

export interface Meeting {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  status: string;
  summary?: MeetingSummary | null;
  attendees?: User[];
  created_at: string;
  updated_at: string;
}

export interface MeetingSummary {
  id: number;
  meeting_id: number;
  content: string;
  generated_at: string | null;
  updated_at: string;
}
