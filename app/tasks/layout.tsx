import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/require-auth";

export default function TasksLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
