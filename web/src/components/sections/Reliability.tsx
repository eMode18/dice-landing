import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { reliability } from "../../data/content";

const illustrations: Record<string, React.ReactNode> = {
  gauge: (
    <div className="relative flex h-28 w-full items-end justify-center gap-1.5 sm:h-32">
      {[40, 70, 50, 90, 65, 100, 55].map((h, i) => (
        <span
          key={i}
          data-bar
          data-h={h}
          className="w-3 rounded-full bg-linear-to-t from-dice-blue/30 to-dice-blue sm:w-3.5"
          style={{ height: `${h * 0.28}%` }}
        />
      ))}
    </div>
  ),
  bolt: (
    <div className="relative flex h-28 w-full items-center justify-center sm:h-32">
      <span className="absolute h-20 w-20 rounded-full border border-dice-blue/15 sm:h-24 sm:w-24" />
      <span data-pulse className="absolute h-20 w-20 rounded-full border border-dice-blue/30 sm:h-24 sm:w-24" />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-dice-blue to-dice-dark text-white shadow-lg shadow-dice-blue/30 sm:h-16 sm:w-16">
        <Icon name="bolt" className="h-7 w-7" />
      </span>
    </div>
  ),
  wave: (
    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden sm:h-32">
      <svg viewBox="0 0 200 80" className="h-20 w-full text-dice-blue sm:h-24" fill="none">
        <path
          data-wave
          d="M0 50 C 30 20, 70 80, 100 50 S 170 20, 200 50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          data-wave
          d="M0 60 C 30 35, 70 85, 100 60 S 170 35, 200 60"
          stroke="#5ec8ff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </div>
  ),
};

export function Reliability() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((bar) => {
        const target = Number(bar.dataset.h);
        gsap.fromTo(
          bar,
          { height: "6%" },
          {
            height: `${target * 0.28}%`,
            duration: 1.4,
            ease: "elastic.out(1, 0.6)",
            scrollTrigger: { trigger: bar, start: "top 90%" },
          }
        );
      });

      gsap.to("[data-pulse]", {
        scale: 1.5,
        opacity: 0,
        duration: 2.2,
        ease: "power1.out",
        repeat: -1,
        transformOrigin: "center",
      });

      gsap.utils.toArray<SVGPathElement>("[data-wave]").forEach((path, i) => {
        gsap.to(path, {
          attr: {
            d:
              i === 0
                ? "M0 50 C 30 80, 70 20, 100 50 S 170 80, 200 50"
                : "M0 60 C 30 85, 70 35, 100 60 S 170 85, 200 60",
          },
          duration: 2.6 + i * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative bg-white py-20 dark:bg-dice-ink sm:py-28 lg:py-32">
      <Container className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
        <SectionHeading
          eyebrow="The Network"
          title="Built for Consistent Connectivity"
          subtitle="Behind every connection is a network engineered for predictable performance — day and night, peak hours included."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
          {reliability.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col gap-6 rounded-3xl border border-slate-200/70 bg-dice-mist/60 p-7 transition-all duration-400 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_30px_70px_-30px_rgba(10,61,145,0.35)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] sm:p-8">
                <div className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-6 dark:border-white/10 dark:bg-white/5">
                  {illustrations[item.icon]}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-semibold text-dice-ink dark:text-white sm:text-xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[0.95rem]">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
