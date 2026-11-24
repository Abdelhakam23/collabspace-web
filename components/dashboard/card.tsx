import type { ReactNode } from "react";

const M = "font-[family-name:var(--font-sans)]";

/** Bordered white card with a 20px title header, shared by the dashboard panels. */
export function Card({ title, actions, children, className = "" }: { title: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[#F3F4F6] bg-white p-5 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className={`${M} text-[20px] font-medium leading-[150%] text-[#191919]`}>{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}

/** "View All" affordance from the frame; no listing target exists yet, so inert. */
export function ViewAll() {
  return <span aria-disabled="true" className={`${M} text-xs font-medium text-[#005AFB]`}>View All</span>;
}
