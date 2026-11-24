import { useState } from "react";
import { Calendar, MoreHorizontal, Plus } from "lucide-react";
import { PRIORITY_TONES } from "@/lib/colors";
import { initials, shortDate } from "@/lib/format";
import type { KanbanColumn, Task } from "@/types";
import { CreateTaskOverlay } from "@/components/projects/create-task-overlay";

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

function TaskCard({ task, pending }: { task: Task; pending: boolean }) {
  const tone = PRIORITY_TONES[(task.priority ?? "").toLowerCase()];
  return (
    <li
      draggable={!pending}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ id: task.id, status: task.status }));
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`flex h-[167px] flex-col justify-between rounded-2xl bg-[#F6F8FA] p-4 ring-1 ring-[#F3F4F6] ${pending ? "opacity-50" : "cursor-grab"}`}
    >
      <div className="flex flex-col gap-2">
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
      </div>
      <div className="flex items-center justify-between">
        {task.assignee ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#E9E9EA] bg-white text-[9px] text-[#000712]"
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

export function KanbanBoard({
  columns,
  projectId,
  onChanged,
  onMoveTask,
  pendingMove,
  className = "mt-8",
}: {
  columns: KanbanColumn[];
  projectId: string;
  onChanged: () => void;
  onMoveTask: (taskId: number, toStatus: string) => void;
  pendingMove: number | null;
  className?: string;
}) {
  const [creatingIn, setCreatingIn] = useState<string | null>(null);
  return (
    <>
      <div className={`${className} grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-4`}>
        {columns.map((col) => {
          const style = columnStyle(col.status);
          return (
            <section
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                try {
                  const raw = e.dataTransfer.getData("text/plain");
                  const payload = JSON.parse(raw) as { id?: number; status?: string };
                  if (payload.id != null && payload.status !== col.status) onMoveTask(payload.id, col.status);
                } catch {
                }
              }}
              className="flex flex-col overflow-hidden rounded-2xl bg-white pb-5 ring-1 ring-[#E9E9EA]"
            >
              <header
                className={`${SANS} flex h-[62px] items-center justify-between px-5 text-[15px] font-medium text-[#191919]`}
                style={{ backgroundColor: style.bg }}
              >
                {style.label}
                                <span aria-disabled="true" title="Column actions are not wired yet" className="text-[#4A4A4A]">
                  <MoreHorizontal size={16} />
                </span>
              </header>
              <ul className="flex flex-col gap-[18px] px-5 pt-5">
                <li>
                  <button
                    type="button"
                    onClick={() => setCreatingIn(col.status)}
                    className={`${SANS} flex w-full items-center justify-center gap-1 rounded-[10px] border border-dashed border-[#005AFB] py-2.5 text-sm font-medium leading-none text-[#005AFB] transition-colors hover:bg-[#005AFB]/5`}
                  >
                    Add Task <Plus size={14} />
                  </button>
                </li>
                {(col.tasks ?? []).map((task) => (
                  <TaskCard key={task.id} task={task} pending={pendingMove === task.id} />
                ))}
              </ul>
            </section>
          );
        })}
        {columns.length === 0 ? <p className={`${SANS} text-sm text-[#718096]`}>No tasks yet.</p> : null}
      </div>
      {creatingIn ? (
        <CreateTaskOverlay projectId={projectId} status={creatingIn} onClose={() => setCreatingIn(null)} onCreated={onChanged} />
      ) : null}
    </>
  );
}
