"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Periodically re-fetches the current (server-rendered) page so new
 *  orders/events show up without the admin needing to manually reload. */
export default function AutoRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
