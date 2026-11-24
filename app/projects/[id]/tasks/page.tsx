"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectShell } from "@/components/projects/project-shell";
import { useKanbanBoard } from "@/lib/use-kanban-board";

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
  const { columns, loaded, pendingMove, moveError, moveTask, reload } = useKanbanBoard(id);

  return (
    <ProjectShell projectId={id}>
      {moveError ? <p className="mt-4 text-sm text-[#af2622]" role="alert">{moveError}</p> : null}
      {loaded ? (
        <KanbanBoard columns={columns} projectId={id} onChanged={reload} onMoveTask={moveTask} pendingMove={pendingMove} />
      ) : null}
    </ProjectShell>
  );
}
