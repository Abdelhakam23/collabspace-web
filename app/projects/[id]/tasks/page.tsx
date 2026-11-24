"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectShell } from "@/components/projects/project-shell";
import { getKanbanBoardForProject, updateTaskStatus } from "@/lib/api/tasks";
import type { KanbanColumn } from "@/lib/types";

/** Tasks tab of the project screen ("All Projects / Alpha / Tasks",
 * node 181-1418), wired to A5.2. */

export default function ProjectTasksPage() {
  return (
    <Suspense>
      <ProjectTasksContent />
    </Suspense>
  );
}

function ProjectTasksContent() {
  const { id } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [pendingMove, setPendingMove] = useState<number | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  // Ref guard: state alone cannot stop two drops in the same render batch.
  const moving = useRef(false);

  async function load() {
    try {
      const res = await getKanbanBoardForProject(id);
      setColumns(Array.isArray(res.data) ? res.data : []);
    } catch {
      setColumns([]);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getKanbanBoardForProject(id);
        if (!cancelled) setColumns(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setColumns([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // A5.6 status move: optimistic, one move at a time, rolls back visibly.
  async function moveTask(taskId: number, toStatus: string) {
    if (moving.current) return;
    moving.current = true;
    const before = columns;
    const next = columns.map((col) => ({
      ...col,
      tasks: (col.tasks ?? []).filter((t) => t.id !== taskId),
    }));
    let moved = false;
    for (const col of next) {
      if (col.status === toStatus) {
        const task = before.flatMap((c) => c.tasks ?? []).find((t) => t.id === taskId);
        if (task) {
          col.tasks = [...(col.tasks ?? []), { ...task, status: toStatus }];
          moved = true;
        }
      }
    }
    if (!moved) return;
    setPendingMove(taskId);
    setMoveError(null);
    setColumns(next);
    try {
      await updateTaskStatus(taskId, { status: toStatus });
    } catch {
      setColumns(before);
      setMoveError("Couldn't move the task. It was moved back.");
    } finally {
      moving.current = false;
      setPendingMove(null);
    }
  }

  return (
    <ProjectShell projectId={id}>
      {moveError ? <p className="mt-4 text-sm text-[#af2622]" role="alert">{moveError}</p> : null}
      {loaded ? (
        <KanbanBoard columns={columns} projectId={id} onChanged={load} onMoveTask={moveTask} pendingMove={pendingMove} />
      ) : null}
    </ProjectShell>
  );
}
