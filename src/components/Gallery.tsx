import Image from "next/image";
import WinterDecor from "./WinterDecor";
import { imageExists } from "@/lib/images";

type Tile = {
  label: string;
  src: string;
  from: string;
  to: string;
  span?: string;
  /** Focal point for object-cover cropping, so any photo size fits the tile. */
  position?: string;
};

const TILES: Tile[] = [
  {
    label: "Window Seat",
    src: "/images/gallery/window-seat.png",
    from: "#4f1c24",
    to: "#1c130f",
    span: "md:col-span-2 md:row-span-2",
    position: "center 85%",
  },
  {
    label: "Latte Art",
    src: "/images/gallery/latte-art.png",
    from: "#c1622e",
    to: "#954b23",
  },
  {
    label: "To Go",
    src: "/images/gallery/to-go.png",
    from: "#1a1a1a",
    to: "#1c130f",
  },
  {
    label: "Afternoon Treat",
    src: "/images/gallery/afternoon-treat.png",
    from: "#ab5361",
    to: "#7c2d3a",
  },
  {
    label: "The Bake Case",
    src: "/images/gallery/bake-case.png",
    from: "#c1622e",
    to: "#7a3a20",
    span: "md:col-span-2",
    position: "center 55%",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-paper grain py-24 md:py-28">
      <WinterDecor className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full opacity-60 md:block" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-block rounded-[28px] bg-paper/90 px-8 py-6">
            <p className="page-mark text-rust mb-5">In the Room — Fig. 03</p>
            <h2 className="font-display text-4xl sm:text-5xl text-balance">
              <span className="grain-text">A little light,</span>
              <br />
              <span className="grain-text [--grain-color:var(--maroon)] italic font-normal">
                a lot of steam.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[170px] gap-4">
          {TILES.map((t) => (
            <div
              key={t.label}
              className={`group relative overflow-hidden rounded-2xl ${t.span ?? ""}`}
              style={{
                backgroundImage: `linear-gradient(155deg, ${t.from}, ${t.to})`,
              }}
            >
              {imageExists(t.src) ? (
                <Image
                  src={t.src}
                  alt={t.label}
                  fill
                  sizes={t.span ? "(min-width: 768px) 576px, 50vw" : "(min-width: 768px) 288px, 50vw"}
                  style={{ objectPosition: t.position ?? "center" }}
                  className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-90 sepia-[0.35] saturate-[1.3]"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.14em] text-cream/50">
                  Photo coming soon
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
              <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/15 transition-colors" />
              <span className="absolute bottom-3 left-4 right-4 text-[11px] uppercase tracking-[0.14em] text-cream/90">
                {t.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[12px] text-ink/40">
          <span className="rounded-full bg-paper/90 px-3 py-1">
            Real corners of the cafe — new photos added seasonally.
          </span>
        </p>
      </div>
    </section>
  );
}
