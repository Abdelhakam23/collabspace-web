"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getStoredToken } from "@/lib/api-client";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getStoredToken() ? "/dashboard" : "/login");
  }, [router]);

  return null;
}
