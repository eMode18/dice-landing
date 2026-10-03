import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { heroFeatures } from "../../data/content";
import heroImage from "../../assets/hero-connected.webp";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: skip the choreographed entrance — everything stays
      // visible from the start instead of being gated behind a timeline.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-in], [data-hero-visual]", { opacity: 1, y: 0, scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          "[data-hero-in]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        ).fromTo(
          "[data-hero-visual]",
          { opacity: 0, y: 20, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          0.15,
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="home" ref={rootRef} className="relative isolate overflow-hidden pb-6 pt-[96px] sm:pb-10 sm:pt-[104px] lg:pb-8 lg:pt-[112px]">
      {/* Soft blue wash behind the visual, as in the mockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-24 -z-10 h-[680px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(31,107,255,0.10),transparent)] dark:bg-[radial-gradient(closest-side,rgba(31,107,255,0.18),transparent)]"
      />

      {/* Phones/tablets: copy → CTAs → image → features, so the product shows on
          the first screen. Small laptops (lg): copy beside the image, features in
          a full-width row below. Desktop (xl): copy and features stacked on the
          left, the image spanning both rows on the right. */}
      <Container className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_auto] lg:gap-x-6 lg:gap-y-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:gap-x-4 xl:gap-y-12">
        <div className="flex flex-col items-start lg:col-start-1 lg:row-start-1 xl:self-end">
          <h1
            data-hero-in
            className="text-balance font-display text-[clamp(2rem,8.6vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-dice-navy dark:text-white lg:text-[2.85rem] xl:max-w-[13ch] xl:text-[3.6rem]"
          >
            Stay connected wherever you are
          </h1>

          <p data-hero-in className="mt-5 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:mt-6 sm:max-w-lg sm:text-[1.05rem]">
            Fast, reliable and affordable public WiFi hotspots across Kenya. Work, stream, learn and stay in touch —
            from the places you love.
          </p>

          <div data-hero-in className="mt-7 flex w-full flex-col gap-3 xs:w-auto xs:flex-row sm:mt-8 sm:gap-4">
            <Button href="/hotspots" className="w-full xs:w-auto">
              Find a Hotspot
              <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button href="/plans" variant="outline" className="w-full px-9 xs:w-auto">
              View Plans
            </Button>
          </div>
        </div>

        <div data-hero-visual className="relative mx-auto w-full max-w-[640px] lg:col-start-2 lg:row-start-1 lg:-mr-6 lg:max-w-none xl:row-span-2 xl:-mr-16">
          <img
            src={heroImage}
            width={1200}
            height={763}
            fetchPriority="high"
            alt="The Dice WiFi app showing a 120 Mbps connection, next to a smiling woman using her phone at a Dice WiFi hotspot"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </div>

        <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-2 lg:row-start-2 xl:col-span-1 xl:col-start-1 xl:w-[630px] xl:self-start">
          {heroFeatures.map((item) => (
            <li data-hero-in key={item.title} className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-dice-accent shadow-[0_4px_14px_-6px_rgba(15,31,69,0.18)] dark:border-white/10 dark:bg-white/5 dark:text-dice-cyan">
                <Icon name={item.icon} className="h-[1.1rem] w-[1.1rem]" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-dice-navy dark:text-white">{item.title}</span>
                <span className="text-[0.8rem] leading-snug text-slate-500 dark:text-slate-400">{item.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
