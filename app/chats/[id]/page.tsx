"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { ChatsSidebar } from "@/components/chats/sidebar";
import { Conversation } from "@/components/chats/conversation";
import { useChannels } from "@/components/chats/use-channels";
import { getProfile } from "@/lib/api/profile";
import type { User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

/**
 * Drawn open-conversation state: the same sidebar with the active channel
 * highlighted, plus the conversation pane (header, messages, composer) for
 * the selected project.
 */
export default function ChatConversationPage() {
  const params = useParams();
  const projectId = Number(params.id);
  const [me, setMe] = useState<User | null>(null);
  const { channels } = useChannels();

  useEffect(() => {
    getProfile()
      .then((res) => setMe(res.data.user))
      .catch(() => {});
  }, []);

  const project = channels?.find((channel) => channel.project.id === projectId)?.project ?? null;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Chats" />
      <main className="flex items-start gap-6 px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[44px]">
        <ChatsSidebar channels={channels ?? []} activeId={projectId} />
        {channels === null ? (
          <p className={`${SANS} flex-1 py-8 text-center text-sm text-[#606C80]`}>Loading...</p>
        ) : project ? (
          <Conversation project={project} />
        ) : (
          <p className={`${SANS} flex-1 py-8 text-center text-sm text-[#606C80]`}>This project conversation is not available.</p>
        )}
      </main>
    </div>
  );
}
