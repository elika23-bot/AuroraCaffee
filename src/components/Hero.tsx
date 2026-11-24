import Badge from "./Badge";
import LogoLockup from "./LogoLockup";
import { imageExists } from "@/lib/images";

export default function Hero() {
  const hasLogo = imageExists("/images/logo.png");

  return (
    <section
      id="top"
      className="relative overflow-hidden grain pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="hero-intro relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between text-ink/40 page-mark">
          <span className="rounded-full border border-ink bg-paper/90 px-3 py-1">
            Est. 2019 — Neighborhood Roastery
          </span>
          <span className="rounded-full bg-paper/90 px-3 py-1">№ 01</span>
        </div>

        <div className="mt-10 md:mt-14">
          <h1 className="grain-text font-display font-black leading-[0.86] text-balance text-center">
            <span className="block text-[3.6rem] sm:text-8xl md:text-9xl lg:text-[9rem]">
              Wake
            </span>
            <span className="mt-1 flex items-center justify-center gap-3 text-[3.6rem] sm:text-8xl md:text-9xl lg:text-[9rem]">
              <Badge className="h-[0.62em] w-[0.62em] shrink-0 -translate-y-[0.04em]" />
              Better.
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 text-center">
            <span className="inline-block rounded-full border border-ink bg-paper/90 px-5 py-1">
              <span className="grain-text [--grain-color:var(--rust)] font-display italic text-2xl sm:text-3xl">
                or don&rsquo;t wake at all.
              </span>
            </span>
          </p>
        </div>

        <div className="mt-14 md:mt-16 flex justify-center">
          <div className="rounded-[28px] bg-paper/90 px-10 py-7">
            {hasLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/logo.png"
                alt="Aurora Cafe — Rise With The Sun"
                className="w-[220px] sm:w-[260px] md:w-[300px] h-auto drop-shadow-[0_20px_30px_rgba(26,26,26,0.15)]"
              />
            ) : (
              <LogoLockup />
            )}
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col items-center text-center">
          <p className="max-w-md rounded-2xl bg-paper/90 px-5 py-3 text-[15px] leading-relaxed text-ink/65">
            Single-origin espresso, slow pour-overs, and pastries baked
            before sunrise — a warm room built for the first hour of your
            day.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#menu"
              className="inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream hover:bg-maroon transition-colors"
            >
              View the Menu
            </a>
            <a
              href="#visit"
              className="inline-flex items-center rounded-full border border-ink/25 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink hover:border-rust hover:text-rust transition-colors"
            >
              Visit Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
