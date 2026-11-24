"use client";

import { useCallback, useEffect, useState } from "react";
import { listProjects } from "@/lib/api/projects";
import { listProjectMessages } from "@/lib/api/messages";
import type { Message } from "@/types";
import type { ChannelPreview } from "@/components/chats/sidebar";

export function useChannels(): {
  channels: ChannelPreview[] | null;
  error: boolean;
  updatePreview: (projectId: number, message: Message) => void;
} {
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

  const updatePreview = useCallback((projectId: number, message: Message) => {
    setChannels((prev) =>
      prev ? prev.map((c) => (c.project.id === projectId ? { ...c, latest: message } : c)) : prev,
    );
  }, []);

  return { channels, error, updatePreview };
}
