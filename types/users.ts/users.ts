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
