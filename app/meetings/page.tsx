"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { WeekGrid } from "@/components/meetings/week-grid";
import { DurationMenu } from "@/components/meetings/duration-menu";
import { AddMeetingOverlay } from "@/components/meetings/add-meeting-overlay";
import { listMeetings } from "@/lib/api/meetings";
import { getProfile } from "@/lib/api/profile";
import type { Meeting, User } from "@/types";

const SANS = "font-[family-name:var(--font-sans)]";

export default function MeetingsPage() {
  const [me, setMe] = useState<User | null>(null);
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);

  const load = useCallback(
    () =>
      Promise.all([(async () => {
        const all: Meeting[] = [];
        let page = 1;
        let lastPage = 1;
        do {
          const result = await listMeetings({ time_filter: "upcoming", per_page: 100, page });
          all.push(...(result.data.data ?? []));
          lastPage = result.data.meta?.last_page ?? page;
          page += 1;
        } while (page <= lastPage);
        return all;
      })(), getProfile()]).then(
        ([list, profile]) => {
          setMeetings(list);
          setMe(profile.data.user);
        },
        () => setError(true),
      ),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + dayOffset);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 4);
  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
  const monthLabel = sameMonth
    ? startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const arrowClass = "p-1 text-[#000712] hover:text-[#005AFB]";

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
        <div className="mt-[42px] flex max-w-[1311px] flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setDayOffset((offset) => offset - 5)} aria-label="Previous five days" className={arrowClass}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className={`${SANS} text-[20px] font-medium leading-[150%] text-[#000712]`}>{monthLabel}</span>
            <button type="button" onClick={() => setDayOffset((offset) => offset + 5)} aria-label="Next five days" className={arrowClass}>
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
          <WeekGrid meetings={meetings} startDate={startDate} />
        ) : (
          <p className={`${SANS} mt-8 text-sm text-[#718096]`}>Loading meetings...</p>
        )}
      </main>
      {adding ? <AddMeetingOverlay onClose={() => setAdding(false)} onCreated={load} /> : null}
    </div>
  );
}
