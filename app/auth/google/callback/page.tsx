"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { storeToken } from "@/lib/api-client";

/**
 * Landing page for the backend's Google OAuth callback.
 * The backend returns here after /auth/social/google/callback with the
 * token in the query string; we store it and continue to the dashboard.
 */
function GoogleCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token") ?? params.get("access_token");
    if (token) {
      storeToken(token);
      router.replace("/dashboard");
    } else {
      router.replace("/login?error=google");
    }
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8fa]">
      <p className="text-base text-[#718096]">Signing you in...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallback />
    </Suspense>
  );
}
