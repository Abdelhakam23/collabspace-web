"use client";

import { Check, Copy } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500"] });

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
  time: string;
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const URL_TEST = /^https?:\/\/\S+$/;

function MessageContent({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (!URL_TEST.test(part)) {
          return <span key={i}>{part}</span>;
        }
        let host = part;
        try {
          host = new URL(part).host;
        } catch {
        }
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex flex-col gap-1 rounded-xl bg-gradient-to-br from-[#005AFB] to-[#003db0] p-3 text-white"
          >
            <span className="flex items-center justify-between gap-2 text-[13px] font-semibold">
              {host}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <span className="break-all text-[11px] opacity-80">{part}</span>
          </a>
        );
      })}
    </>
  );
}

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
                <MessageContent text={message.text} />
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
                <MessageContent text={message.text} />
              </span>
              <span className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                {message.time}
                <Check size={10} aria-hidden="true" />
              </span>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-300 text-xs font-semibold text-white" aria-hidden="true">
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
