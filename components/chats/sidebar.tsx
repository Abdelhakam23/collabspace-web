import Link from "next/link";
import type { Message, Project } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

export interface ChannelPreview {
  project: Project;
  latest: Message | null;
}

function previewTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Chats sidebar card (drawn sidebar 415x942 at left 65/top 104: white, 16px
 * radius, 16px padding, 24px gaps): the H2 title row with the search icon,
 * the inbox / Project Chats tabs, and the project channel list.
 *
 * Scope notes:
 * - The API has no channel concept, so the drawn channel sub-labels
 *   ("Public Channel", "Frontend Team Channel") are omitted; each project is
 *   one conversation.
 * - The drawn search icon has no message-search parameter in the API, so it
 *   is disabled with a reason.
 * - The drawn "inbox" tab holds direct messages; there is no DM endpoint, so
 *   the tab is disabled with a reason.
 * - Tab text, row text and time styles are estimated (unmeasured in the
 *   source); geometry comes from the drawn frames.
 */
export function ChatsSidebar({ channels, activeId }: { channels: ChannelPreview[]; activeId?: number }) {
  return (
    <aside className="flex w-full max-w-[415px] shrink-0 flex-col gap-6 self-start rounded-2xl bg-white p-4">
      <div className="flex h-12 items-center justify-between">
        <h2 className={`${SANS} text-[49px] font-semibold leading-[150%] text-[#222222]`}>Chats</h2>
        <button
          type="button"
          disabled
          title="Message search is not documented in the API"
          className="cursor-not-allowed text-[#000712] opacity-40"
          aria-label="Search messages (unavailable)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled
          title="Direct messages are not documented in the API"
          className={`${SANS} flex h-12 cursor-not-allowed items-center rounded-2xl px-4 text-left text-[18px] font-medium text-[#606C80] opacity-40`}
        >
          inbox
        </button>
        <div className={`${SANS} flex h-12 items-center rounded-2xl bg-[#F6F8FA] px-4 text-[18px] font-semibold text-[#000712]`}>
          Project Chats
        </div>
      </div>
      <div className="flex flex-col">
        {channels.length === 0 ? (
          <p className={`${SANS} px-2 py-6 text-sm text-[#606C80]`}>No projects yet.</p>
        ) : (
          channels.map(({ project, latest }) => {
            const active = project.id === activeId;
            return (
              <Link
                key={project.id}
                href={`/chats/${project.id}`}
                className={`flex min-h-[96px] flex-col justify-center gap-1 rounded-lg px-3 py-3 transition-colors ${
                  active ? "bg-[#F6F8FA]" : "hover:bg-[#F6F8FA]"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`${SANS} truncate text-[16px] font-semibold text-[#000712]`}>{project.name}</span>
                  {latest ? (
                    <span className={`${SANS} shrink-0 text-[12px] text-[#606C80]`}>{previewTime(latest.created_at)}</span>
                  ) : null}
                </div>
                {latest ? (
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#005AFB] text-[9px] font-semibold text-white">
                      {initials(latest.user?.name ?? "?")}
                    </span>
                    <span className={`${SANS} truncate text-[12px] text-[#606C80]`}>{latest.body}</span>
                  </div>
                ) : (
                  <span className={`${SANS} text-[12px] text-[#606C80]`}>No messages yet</span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
