import type { User } from "./users";

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
