/** Thin progress track used across the dashboard panels. */
export function Bar({ ratio, color, className = "" }: { ratio: number; color: string; className?: string }) {
  const width = `${Math.min(100, Math.max(0, Math.round(ratio * 100)))}%`;
  return (
    <span className={`block h-1.5 rounded-full bg-[#f0f2f5] ${className}`} aria-hidden="true">
      <span className="block h-full rounded-full" style={{ width, backgroundColor: color }} />
    </span>
  );
}
