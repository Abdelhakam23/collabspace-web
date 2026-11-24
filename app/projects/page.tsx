"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { NewProjectOverlay } from "@/components/projects/new-project-overlay";
import { TinyChevron } from "@/components/projects/tiny-chevron";
import { listProjects } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import { initials } from "@/lib/format";
import { PROJECT_COLORS } from "@/lib/colors";
import type { Project } from "@/types";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/constants/projects";

const SANS = "font-[family-name:var(--font-sans)]";
const RUBIK = "font-[family-name:var(--font-rubik)]";


function ProjectIcon({ color }: { color: string }) {
  return (
    <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px]" style={{ backgroundColor: `${color}1A`, color }}>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12.5 3.5h-11a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1M5 .5h4a1 1 0 0 1 1 1v2H4v-2a1 1 0 0 1 1-1M3.5 7h7m-7 3h7" />
      </svg>
    </span>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#F8B040" aria-hidden="true">
      <path d="M14 11a3 3 0 0 1-3-3V4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-8zm-2-3a2 2 0 0 0 2 2h3.59L12 4.41zM7 3h5l7 7v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="#000712" aria-hidden="true">
      <path d="M9 15.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.249 1.249 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0" />
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
                className={`${RUBIK} flex h-10 shrink-0 items-center gap-[10px] whitespace-nowrap rounded-2xl border border-[#27272B] bg-white pl-4 pr-[10px] text-xs text-[#000712]`}
              >
                {label}
                <span className="text-[#000712]"><TinyChevron /></span>
              </span>
            ))}
          </div>
        </div>

                <div className="mt-5 overflow-x-auto xl:overflow-visible"><div className="flex min-w-[1312px] flex-col xl:min-w-0 gap-4">
          <div className="flex items-center border-b border-[#BCBCBD] pb-2 pt-1">
            {["Project Name", "Start Date", "Deadline", "Status", "Files", "Teams", "Priority"].map((h) => (
              <span key={h} className={`${SANS} flex-1 p-[10px] text-left text-[18px] font-medium leading-[150%] text-[#000712]`}>
                {h}
              </span>
            ))}
          </div>
          {(projects ?? []).filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())).map((p, idx) => {
            const members = (p.teams ?? []).flatMap((t) => t.members ?? []);
            const cell = "flex w-[184px] items-center xl:w-auto xl:min-w-0 xl:flex-1 p-[10px]";
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex h-[60px] items-center border-b border-[#F3F4F6] bg-white py-1"
              >
                <span className={cell}>
                  <span className="flex items-center gap-[8px]">
                    <ProjectIcon color={PROJECT_COLORS[idx % PROJECT_COLORS.length]} />
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
                <span className="flex w-[184px] items-center gap-[8px] xl:w-auto xl:min-w-0 xl:flex-1 py-[10px]">
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
