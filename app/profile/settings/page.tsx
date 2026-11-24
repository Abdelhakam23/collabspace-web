"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { getProfile, updateProfileWithAvatar } from "@/lib/api/profile";
import type { User } from "@/types";

const SANS = "font-[family-name:var(--font-sans)]";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const DISABLED_REASONS = {
  email: "Email changes are not documented in the API",
  availability: "Availability changes are not documented in the API",
  project: "Changing the current team or project is not documented in the API",
} as const;

export default function ProfileSettingsPage() {
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [years, setYears] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const savingRef = useRef(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const user = res.data.user;
        setMe(user);
        setName(user.name ?? "");
        setPhone(user.phone ?? "");
        setJobTitle(user.job_title ?? "");
        setYears(user.years_of_experience != null ? String(user.years_of_experience) : "");
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaved(false);
    setSaveError(false);
    try {
      const res = await updateProfileWithAvatar({
        name,
        phone,
        job_title: jobTitle,
        years_of_experience: years,
        ...(avatar ? { avatar } : {}),
      });
      setMe(res.data.user);
      setAvatar(null);
      setSaved(true);
    } catch {
      setSaveError(true);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const inputClass = `${SANS} w-full rounded-lg border border-[#E6EBF0] bg-white px-3 py-2.5 text-[13px] text-[#222222] outline-none focus:border-[#005AFB]`;
  const disabledClass = `${SANS} w-full cursor-not-allowed rounded-lg border border-[#E6EBF0] bg-[#F6F8FA] px-3 py-2.5 text-[13px] text-[#606C80] opacity-60`;
  const labelClass = `${SANS} mb-1 block text-[12px] font-medium text-[#606C80]`;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <DashboardNavbar userName={me?.name ?? ""} userRole={me?.roles?.[0]} active="" />
      <main className="flex flex-col items-start gap-6 px-4 pt-8 sm:px-8 lg:px-16 lg:pt-[44px]">
        {me === null ? (
          <p className={`${SANS} py-8 text-sm text-[#606C80]`}>Loading...</p>
        ) : (
          <div className="w-full max-w-[1311px]">
            <div className="flex items-center gap-5 rounded-[13px] bg-white p-5">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                title="Change avatar"
                className="relative block h-16 w-16 shrink-0"
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(avatar)} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : me.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={me.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#005AFB] text-lg font-semibold text-white">
                    {initials(me.name)}
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#005AFB] text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </span>
              </button>
              <h1 className={`${SANS} text-[18px] font-semibold text-[#000712]`}>{me.name}</h1>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
              <div>
                <h2 className={`${SANS} text-[14px] font-semibold text-[#000712]`}>Personal Info</h2>
                <p className={`${SANS} mt-1 text-[11px] text-[#606C80]`}>You can change your personal information/settings here</p>
              </div>
              <div className="grid gap-4 rounded-[13px] bg-white p-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="full-name">Full Name</label>
                  <input id="full-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                    <input value={me.email} disabled title={DISABLED_REASONS.email} className={disabledClass} aria-label="Email Address (read only)" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Availability Status</label>
                  <input value={me.available_status ?? ""} disabled title={DISABLED_REASONS.availability} className={disabledClass} aria-label="Availability Status (read only)" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
              <div>
                <h2 className={`${SANS} text-[14px] font-semibold text-[#000712]`}>Experience</h2>
                <p className={`${SANS} mt-1 text-[11px] text-[#606C80]`}>You can change Experience settings here.</p>
              </div>
              <div className="grid gap-4 rounded-[13px] bg-white p-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="job-title">Job Title</label>
                  <input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="years">Years Of Experience</label>
                  <input id="years" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Current Team / Project</label>
                  <input
                    value={me.current_project_id != null ? `Project #${me.current_project_id}` : ""}
                    disabled
                    title={DISABLED_REASONS.project}
                    className={disabledClass}
                    aria-label="Current Team / Project (read only)"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className={`${SANS} mt-6 w-full rounded-[13px] bg-[#005AFB] py-3.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {saved ? <p className={`${SANS} mt-2 text-[12px] text-[#1A7F37]`}>Profile saved.</p> : null}
            {saveError ? <p className={`${SANS} mt-2 text-[12px] text-[#E5484D]`}>The profile could not be saved. Try again.</p> : null}
          </div>
        )}
      </main>
    </div>
  );
}
