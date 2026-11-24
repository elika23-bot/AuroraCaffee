import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Visit from "@/components/Visit";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ScrollMotion from "@/components/ScrollMotion";
import WinterDecor from "@/components/WinterDecor";
import { imageExists } from "@/lib/images";

export default function Home() {
  const hasLogo = imageExists("/images/logo.png");

  return (
    <>
      <Header hasLogo={hasLogo} />
      <main>
        {/* Hero and Story share one background layer so the winter pattern
            flows across their shared edge instead of resetting per section. */}
        <div className="relative overflow-hidden bg-paper">
          <WinterDecor className="pointer-events-none absolute inset-0 z-0 hidden w-full opacity-60 md:block" />
          <div className="relative z-10">
            <Hero />
            <Story />
          </div>
        </div>
        <Menu />
        <Gallery />
        <Visit />
        {/* Same treatment for Events and Testimonials. */}
        <div className="relative overflow-hidden bg-paper">
          <WinterDecor className="pointer-events-none absolute inset-0 z-0 hidden w-full opacity-60 md:block" />
          <div className="relative z-10">
            <Events />
            <Testimonials />
          </div>
        </div>
      </main>
      <Footer />
      <ScrollMotion />
    </>
  );
}
