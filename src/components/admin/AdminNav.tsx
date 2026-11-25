"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/events", label: "Events" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-ink-950 text-cream">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <p className="font-display text-lg shrink-0">
            Aurora <span className="text-rust italic">Admin</span>
          </p>
          <nav className="flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-[12.5px] uppercase tracking-[0.1em] transition-colors ${
                    active ? "bg-cream/10 text-cream" : "text-cream/60 hover:text-cream"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-[12px] uppercase tracking-[0.1em] text-cream/60 hover:text-rust transition-colors disabled:opacity-50"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
