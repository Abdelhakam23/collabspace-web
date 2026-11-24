import type { User } from "./users";

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
