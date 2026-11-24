import type { ReactNode } from "react";

const SANS = "font-[family-name:var(--font-sans)]";

/** White ring card with configurable header/body gap, per the Alpha frame. */
export function Card({ title, children, className = "", gap = 20, aside, asideInline = false }: { title: string; children: ReactNode; className?: string; gap?: number; aside?: ReactNode; asideInline?: boolean }) {
  return (
    <section className={`rounded-2xl bg-white p-5 ring-1 ring-[#F3F4F6] ${className}`}>
      <div className="flex flex-col" style={{ gap }}>
        <div className={asideInline ? "flex items-center gap-4" : "flex items-start justify-between"}>
          <h2 className={`${SANS} text-[20px] font-medium leading-[15px] text-[#191919]`}>{title}</h2>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Icon-in-tinted-circle marker for the Product Details grid. */
export function DetailIcon({ bg, color, children }: { bg: string; color: string; children: ReactNode }) {
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bg, color }}>
      {children}
    </span>
  );
}
