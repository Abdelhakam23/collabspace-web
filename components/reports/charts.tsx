"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReportPoint } from "@/lib/reports-normalize";

const SANS = "font-[family-name:var(--font-sans)]";
const AXIS_TICK = { fontSize: 11, fill: "#606C80" };

/** Shared chart wrappers for the Reports cards (recharts, already installed). */

function EmptyChart() {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <p className={`${SANS} text-sm text-[#606C80]`}>No chart data available.</p>
    </div>
  );
}

export function ReportBarChart({ points }: { points: ReportPoint[] | null }) {
  if (!points || points.length === 0) return <EmptyChart />;
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E6EBF0" />
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} padding={{ left: 14, right: 14 }} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#005AFB" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportAreaChart({ points }: { points: ReportPoint[] | null }) {
  if (!points || points.length === 0) return <EmptyChart />;
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E6EBF0" />
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} padding={{ left: 14, right: 14 }} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#22C55E" fill="#22C55E" fillOpacity={0.18} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportLineChart({ points }: { points: ReportPoint[] | null }) {
  if (!points || points.length === 0) return <EmptyChart />;
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E6EBF0" />
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} padding={{ left: 14, right: 14 }} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#005AFB" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
