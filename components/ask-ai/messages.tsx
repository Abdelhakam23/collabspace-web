"use client";

import { Check, Copy } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500"] });

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
  time: string;
}

/**
 * Message bubbles of the "Ask Ai/ chat" frame (229-5948).
 * Bubble: white, radius 16, 1px #E2E8F0 border, padding 12, gap 4 to the
 * timestamp; text Plus Jakarta Sans Medium 14px/20px, -0.6% tracking,
 * #1E293B. AI rows lead with a 40px #EEF2FF "CB" circle and cap the bubble
 * at 412px; user rows right-align with a 40px avatar and cap at 320px.
 * Timestamp size/color and the CB text color are pixel-estimated.
 * The design's speaker/thumbs icons have no API and are omitted; copy is
 * kept because it works client-side.
 */
export function MessageList({ messages, pending }: { messages: ChatMessage[]; pending: boolean }) {
  return (
    <div className="flex flex-col gap-2.5 px-24 pb-20 pt-8">
      {messages.map((message, index) =>
        message.role === "ai" ? (
          <div key={index} className="flex items-start gap-2">
            <span
              className="grid h-10 w-10 shrink-0 select-none place-items-center rounded-full bg-[#EEF2FF] text-xs font-semibold text-[#005AFB]"
              aria-hidden="true"
            >
              CB
            </span>
            <span className="flex max-w-[412px] flex-col gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-3">
              <span className={`${jakarta.className} text-sm font-medium leading-5 tracking-[-0.6%] text-[#1E293B]`}>
                {message.text}
              </span>
              <span className="flex items-center justify-between">
                <Copy
                  size={14}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                  role="button"
                  aria-label="Copy reply"
                  onClick={() => navigator.clipboard?.writeText(message.text)}
                />
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  {message.time}
                  <Check size={10} aria-hidden="true" />
                </span>
              </span>
            </span>
          </div>
        ) : (
          <div key={index} className="flex items-start justify-end gap-2">
            <span className="flex max-w-[320px] flex-col gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-3">
              <span className={`${jakarta.className} text-sm font-medium leading-5 tracking-[-0.6%] text-[#1E293B]`}>
                {message.text}
              </span>
              <span className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                {message.time}
                <Check size={10} aria-hidden="true" />
              </span>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-300 text-xs font-semibold text-white" aria-hidden="true">
              {/** Avatar placeholder: /me carries no avatar in fixtures. */}
              ME
            </span>
          </div>
        ),
      )}
      {pending ? (
        <div className="flex items-center justify-end gap-2" aria-label="Assistant is typing">
          <span className="flex items-center gap-1 rounded-full bg-[#005AFB] px-3 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:300ms]" />
          </span>
          <span className="h-10 w-10 rounded-full bg-slate-300" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
}
