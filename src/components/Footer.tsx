import LogoLockup from "./LogoLockup";
import { imageExists } from "@/lib/images";

export default function Footer() {
  const hasLogo = imageExists("/images/logo.png");

  return (
    <footer className="bg-ink-950 text-cream">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2">
            {hasLogo ? (
              <div className="inline-flex h-24 w-40 items-center justify-center rounded-2xl bg-cream p-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="Aurora Cafe"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="inline-flex flex-col items-center rounded-2xl bg-cream px-6 py-5 mb-4">
                <LogoLockup />
              </div>
            )}
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-cream/60">
              A neighborhood coffeehouse built around single-origin espresso,
              slow pour-overs, and warm mornings.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-cream/45 mb-3">
              Explore
            </p>
            <ul className="space-y-2 text-[14px] text-cream/75">
              <li><a href="#story" className="hover:text-rust transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-rust transition-colors">Menu</a></li>
              <li><a href="#gallery" className="hover:text-rust transition-colors">Gallery</a></li>
              <li><a href="#visit" className="hover:text-rust transition-colors">Visit</a></li>
              <li><a href="#events" className="hover:text-rust transition-colors">Events</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-cream/45 mb-3">
              Follow
            </p>
            <ul className="space-y-2 text-[14px] text-cream/75">
              <li><a href="#" className="hover:text-rust transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-rust transition-colors">Facebook</a></li>
              <li><a href="mailto:hello@auroracafe.com" className="hover:text-rust transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-cream/45">
          <span>Aurora Cafe — Rise With The Sun</span>
          <span>1700 Christian Street · Philadelphia, PA 19146</span>
          <span>&copy; {new Date().getFullYear()} Aurora Cafe</span>
        </div>
      </div>
    </footer>
  );
}
