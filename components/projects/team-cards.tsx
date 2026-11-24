import { initials } from "@/lib/format";
import type { ProjectTeamProgress } from "@/lib/types";

/**
 * Team cards of the "All Projects / Alpha / teams" frame (node 181-1982),
 * wired to A4.4 (GET /projects/:id/teams). Band tints are pixel-sampled from
 * the 46% capture (docs/design-api-gaps.md); member photos fall back to
 * initials because the API rarely carries avatar URLs.
 */

const SANS = "font-[family-name:var(--font-sans)]";

const BAND_TINTS: Record<string, string> = {
  "ui/ux": "#FAECF6",
  frontend: "#F2EAF2",
  backend: "#E6F8F7",
  marketing: "#E9E9EA",
};

export function TeamCards({ teams }: { teams: ProjectTeamProgress[] }) {
  return (
    <div className="mt-8 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
      {teams.map((team, i) => (
        <section key={team.id ?? i} className="overflow-hidden rounded-[12px] bg-white ring-1 ring-[#F3F4F6]">
          <header
            className={`${SANS} flex items-center justify-between px-4 py-3 text-sm font-medium text-[#191919]`}
            style={{ backgroundColor: BAND_TINTS[team.name?.toLowerCase()] ?? "#F3F4F6" }}
          >
            {team.name}
            <span className={`${SANS} rounded-full bg-white px-2 py-1 text-[11px] font-medium text-[#2BA52E]`}>
              {team.completion_percentage}% Completed
            </span>
          </header>
          <div className="flex items-center justify-between px-4 pt-3 text-[11px] font-medium uppercase tracking-wide text-[#718096]">
            <span>Name</span>
            <span>Tasks</span>
          </div>
          <ul className="flex flex-col px-4 pb-4 pt-2">
            {(team.members ?? []).map((m, mi) => (
              <li key={`${m.id}-${mi}`} className="flex items-center gap-3 border-b border-[#F3F4F6] py-2 last:border-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#E9E9EA] bg-[#F6F8FA] text-[10px] text-[#000712]">
                  {m.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatar_url} alt={m.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    initials(m.name)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`${SANS} flex items-baseline gap-2 text-[13px] text-[#191919]`}>
                    <span className="truncate">{m.name}</span>
                    <span className={`${SANS} truncate text-[10px] text-[#718096]`}>{m.role_in_team}</span>
                  </span>
                  <span className="mt-1 block h-[4px] w-full overflow-hidden rounded-full bg-[#E6EFFF]">
                    <span
                      className="block h-full rounded-full bg-[#005AFB]"
                      style={{ width: `${Math.min(100, Math.max(0, m.progress_percentage ?? 0))}%` }}
                    />
                  </span>
                </span>
                <span className={`${SANS} shrink-0 text-[11px] text-[#4A4A4A]`}>{m.tasks_ratio ?? `${m.tasks_completed}/${m.tasks_total}`}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {teams.length === 0 ? <p className={`${SANS} text-sm text-[#718096]`}>No teams assigned yet.</p> : null}
    </div>
  );
}
