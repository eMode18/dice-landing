import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { HeroVisual } from "./HeroVisual";
import { trustIndicators } from "../../data/content";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-line]",
        { opacity: 0, y: 44, rotateX: 35 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.12 }
      )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45"
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          "[data-hero-trust]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.3"
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative isolate overflow-hidden bg-dice-mist pb-20 pt-32 dark:bg-dice-ink sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44"
    >
      {/* Base: colored blobs for the glass to blur against */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-dice-blue/15 blur-[120px]" />
        <div className="absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-dice-cyan/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-dice-blue/8 blur-[100px]" />
      </div>

      {/* Glass layer */}
      <div className="absolute inset-0 -z-20 bg-white/65 backdrop-blur-3xl dark:bg-dice-ink/90" />

      {/* Noise grain texture */}
      <div className="noise-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.06]" />

      {/* Dark mode: keep the original mesh gradient underneath */}
      <div className="mesh-gradient pointer-events-none absolute inset-0 -z-20 opacity-0 dark:opacity-60" />

      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:gap-20">
        <div className="flex flex-col items-start gap-6 text-left sm:gap-7">
          <h1 className="font-display max-w-xl text-[2.5rem] leading-[1.08] font-semibold text-dice-ink perspective-midrange dark:text-white sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem] xl:text-[3.85rem]">
            <span data-hero-line className="block">Your WiFi Hotspot.</span>
            <span data-hero-line className="block text-dice-blue dark:text-dice-cyan">
              Plans from KSh 10.
            </span>
          </h1>

          <p data-hero-sub className="max-w-lg text-base leading-relaxed text-slate-600 dark:text-white/75 sm:text-lg">
            Connect to any Dice hotspot, choose a plan, pay with M-Pesa, and
            start browsing. Works on any device with no app or setup required.
          </p>

          <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4">
            <span data-hero-cta>
              <Button href="#plans" size="lg">
                View Plans
                <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </span>
            <span data-hero-cta>
              <Button href="#how-it-works" variant="secondary" size="lg" className="dark:border-white/35 dark:bg-transparent dark:text-white dark:hover:bg-white/10">
                How It Works
              </Button>
            </span>
          </div>

          <dl className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
            {trustIndicators.map((item) => (
              <div data-hero-trust key={item.label} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-white/80">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dice-blue/20 bg-dice-blue/8 text-dice-blue backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:text-dice-cyan">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <dt className="font-medium">{item.label}</dt>
                <dd className="sr-only">Available</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
