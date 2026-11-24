"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listProjectMessages, sendMessage } from "@/lib/api/messages";
import type { Message, Project } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function messageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

const DISABLED_ICON =
  "cursor-not-allowed text-[#000712] opacity-40";

/**
 * Conversation pane (drawn open-chat state, 864px wide): a white header card
 * (16px radius/padding/gap) with the conversation title and the icon cluster,
 * the message list, and the composer (white, 16px radius, 24px/16px padding)
 * with the paperclip and the blue send button.
 *
 * Scope notes:
 * - The header title uses the project name; the drawn channel label
 *   ("Public Channel") has no API counterpart.
 * - Header search, phone, video and menu icons have no API endpoints, so
 *   they are disabled with reasons.
 * - The paperclip stays disabled: message attachments need an upload-then-
 *   send flow that is not wired yet (tracked in docs/screen-coverage.md).
 * - Send posts A8.2 with the message text only.
 */
export function Conversation({ project }: { project: Project }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await listProjectMessages(project.id, { per_page: 50 });
      const list = res.data.data ?? [];
      setMessages([...list].reverse());
    } catch {
      setError(true);
    }
  }, [project.id]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    try {
      const res = await sendMessage(project.id, { message: text });
      const created = res.data.message;
      setMessages((prev) => (prev ? [...prev, created] : [created]));
      setDraft("");
    } catch {
      // Keep the draft so the user can retry.
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <section className="flex w-full max-w-[864px] flex-1 flex-col gap-6">
      <header className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4">
        <h1 className={`${SANS} truncate text-[20px] font-semibold text-[#000712]`}>{project.name}</h1>
        <div className="flex items-center gap-4">
          <button type="button" disabled title="Message search is not documented in the API" className={DISABLED_ICON} aria-label="Search in conversation (unavailable)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button type="button" disabled title="Voice calls are not documented in the API" className={DISABLED_ICON} aria-label="Voice call (unavailable)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
          <button type="button" disabled title="Video calls are not documented in the API" className={DISABLED_ICON} aria-label="Video call (unavailable)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 10 6-3v10l-6-3" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
          </button>
          <button type="button" disabled title="Chat settings are not documented in the API" className={DISABLED_ICON} aria-label="Chat settings (unavailable)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex min-h-[300px] flex-1 flex-col gap-4 overflow-y-auto">
        {error ? (
          <p className={`${SANS} py-8 text-center text-sm text-[#606C80]`}>Messages could not be loaded.</p>
        ) : messages === null ? (
          <p className={`${SANS} py-8 text-center text-sm text-[#606C80]`}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className={`${SANS} py-8 text-center text-sm text-[#606C80]`}>No messages yet. Start the conversation below.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#005AFB] text-[12px] font-semibold text-white">
                {initials(msg.user?.name ?? "?")}
              </span>
              <div className="flex max-w-[420px] flex-col gap-1 rounded-2xl bg-white px-4 py-2">
                <div className="flex items-baseline gap-2">
                  <span className={`${SANS} text-[13px] font-semibold text-[#000712]`}>{msg.user?.name ?? "Unknown"}</span>
                  <span className={`${SANS} text-[11px] text-[#606C80]`}>{messageTime(msg.created_at)}</span>
                </div>
                <p className={`${SANS} whitespace-pre-wrap text-[14px] leading-[150%] text-[#222222]`}>{msg.body}</p>
                {msg.attachment ? (
                  <span className={`${SANS} mt-1 inline-flex w-fit items-center rounded-md bg-[#005AFB] px-2 py-0.5 text-[12px] text-white`}>
                    {msg.attachment.original_name ?? msg.attachment.name ?? "Attachment"}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              send();
            }
          }}
          placeholder="Write a message"
          className={`${SANS} h-8 flex-1 bg-transparent text-[14px] text-[#222222] outline-none placeholder:text-[#606C80]`}
          aria-label="Write a message"
        />
        <button type="button" disabled title="Message attachments are not wired yet" className={DISABLED_ICON} aria-label="Attach a file (unavailable)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <button
          type="button"
          onClick={send}
          disabled={sending || draft.trim().length === 0}
          title="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#005AFB] text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.4 20.4 21.85 12 3.4 3.6l-.01 6.53L14 12 3.39 13.87z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
