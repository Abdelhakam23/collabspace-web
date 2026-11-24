import type { TaskPriority } from "@/types";

export const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];

export const PROJECT_TABS = [
  { label: "Overview", path: "" },
  { label: "Tasks", path: "/tasks" },
  { label: "Teams", path: "/teams" },
  { label: "Files", path: "/files" },
];

export const STATUS_COLORS: Record<string, string> = { Active: "#FA2B75", Completed: "#2BA52E" };
export const PRIORITY_COLORS: Record<string, string> = { High: "#DB302A", Medium: "#E6BA0E" };

export const STATUS_LEGEND = [
  { status: "Pending", label: "Pending tasks", color: "#191919" },
  { status: "In Progress", label: "In progress tasks", color: "#005AFB" },
  { status: "Completed", label: "Completed tasks", color: "#2BA52E" },
];

export const BAND_TINTS: Record<string, string> = {
  "ui/ux": "#FAECF6",
  frontend: "#F2EAF2",
  backend: "#E6F8F7",
  marketing: "#E9E9EA",
};

export const COMPLETION_COLORS: Record<string, string> = {
  "ui/ux": "#A43782",
  frontend: "#7D2D7E",
  backend: "#04B5AE",
  marketing: "#27272B",
};
