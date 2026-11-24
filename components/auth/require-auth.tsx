"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getStoredToken } from "@/lib/api-client";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
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
