"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectShell } from "@/components/projects/project-shell";
import { getKanbanBoardForProject } from "@/lib/api/tasks";
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

  return (
    <ProjectShell projectId={id}>
      {loaded ? <KanbanBoard columns={columns} projectId={id} onChanged={load} /> : null}
    </ProjectShell>
  );
}
