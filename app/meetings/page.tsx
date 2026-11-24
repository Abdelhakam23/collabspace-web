"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { WeekGrid } from "@/components/meetings/week-grid";
import { DurationMenu } from "@/components/meetings/duration-menu";
import { AddMeetingOverlay } from "@/components/meetings/add-meeting-overlay";
import { listMeetings } from "@/lib/api/meetings";
import { getProfile } from "@/lib/api/profile";
import type { Meeting, User } from "@/lib/types";

/**
 * "Meetings" frame (node 114-2597, 1440x1024, page background #F6F8FA):
 * navbar with the Meetings pill active, the H1 row (native: Inter 600 31px
 * at top 120/left 65 with the #005AFB Add Meeting pill, 32px radius), the
 * toolbar row (top 202: month label Inter 500 20px #000712 and the
 * time-filter control), and the week grid (top 281) fed by A6.1 with the
 * documented time_filter=upcoming. The grid displays exactly the five
 * days the selected "Upcoming" option covers (renamed from the drawn
 * "This Week" with the user's sign-off, 2026-11-24); returned meetings
 * beyond those days are flagged
 * under the grid as an unresolved reach limitation (no drawn control or
 * documented API value can page to them). The frame's month arrows have no
 * matching API (the list takes no date range), so they are disabled with an
 * explanation instead of navigating a grid that could never fill; the label
 * shows the real current month. Add Meeting opens the A6.2 overlay.
 */

const SANS = "font-[family-name:var(--font-sans)]";

export default function MeetingsPage() {
  const [me, setMe] = useState<User | null>(null);
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);

  const load = useCallback(
    () =>
      // Promise callbacks keep the state updates asynchronous (react-hooks
      // set-state-in-effect): the effect below only kicks off the fetch.
      Promise.all([listMeetings({ time_filter: "upcoming", per_page: 15 }), getProfile()]).then(
        ([list, profile]) => {
          setMeetings(list.data.data ?? []);
          setMe(profile.data.user);
        },
        () => setError(true),
      ),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const arrowClass = "cursor-not-allowed p-1 text-[#000712] opacity-40";
  const arrowTitle = "Month navigation is not documented in the meetings API";

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Meetings" />
      <main className="px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[44px]">
        <div className="flex max-w-[1311px] items-center justify-between gap-8">
          <h1 className={`${SANS} text-[31px] font-semibold leading-[150%] text-black`}>Meetings</h1>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={`${SANS} flex h-10 items-center gap-2 rounded-[32px] bg-[#005AFB] py-3 pl-5 pr-3 text-sm font-medium leading-none text-white`}
          >
            Add Meeting
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <div className="mt-[42px] flex max-w-[1311px] items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <button type="button" disabled title={arrowTitle} aria-label="Previous month" className={arrowClass}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className={`${SANS} text-[20px] font-medium leading-[150%] text-[#000712]`}>{monthLabel}</span>
            <button type="button" disabled title={arrowTitle} aria-label="Next month" className={arrowClass}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <DurationMenu />
        </div>

        {error ? (
          <p className="mt-8 text-sm text-[#af2622]" role="alert">Could not load meetings. Please try again.</p>
        ) : meetings ? (
          <WeekGrid meetings={meetings} />
        ) : (
          <p className={`${SANS} mt-8 text-sm text-[#718096]`}>Loading meetings...</p>
        )}
      </main>
      {adding ? <AddMeetingOverlay onClose={() => setAdding(false)} onCreated={load} /> : null}
    </div>
  );
}
