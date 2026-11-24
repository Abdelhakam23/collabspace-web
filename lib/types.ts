/** Shared API envelope. Laravel returns { success, message, data }. */
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Paginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    [key: string]: unknown;
  };
}

export type Role = "Admin" | "Project Manager" | "Team Member";

export interface User {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  about: string | null;
  years_of_experience: number | null;
  phone: string | null;
  avatar_url: string | null;
  status: string;
  available_status: string;
  current_project_id: number | null;
  roles: Role[];
  permissions: string[];
  google_linked: boolean;
  facebook_linked: boolean;
  linkedin_linked: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthPayload {
  user: User;
  token: string;
  token_type: "Bearer";
}

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: number | null;
  assignee?: User | null;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumn {
  status: TaskStatus;
  tasks: Task[];
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  members_count?: number;
  members?: TeamMember[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  user: User;
  role: string;
  is_leader: boolean;
}

export interface TeamRole {
  value: string;
  is_leader: boolean;
}

export type ProjectStatus = "Active" | "On Hold" | "Completed" | "Delayed";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: TaskPriority;
  start_date: string | null;
  deadline: string | null;
  progress: number;
  teams?: Team[];
  files_count?: number;
  created_at: string;
  updated_at: string;
}

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

export interface FileAttachment {
  id: number;
  name: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  project_id: number | null;
  task_id: number | null;
  uploaded_by: number;
  uploader?: User;
  created_at: string;
}

export interface Message {
  id: number;
  project_id: number;
  user_id: number;
  user?: User;
  body: string;
  parent_id: number | null;
  attachment?: FileAttachment | null;
  mentions?: number[];
  reads_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface DashboardData {
  overview: {
    projects: { total: number; active: number; completed: number; average_progress: number };
    tasks: Record<string, number>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface AiSetting {
  id: number;
  key: string;
  value: unknown;
  type: string;
  description: string | null;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user: User | null;
  action: string;
  subject_type: string | null;
  subject_id: number | null;
  properties: Record<string, unknown> | null;
  created_at: string;
}

/** A4.3 Get Project Overview - shape observed from the live backend
 *  (sanitized capture in docs/design-api-gaps.md). */
export interface ProjectOverview {
  id: number;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  progress_percentage: number;
  due_date_indicator: {
    start_date: string;
    deadline: string;
    total_days: number;
    days_remaining: number;
    is_overdue: boolean;
  };
  tasks_statistics: {
    total: number;
    pending: number;
    in_progress: number;
    in_review: number;
    completed: number;
    completion_rate: number;
    pending_percentage: number;
    in_progress_percentage: number;
    in_review_percentage: number;
    completed_percentage: number;
  };
  counts: { files: number; meetings: number; messages: number; teams: number; direct_members: number };
  teams: { id: number; name: string; description: string | null; created_by: number; members_count: number; active_projects_count: number; created_at: string; updated_at: string }[];
  direct_members: { id: number; name: string; email: string; avatar_url: string | null; job_title: string | null; role: string }[];
  created_by: number;
  creator: { id: number; name: string; email: string };
  created_at: string;
  updated_at: string;
  chart: {
    period: string;
    year: number;
    group_by: string;
    data: { month: string; month_number: number; year: number; label: string; created_tasks: number; completed_tasks: number; progress_percentage: number; is_future: boolean }[];
  };
}

/** A4.4 Get Project Teams & Task Progress - shape observed from the live
 *  backend; the envelope's data is the team array itself. */
export interface ProjectTeamProgress {
  id: number;
  name: string;
  completion_percentage: number;
  total_tasks: number;
  completed_tasks: number;
  members: {
    id: number;
    name: string;
    avatar_url: string | null;
    role_in_team: string;
    is_leader: boolean;
    tasks_completed: number;
    tasks_total: number;
    tasks_ratio: string;
    progress_percentage: number;
  }[];
}
