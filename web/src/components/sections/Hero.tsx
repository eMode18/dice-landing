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
    <section id="home" ref={rootRef} className="relative isolate pb-10 pt-20 sm:pb-12 sm:pt-24 lg:pb-16 lg:pt-28">
      <Container className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10 xl:gap-14">
        <div className="flex flex-col items-start gap-5 text-left sm:gap-7">
          <h1 className="font-display max-w-xl leading-[1.1] font-semibold text-dice-ink perspective-midrange dark:text-white">
            <span data-hero-line className="block text-[2.4rem] sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem] xl:text-[3.85rem]">
              Dice WiFi
            </span>
            <span data-hero-line className="mt-2 block text-xl font-medium text-dice-blue sm:text-2xl lg:text-[1.75rem] dark:text-dice-cyan">
              Plans from KSh 10
            </span>
          </h1>

          <p
            data-hero-sub
            className="max-w-lg text-base leading-relaxed text-slate-600 dark:text-white/65 sm:text-lg"
          >
            Connect to any Dice hotspot, choose a plan, pay with M-Pesa, and
            start browsing. Works on any device with no app or setup required.
          </p>

          <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4">
            <span data-hero-cta>
              <Button href="#plans" size="lg">
                View Plans
                <Icon
                  name="arrowRight"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </span>
            <span data-hero-cta>
              <Button
                href="#how-it-works"
                variant="secondary"
                size="lg"
                className="dark:border-white/35 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
              >
                How It Works
              </Button>
            </span>
          </div>

          <dl className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
            {trustIndicators.map((item) => (
              <div
                data-hero-trust
                key={item.label}
                className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-white/75"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dice-blue/20 bg-dice-blue/8 text-dice-blue backdrop-blur-md dark:border-white/15 dark:bg-white/8 dark:text-dice-cyan">
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
