"use client";

import { useEffect, useRef, useState } from "react";
import { createProject } from "@/lib/api/projects";
import { uploadFileToProject } from "@/lib/api/files";
import { listUsers } from "@/lib/api/users";
import type { TaskPriority, User } from "@/lib/types";

/**
 * "New Project overlya" frame (UI Design page, node 139-2255), opened from
 * the All Projects toolbar button whose interaction targets this overlay.
 * Native reads: 720 x Hug(661), vertical, radius 16, padding 24, gap 32,
 * white fill, drop shadow 0/8/16 #000000@16%; title Team C Text/H5 (Inter
 * 500 25px #000712, cap-height trim); close glyph 13.15px #000000; field
 * labels Small Caption 12px #718096; placeholders small Body 14px #718096;
 * member avatars 40px radius 30 with 2.5px #C2C2C2 border; upload zone
 * Fill 672 x 129, radius 4, dashed 0.5px #718096, padding 36; submit =
 * Primary button Fill 672 x Hug 40, radius 32, padding 13/20, #005AFB,
 * Inter 500 14px white. Input containers reuse the file's input component
 * styling (their own container reads kept resolving to the frame itself).
 *
 * Wiring (A4.2 POST /projects, then A7.2 POST /files per selected file):
 * name, priority, start_date, deadline ("End Date") and members come from
 * the form. The payload's required `status` and `description` fields have
 * no counterpart in the design: status is sent as "Active" and description
 * as empty, both flagged in docs/design-api-gaps.md. The priority options
 * are the API's documented TaskPriority values; the file shows only "High".
 */

const SANS = "font-[family-name:var(--font-sans)]";
const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];

const fieldLabel = `${SANS} text-xs text-[#718096]`;
const fieldBox = `${SANS} h-[56px] w-full rounded-[12px] border border-[#CBD5E0] bg-[#F9FAFB] px-4 text-sm text-[#000712] outline-none placeholder:text-[#718096]`;

export function NewProjectOverlay({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [guess, setGuess] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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
    (u) => guess.trim() && u.name.toLowerCase().includes(guess.trim().toLowerCase()) && !members.some((m) => m.id === u.id),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await createProject({
        name,
        description: "",
        start_date: startDate,
        deadline,
        priority,
        status: "Active",
        teams: "",
        members: "",
        "members[].user_id": members[0]?.id ?? 0,
        "members[].role": members[0]?.roles?.[0] ?? "Member",
      });
      const created = (res.data as { project?: { id?: number } }).project;
      for (const f of files) {
        if (created?.id) await uploadFileToProject({ file: f, project_id: String(created.id), name: f.name });
      }
      onCreated();
      onClose();
    } catch {
      setError("Could not create the project. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="New Project">
      <form
        onSubmit={onSubmit}
        className={`${SANS} flex max-h-[90vh] w-full max-w-[720px] flex-col gap-8 overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_8px_16px_rgba(0,0,0,0.16)]`}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-[25px] font-medium leading-[150%] text-[#000712]"
            style={{ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as React.CSSProperties}
          >
            New Project
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-black">
            <svg width="13.15" height="13.15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="m1 1 12 12M13 1 1 13" />
            </svg>
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={fieldLabel}>Project Name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" className={`${fieldBox} mt-1`} />
          </label>
          <label className="block">
            <span className={fieldLabel}>Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={`${fieldBox} mt-1 appearance-none`}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <span className={fieldLabel}>Add Guess</span>
          <div className="mt-1 flex items-center gap-3">
            <input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="@Anas Mohamed" className={fieldBox} list="new-project-users" />
            <datalist id="new-project-users">
              {matches.map((u) => (
                <option key={u.id} value={u.name} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={() => {
                const u = users.find((x) => x.name.toLowerCase() === guess.trim().toLowerCase());
                if (u) {
                  setMembers((m) => [...m, u]);
                  setGuess("");
                }
              }}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-[12px] bg-[#000712] px-4 text-sm font-medium text-white"
            >
              Add
              <svg width="9.33" height="9.33" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M5 1v8M1 5h8" />
              </svg>
            </button>
          </div>
          {members.length ? (
            <div className="mt-3 flex items-center gap-[12.5px]">
              {members.map((m) => (
                <span key={m.id} title={m.name} className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-[#C2C2C2] bg-[#F6F8FA] text-xs text-[#000712]">
                  {m.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatar_url} alt={m.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    m.name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
                  )}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={fieldLabel}>Start Date</span>
            <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${fieldBox} mt-1`} />
          </label>
          <label className="block">
            <span className={fieldLabel}>End Date</span>
            <input required type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={`${fieldBox} mt-1`} />
          </label>
        </div>

        <div>
          <span className={fieldLabel}>Add Project Files</span>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-1 flex h-[129px] w-full items-center justify-center rounded-[4px] border-[0.5px] border-dashed border-[#718096] bg-white p-9 text-sm text-[#718096]"
          >
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

        {error ? <p className="text-sm text-[#af2622]">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="flex h-10 w-full items-center justify-center rounded-[32px] bg-[#005AFB] px-5 py-[13px] text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Adding..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}
