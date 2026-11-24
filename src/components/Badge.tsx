import Logo from "./Logo";

/** Alias for the sun mark used inline in copy (e.g. "Wake [sun] Better.")
 *  and in LogoLockup. Renders the exact same glyph as the nav/footer logo
 *  so there's only ever one sun design across the site. */
export default function Badge({ className }: { className?: string }) {
  return <Logo theme="dark" className={className} />;
}
