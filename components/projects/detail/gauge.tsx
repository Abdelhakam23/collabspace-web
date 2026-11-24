export function Gauge({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const c = 89, r = 82.5, C = 2 * Math.PI * r;
  const trackLen = (192 / 360) * C;
  const pivotX = 88.06, pivotY = 97.51;
  const trueDeg = 1.92 * clamped - 97.5;
  const needleDeg = trueDeg;
  const progLen = (trackLen * clamped) / 100;
  return (
    <svg viewBox="0 0 178 178" className="absolute inset-0 h-full w-full">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E9E9EA" strokeWidth="9"
        strokeLinecap="round" strokeDasharray={`${trackLen} ${C}`} transform={`rotate(172.5 ${c} ${c})`} />
      {progLen > 0 ? (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#27272B" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={`${progLen} ${C}`} transform={`rotate(172.5 ${c} ${c})`} />
      ) : null}
      <g transform={`rotate(${needleDeg - 22.09} ${pivotX} ${pivotY})`}>
                <rect x={94.78} y={41.94} width={9.45} height={54.32} rx={4.725} fill="#27272B"
          transform="rotate(22.09 99.5 69.1)" />
      </g>
            <circle cx={pivotX} cy={pivotY} r={7.56} fill="#FFFFFF" stroke="#27272B" strokeWidth="1.89" />
    </svg>
  );
}
