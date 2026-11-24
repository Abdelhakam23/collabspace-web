import type { User } from "./users";

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
