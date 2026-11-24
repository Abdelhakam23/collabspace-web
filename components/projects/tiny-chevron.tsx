export function TinyChevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`h-[5px] w-[10px] ${className}`}>
      <path d="m1 1 4 3 4-3" />
    </svg>
  );
}
