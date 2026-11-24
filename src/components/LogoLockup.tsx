import Badge from "./Badge";

type LogoLockupProps = {
  className?: string;
  theme?: "light" | "dark";
};

/** Full text+sun brand lockup, shown wherever /public/images/logo.png
 *  (the real logo file) hasn't been added yet. */
export default function LogoLockup({
  className,
  theme = "light",
}: LogoLockupProps) {
  const word = theme === "dark" ? "text-cream" : "text-ink-950";
  const rule = theme === "dark" ? "bg-cream/40" : "bg-ink-950/30";

  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <Badge className="h-14 w-14 mb-2" />
      <p className={`font-display text-3xl leading-none ${word}`}>Aurora</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`h-px w-5 ${rule}`} />
        <span className={`text-[11px] tracking-[0.3em] uppercase ${word}`}>
          Cafe
        </span>
        <span className={`h-px w-5 ${rule}`} />
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-rust font-semibold">
        Rise With The Sun
      </p>
    </div>
  );
}
