import type { TaskPriority } from "./tasks";
import type { Team } from "./teams";

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
