"use client";

import { FormEvent, useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.message ?? "Incorrect password.");
        setLoading(false);
        return;
      }
      window.location.href = next;
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-[28px] bg-paper p-8 sm:p-10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
    >
      <p className="font-display text-2xl text-ink text-center">Aurora Cafe Admin</p>
      <p className="mt-2 text-[13px] text-ink/55 text-center">
        Sign in to manage orders and events.
      </p>

      <label className="mt-8 block">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-maroon"
        />
      </label>

      {error && <p className="mt-3 text-[13px] text-rust">{error}</p>}

      <button
        type="submit"
        disabled={loading || !password}
        className="mt-6 w-full rounded-full bg-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream hover:bg-maroon transition-colors disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
