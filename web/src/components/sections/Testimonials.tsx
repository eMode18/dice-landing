import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Icon } from "../ui/Icon";
import { testimonials } from "../../data/content";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const total = testimonials.length;

  const go = (dir: 1 | -1) => {
    const next = (index + dir + total) % total;
    const card = cardRef.current;
    if (!card) {
      setIndex(next);
      return;
    }
    gsap.to(card, {
      opacity: 0,
      x: dir * -40,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        setIndex(next);
        gsap.fromTo(
          card,
          { opacity: 0, x: dir * 40 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
        );
      },
    });
  };

  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
        }
      );
    },
    { scope: cardRef }
  );

  const t = testimonials[index];

  return (
    <section id="testimonials" className="relative isolate overflow-hidden bg-white py-20 dark:bg-dice-ink sm:py-28 lg:py-32">
      <div className="mesh-gradient pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[480px] -translate-y-1/2 opacity-[0.06]" />

      <Container className="flex flex-col items-center gap-12 sm:gap-16">
        <SectionHeading title="Loved by Thousands of Users" />

        <div className="relative w-full max-w-3xl">
          <div
            ref={cardRef}
            className="glass relative flex flex-col items-center gap-6 rounded-[32px] border-slate-200/70 px-6 py-10 text-center shadow-[0_36px_90px_-32px_rgba(10,61,145,0.35)] sm:px-12 sm:py-14"
          >
            <span className="absolute left-6 top-6 font-display text-6xl text-dice-blue/10 sm:left-10 sm:top-8 sm:text-7xl">"</span>

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-dice-blue to-dice-dark font-display text-lg font-semibold text-white shadow-lg shadow-dice-blue/30 sm:h-20 sm:w-20 sm:text-xl">
              {t.initials}
            </div>

            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Icon key={i} name="star" className="h-4 w-4 fill-amber-400 sm:h-5 sm:w-5" />
              ))}
            </div>

            <p className="max-w-xl text-balance text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg lg:text-xl">
              "{t.quote}"
            </p>

            <div>
              <p className="font-display text-base font-semibold text-dice-ink dark:text-white sm:text-lg">{t.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-dice-ink shadow-sm transition-all hover:-translate-x-0.5 hover:border-dice-blue/40 hover:text-dice-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-dice-cyan/40 dark:hover:text-dice-cyan"
            >
              <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-7 bg-dice-blue" : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/15 dark:hover:bg-white/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-dice-ink shadow-sm transition-all hover:translate-x-0.5 hover:border-dice-blue/40 hover:text-dice-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-dice-cyan/40 dark:hover:text-dice-cyan"
            >
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
