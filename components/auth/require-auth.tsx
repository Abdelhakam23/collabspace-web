"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getStoredToken } from "@/lib/api-client";

/** Client-side route guard: no token, no page. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // The token check stays inside a promise callback so the state update is
    // asynchronous (react-hooks set-state-in-effect); a missing token goes
    // straight to login.
    Promise.resolve().then(() => {
      if (getStoredToken()) {
        setAllowed(true);
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}
