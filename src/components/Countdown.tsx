"use client";

import { useEffect, useRef, useState } from "react";

type CountdownProps = {
  /** ISO datetime string of the target moment. */
  target: string;
  completedLabel?: string;
  className?: string;
  /** "sm" for tight spaces like a sidebar list, "md" for a featured card. */
  size?: "sm" | "md";
};

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function computeRemaining(targetMs: number): Remaining {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(diff / (1000 * 60)) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: false,
  };
}

const SIZES = {
  sm: {
    gap: "gap-1.5",
    card: "w-10 h-10 text-xl",
    label: "text-[9px] mt-1",
  },
  md: {
    gap: "gap-2.5 sm:gap-4",
    card: "w-16 h-16 sm:w-24 sm:h-24 text-4xl sm:text-6xl",
    label: "text-[11px] sm:text-sm mt-2",
  },
} as const;

/** One flip-clock tile: a dark card with the fold seam and a quick
 *  rotateX "flip" whenever its value changes. */
function FlipUnit({
  value,
  label,
  sizeKey,
}: {
  value: number;
  label: string;
  sizeKey: keyof typeof SIZES;
}) {
  const sizes = SIZES[sizeKey];
  const [flipping, setFlipping] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;
    setFlipping(true);
    const timeout = setTimeout(() => setFlipping(false), 320);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-md bg-ink-950 shadow-lg [perspective:200px] ${
          sizes.card
        } ${flipping ? "animate-flip-tick" : ""}`}
      >
        <span className="font-display font-bold leading-none text-gold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
        {/* fold seam, like the crease between a flip clock's two flaps */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/50" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/[0.06]" />
      </div>
      <span className={`uppercase tracking-[0.12em] text-ink/40 ${sizes.label}`}>{label}</span>
    </div>
  );
}

/** Live flip-clock countdown, ticking every second. Renders an invisible
 *  placeholder on first paint (server can't know "now" precisely) and
 *  fills in right after mount — avoids a hydration mismatch. */
export default function Countdown({
  target,
  completedLabel = "Happening now",
  className,
  size = "md",
}: CountdownProps) {
  const targetMs = new Date(target).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // Date.now() is impure, so the initial value is computed after mount
    // (matches the server's blank-placeholder first paint) rather than
    // during render — this is a one-time external-clock read, not
    // cascading app state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(computeRemaining(targetMs));
    const id = setInterval(() => setRemaining(computeRemaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (!remaining) {
    return (
      <div className={`flex items-start ${SIZES[size].gap} opacity-0 ${className ?? ""}`} aria-hidden="true">
        <FlipUnit value={0} label="Days" sizeKey={size} />
        <FlipUnit value={0} label="Hrs" sizeKey={size} />
        <FlipUnit value={0} label="Min" sizeKey={size} />
        <FlipUnit value={0} label="Sec" sizeKey={size} />
      </div>
    );
  }

  if (remaining.done) {
    return (
      <span
        className={`inline-block text-[12px] font-semibold uppercase tracking-[0.08em] text-rust ${className ?? ""}`}
      >
        {completedLabel}
      </span>
    );
  }

  return (
    <div className={`flex items-start ${SIZES[size].gap} ${className ?? ""}`}>
      <FlipUnit value={remaining.days} label="Days" sizeKey={size} />
      <FlipUnit value={remaining.hours} label="Hrs" sizeKey={size} />
      <FlipUnit value={remaining.minutes} label="Min" sizeKey={size} />
      <FlipUnit value={remaining.seconds} label="Sec" sizeKey={size} />
    </div>
  );
}
