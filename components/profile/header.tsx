import Link from "next/link";
import type { User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

export type ProfileTab = "overview" | "tasks" | "files";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function joined(user: User): string | null {
  const date = new Date(user.created_at);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Profile header (drawn 1313x92 hug card, 13px radius, 20px gap): avatar
 * with the camera badge linking to the settings screen, name, job title and
 * join date, then the Completed Tasks and Hours Worked stat cards and the
 * Overview / Tasks / Files tabs. The stats come from the personal
 * productivity report through the fail-closed extractor and render as "Not
 * available" when the payload does not carry them unambiguously. Tab text
 * styles are estimated (unmeasured).
 */
export function ProfileHeader({
  user,
  completedTasks,
  hoursWorked,
  tab,
  onTab,
}: {
  user: User;
  completedTasks: number | null;
  hoursWorked: number | null;
  tab: ProfileTab;
  onTab: (tab: ProfileTab) => void;
}) {
  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks" },
    { id: "files", label: "Files" },
  ];
  return (
    <div className="flex w-full max-w-[1311px] flex-col rounded-[13px] bg-white p-5">
      <div className="flex flex-wrap items-center gap-5">
        <Link href="/profile/settings" title="Edit profile" className="relative block h-16 w-16 shrink-0">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#005AFB] text-lg font-semibold text-white">
              {initials(user.name)}
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#005AFB] text-white">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
        </Link>
        <div className="min-w-[200px]">
          <h1 className={`${SANS} text-[18px] font-semibold text-[#000712]`}>{user.name}</h1>
          <p className={`${SANS} text-[13px] text-[#606C80]`}>
            {user.job_title ?? user.roles[0] ?? ""}
            {joined(user) ? <>&nbsp;&nbsp;|&nbsp;&nbsp;Join {joined(user)}</> : null}
          </p>
        </div>
        <div className="flex flex-1 flex-wrap justify-end gap-6">
          <div className="flex items-center gap-3">
            <div>
              <p className={`${SANS} text-[12px] text-[#606C80]`}>Completed Tasks</p>
              <p className={`${SANS} text-[20px] font-semibold text-[#000712]`}>
                {completedTasks === null ? "Not available" : completedTasks}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className={`${SANS} text-[12px] text-[#606C80]`}>Hours Worked</p>
              <p className={`${SANS} text-[20px] font-semibold text-[#000712]`}>
                {hoursWorked === null ? "Not available" : hoursWorked}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-6 border-t border-[#E6EBF0] pt-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            className={`${SANS} text-[14px] ${
              tab === t.id ? "font-semibold text-[#005AFB] underline underline-offset-8" : "text-[#606C80] hover:text-[#000712]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
