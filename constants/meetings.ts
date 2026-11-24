export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

export const DRAWN_START = 9;
export const DRAWN_END = 13;

export const DURATIONS: { label: string; minutes: number }[] = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hour", minutes: 60 },
  { label: "1 hour 30 min", minutes: 90 },
  { label: "2 hours", minutes: 120 },
];

export const MEETING_FILTER_OPTIONS = ["Today", "Upcoming", "This Month", "Last Three Month", "This Year"];
export const MEETING_FILTER_DEFAULT = "Upcoming";
