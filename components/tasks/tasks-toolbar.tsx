"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TinyChevron } from "@/components/projects/tiny-chevron";
import type { Project } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

export type TaskScope = "all" | "mine";

function Menu({
  open,
  onClose,
  align = "left",
  children,
}: {
  open: boolean;
  onClose: () => void;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <button type="button" aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
      <div
        role="menu"
        className={`absolute top-full z-50 mt-2 w-[210px] rounded-2xl bg-white p-4 shadow-lg ring-1 ring-[#E9E9EA] ${align === "right" ? "right-0" : "left-0"}`}
      >
        {children}
      </div>
    </>
  );
}

function MenuItem({
  label,
  active,
  disabled,
  title,
  onSelect,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      title={title}
      onClick={onSelect}
      className={`${SANS} flex h-7 w-full items-center rounded-md px-2 text-left text-[13px] ${
        disabled ? "cursor-not-allowed text-[#A0AEC0]" : active ? "font-medium text-[#005AFB]" : "text-[#191919] hover:bg-[#F6F8FA]"
      }`}
    >
      {label}
    </button>
  );
}

export function TasksToolbar({
  query,
  onQuery,
  projects,
  projectId,
  onProject,
  scope,
  onScope,
  onCreateTask,
}: {
  query: string;
  onQuery: (value: string) => void;
  projects: Project[];
  projectId: number | null;
  onProject: (id: number) => void;
  scope: TaskScope;
  onScope: (scope: TaskScope) => void;
  onCreateTask: () => void;
}) {
  const [openMenu, setOpenMenu] = useState<"project" | "scope" | null>(null);
  const close = () => setOpenMenu(null);
  const selected = projects.find((p) => p.id === projectId);

  return (
    <div className="flex h-11 items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <label
          className={`${SANS} flex h-10 w-[326px] items-center gap-1 rounded-full bg-[#E9E9EA] pl-4 pr-1 text-sm text-[#000712]`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search tasks on the loaded board"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#718096]"
          />
        </label>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={openMenu === "project"}
            onClick={() => setOpenMenu(openMenu === "project" ? null : "project")}
            className={`${SANS} flex h-11 items-center gap-[10px] rounded-2xl border border-[#27272B] bg-[#F6F8FA] p-[10px] text-[13px] text-[#000712]`}
          >
            {selected?.name ?? "Project"}
            <TinyChevron />
          </button>
          <Menu open={openMenu === "project"} onClose={close}>
            {projects.map((p) => (
              <MenuItem key={p.id} label={p.name} active={p.id === projectId} onSelect={() => { onProject(p.id); close(); }} />
            ))}
          </Menu>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={openMenu === "scope"}
            onClick={() => setOpenMenu(openMenu === "scope" ? null : "scope")}
            className={`${SANS} flex h-11 items-center gap-[10px] rounded-2xl border border-[#27272B] bg-[#F6F8FA] p-[10px] text-[13px] text-[#000712]`}
          >
            {scope === "mine" ? "My Tasks" : "All Tasks"}
            <TinyChevron />
          </button>
          <Menu open={openMenu === "scope"} onClose={close}>
            <MenuItem label="My Tasks" active={scope === "mine"} onSelect={() => { onScope("mine"); close(); }} />
            {["UIUX", "Front End", "Back End"].map((team) => (
              <MenuItem key={team} label={team} disabled title="Team filters are not supported by the tasks API" />
            ))}
            <MenuItem label="All Tasks" active={scope === "all"} onSelect={() => { onScope("all"); close(); }} />
          </Menu>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreateTask}
        className={`${SANS} flex h-10 items-center gap-2 rounded-[32px] bg-[#005AFB] pl-5 pr-4 text-sm font-medium text-white`}
      >
        Create Task <Plus size={14} />
      </button>
    </div>
  );
}
