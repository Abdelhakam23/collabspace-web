"use client";

import { useEffect, useRef, useState } from "react";
import { scheduleMeeting } from "@/lib/api/meetings";
import { listProjects } from "@/lib/api/projects";
import { listUsers } from "@/lib/api/users";
import { initials } from "@/lib/format";
import type { Project, User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";
const fieldLabel = `${SANS} absolute -top-[9px] left-4 z-10 bg-white px-1.5 text-xs text-[#718096]`;
const fieldBox = `${SANS} h-14 w-full rounded-[12px] border border-[#CBD5E0] bg-transparent px-4 py-2 text-sm text-[#000712] outline-none placeholder:text-[#718096]`;

const DURATIONS: { label: string; minutes: number }[] = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hour", minutes: 60 },
  { label: "1 hour 30 min", minutes: 90 },
  { label: "2 hours", minutes: 120 },
];

export function AddMeetingOverlay({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [guests, setGuests] = useState<User[]>([]);
  const [guess, setGuess] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  useEffect(() => {
    let cancelled = false;
    listUsers({ per_page: 15 })
      .then((res) => {
        if (!cancelled) setUsers((res.data as { data?: User[] }).data ?? []);
      })
      .catch(() => {});
    listProjects({ page: 1, per_page: 50, sort: "newest" })
      .then((res) => {
        if (!cancelled) setProjects(res.data.data ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const match = users.find((u) => guess.trim() && u.name.toLowerCase().includes(guess.trim().toLowerCase()) && !guests.some((m) => m.id === u.id));

  function addGuest() {
    if (match) {
      setGuests((current) => [...current, match]);
      setGuess("");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      const start = new Date(`${date}T${time}`);
      const end = new Date(start.getTime() + duration * 60_000);
      const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      await scheduleMeeting({
        title: subject,
        description: note,
        meeting_date: date,
        start_time: hhmm(start),
        end_time: hhmm(end),
        meeting_link: link,
        project_id: Number(projectId),
        participants: guests.map((g) => g.id),
      });
      onCreated();
      onClose();
    } catch {
      submitting.current = false;
      setError("Could not schedule the meeting. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="New Meeting">
      <form onSubmit={onSubmit} className="flex w-full max-w-[720px] flex-col gap-8 rounded-2xl bg-white p-6">
        <div className="flex items-start justify-between">
          <h2 className={`${SANS} text-[25px] font-medium leading-[150%] text-[#000712]`}>New Meeting</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-[#000712]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <label htmlFor="meeting-subject" className={fieldLabel}>Meeting Subject</label>
          <input id="meeting-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Meeting Subject" className={fieldBox} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <label htmlFor="meeting-date" className={fieldLabel}>Select Date</label>
            <input id="meeting-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={fieldBox} />
          </div>
          <div className="relative">
            <label htmlFor="meeting-time" className={fieldLabel}>Select Time</label>
            <input id="meeting-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={fieldBox} />
          </div>
          <div className="relative">
            <label htmlFor="meeting-duration" className={fieldLabel}>Select Duration</label>
            <select id="meeting-duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={fieldBox}>
              {DURATIONS.map((d) => (
                <option key={d.minutes} value={d.minutes}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <label htmlFor="meeting-project" className={fieldLabel}>Select Project</label>
            <select id="meeting-project" value={projectId} onChange={(e) => setProjectId(e.target.value)} required className={fieldBox}>
              <option value="" disabled>Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label htmlFor="meeting-link" className={fieldLabel}>Meeting Link</label>
            <input id="meeting-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} required placeholder="https://..." className={fieldBox} />
          </div>
        </div>

        <div>
          <div className="relative flex items-center gap-3">
            <label htmlFor="meeting-guests" className={fieldLabel}>Add Guests</label>
            <input
              id="meeting-guests"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="@Anas Mohamed"
              className={fieldBox}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGuest();
                }
              }}
            />
            <button
              type="button"
              onClick={addGuest}
              disabled={!match}
              className={`${SANS} flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#000712] px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40`}
            >
              Add
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          {guests.length ? (
            <div className="mt-3 flex items-center">
              {guests.map((user, i) => (
                <span
                  key={user.id}
                  title={user.name}
                  className={`${SANS} flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C2C2C2] bg-[#E2E8F0] text-xs font-semibold text-[#000712] ${i > 0 ? "-ml-2" : ""}`}
                >
                  {initials(user.name)}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <label htmlFor="meeting-note" className={fieldLabel}>Add Note</label>
          <textarea id="meeting-note" value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="The Goal of this meeting is ..." className={`${fieldBox} h-auto py-3`} />
        </div>

        {error ? <p className="text-sm text-[#af2622]" role="alert">{error}</p> : null}

        <button type="submit" disabled={pending} className={`${SANS} flex h-14 w-full items-center justify-center rounded-full bg-[#005AFB] text-sm font-medium text-white disabled:opacity-60`}>
          {pending ? "Adding..." : "Add Meeting"}
        </button>
      </form>
    </div>
  );
}
