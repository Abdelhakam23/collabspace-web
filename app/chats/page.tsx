"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { ChatsSidebar } from "@/components/chats/sidebar";
import { useChannels } from "@/components/chats/use-channels";
import { getProfile } from "@/lib/api/profile";
import type { User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

/**
 * "Chats" frame (node 126-2481, 1440x1024, page background #F6F8FA), Project
 * Chats tab state: navbar with the Chats pill active, the sidebar card with
 * the channel list, and the "Select Chat" empty state on the right. The drawn
 * inbox tab (direct messages) is disabled: there is no DM endpoint. "Select
 * Chat" styling is estimated (unmeasured in the source).
 */
export default function ChatsPage() {
  const [me, setMe] = useState<User | null>(null);
  const { channels } = useChannels();

  useEffect(() => {
    getProfile()
      .then((res) => setMe(res.data.user))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Chats" />
      <main className="flex items-start gap-6 px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[44px]">
        <ChatsSidebar channels={channels ?? []} />
        <section className="flex min-h-[400px] flex-1 items-center justify-center">
          <p className={`${SANS} text-[24px] font-semibold text-[#222222]`}>Select Chat</p>
        </section>
      </main>
    </div>
  );
}
