import type { FileAttachment, Task, User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

/**
 * Overview tab: the drawn About section fed by the profile. The drawn
 * "Recent Activities" section is omitted: the API has no activity-feed
 * endpoint, and fabricating activity rows would be invented data.
 */
export function OverviewTab({ user }: { user: User }) {
  return (
    <section className="w-full max-w-[1311px] rounded-[13px] bg-white p-5">
      <h2 className={`${SANS} text-[15px] font-semibold text-[#000712]`}>About</h2>
      <p className={`${SANS} mt-2 text-[13px] leading-[160%] text-[#222222]`}>
        {user.about ?? "No bio added yet."}
      </p>
    </section>
  );
}

function TaskCard({ title, count, done, tasks }: { title: string; count: number; done: boolean; tasks: Task[] }) {
  return (
    <section className={`flex-1 rounded-[13px] p-5 ${done ? "bg-[#EAF9EE]" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <h2 className={`${SANS} text-[15px] font-semibold ${done ? "text-[#1A7F37]" : "text-[#000712]"}`}>{title}</h2>
        <span className={`${SANS} text-[12px] text-[#606C80]`}>{count}</span>
      </div>
      <div className="mt-3 flex flex-col divide-y divide-[#E6EBF0]">
        {tasks.length === 0 ? (
          <p className={`${SANS} py-3 text-[13px] text-[#606C80]`}>No tasks.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className={`${SANS} truncate text-[13px] text-[#222222]`}>{task.title}</span>
              {done ? (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#1A7F37] text-[#1A7F37]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/**
 * Tasks tab (drawn To do / Done columns fed by A2.5). The drawn per-row
 * progress bars are omitted: tasks carry no progress field, so there is no
 * honest value to draw.
 */
export function TasksTab({ tasks }: { tasks: Task[] | null }) {
  if (tasks === null) {
    return <p className={`${SANS} w-full max-w-[1311px] py-8 text-center text-sm text-[#606C80]`}>Loading tasks...</p>;
  }
  const todo = tasks.filter((t) => t.status !== "Completed");
  const done = tasks.filter((t) => t.status === "Completed");
  return (
    <div className="flex w-full max-w-[1311px] gap-6">
      <TaskCard title="To do" count={todo.length} done={false} tasks={todo} />
      <TaskCard title="Done" count={done.length} done tasks={done} />
    </div>
  );
}

function fileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function ago(iso: string): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 3600) return `${Math.floor(seconds / 60) || 1}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Files tab (drawn three-column file card grid fed by A2.6). */
export function FilesTab({ files }: { files: FileAttachment[] | null }) {
  if (files === null) {
    return <p className={`${SANS} w-full max-w-[1311px] py-8 text-center text-sm text-[#606C80]`}>Loading files...</p>;
  }
  if (files.length === 0) {
    return <p className={`${SANS} w-full max-w-[1311px] py-8 text-center text-sm text-[#606C80]`}>No files yet.</p>;
  }
  return (
    <div className="grid w-full max-w-[1311px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 rounded-[13px] bg-white p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDECEC] text-[#E5484D]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className={`${SANS} truncate text-[13px] font-semibold text-[#000712]`}>{file.original_name || file.name}</p>
            <p className={`${SANS} truncate text-[11px] text-[#606C80]`}>
              {file.uploader ? `By ${file.uploader.name} • ` : ""}
              {fileSize(file.size)} • {ago(file.created_at)}
            </p>
          </div>
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            title="Download file"
            aria-label={`Download ${file.original_name || file.name}`}
            className="shrink-0 text-[#606C80] hover:text-[#000712]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m7 10 5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
          </a>
        </div>
      ))}
    </div>
  );
}
