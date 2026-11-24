"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import CartButton from "./CartButton";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit" },
  { href: "#events", label: "Events" },
];

export default function Header({ hasLogo = false }: { hasLogo?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? "text-cream" : "text-ink";
  const textMuted = scrolled ? "text-cream/75" : "text-ink/70";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ink-950/95 border-b border-cream/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-18 py-3">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          {hasLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/images/logo.png" alt="Aurora Cafe" className="h-10 w-10" />
          ) : (
            <Logo theme="dark" className="h-10 w-10" />
          )}
          <span className={`font-display text-lg tracking-wide ${textColor}`}>
            Aurora <span className="text-rust italic">Cafe</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-[13px] uppercase tracking-[0.16em] hover:text-rust transition-colors ${textMuted}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartButton className={textColor} />
          <a
            href="#visit"
            className="hidden md:inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-maroon transition-colors"
          >
            Visit Us
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`md:hidden p-2 -mr-2 ${textColor}`}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`h-[1.5px] bg-current transition-transform ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] bg-current transition-transform ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-paper border-t border-ink/10 px-6 py-6 flex flex-col gap-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.16em] text-ink/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#visit"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
          >
            Visit Us
          </a>
        </div>
      )}
    </header>
  );
}
