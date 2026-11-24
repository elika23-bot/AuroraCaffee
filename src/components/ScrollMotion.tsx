"use client";

import { useEffect, useRef } from "react";

/**
 * Page-wide scroll motion, styled in globals.css:
 *  - content in each section rises into place as it scrolls into view,
 *    with grids and lists staggering their items one after another
 *  - a hairline progress bar tracks how far down the page you are
 *
 * Targets are found automatically (each section's content wrapper), so
 * sections need no extra markup. Anything already on screen at load is
 * left alone, so nothing flashes or hides on first paint.
 *
 * Performance: nothing runs per scroll frame except one transform on the
 * progress bar. Reveals are pure CSS transitions on opacity/transform, and
 * each element's attributes are cleared once it lands so its temporary
 * GPU layer is released.
 */
const REVEAL_MS = 1100;
const STAGGER_MS = 90;

export default function ScrollMotion() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets: HTMLElement[] = [];
    const wrappers = document.querySelectorAll<HTMLElement>(
      "main section:not(:first-child) > div.mx-auto, footer > div.mx-auto",
    );
    wrappers.forEach((wrapper) => {
      Array.from(wrapper.children).forEach((child) => {
        const el = child as HTMLElement;
        const display = getComputedStyle(el).display;
        const isGroup =
          (display === "grid" || el.tagName === "UL" || el.tagName === "OL") &&
          el.children.length > 1;
        if (isGroup) {
          Array.from(el.children).forEach((item, i) => {
            (item as HTMLElement).style.setProperty("--reveal-i", String(Math.min(i, 6)));
            targets.push(item as HTMLElement);
          });
        } else {
          targets.push(el);
        }
      });
    });

    const below = targets.filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
    );
    below.forEach((el) => el.setAttribute("data-reveal", ""));

    const timers = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.setAttribute("data-revealed", "");
          const i = Number(el.style.getPropertyValue("--reveal-i") || 0);
          const timer = window.setTimeout(() => {
            el.removeAttribute("data-reveal");
            el.removeAttribute("data-revealed");
            timers.delete(timer);
          }, REVEAL_MS + i * STAGGER_MS + 100);
          timers.add(timer);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    below.forEach((el) => observer.observe(el));

    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      targets.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.removeAttribute("data-revealed");
      });
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden />;
}
