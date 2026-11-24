import type { User } from "./users";

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
