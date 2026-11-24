import type { User } from "./users";
import type { FileAttachment } from "./files";

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
