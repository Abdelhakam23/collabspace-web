"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getKanbanBoardForProject, updateTaskStatus } from "@/lib/api/tasks";
import type { KanbanColumn } from "@/lib/types";

export function useKanbanBoard(projectId: string | number | null) {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loadedId, setLoadedId] = useState<string | number | null>(null);
  const loaded = loadedId === projectId;
  const [pendingMove, setPendingMove] = useState<number | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const moving = useRef(false);

  useEffect(() => {
    if (projectId == null) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getKanbanBoardForProject(projectId);
        if (!cancelled) setColumns(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setColumns([]);
      } finally {
        if (!cancelled) setLoadedId(projectId);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const reload = useCallback(async () => {
    if (projectId == null) return;
    try {
      const res = await getKanbanBoardForProject(projectId);
      setColumns(Array.isArray(res.data) ? res.data : []);
    } catch {
      setColumns([]);
    } finally {
      setLoadedId(projectId);
    }
  }, [projectId]);

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
    if (!moved) {
      moving.current = false;
      return;
    }
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

  return { columns, loaded, pendingMove, moveError, moveTask, reload };
}
