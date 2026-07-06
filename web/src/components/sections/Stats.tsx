import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { stats } from "../../data/content";

function formatValue(raw: number, suffix: string) {
  if (suffix === "%") return raw.toFixed(1);
  if (suffix === "/7") return Math.round(raw).toString();
  return Math.round(raw).toLocaleString("en-US");
}

export function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
        }
      );

      cards.forEach((card) => {
        const valueEl = card.querySelector<HTMLElement>("[data-stat-value]");
        if (!valueEl) return;
        const target = Number(valueEl.dataset.value);
        const suffix = valueEl.dataset.suffix ?? "";
        const counter = { val: 0 };

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                valueEl.textContent = `${formatValue(counter.val, suffix)}${suffix}`;
              },
            }),
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative bg-dice-mist py-20 dark:bg-dice-ink sm:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-7">
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-stat-card
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white px-5 py-8 text-center shadow-[0_18px_50px_-24px_rgba(10,61,145,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_-20px_rgba(0,102,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)] sm:px-7 sm:py-10"
            >
              <div className="pointer-events-none absolute inset-x-6 -top-10 h-24 rounded-full bg-dice-blue/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <p className="font-display text-3xl font-semibold text-dice-ink dark:text-white sm:text-4xl lg:text-[2.6rem]">
                <span data-stat-value data-value={stat.value} data-suffix={stat.suffix}>
                  0{stat.suffix}
                </span>
              </p>
              <p className="mt-2.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
