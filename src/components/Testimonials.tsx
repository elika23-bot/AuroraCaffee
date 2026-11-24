"use client";

import { FormEvent, useEffect, useState } from "react";

type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  createdAt: string;
};

type LoadState = "loading" | "ready" | "error";
type SubmitState = "idle" | "loading" | "success" | "error";

function Stars({ value, size = "text-sm" }: { value: number; size?: string }) {
  return (
    <span className={`${size} tracking-[0.05em] text-rust`} aria-label={`${value} out of 5 stars`}>
      {"★★★★★".slice(0, value)}
      <span className="text-ink/20">{"★★★★★".slice(value)}</span>
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className={`text-2xl leading-none transition-colors ${
            n <= value ? "text-rust" : "text-ink/20 hover:text-rust/50"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default function Testimonials() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [reviews, setReviews] = useState<Review[]>([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setReviews(Array.isArray(json.reviews) ? json.reviews : []);
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("loading");
    setFieldErrors({});

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, rating, text, company }),
      });
      const json = await res.json();

      if (!res.ok) {
        setSubmitState("error");
        setSubmitMessage(json.message ?? "Please fix the highlighted fields.");
        setFieldErrors(json.fields ?? {});
        return;
      }

      if (json.review) {
        setReviews((prev) => [json.review, ...prev]);
      }
      setSubmitState("success");
      setSubmitMessage("Thanks — your review is live below.");
      setName("");
      setRole("");
      setRating(5);
      setText("");
    } catch {
      setSubmitState("error");
      setSubmitMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <section className="relative overflow-hidden grain py-24 md:py-28">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex justify-center">
          <p className="page-mark rounded-full bg-paper/90 px-4 py-1.5 text-center text-rust">
            What our regulars say about their morning cup
          </p>
        </div>
        <div className="mx-auto mt-3 h-px w-16 bg-ink/15" />

        {loadState === "loading" && (
          <p className="mt-14 text-center text-[13px] text-ink/40">
            <span className="rounded-full bg-paper/90 px-4 py-1.5">
              Loading reviews…
            </span>
          </p>
        )}

        {loadState === "error" && (
          <p className="mt-14 text-center text-[13px] text-rust">
            <span className="rounded-full bg-paper/90 px-4 py-1.5">
              Couldn&rsquo;t load reviews right now. Please refresh.
            </span>
          </p>
        )}

        {loadState === "ready" && reviews.length === 0 && (
          <div className="mt-14 flex justify-center">
            <p className="max-w-sm rounded-2xl bg-paper/90 px-6 py-4 text-center text-[14.5px] text-ink/55">
              No reviews yet — be the first to tell us about your visit.
            </p>
          </div>
        )}

        {loadState === "ready" && reviews.length > 0 && (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="rounded-2xl bg-paper/90 p-6 text-left"
              >
                <Stars value={r.rating} />
                <blockquote className="mt-3 text-[15px] leading-[1.85] text-ink/75 [text-align:justify]">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="h-8 w-8 shrink-0 rounded-full bg-maroon flex items-center justify-center text-cream font-display text-sm">
                    {r.name[0]?.toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {r.name}
                    </span>
                    <span className="block text-[11px] uppercase tracking-[0.1em] text-ink/45">
                      {r.role ? r.role : timeAgo(r.createdAt)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-20 mx-auto max-w-xl">
          <div className="rounded-2xl border border-ink/10 bg-cream p-7 sm:p-9 shadow-[0_20px_50px_-30px_rgba(15,36,39,0.3)]">
            <p className="font-display text-xl text-ink text-center">
              Leave a review
            </p>
            <p className="mt-1.5 text-[13px] text-ink/55 text-center">
              Visited Aurora recently? We&rsquo;d love to hear about it —
              your review appears here right away.
            </p>

            {submitState === "success" ? (
              <div className="mt-6 text-center">
                <p className="text-[14.5px] text-maroon">{submitMessage}</p>
                <button
                  onClick={() => setSubmitState("idle")}
                  className="mt-4 text-[13px] uppercase tracking-[0.12em] text-rust hover:text-maroon transition-colors"
                >
                  Write another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="relative mt-6 space-y-4">
                {/* Honeypot — hidden from real visitors, catches basic bots.
                    Kept near (0,0) with a near-zero box so it can never
                    expand the page's scrollable width (unlike the classic
                    `left: -9999px` trick, which does exactly that). */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
                      Name
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Ellis"
                      className={fieldClass(!!fieldErrors.name)}
                    />
                    {fieldErrors.name && (
                      <span className="mt-1 block text-[12px] text-rust">{fieldErrors.name}</span>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
                      Role / Visit (optional)
                    </span>
                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Regular since 2024"
                      className={fieldClass(false)}
                    />
                  </label>
                </div>

                <div>
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
                    Rating
                  </span>
                  <StarPicker value={rating} onChange={setRating} />
                  {fieldErrors.rating && (
                    <span className="mt-1 block text-[12px] text-rust">{fieldErrors.rating}</span>
                  )}
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
                    Your review
                  </span>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your visit…"
                    className={fieldClass(!!fieldErrors.text)}
                  />
                  {fieldErrors.text && (
                    <span className="mt-1 block text-[12px] text-rust">{fieldErrors.text}</span>
                  )}
                </label>

                {submitState === "error" && !Object.keys(fieldErrors).length && (
                  <p className="text-[13px] text-rust">{submitMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="w-full rounded-full bg-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream hover:bg-maroon transition-colors disabled:opacity-60"
                >
                  {submitState === "loading" ? "Submitting…" : "Post Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function fieldClass(hasError: boolean) {
  return `w-full rounded-lg border bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-maroon ${
    hasError ? "border-rust" : "border-ink/15"
  }`;
}
