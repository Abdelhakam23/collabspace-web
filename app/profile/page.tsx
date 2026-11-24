"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { ProfileHeader, type ProfileTab } from "@/components/profile/header";
import { FilesTab, OverviewTab, TasksTab } from "@/components/profile/tabs";
import { getProfile, getUserFiles, getUserTasks } from "@/lib/api/profile";
import type { FileAttachment, Task, User } from "@/lib/types";

const SANS = "font-[family-name:var(--font-sans)]";

/**
 * Profile screens (nodes 214-8454 overview, 214-8743 tasks, 214-8536
 * files; 1440x1024, #F6F8FA): shared header card + tabs fed by A2.1, A2.5
 * and A2.6. The header stats bind the observed auth/me stats block
 * (completed_tasks, hours_worked) by exact path and show "Not available"
 * when the block is absent. The drawn Recent Activities section is
 * omitted (no activity endpoint). The navbar pill keeps its drawn state.
 */
export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [files, setFiles] = useState<FileAttachment[] | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number | null>(null);
  const [hoursWorked, setHoursWorked] = useState<number | null>(null);
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setMe(profile.data.user);
        // Exact observed paths only (auth/me capture 2026-11-23): a missing
        // stats block or key stays "Not available", never a guessed zero.
        const stats = profile.data.stats;
        setCompletedTasks(typeof stats?.completed_tasks === "number" ? stats.completed_tasks : null);
        setHoursWorked(typeof stats?.hours_worked === "number" ? stats.hours_worked : null);
      } catch {
        setError(true);
      }
      getUserTasks()
        .then((res) => setTasks(res.data.data ?? []))
        .catch(() => setTasks([]));
      getUserFiles()
        .then((res) => setFiles(res.data.data ?? []))
        .catch(() => setFiles([]));
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="Reports" />
      <main className="flex flex-col items-start gap-6 px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[44px]">
        {error ? (
          <p className={`${SANS} py-8 text-sm text-[#606C80]`}>Your profile could not be loaded.</p>
        ) : me === null ? (
          <p className={`${SANS} py-8 text-sm text-[#606C80]`}>Loading...</p>
        ) : (
          <>
            <ProfileHeader user={me} completedTasks={completedTasks} hoursWorked={hoursWorked} tab={tab} onTab={setTab} />
            {tab === "overview" ? <OverviewTab user={me} /> : tab === "tasks" ? <TasksTab tasks={tasks} /> : <FilesTab files={files} />}
          </>
        )}
      </main>
    </div>
  );
}
