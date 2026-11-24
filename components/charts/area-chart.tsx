"use client";

import { useId } from "react";

export function AreaChart({ points, maxChart, className = "h-44 w-full" }: { points: number[]; maxChart: number; className?: string }) {
  const gradientId = useId();
  const w = 560, h = 180, pad = 4;
  const n = Math.max(2, points.length);
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / (n - 1));
  const ys = points.map((v) => h - pad - (v / maxChart) * (h - pad * 2));
  const seg = (i: number) => {
    const p0 = i > 0 ? i - 1 : 0, p1 = i, p2 = i + 1 < n ? i + 1 : n - 1, p3 = i + 2 < n ? i + 2 : n - 1;
    const c1x = xs[p1] + (xs[p2] - xs[p0]) / 6, c1y = ys[p1] + (ys[p2] - ys[p0]) / 6;
    const c2x = xs[p2] - (xs[p3] - xs[p1]) / 6, c2y = ys[p2] - (ys[p3] - ys[p1]) / 6;
    return `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${xs[p2].toFixed(1)},${ys[p2].toFixed(1)}`;
  };
  const path = `M${xs[0].toFixed(1)},${ys[0].toFixed(1)} ${Array.from({ length: n - 1 }, (_, i) => seg(i)).join(" ")}`;
  const area = `${path} L${xs[n - 1].toFixed(1)},${h} L${xs[0].toFixed(1)},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2692FF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2692FF" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke="#2692FF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
