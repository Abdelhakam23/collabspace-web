"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The "This Week" filter control from the Meetings frame plus its open
 * state, the "Duration overlay" (node 139-1583: 210x164 fixed, radius 16,
 * padding 16, white). The meetings list endpoint (A6.1) documents only
 * time_filter=upcoming, which is what "This Week" sends; the other drawn
 * options have no documented API value, so they render disabled and say why
 * instead of pretending to filter. The closed control's border color is
 * pixel-estimated as the shared input border #CBD5E0 (the native control is
 * too small to sample cleanly).
 */

const SANS = "font-[family-name:var(--font-sans)]";
const OPTIONS = ["Today", "This Week", "This Month", "Last Three Month", "This Year"];
const SELECTED = "This Week";

export function DurationMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`${SANS} flex h-[30px] items-center gap-1 rounded-full border border-[#CBD5E0] bg-white px-3 text-sm font-normal leading-[150%] text-[#27272B]`}
      >
        {SELECTED}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div role="listbox" aria-label="Meeting time filter" className="absolute right-0 z-40 mt-2 flex w-[210px] flex-col rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(9,30,66,0.16)]">
          {OPTIONS.map((option) =>
            option === SELECTED ? (
              <span key={option} role="option" aria-selected="true" className={`${SANS} flex items-center justify-between py-1 text-sm font-normal text-[#27272B]`}>
                {option}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2BA52E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            ) : (
              <span
                key={option}
                role="option"
                aria-selected="false"
                aria-disabled="true"
                title="The meetings API does not document this filter value"
                className={`${SANS} cursor-not-allowed py-1 text-sm font-normal text-[#27272B] opacity-40`}
              >
                {option}
              </span>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
