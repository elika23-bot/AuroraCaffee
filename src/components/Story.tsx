import Image from "next/image";
import { imageExists } from "@/lib/images";

const STORY_PHOTO = "/images/gallery/window-seat.png";

const STATS = [
  { value: "2019", label: "Year Founded" },
  { value: "12", label: "Origins on Rotation" },
  { value: "6am", label: "Doors Open Daily" },
];

export default function Story() {
  return (
    <section id="story" className="relative overflow-hidden grain py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <div className="inline-block rounded-[28px] bg-paper/90 px-7 py-6 sm:px-9 sm:py-8">
              <p className="page-mark text-rust mb-5">Our Story — Fig. 01</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.03] text-balance">
                <span className="grain-text">Slow mornings,</span>
                <br />
                <span className="grain-text [--grain-color:var(--maroon)] italic font-normal">
                  well made.
                </span>
              </h2>

              <div className="mt-8 space-y-5 max-w-xl text-[15.5px] leading-[1.8] text-ink/75">
                <p>
                  Aurora opened on a corner that catches the first light of
                  the street — which is, more or less, the whole idea. We
                  roast in small batches, pull shots to order, and let a
                  pour-over take as long as it needs to take.
                </p>
                <p>
                  <span className="font-semibold text-ink">
                    No syrup walls, no rush.
                  </span>{" "}
                  Just twelve rotating origins, a bake case refreshed at dawn,
                  and a room built for people who like their coffee the way
                  they like their mornings — unhurried, but never late.
                </p>
              </div>

              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-ink/10 pt-8">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-3xl sm:text-4xl text-maroon">
                      {s.value}
                    </dd>
                    <dd className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/62">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative mx-auto max-w-sm md:rotate-1">
              <div className="relative overflow-hidden rounded-[24px] shadow-[0_30px_60px_-25px_rgba(28,19,15,0.45)] ring-1 ring-ink/5 aspect-[4/5] bg-paper-deep">
                {imageExists(STORY_PHOTO) ? (
                  <Image
                    src={STORY_PHOTO}
                    alt="A latte and a slice of banana bread on the windowsill at Aurora Cafe"
                    fill
                    sizes="(min-width: 768px) 384px, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-ink/62">
                      Photo coming soon
                    </span>
                  </div>
                )}
              </div>
              <p className="page-mark mt-4 text-center text-ink/62">
                <span className="rounded-full bg-paper/90 px-3 py-1">
                  Aurora House Blend — Roasted Weekly
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
