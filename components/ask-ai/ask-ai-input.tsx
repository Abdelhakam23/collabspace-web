"use client";

import { Mic, Plus, Send } from "lucide-react";
import type { FormEvent } from "react";

/**
 * The AI input card, drawn twice in the design:
 * - "empty" (Ask AI frame 225-9992): radius 16, padding 20, vertical gap 51,
 *   placeholder "ask me anything about....", no shadow, border #E9E9EA.
 * - "chat" (Ask Ai/ chat frame 229-5948): radius 24, padding 16, gap 10,
 *   shadow lg, border #E2E8F0, placeholder "Message to ChatBot....".
 * Both: + button (12px plus, 1.5 stroke), mic icon (24px), Submit pill
 * (Hug 112 x 48, radius 32, #005AFB, pl-20/pr-12/py-12, gap 8, send icon).
 */
export function AskAiInput({
  variant,
  value,
  pending,
  onChange,
  onSubmit,
}: {
  variant: "empty" | "chat";
  value: string;
  pending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const chat = variant === "chat";
  function submit(event: FormEvent) {
    event.preventDefault();
    if (value.trim() && !pending) onSubmit();
  }
  return (
    <form
      onSubmit={submit}
      className={`flex w-full flex-col border bg-white ${
        chat
          ? "gap-2.5 rounded-3xl border-[#E2E8F0] p-4 shadow-lg"
          : "gap-[51px] rounded-2xl border-[#E9E9EA] p-5"
      }`}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={chat ? "Message to ChatBot...." : "ask me anything about...."}
        aria-label={chat ? "Message to ChatBot" : "Ask me anything"}
        className="w-full bg-transparent text-base text-black outline-none placeholder:text-black/60"
      />
      <div className="flex items-center justify-between">
        {/* A10.2 accepts only { query }: no attachment or voice input. */}
        <button
          type="button"
          disabled
          title="Attachments are not supported by the assistant endpoint"
          className="grid h-6 w-6 cursor-not-allowed place-items-center opacity-40"
        >
          <Plus size={12} strokeWidth={1.5} className="text-black" />
        </button>
        <span className="flex items-center gap-4">
          <button
            type="button"
            disabled
            title="Voice input is not supported by the assistant endpoint"
            className="cursor-not-allowed opacity-40"
          >
            <Mic size={24} className="text-black/70" />
          </button>
          <button
            type="submit"
            disabled={pending || !value.trim()}
            className="flex h-12 items-center gap-2 rounded-full bg-[#005AFB] py-3 pl-5 pr-3 text-sm font-medium text-white disabled:opacity-60"
          >
            Submit
            <Send size={16} aria-hidden="true" />
          </button>
        </span>
      </div>
    </form>
  );
}
