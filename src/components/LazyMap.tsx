"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Maps embed that only mounts once it scrolls near the viewport.
 * Native loading="lazy" isn't enough: on slow connections Chrome widens its
 * lazy-load distance so far that the ~600 KB of Maps scripts still load with
 * the page. Until then, the tile shows the section's dark ground.
 */
export default function LazyMap({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 bg-ink-900">
      {show && (
        <iframe
          src={src}
          title={title}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full pointer-events-none grayscale-[15%] contrast-[1.05]"
          style={{ border: 0 }}
        />
      )}
    </div>
  );
}
