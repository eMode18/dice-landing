import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { steps } from "../../data/content";

const stepIcons = ["wifi", "user", "layers", "bolt"] as const;

export function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-progress-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-step-dot]").forEach((dot, i) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: dot, start: "top 80%" },
            delay: i * 0.05,
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="how-it-works" ref={rootRef} className="relative isolate overflow-hidden bg-dice-mist py-20 dark:bg-dice-ink sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-80 w-80 rounded-full bg-dice-blue/5 blur-[120px]" />

      <Container className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
        <SectionHeading
          eyebrow="Getting Started"
          title="Getting Online is Easy"
          subtitle="Four simple steps stand between you and a fast, secure connection — no technician visits, no waiting in line."
        />

        <div className="relative">
          {/* connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-8 -z-10 hidden h-0.5 bg-slate-200 dark:bg-white/10 lg:block">
            <div data-progress-line className="h-full w-full origin-left scale-x-0 bg-linear-to-r from-dice-blue to-dice-cyan" />
          </div>
          {/* connecting line (mobile/tablet — vertical) */}
          <div className="absolute bottom-6 left-7 top-6 -z-10 w-0.5 bg-slate-200 dark:bg-white/10 lg:hidden">
            <div className="h-full w-full bg-linear-to-b from-dice-blue to-dice-cyan" style={{ transform: "scaleY(1)" }} />
          </div>

          <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} as="li" className="relative flex gap-5 lg:flex-col lg:gap-6">
                <div
                  data-step-dot
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-dice-blue shadow-[0_14px_40px_-16px_rgba(0,102,255,0.5)] ring-4 ring-dice-mist dark:bg-dice-ink dark:text-dice-cyan dark:ring-white/10 lg:h-16 lg:w-16"
                >
                  <Icon name={stepIcons[i]} className="h-6 w-6 lg:h-7 lg:w-7" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dice-blue font-display text-[11px] font-bold text-white shadow-md">
                    {i + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pb-2 lg:pb-0">
                  <h3 className="font-display text-base font-semibold text-dice-ink dark:text-white sm:text-lg">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
