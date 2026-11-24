import { Calendar } from "lucide-react";
import { Bar } from "./bar";

const M = "font-[family-name:var(--font-sans)]";

function KpiIcon({ tone }: { tone: "orange" | "blue" | "green" }) {
  const tones = { orange: ["#FFF5E6", "#FA9E00"], blue: ["#E5EFFF", "#005AFB"], green: ["#E7F6EC", "#22B14C"] } as const;
  const [bg, fg] = tones[tone];
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: bg }} aria-hidden="true">
      <Calendar size={18} color={fg} />
    </span>
  );
}

export function KpiCard({ label, value, tone, ratio, fraction }: { label: string; value: number; tone: "orange" | "blue" | "green"; ratio: number; fraction: string }) {
  const colors = { orange: "#FA9E00", blue: "#005AFB", green: "#22B14C" } as const;
  return (
    <section className="rounded-2xl border border-[#F3F4F6] bg-white p-5 xl:h-[160px]">
      <div className="flex items-center justify-between">
        <h2 className={`${M} text-[20px] font-medium leading-[150%] text-[#000000]`}>{label}</h2>
        <KpiIcon tone={tone} />
      </div>
      <p className={`${M} mt-1 text-[31px] font-semibold leading-[150%] text-[#000000]`}>{value}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <Bar ratio={ratio} color={colors[tone]} className="w-2/3" />
        <span className={`${M} text-xs font-medium text-[#525256]`}>{fraction}</span>
      </div>
    </section>
  );
}
