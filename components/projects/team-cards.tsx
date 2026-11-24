import { initials } from "@/lib/format";
import type { ProjectTeamProgress } from "@/lib/types";

/**
 * Team cards of the "All Projects / Alpha / teams" frame (node 181-1982),
 * wired to A4.4 (GET /projects/:id/teams). Geometry and type are read from
 * the native nodes: white cards (radius 16, 1px #F3F4F6 border, 16px bottom
 * padding, 20px internal gap), a 68px tinted band with 20px padding, the
 * team name in Inter Medium 20px, and a transparent 28px pill carrying the
 * completion text in Inter Regular 13px, colored per team. Member rows are
 * 40px tall with 16px gaps and 16px side padding: a 40px avatar, the name
 * (Inter Regular 14px #000712) with the role (Inter Regular 12px #4A4A4A),
 * and a 4px progress bar (#E6EFFF track, #005AFB fill) with the task count
 * (Inter Regular 12px). Member photos fall back to initials because the API
 * rarely carries avatar URLs.
 */

const SANS = "font-[family-name:var(--font-sans)]";

const BAND_TINTS: Record<string, string> = {
  "ui/ux": "#FAECF6",
  frontend: "#F2EAF2",
  backend: "#E6F8F7",
  marketing: "#E9E9EA",
};

const COMPLETION_COLORS: Record<string, string> = {
  "ui/ux": "#A43782",
  frontend: "#7D2D7E",
  backend: "#04B5AE",
  marketing: "#27272B",
};

export function TeamCards({ teams }: { teams: ProjectTeamProgress[] }) {
  return (
    <div className="mt-8 grid items-start gap-8 md:grid-cols-2 xl:grid-cols-4">
      {teams.map((team, i) => {
        const key = team.name?.toLowerCase() ?? "";
        return (
          <section
            key={team.id ?? i}
            className="flex flex-col gap-5 overflow-hidden rounded-2xl bg-white pb-4 ring-1 ring-[#F3F4F6]"
          >
            <header
              className={`${SANS} flex h-[68px] items-center justify-between px-5 text-xl font-medium text-[#000712]`}
              style={{ backgroundColor: BAND_TINTS[key] ?? "#F3F4F6" }}
            >
              {team.name}
              <span
                className={`${SANS} flex h-7 items-center rounded-full px-2 text-[13px] leading-[150%]`}
                style={{ color: COMPLETION_COLORS[key] ?? "#27272B" }}
              >
                {team.completion_percentage}% Completed
              </span>
            </header>
            <div className={`${SANS} flex items-center justify-between px-4 text-[13px] text-[#4A4A4A]`}>
              <span>Name</span>
              <span>Tasks</span>
            </div>
            <ul className="flex flex-col gap-4 px-4">
              {(team.members ?? []).map((m, mi) => (
                <li key={`${m.id}-${mi}`} className="flex h-10 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#E9E9EA] bg-[#F6F8FA] text-[10px] text-[#000712]">
                    {m.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar_url} alt={m.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      initials(m.name)
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-[3px]">
                    <span className={`${SANS} flex items-baseline gap-2 text-sm leading-tight text-[#000712]`}>
                      <span className="truncate">{m.name}</span>
                      <span className={`${SANS} truncate text-xs text-[#4A4A4A]`}>{m.role_in_team}</span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="block h-1 w-[172px] max-w-full overflow-hidden rounded-full bg-[#E6EFFF]">
                        <span
                          className="block h-full rounded-full bg-[#005AFB]"
                          style={{ width: `${Math.min(100, Math.max(0, m.progress_percentage ?? 0))}%` }}
                        />
                      </span>
                      <span className={`${SANS} shrink-0 text-xs leading-4 text-[#000712]`}>
                        {m.tasks_ratio ?? `${m.tasks_completed}/${m.tasks_total}`}
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {teams.length === 0 ? <p className={`${SANS} text-sm text-[#718096]`}>No teams assigned yet.</p> : null}
    </div>
  );
}
