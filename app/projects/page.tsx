"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { NewProjectOverlay } from "@/components/projects/new-project-overlay";
import { listProjects } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import type { Project } from "@/lib/types";

/**
 * All Projects from the final hi-fi "All Projects" frame (UI Design page,
 * node 114-1915, 1440x1024), wired to GET /api/v1/projects (A4.1, read-only).
 *
 * Native properties read in Figma: page BG #F6F8FA; title Team C Text/H4
 * (Inter 600 31px, #000712, cap-height trim); search box 326x40, radius 100,
 * 1px border in BG label #F3F4F6, white fill, placeholder Rubik 400 14px
 * #000712; Add Project = Primary button (hug ~135x40, radius 32, padding
 * 12/12/12/20, gap 8, Inter 500 14px white on #005AFB, plus icon right);
 * filter labels Rubik 400 12px #000712 with a 10x5 chevron (1.5 border);
 * column headers Inter 500 18px #000712; rows Fill 1312 x hug 60, white,
 * space-between, 1px bottom border; cell text Team C Text/small Body r
 * (Inter 400 14px #000712); status active = Support colors/Redish/Normal
 * #FA2B75, Done = Support colors/Green/Normal #2BA52E; priority High =
 * Support colors/Red/Normal #DB302A, Medium = Support colors/Yellow/Normal
 * #E6BA0E; team avatars 23.73px, radius 17.8, 1.48px border #C2C2C2.
 * Column x positions are pixel-measured at 46% zoom (the row uses auto
 * layout with space-between, so no absolute offsets are exposed).
 *
 * Scope (design x API): the toolbar search filters the loaded rows
 * client-side (frontend-only behavior; A4.1 documents no search parameter).
 * Both filter dropdowns stay inert - the file does not show their contents.
 * Filter dropdowns (frame 2147224288): Hug x 40px, radius 16, border 1px
 * secodary-500 #27272B, padding 16/10, gap 10, label Rubik 400 12px #000712,
 * chevron 10x5 with 1.5px #000712 stroke - all native reads. Earlier
 * pixel-sampled values superseded.
 * zoom, not native reads. Add Project opens the New Project overlay
 * (node 139-2255), wired to POST /projects (A4.2). Add Project opens an overlay in the file; the
 * overlay frame has not been extracted yet, so the button is rendered but
 * inert for now. Statuses/priorities beyond the two drawn samples render
 * in the default text color until their design treatment is known.
 */

const SANS = "font-[family-name:var(--font-sans)]";
const RUBIK = "font-[family-name:var(--font-rubik)]";

const STATUS_COLORS: Record<string, string> = { Active: "#FA2B75", Completed: "#2BA52E" };
const PRIORITY_COLORS: Record<string, string> = { High: "#DB302A", Medium: "#E6BA0E" };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProjectIcon() {
  // Approximation of the frame's violet project glyph (Support colors/Violet 2
  // #7D2D7E strokes); the original vector is not exportable from a view-only file.
  return (
    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-[#F7EFF7]">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7D2D7E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    </span>
  );
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000712" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="10" height="5" viewBox="0 0 10 5" fill="none" stroke="#000712" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m1 1 4 3 4-3" />
    </svg>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, profile] = await Promise.all([
          listProjects({ page: 1, per_page: 15, sort: "newest" }),
          getProfile(),
        ]);
        if (cancelled) return;
        setProjects(list.data.data);
        const u = (profile.data as { user?: { name?: string; roles?: string[] } }).user;
        setUserName(u?.name ?? "");
        setUserRole(u?.roles?.[0]);
      } catch {
        if (!cancelled) setProjects([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={userName} userRole={userRole} active="Projects" />
      <main className="px-4 pt-10 sm:px-8 lg:px-16 lg:pt-[36px]">
        <div className="flex items-center justify-between gap-4">
          <h1
            className={`${SANS} text-[31px] font-semibold leading-[150%] text-[#000712]`}
            style={{ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as React.CSSProperties}
          >
            All Projects
          </h1>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className={`${SANS} flex items-center gap-2 rounded-[32px] bg-[#005AFB] py-3 pl-5 pr-3 text-sm font-medium text-white`}
          >
            Add Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div className="mt-[36px] flex items-center justify-between gap-4">
          {/* Search and filters: drawn in the frame, but A4.1 documents no
              search parameter and the dropdown contents are not designed, so
              both stay inert (docs/design-api-gaps.md). */}
          <label
            className={`${RUBIK} flex h-10 w-full max-w-[326px] items-center gap-2 rounded-full border border-[#F3F4F6] bg-white pl-4 pr-1 text-sm text-[#000712]`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input type="search" placeholder="Search" aria-label="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#000712]" />
          </label>
          <div className="flex items-center gap-3">
            {["All Projects", "Newest"].map((label) => (
              <span
                key={label}
                aria-disabled="true"
                title="Filter options are not designed yet"
                className={`${RUBIK} flex h-10 items-center gap-[10px] rounded-2xl border border-[#27272B] bg-white pl-4 pr-[10px] text-xs text-[#000712]`}
              >
                {label}
                <Chevron />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-[27px]">
          <div className="grid grid-cols-[171px_184px_178px_180px_184px_176px_1fr] items-center border-b border-[#E8E9EB] pl-[28px]">
            {["Project Name", "Start Date", "Deadline", "Status", "Files", "Teams", "Priority"].map((h) => (
              <span key={h} className={`${SANS} py-4 text-[18px] font-medium leading-[150%] text-[#000712]`}>
                {h}
              </span>
            ))}
          </div>
          {(projects ?? []).filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())).map((p) => {
            const members = (p.teams ?? []).flatMap((t) => t.members ?? []);
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="grid h-[60px] grid-cols-[171px_184px_178px_180px_184px_176px_1fr] items-center border-b border-[#F3F4F6] bg-white py-1 pl-[28px] [&>*:first-child]:pl-7"
              >
                <span className="flex items-center gap-2">
                  <ProjectIcon />
                  <span className={`${SANS} text-sm text-[#000712]`}>{p.name}</span>
                </span>
                <span className={`${SANS} text-sm text-[#000712]`}>{p.start_date ?? ""}</span>
                <span className={`${SANS} text-sm text-[#000712]`}>{p.deadline ?? ""}</span>
                <span className={`${SANS} text-sm`} style={{ color: STATUS_COLORS[p.status] ?? "#000712" }}>
                  {p.status === "Completed" ? "Done" : p.status.toLowerCase()}
                </span>
                <span className="flex items-center gap-2">
                  <FolderIcon />
                  <span className={`${SANS} text-sm text-[#000712]`}>{p.files_count ?? 0} Files</span>
                </span>
                <span className="flex items-center">
                  {members.slice(0, 4).map((m, i) => (
                    <span
                      key={m.id}
                      className={`${SANS} flex h-[23.73px] w-[23.73px] items-center justify-center rounded-full border-[1.48px] border-[#C2C2C2] bg-[#F6F8FA] text-[9px] text-[#000712] ${i > 0 ? "-ml-1.5" : ""}`}
                      title={m.user.name}
                    >
                      {m.user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.user.avatar_url} alt={m.user.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        initials(m.user.name)
                      )}
                    </span>
                  ))}
                </span>
                <span className={`${SANS} text-sm`} style={{ color: PRIORITY_COLORS[p.priority] ?? "#000712" }}>
                  {p.priority}
                </span>
              </Link>
            );
          })}
          {projects !== null && projects.length === 0 ? (
            <div className={`${SANS} border-b border-[#F3F4F6] bg-white py-6 pl-[34px] text-sm text-[#718096]`}>
              No projects yet.
            </div>
          ) : null}
        </div>
      </main>
      {showNew ? (
        <NewProjectOverlay
          onClose={() => setShowNew(false)}
          onCreated={() => {
            listProjects({ page: 1, per_page: 15, sort: "newest" })
              .then((list) => setProjects(list.data.data))
              .catch(() => {});
          }}
        />
      ) : null}
    </div>
  );
}
