"use client";

import { useEffect, useState } from "react";
import { listProjects } from "@/lib/api/projects";
import { listProjectMessages } from "@/lib/api/messages";
import type { ChannelPreview } from "@/components/chats/sidebar";

/**
 * Loads the sidebar channels: every project is one conversation (the API has
 * no channel concept), and each row shows its latest message (A8.1,
 * per_page=1) as the drawn preview line. Preview failures degrade to a
 * "No messages yet" row instead of breaking the list.
 */
export function useChannels(): { channels: ChannelPreview[] | null; error: boolean } {
  const [channels, setChannels] = useState<ChannelPreview[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listProjects({ page: 1, per_page: 50, sort: "desc" });
        const projects = res.data.data ?? [];
        const previews = await Promise.all(
          projects.map(async (project): Promise<ChannelPreview> => {
            try {
              const latest = await listProjectMessages(project.id, { per_page: 1 });
              return { project, latest: latest.data.data?.[0] ?? null };
            } catch {
              return { project, latest: null };
            }
          }),
        );
        if (!cancelled) setChannels(previews);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { channels, error };
}
