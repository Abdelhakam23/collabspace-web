/** Needle gauge, geometry measured from the native file
 *  (docs/design-api-gaps.md). The drawn arc is decorative (~63% of the
 *  track, not the labeled 78%): runtime maps pct truthfully, the
 *  visual-fixture harness reproduces the drawn state verbatim. */
export function Gauge({ pct, drawn = false }: { pct: number; drawn?: boolean }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const c = 89, r = 82.5, C = 2 * Math.PI * r;
  // Vector endpoints include the round caps (~3.1deg at r 82.5).
  const trackLen = (192 / 360) * C;
  const pivotX = 88.06, pivotY = 97.51;
  // Truthful mapping: arc end and needle at 172.5 + 1.92 * pct degrees.
  const trueDeg = 1.92 * clamped - 97.5;
  const needleDeg = drawn ? 22.09 : trueDeg;
  const progLen = drawn ? (120 / 360) * C : (trackLen * clamped) / 100;
  return (
    <svg viewBox="0 0 178 178" className="absolute inset-0 h-full w-full">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E9E9EA" strokeWidth="9"
        strokeLinecap="round" strokeDasharray={`${trackLen} ${C}`} transform={`rotate(172.5 ${c} ${c})`} />
      {progLen > 0 ? (
        <circle cx={c} cy={c} r={r} fill="none" stroke="#27272B" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={`${progLen} ${C}`} transform={`rotate(172.5 ${c} ${c})`} />
      ) : null}
      <g transform={`rotate(${needleDeg - 22.09} ${pivotX} ${pivotY})`}>
        {/* Figma reports the rotated bounding box for the needle, so place
            by its center (99.5,69.1) and tilt 22.09deg clockwise. */}
        <rect x={94.78} y={41.94} width={9.45} height={54.32} rx={4.725} fill="#27272B"
          transform="rotate(22.09 99.5 69.1)" />
      </g>
      {/* Dot stroke draws inside the 17.01 box, so r = 8.505 - 1.89/2. */}
      <circle cx={pivotX} cy={pivotY} r={7.56} fill="#FFFFFF" stroke="#27272B" strokeWidth="1.89" />
    </svg>
  );
}
