"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Folder, Play } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { getMeetingDetails, getMeetingSummary } from "@/lib/api/meetings";
import { getProjectOverview } from "@/lib/api/projects";
import { getProfile } from "@/lib/api/profile";
import { initials } from "@/lib/format";
import type { Meeting, MeetingSummary, User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";
const RUBIK = "font-[family-name:var(--font-rubik)]";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatTimeRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const fmt = (d: Date, withMeridiem: boolean) => {
    let h = d.getHours() % 12;
    if (h === 0) h = 12;
    const m = String(d.getMinutes()).padStart(2, "0");
    const meridiem = d.getHours() < 12 ? "AM" : "PM";
    return withMeridiem ? `${h}:${m} ${meridiem}` : `${h}:${m}`;
  };
  const sameMeridiem = start.getHours() < 12 === end.getHours() < 12;
  return `${fmt(start, !sameMeridiem)} - ${fmt(end, true)}`;
}

function SummaryBody({ summary }: { summary: MeetingSummary }) {
  const lines = (summary.content ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith("- ") || l.startsWith("* ")).map((l) => l.slice(2));
  const paragraphs = lines.filter((l) => !(l.startsWith("- ") || l.startsWith("* ")));
  if (lines.length === 0) {
    return <p className={`${SANS} text-base font-normal leading-6 text-black`}>No summary has been generated for this meeting.</p>;
  }
  return (
    <>
      {paragraphs.map((line, i) => (
        <p key={i} className={`${SANS} text-base font-normal leading-6 text-black`}>{line}</p>
      ))}
      {bullets.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className={`${RUBIK} text-xl font-medium leading-5 text-black`}>Key Points</h3>
          <ul className={`${SANS} list-disc space-y-2 pl-5 text-base font-normal leading-6 text-black`}>
            {bullets.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default function MeetingRoomPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [me, setMe] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [details, profile] = await Promise.all([getMeetingDetails(id), getProfile()]);
        if (cancelled) return;
        const found = details.data.meeting;
        setMeeting(found);
        setMe(profile.data.user);
        try {
          const summaryRes = await getMeetingSummary(id);
          if (!cancelled) setSummary(summaryRes.data.summary);
        } catch {
          if (!cancelled) setSummary(null);
        }
        try {
          const overview = await getProjectOverview(found.project_id);
          if (!cancelled) setProjectName(overview.data.name ?? null);
        } catch {
          if (!cancelled) setProjectName(null);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const attendees = useMemo(() => meeting?.attendees ?? [], [meeting]);
  const shownAttendees = attendees.slice(0, 5);
  const extraAttendees = attendees.length - shownAttendees.length;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Meetings" />
      <main className="px-4 pb-16 pt-8 sm:px-8 lg:px-16 lg:pt-[44px]">
        {loading ? (
          <p className={`${SANS} text-base text-[#000712]`}>Loading meeting...</p>
        ) : error || !meeting ? (
          <div className="flex flex-col gap-3">
            <p className={`${SANS} text-base text-[#000712]`}>This meeting could not be loaded.</p>
            <Link href="/meetings" className={`${SANS} text-sm font-medium text-[#005AFB]`}>
              Back to Meetings
            </Link>
          </div>
        ) : (
          <div className="flex max-w-[752px] flex-col">
            <nav aria-label="Breadcrumb" className={`${SANS} text-sm font-medium leading-4`}>
              <Link href="/meetings" className="text-[#000712]/60 hover:text-[#000712]">
                Meetings
              </Link>
              <span className="mx-1 text-[#000712]/60">&gt;</span>
              <span className="text-[#000712]">{meeting.title}</span>
            </nav>
            <h1 className={`${SANS} mt-3 text-[31px] font-semibold leading-[150%] text-black`}>{meeting.title}</h1>
            <div className={`${SANS} mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-normal leading-4 text-[#000712]`}>
              {projectName ? (
                <span className="flex items-center gap-1.5">
                  <Folder size={14} aria-hidden="true" />
                  {projectName}
                </span>
              ) : null}
              {attendees.length > 0 ? (
                <span className="flex items-center">
                  {shownAttendees.map((user, i) => (
                    <span
                      key={user.id}
                      title={user.name}
                      className={`${SANS} flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#C2C2C2] bg-[#E2E8F0] text-[9px] font-semibold text-[#000712] ${i > 0 ? "-ml-2" : ""}`}
                    >
                      {initials(user.name)}
                    </span>
                  ))}
                  {extraAttendees > 0 ? (
                    <span className={`${SANS} -ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#C2C2C2] bg-[#F3F4F6] text-[9px] font-extrabold text-[#606C80]`}>
                      +{extraAttendees}
                    </span>
                  ) : null}
                </span>
              ) : null}
              {formatDate(meeting.start_time) ? (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} aria-hidden="true" />
                  {formatDate(meeting.start_time)}
                </span>
              ) : null}
              {formatTimeRange(meeting.start_time, meeting.end_time) ? (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} aria-hidden="true" />
                  {formatTimeRange(meeting.start_time, meeting.end_time)}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              disabled
              title="Live video is not embedded in this app"
              aria-label="Video call placeholder, not available"
              className="mt-5 flex h-[323px] w-full cursor-not-allowed items-center justify-center rounded-[28px] bg-[#D9D9D9]"
            >
              <Play size={64} className="fill-[#005AFB] text-[#005AFB] opacity-60" aria-hidden="true" />
            </button>
            <div className="mt-6 flex flex-col">
              <div className="flex items-end">
                <span className={`${SANS} rounded-tl-lg rounded-tr-[7px] bg-white px-2.5 py-2.5 text-sm font-medium leading-4 text-[#000712]`}>
                  AI Summary
                </span>
                <button
                  type="button"
                  disabled
                  title="Meeting notes are not documented in the meetings API"
                  className={`${SANS} cursor-not-allowed px-2.5 py-2.5 text-sm font-medium leading-4 text-[#000712] opacity-40`}
                >
                  Note
                </button>
                <button
                  type="button"
                  disabled
                  title="Meeting comments are not documented in the meetings API"
                  className={`${SANS} cursor-not-allowed px-2.5 py-2.5 text-sm font-medium leading-4 text-[#000712] opacity-40`}
                >
                  Comments
                </button>
              </div>
              <section className="flex flex-col gap-6 rounded-[20px] rounded-tl-none bg-[#F0F0F0] px-4 pb-4 pt-5">
                <h2 className={`${RUBIK} text-2xl font-medium leading-6 text-black`}>AI Generate Summary</h2>
                {summary ? (
                  <SummaryBody summary={summary} />
                ) : (
                  <p className={`${SANS} text-base font-normal leading-6 text-black`}>No summary has been generated for this meeting.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
