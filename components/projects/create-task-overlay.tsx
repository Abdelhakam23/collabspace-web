"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Upload } from "lucide-react";
import { createTask } from "@/lib/api/tasks";
import { uploadFileToTask } from "@/lib/api/files";
import { listUsers } from "@/lib/api/users";
import type { User } from "@/lib/types";

/**
 * Create Task modal, matching the "Create Task Overlay" frame (node 141-2397:
 * 720px, radius 16, 24px padding, 32px gaps, white) and posting to A5.3.
 * Only fields present in BOTH the frame and the documented request body are
 * sent: name, due_date (End Date), status (the column the button lives in),
 * project_id (route) and assigned_to.
 *
 * The frame draws several guest chips while A5.3 accepts a single
 * assigned_to, so the form takes one assignee, says so in the UI before
 * submission, and never silently drops extra guests. Create-success with an
 * upload-failure is surfaced as partial success with resubmission blocked,
 * so a retry cannot create a duplicate task. The frame's Start Date has no
 * task-API field and renders disabled, and priority/description/team_id
 * exist only in the API, so they are not invented into the form. Files
 * upload after creation via A7.3. Field chrome reuses the New Project
 * overlay's measurements.
 */

const SANS = "font-[family-name:var(--font-sans)]";
const fieldLabel = `${SANS} absolute -top-[9px] left-4 z-10 bg-white px-1.5 text-xs text-[#718096]`;
const fieldBox = `${SANS} h-14 w-full rounded-[12px] border border-[#CBD5E0] bg-transparent px-4 py-2 text-sm text-[#000712] outline-none placeholder:text-[#718096]`;

export function CreateTaskOverlay({
  projectId,
  status,
  onClose,
  onCreated,
}: {
  projectId: string;
  status: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [guests, setGuests] = useState<User[]>([]);
  const [guess, setGuess] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set once the task exists: the form never submits twice, and a failed
  // file upload after a successful create becomes a visible partial success.
  const [created, setCreated] = useState(false);
  const [uploadFailures, setUploadFailures] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  // Ref guard: state alone cannot stop two submits in the same render batch.
  const submitting = useRef(false);

  useEffect(() => {
    let cancelled = false;
    listUsers({ per_page: 15 })
      .then((res) => {
        if (!cancelled) setUsers((res.data as { data?: User[] }).data ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = users.filter(
    (u) => guess.trim() && u.name.toLowerCase().includes(guess.trim().toLowerCase()) && !guests.some((m) => m.id === u.id),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current || created) return;
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      const res = await createTask({
        name,
        project_id: Number(projectId),
        status,
        due_date: dueDate,
        ...(guests[0] ? { assigned_to: guests[0].id } : {}),
      });
      setCreated(true);
      onCreated();
      const createdTask = (res.data as { task?: { id?: number } }).task;
      let failed = 0;
      for (const f of files) {
        if (!createdTask?.id) break;
        try {
          await uploadFileToTask({ file: f, task_id: String(createdTask.id) });
        } catch {
          failed += 1;
        }
      }
      if (failed) {
        setUploadFailures(failed);
      } else {
        onClose();
      }
    } catch {
      submitting.current = false;
      setError("Could not create the task. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="Create Task">
      <form
        onSubmit={onSubmit}
        className={`${SANS} flex max-h-[90vh] w-full max-w-[720px] flex-col gap-8 overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_8px_16px_rgba(0,0,0,0.16)]`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[25px] font-medium leading-[24px] text-[#000712]">Create Task</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-black">
            <svg width="13.15" height="13.15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="m1 1 12 12M13 1 1 13" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-[33px]">
          <label className="relative block">
            <span className={fieldLabel}>Task Name</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 4a3 3 0 0 1 6 0M9 11h6M9 15h4" />
              </svg>
            </span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Task Name" className={`${fieldBox} pl-11`} />
          </label>

          <div className="grid gap-[33px] sm:grid-cols-2">
            {/* The frame draws Start Date, but A5.3 has no start field, so it
                is marked unavailable instead of collecting data it never sends. */}
            <label className="relative block" title="Start date is not supported by the documented task API">
              <input disabled aria-disabled="true" className={`${fieldBox} cursor-not-allowed pr-10 text-transparent opacity-60`} />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A4A]">
                <Calendar size={16} strokeWidth={1.6} />
              </span>
              <span className={`${SANS} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#718096]`}>Start Date</span>
            </label>
            <label className="relative block">
              <input
                required
                type="date"
                aria-label="End Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${fieldBox} pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 ${dueDate ? "" : "text-transparent"}`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A4A]">
                <Calendar size={16} strokeWidth={1.6} />
              </span>
              {!dueDate ? <span className={`${SANS} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#718096]`}>End Date</span> : null}
            </label>
          </div>

          <div>
            <div className="relative">
              <span className={fieldLabel}>Add Guests</span>
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="@Anas Mohamed"
                disabled={guests.length > 0}
                className={`${fieldBox} pr-24 disabled:cursor-not-allowed disabled:opacity-60`}
                list="create-task-users"
              />
              <datalist id="create-task-users">
                {matches.map((u) => (
                  <option key={u.id} value={u.name} />
                ))}
              </datalist>
              <button
                type="button"
                disabled={guests.length > 0}
                onClick={() => {
                  const u = users.find((x) => x.name.toLowerCase() === guess.trim().toLowerCase());
                  if (u) {
                    setGuests([u]);
                    setGuess("");
                  }
                }}
                className="absolute right-4 top-1/2 flex h-[30px] w-[113px] -translate-y-1/2 items-center justify-center gap-1.5 rounded-full bg-[#27272B] text-sm font-medium text-white disabled:opacity-50"
              >
                Add
                <svg width="9.33" height="9.33" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 1v8M1 5h8" />
                </svg>
              </button>
            </div>
            {/* A5.3 accepts exactly one assigned_to, so the picker stops at
                one and says why instead of silently dropping extra guests. */}
            {guests.length ? (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 items-center">
                  {guests.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      title={`Remove ${m.name}`}
                      aria-label={`Remove ${m.name}`}
                      onClick={() => setGuests([])}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-[#C2C2C2] bg-[#F6F8FA] text-xs text-[#000712]"
                    >
                      {m.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.avatar_url} alt={m.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        m.name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
                      )}
                    </button>
                  ))}
                </div>
                <span className={`${SANS} text-xs text-[#718096]`}>One assignee per task</span>
              </div>
            ) : null}
          </div>

          <div className="flex h-[163px] flex-col gap-4">
            <span className={`${SANS} block text-xs leading-[18px] text-[#718096]`}>Add Task Files</span>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex w-full flex-1 items-center justify-center gap-2 rounded-[4px] border-[0.5px] border-dashed border-[#718096] bg-white px-[36px] text-sm text-[#718096]"
            >
              <Upload size={14} strokeWidth={1.6} />
              {files.length ? files.map((f) => f.name).join(", ") : "Drag and drop files or click to upload"}
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </div>
        </div>

        {error ? <p className="text-sm text-[#af2622]">{error}</p> : null}

        {uploadFailures ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#af2622]">
              Task created, but {uploadFailures} file{uploadFailures > 1 ? "s" : ""} failed to upload. You can attach them again from the task later.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-full items-center justify-center rounded-[32px] bg-[#005AFB] px-5 py-[13px] text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={pending || created}
            className="flex h-10 w-full items-center justify-center rounded-[32px] bg-[#005AFB] px-5 py-[13px] text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create Task"}
          </button>
        )}
      </form>
    </div>
  );
}
