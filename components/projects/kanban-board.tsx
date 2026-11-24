import { Calendar, MoreHorizontal, Plus } from "lucide-react";
import { PRIORITY_TONES } from "@/lib/colors";
import { initials, shortDate } from "@/lib/format";
import type { KanbanColumn, Task } from "@/lib/types";

/**
 * Kanban columns of the "All Projects / Alpha / Tasks" frame (node 181-1418),
 * wired to A5.2 (GET /projects/:id/tasks/kanban). Column band colors are
 * pixel-sampled from the 46% capture (docs/design-api-gaps.md). The drawn
 * per-task Progress bar and comment count have no fields in the documented
 * Task model, so they are omitted; "Add Task" is a write and stays inert.
 */

const SANS = "font-[family-name:var(--font-sans)]";

const COLUMN_STYLES: Record<string, { label: string; bg: string }> = {
  pending: { label: "To-do", bg: "#F9FAFB" },
  "in progress": { label: "In Progress", bg: "#E6EFFF" },
  "in review": { label: "In Review", bg: "#FAECF6" },
  completed: { label: "Completed Tasks", bg: "#EAF6EA" },
};

function columnStyle(status: string) {
  return COLUMN_STYLES[status.toLowerCase()] ?? { label: status, bg: "#F9FAFB" };
}

function TaskCard({ task }: { task: Task }) {
  const tone = PRIORITY_TONES[(task.priority ?? "").toLowerCase()];
  return (
    <li className="flex flex-col gap-2 rounded-[12px] bg-white p-3 ring-1 ring-[#F3F4F6]">
      <div className="flex items-start justify-between gap-2">
        <p className={`${SANS} text-sm font-medium text-[#191919]`}>{task.title}</p>
        {tone ? (
          <span
            className={`${SANS} shrink-0 rounded-full px-2 py-1 text-[12px] font-medium leading-[16px]`}
            style={{ color: tone.text, backgroundColor: tone.bg }}
          >
            {task.priority}
          </span>
        ) : null}
      </div>
      {task.description ? <p className={`${SANS} line-clamp-2 text-xs text-[#718096]`}>{task.description}</p> : null}
      <div className="mt-1 flex items-center justify-between">
        {task.assignee ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#E9E9EA] bg-[#F6F8FA] text-[9px] text-[#000712]"
            title={task.assignee.name}
          >
            {task.assignee.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={task.assignee.avatar_url} alt={task.assignee.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials(task.assignee.name)
            )}
          </span>
        ) : (
          <span />
        )}
        {task.due_date ? (
          <span className={`${SANS} flex items-center gap-1 text-[11px] text-[#718096]`}>
            <Calendar size={12} />
            {shortDate(task.due_date)}
          </span>
        ) : null}
      </div>
    </li>
  );
}

export function KanbanBoard({ columns }: { columns: KanbanColumn[] }) {
  return (
    <div className="mt-8 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => {
        const style = columnStyle(col.status);
        return (
          <section key={col.status} className="flex flex-col gap-3">
            <header
              className={`${SANS} flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#191919]`}
              style={{ backgroundColor: style.bg }}
            >
              {style.label}
              {/* Column actions have no read-only scope equivalent. */}
              <span aria-disabled="true" title="Column actions are not wired yet" className="text-[#4A4A4A]">
                <MoreHorizontal size={16} />
              </span>
            </header>
            {/* Task creation is a write flow outside the current read-only
                scope; the drawn button stays inert (docs/design-api-gaps.md). */}
            <button
              type="button"
              aria-disabled="true"
              title="Task creation is not wired yet"
              className={`${SANS} flex items-center justify-center gap-1 rounded-[8px] border border-dashed border-[#005AFB] px-3 py-2 text-[13px] text-[#005AFB]`}
            >
              Add Task <Plus size={14} />
            </button>
            <ul className="flex flex-col gap-3">
              {(col.tasks ?? []).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
          </section>
        );
      })}
      {columns.length === 0 ? <p className={`${SANS} text-sm text-[#718096]`}>No tasks yet.</p> : null}
    </div>
  );
}
