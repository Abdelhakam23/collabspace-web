"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { AskAiInput } from "@/components/ask-ai/ask-ai-input";
import { EmptyHero } from "@/components/ask-ai/empty-hero";
import { MessageList, type ChatMessage } from "@/components/ask-ai/messages";
import { askAi } from "@/lib/api/ai";
import { getProfile } from "@/lib/api/profile";
import type { User } from "@/types";

export default function AskAiPage() {
  const [me, setMe] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((profile) => setMe(profile.data.user)).catch(() => {});
  }, []);

  async function send() {
    const query = draft.trim();
    if (!query || pending) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((current) => [...current, { role: "user", text: query, time }]);
    setDraft("");
    setError(null);
    setPending(true);
    try {
      const answer = await askAi(query);
      setMessages((current) => [
        ...current,
        { role: "ai", text: answer, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } catch {
      setDraft(query);
      setMessages((current) => current.slice(0, -1));
      setError("The assistant could not answer right now. Your message is back in the box.");
    } finally {
      setPending(false);
    }
  }

  const chatting = messages.length > 0 || pending;
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Dashboard" />
      <main className="px-16 pt-12">
        <h1 className="text-[31px] font-semibold leading-[1.5] text-black">Collabspace AI</h1>
        {chatting ? (
          <div className="mt-10 flex flex-col gap-10 pb-10">
            <MessageList messages={messages} pending={pending} />
            <div className="-mx-8 px-8">
              <AskAiInput variant="chat" value={draft} pending={pending} onChange={setDraft} onSubmit={send} />
            </div>
          </div>
        ) : (

          <div className="flex min-h-[calc(100vh-220px)] flex-col pb-16">
            <div className="grid flex-1 place-items-center">
              <EmptyHero />
            </div>
            <AskAiInput variant="empty" value={draft} pending={pending} onChange={setDraft} onSubmit={send} />
          </div>
        )}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </main>
    </div>
  );
}
