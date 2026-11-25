import LazyMap from "./LazyMap";

const HOURS = [
  { day: "Monday — Friday", time: "6:00 AM – 6:00 PM" },
  { day: "Saturday", time: "7:00 AM – 7:00 PM" },
  { day: "Sunday", time: "7:00 AM – 4:00 PM" },
];

const ADDRESS = "1700 Christian Street, Philadelphia, PA 19146";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  ADDRESS
)}&z=16&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS
)}`;

export default function Visit() {
  return (
    <section id="visit" className="bg-ink-950 text-cream halftone-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16 items-start">
          <div>
            <p className="page-mark text-maroon-light mb-5">Visit — Fig. 04</p>
            <h2 className="font-display text-4xl sm:text-5xl text-balance">
              <span className="grain-text [--grain-color:var(--cream)]">Find your table</span>
              <br />
              <span className="grain-text [--grain-color:var(--rust)] italic font-normal">
                before the rush.
              </span>
            </h2>

            <div className="mt-10 space-y-8 max-w-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-cream/55 mb-2">
                  Address
                </p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xl hover:text-rust transition-colors"
                >
                  1700 Christian Street
                  <br />
                  Philadelphia, PA 19146
                </a>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-cream/55 mb-2">
                  Hours
                </p>
                <dl className="space-y-1.5">
                  {HOURS.map((h) => (
                    <div
                      key={h.day}
                      className="flex items-baseline justify-between gap-4 text-[14.5px]"
                    >
                      <dt className="text-cream/70">{h.day}</dt>
                      <dd className="font-medium">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-cream/55 mb-2">
                  Contact
                </p>
                <p className="text-[14.5px] space-x-1">
                  <a href="tel:+15551234567" className="hover:text-rust transition-colors">
                    (555) 123-4567
                  </a>
                  <span className="text-cream/30">·</span>
                  <a href="mailto:hello@auroracafe.com" className="hover:text-rust transition-colors">
                    hello@auroracafe.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${ADDRESS} in Google Maps`}
            className="group relative block aspect-[4/3] md:aspect-square overflow-hidden rounded-3xl ring-1 ring-cream/10"
          >
            <LazyMap src={MAPS_EMBED_SRC} title={`Map showing Aurora Cafe at ${ADDRESS}`} />
            <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/15 transition-colors" />
            <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full bg-ink-950/90 px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] text-cream">
              <span>Aurora Cafe · Philadelphia</span>
              <span className="text-rust">Open in Maps →</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
