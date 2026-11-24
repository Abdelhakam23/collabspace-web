import { Sparkle } from "lucide-react";

export function EmptyHero() {
  return (
    <div className="flex flex-col items-center gap-7">
      <span className="grid h-[76px] w-[76px] place-items-center rounded-2xl border border-[#D7E3FA] bg-white" aria-hidden="true">
        <Sparkle size={28} strokeWidth={3} className="text-[#005AFB]" />
      </span>
      <h1 className="text-center text-[31px] font-semibold leading-[1.5] text-black">Hi There 👋</h1>
      <p className="-mt-4 text-center text-[20px] font-medium leading-[1.5] text-[#000712]">
        Start chatting with Collabspace
      </p>
    </div>
  );
}
