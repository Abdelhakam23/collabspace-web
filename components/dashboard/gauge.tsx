/** Semicircular gauge with a needle, as in the dashboard completion-rate card. */
export function Gauge({ ratio }: { ratio: number }) {
  const clamped = Math.min(1, Math.max(0, ratio));
  const cx = 42, cy = 44, r = 32;
  const angle = Math.PI - clamped * Math.PI;
  const nx = cx + Math.cos(angle) * (r - 8);
  const ny = cy - Math.sin(angle) * (r - 8);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const a = Math.PI - t * Math.PI;
    return {
      x1: cx + Math.cos(a) * (r + 2), y1: cy - Math.sin(a) * (r + 2),
      x2: cx + Math.cos(a) * (r + 6), y2: cy - Math.sin(a) * (r + 6),
    };
  });
  return (
    <svg width="84" height="52" viewBox="0 0 84 52" aria-hidden="true">
      <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#eef1f5" strokeWidth="7" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#cbd2da" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#000712" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#000712" />
    </svg>
  );
}
