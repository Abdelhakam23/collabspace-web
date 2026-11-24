"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { CreateTaskOverlay } from "@/components/projects/create-task-overlay";
import { TasksToolbar, type TaskScope } from "@/components/tasks/tasks-toolbar";
import { listProjects } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import { useKanbanBoard } from "@/hooks/use-kanban-board";
import type { KanbanColumn, Project, User } from "@/types";

export default function GlobalTasksPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<TaskScope>("all");
  const [creating, setCreating] = useState(false);
  const { columns, loaded, pendingMove, moveError, moveTask, reload } = useKanbanBoard(projectId);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, profile] = await Promise.all([listProjects({ page: 1, per_page: 15, sort: "newest" }), getProfile()]);
        if (cancelled) return;
        const all = list.data.data ?? [];
        setProjects(all);
        setProjectId((current) => current ?? all[0]?.id ?? null);
        setMe(profile.data.user);
      } catch {
        if (!cancelled) setProjects([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo<KanbanColumn[]>(() => {
    const q = query.trim().toLowerCase();
    return columns.map((col) => ({
      ...col,
      tasks: (col.tasks ?? []).filter((task) => {
        if (scope === "mine" && me && (task.assignee?.id ?? task.assigned_to) !== me.id) return false;
        if (q && !`${task.title} ${task.description ?? ""}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    }));
  }, [columns, query, scope, me]);

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Tasks" />
      <main className="px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[39px]">
        {projects && projects.length > 0 ? (
          <>
            <TasksToolbar
              query={query}
              onQuery={setQuery}
              projects={projects}
              projectId={projectId}
              onProject={setProjectId}
              scope={scope}
              onScope={setScope}
              onCreateTask={() => setCreating(true)}
            />
            {moveError ? <p className="mt-4 text-sm text-[#af2622]" role="alert">{moveError}</p> : null}
            {loaded ? (
              <KanbanBoard
                columns={visible}
                projectId={String(projectId)}
                onChanged={reload}
                onMoveTask={moveTask}
                pendingMove={pendingMove}
                className="mt-[26px]"
              />
            ) : null}
          </>
        ) : projects ? (
          <p className="font-[family-name:var(--font-sans)] mt-8 text-sm text-[#718096]">No projects yet.</p>
        ) : null}
      </main>
      {creating && projectId != null ? (
        <CreateTaskOverlay projectId={String(projectId)} status="Pending" onClose={() => setCreating(false)} onCreated={reload} />
      ) : null}
    </div>
  );
}
