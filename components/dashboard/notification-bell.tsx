"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getUnreadNotificationsCount,
  listUserNotifications,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import type { AppNotification } from "@/types";

export function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    getUnreadNotificationsCount()
      .then((res) => setUnread(res.data.unread_count ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && items === null) {
      listUserNotifications({ per_page: 15 })
        .then((res) => setItems(res.data ?? []))
        .catch(() => setItems([]));
    }
  }

  function open_item(item: AppNotification) {
    if (item.read_at) return;
    setItems((current) => current?.map((n) => (n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n)) ?? null);
    setUnread((count) => Math.max(0, count - 1));
    markNotificationAsRead(item.id).catch(() => {});
  }

  function timeLabel(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const today = date.toDateString() === now.toDateString();
    const yesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
    if (today) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    if (yesterday) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return (
    <span className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
        aria-expanded={open}
        onClick={toggle}
        className="relative block text-[#000712]"
      >
        <Bell className="h-[20.77px] w-[18px]" />
        {unread > 0 ? <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e5484d]" aria-hidden="true" /> : null}
      </button>
      {open ? (
        <span className="fixed inset-x-4 top-[64px] z-50 block rounded-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-9 sm:w-[311px] bg-white py-4 shadow-lg ring-1 ring-black/5">
          <span className="block px-4 text-base font-medium text-[#000712]">Notifications</span>
          <span className="mt-5 block">
            {items === null ? (
              <span className="block px-4 py-2 text-xs text-[#718096]">Loading…</span>
            ) : items.length === 0 ? (
              <span className="block px-4 py-2 text-xs text-[#718096]">No notifications yet.</span>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => open_item(item)}
                  className={`flex w-full flex-col gap-2 px-4 py-2 text-left ${item.read_at ? "bg-white" : "bg-[#E6EFFF]"}`}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#000712]">{item.title}</span>
                    <span className="shrink-0 text-xs text-[#718096]">{timeLabel(item.created_at)}</span>
                  </span>
                  <span className="text-xs text-[#525256]">“{item.body}”</span>
                </button>
              ))
            )}
          </span>
        </span>
      ) : null}
    </span>
  );
}
