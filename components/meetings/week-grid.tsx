import Link from "next/link";
import { initials } from "@/lib/format";
import type { Meeting } from "@/types";
import { DRAWN_END, DRAWN_START, WEEKDAYS } from "@/constants/meetings";

const SANS = "font-[family-name:var(--font-sans)]";
const RUBIK = "font-[family-name:var(--font-rubik)]";

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function timeRange(meeting: Meeting) {
  const start = new Date(meeting.start_time);
  const end = new Date(meeting.end_time);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const fmt = (d: Date, withMeridiem: boolean) => {
    let h = d.getHours() % 12;
    if (h === 0) h = 12;
    const m = String(d.getMinutes()).padStart(2, "0");
    const meridiem = d.getHours() < 12 ? "AM" : "PM";
    return withMeridiem ? `${h}:${m} ${meridiem}` : `${h}:${m}`;
  };
  const sameMeridiem = (start.getHours() < 12) === (end.getHours() < 12);
  return `${fmt(start, !sameMeridiem)} - ${fmt(end, true)}`;
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const attendees = meeting.attendees ?? [];
  const shown = attendees.slice(0, 2);
  const extra = attendees.length - shown.length;
  return (
    <div className="flex h-[105px] w-full flex-col rounded-2xl border border-[#F3F4F6] bg-white p-3">
      <div className="flex flex-col gap-2">
        <p className={`${SANS} truncate text-sm font-normal leading-4 text-black`}>{meeting.title}</p>
        <p className={`${SANS} text-xs font-normal leading-4 text-black/75`}>{timeRange(meeting)}</p>
      </div>
      <div className="mt-auto flex items-center">
        <span className="flex items-center">
          {shown.map((user, i) => (
            <span
              key={user.id}
              title={user.name}
              className={`${SANS} flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C2C2C2] bg-[#E2E8F0] text-[10px] font-semibold text-[#000712] ${i > 0 ? "-ml-2" : ""}`}
            >
              {initials(user.name)}
            </span>
          ))}
          {extra > 0 ? (
            <span className={`${SANS} -ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C2C2C2] bg-[#F3F4F6] text-[10px] font-extrabold leading-4 text-[#606C80]`}>
              +{extra}
            </span>
          ) : null}
        </span>
        <Link
          href={`/meetings/${meeting.id}`}
          className={`${SANS} ml-auto flex items-center gap-1 rounded-2xl text-xs font-normal leading-4 text-[#383838]`}
        >
          Join
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function DayHeader({ date, label }: { date: Date; label: string }) {
  return (
    <>
      <span className={`${RUBIK} text-center text-sm font-normal leading-4 text-black`}>{label}</span>
      <span className={`${RUBIK} text-center text-sm font-normal leading-4 text-black`}>{date.getDate()}</span>
    </>
  );
}

export function WeekGrid({ meetings, startDate }: { meetings: Meeting[]; startDate?: Date }) {
  const today = startDate ?? new Date();
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const placed = meetings
    .map((meeting) => ({ meeting, start: new Date(meeting.start_time) }))
    .filter(({ start }) => !Number.isNaN(start.getTime()));
  const inGrid = placed.filter(({ start }) => days.some((d) => sameDay(start, d)));
  const startHour = Math.min(DRAWN_START, ...inGrid.map(({ start }) => start.getHours()));
  const endHour = Math.max(DRAWN_END, ...inGrid.map(({ start }) => start.getHours()));
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const hiddenCount = placed.length - inGrid.length;

  return (
    <div className="mt-[39px] max-w-[1311px]">
            <div className="grid grid-cols-6 border-b border-[#F3F4F6]">
        <div className="flex h-[137px] flex-col gap-0.5 border-r border-[#F3F4F6] p-4">
          <span className={`${RUBIK} text-sm font-normal leading-4 text-black`}>Time</span>
        </div>
        {days.map((d, i) => (
          <div
            key={d.toDateString()}
            className={`flex h-[137px] flex-col items-center gap-0.5 px-3 py-4 ${i < days.length - 1 ? "border-r border-[#F3F4F6]" : ""} ${sameDay(d, new Date()) ? "bg-[#E6EFFF]" : ""}`}
          >
            <DayHeader date={d} label={sameDay(d, new Date()) ? "Today" : WEEKDAYS[d.getDay()]} />
          </div>
        ))}
      </div>
            {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-6 border-b border-[#F3F4F6]">
          <div className="flex min-h-[137px] flex-col gap-0.5 border-r border-[#F3F4F6] p-4">
            <span className={`${RUBIK} text-sm font-normal leading-4 text-black`}>{hour}:00</span>
          </div>
          {days.map((d, i) => {
            const cellMeetings = placed.filter(({ start }) => sameDay(start, d) && start.getHours() === hour);
            return (
              <div
                key={d.toDateString()}
                className={`flex min-h-[137px] flex-col items-center gap-0.5 px-3 py-4 ${i < days.length - 1 ? "border-r border-[#F3F4F6]" : ""} ${sameDay(d, new Date()) ? "bg-[#E6EFFF]" : ""}`}
              >
                {cellMeetings.map(({ meeting }) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            );
          })}
        </div>
      ))}
      {hiddenCount > 0 ? (
        <p className={`${SANS} mt-4 text-sm text-[#606C80]`}>
          {hiddenCount} more upcoming {hiddenCount === 1 ? "meeting falls" : "meetings fall"} outside the days this screen can show, use the arrows above to view other days.
        </p>
      ) : null}
    </div>
  );
}
