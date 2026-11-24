"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { NewProjectOverlay } from "@/components/projects/new-project-overlay";
import { listProjects } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import type { Project } from "@/lib/types";

/**
 * All Projects list (frame 114-1915) wired to A4.1. Filter/sort controls
 * are design-only and stay inert; native table geometry and sampled-value
 * disclosures: docs/design-api-gaps.md.
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
  // The frame's project badge is the "Bag-Suitcase-1" glyph from the public
  // Streamline Core set (layer name Bag-Suitcase-1--Streamline-Core), drawn
  // 16x16 centered in a 32px tile; stroke color sampled from the frame
  // (Support colors/Violet 2, #7D2D7E).
  return (
    <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[#F7EFF7]">
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="#7D2D7E" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12.5 3.5h-11a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1M5 .5h4a1 1 0 0 1 1 1v2H4v-2a1 1 0 0 1 1-1M3.5 7h7m-7 3h7" />
      </svg>
    </span>
  );
}

function FileIcon() {
  // The frame's files glyph is "mdi-light:file" (layer name mdi-light:file),
  // a 20x20 vector; orange fill pixel-sampled from the frame capture
  // (~#F8B040, disclosed in docs/design-api-gaps.md).
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#F8B040" aria-hidden="true">
      <path d="M14 11a3 3 0 0 1-3-3V4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-8zm-2-3a2 2 0 0 0 2 2h3.59L12 4.41zM7 3h5l7 7v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3" />
    </svg>
  );
}

function DotsIcon() {
  // Trailing row affordance: "pepicons-pencil:dots-y", 24x24, fill #000712
  // (fill read from the vector's native properties).
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="#000712" aria-hidden="true">
      <path d="M9 15.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.249 1.249 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0" />
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
      <main className="px-4 pt-10 sm:px-8 lg:px-16 lg:pt-[41px]">
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

        <div className="mt-[31px] flex items-center justify-between gap-4">
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

        {/* Table per native reads: vertical list, gap 16, header Hug 59
            (border-bottom 1px #BCBCBD, padding T4 B8) and rows Hug 60 (white,
            padding T4 B4, justify space-between, no horizontal padding; the seven 184px cells pack from the left at 184px pitch) each
            holding seven equal Fill cells (header 181.71px, rows 184px) with 10px cell padding, plus the
            header's trailing 40x40 bordered box. Because header and row cell
            widths differ by design, header labels and row values sit a few
            pixels apart - that offset is drawn, not a defect. */}
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center border-b border-[#BCBCBD] pb-2 pt-1">
            {["Project Name", "Start Date", "Deadline", "Status", "Files", "Teams", "Priority"].map((h) => (
              <span key={h} className={`${SANS} flex-1 p-[10px] text-left text-[18px] font-medium leading-[150%] text-[#000712]`}>
                {h}
              </span>
            ))}
            <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-lg border border-[#27272B]" />
          </div>
          {(projects ?? []).filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())).map((p) => {
            const members = (p.teams ?? []).flatMap((t) => t.members ?? []);
            const cell = "flex w-[184px] items-center p-[10px]";
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex h-[60px] items-center border-b border-[#F3F4F6] bg-white py-1"
              >
                <span className={cell}>
                  <span className="flex items-center gap-[8px]">
                    <ProjectIcon />
                    <span className={`${SANS} text-sm text-[#000712]`}>{p.name}</span>
                  </span>
                </span>
                <span className={cell}>
                  <span className={`${SANS} text-sm text-[#000712]`}>{p.start_date ?? ""}</span>
                </span>
                <span className={cell}>
                  <span className={`${SANS} text-sm text-[#000712]`}>{p.deadline ?? ""}</span>
                </span>
                <span className={cell}>
                  <span className={`${SANS} text-sm`} style={{ color: STATUS_COLORS[p.status] ?? "#000712" }}>
                    {p.status === "Completed" ? "Done" : p.status.toLowerCase()}
                  </span>
                </span>
                <span className="flex w-[184px] items-center gap-[8px] py-[10px]">
                  <FileIcon />
                  <span className={`${SANS} text-sm text-[#000712]`}>{p.files_count ?? 0} Files</span>
                </span>
                <span className={cell}>
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
                </span>
                <span className={cell}>
                  <span className={`${SANS} text-sm`} style={{ color: PRIORITY_COLORS[p.priority] ?? "#000712" }}>
                    {p.priority}
                  </span>
                </span>
                <DotsIcon />
              </Link>
            );
          })}
          {projects !== null && projects.length === 0 ? (
            <div className={`${SANS} border-b border-[#F3F4F6] bg-white px-3 py-6 text-sm text-[#718096]`}>
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
