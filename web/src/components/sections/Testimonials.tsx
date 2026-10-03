import { useRef } from "react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { CarouselDots } from "../ui/CarouselDots";
import { testimonials } from "../../data/content";
import { useSnapIndex } from "../../lib/useSnapIndex";

const avatarTints = [
  "bg-[#dbe7ff] text-dice-accent",
  "bg-[#d9f2ea] text-emerald-700",
  "bg-[#fde8d7] text-orange-700",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function Testimonials() {
  const rowRef = useRef<HTMLDivElement>(null);
  const active = useSnapIndex(rowRef, testimonials.length);

  return (
    <section id="testimonials" className="relative scroll-mt-16 py-12 sm:py-14">
      <Container className="flex flex-col gap-8 sm:gap-10">
        <SectionHeading title="What our users say" />

        {/* Phones: swipe row. Tablets: one card per row (short quotes). lg: 3 columns. */}
        <Reveal>
          <div
            ref={rowRef}
            role="region"
            aria-label="Testimonials — swipe to see more"
            className="relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-1 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          >
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="flex w-[88%] shrink-0 snap-center flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 sm:flex-row sm:p-6 dark:border-white/10 dark:bg-white/3 sm:w-auto"
            >
              <span
                aria-hidden
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm sm:h-14 sm:w-14 sm:text-base font-semibold ${avatarTints[i % avatarTints.length]}`}
              >
                {initials(t.name)}
              </span>
              <div className="flex flex-col gap-3">
                <blockquote className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{t.quote}”</blockquote>
                <figcaption className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-dice-navy dark:text-white">{t.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
                </figcaption>
                <div className="flex gap-0.5 text-amber-400" role="img" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Icon key={s} name="star" className="h-4 w-4 fill-current" strokeWidth={1.2} />
                  ))}
                </div>
              </div>
            </figure>
          ))}
          </div>
          <CarouselDots count={testimonials.length} active={active} className="mt-4 sm:hidden" />
        </Reveal>
      </Container>
    </section>
  );
}
