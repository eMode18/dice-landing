import { useRef } from "react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { CarouselDots } from "../ui/CarouselDots";
import { useSiteData } from "../../context/useSiteData";
import { useSnapIndex } from "../../lib/useSnapIndex";
/* Phones: a horizontal swipe row (scroll-snap, next card peeking) that bleeds
   to the screen edge. sm: 2×2 grid. xl: 4 columns. */
const ROW =
  "relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 pt-3 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4";
const CELL = "w-[82%] shrink-0 snap-center sm:w-auto";

export function Plans() {
  const { plans, loading, error } = useSiteData();
  const rowRef = useRef<HTMLDivElement>(null);
  const active = useSnapIndex(rowRef, plans.length);

  return (
    <section id="plans" className="relative scroll-mt-16 py-12 sm:py-14 lg:py-16">
      <Container className="flex flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title={<>Choose the plan that <br className="hidden sm:block" />fits your needs</>}
            subtitle="Flexible passes for every moment — from quick browsing to all-day productivity."
          />
          <Reveal className="flex items-center gap-3 lg:pb-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-dice-accent shadow-[0_4px_14px_-6px_rgba(15,31,69,0.18)] dark:border-white/10 dark:bg-white/5 dark:text-dice-cyan">
              <Icon name="shieldCheck" className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <p className="max-w-[15rem] text-[0.8rem] leading-snug text-slate-500 dark:text-slate-400">
              No subscriptions. No contracts. Just pay and connect.
            </p>
          </Reveal>
        </div>

        {error && !loading && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Unable to load plans right now. Please try again shortly.
          </p>
        )}

        {loading ? (
          <div className={ROW}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`${CELL} h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-white/10 dark:bg-white/5`}
              />
            ))}
          </div>
        ) : (
          <>
          <div ref={rowRef} role="region" aria-label="Plans — swipe to see more" className={`${ROW} sm:pt-3`}>
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.06} className={`${CELL} h-auto ${plan.popular ? "order-first sm:order-none" : ""}`}>
                <article
                  className={`relative flex h-full flex-col rounded-2xl border bg-white px-6 pb-6 pt-7 transition-all duration-300 hover:-translate-y-1 dark:bg-white/3 ${
                    plan.popular
                      ? "border-dice-accent shadow-[0_18px_40px_-20px_rgba(31,107,255,0.45)] ring-1 ring-dice-accent dark:border-dice-cyan/70 dark:ring-dice-cyan/40"
                      : "border-slate-200/90 hover:shadow-[0_18px_40px_-24px_rgba(15,31,69,0.25)] dark:border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-5 rounded-full bg-dice-accent px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <h3 className="font-body text-[0.95rem] font-medium text-slate-700 dark:text-slate-300">{plan.name}</h3>
                  <p className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="whitespace-nowrap font-display text-[1.75rem] font-bold tracking-[-0.02em] text-dice-navy dark:text-white">
                      {plan.price}
                    </span>
                    <span className="whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </p>

                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Icon name="check" className="h-4 w-4 shrink-0 text-dice-accent dark:text-dice-cyan" strokeWidth={2.4} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="/hotspots"
                    size="sm"
                    variant={plan.popular ? "primary" : "outline"}
                    className="mt-7 min-h-11 w-full"
                    aria-label={`Get started with ${plan.name}`}
                  >
                    Get Started
                  </Button>
                </article>
              </Reveal>
            ))}
          </div>
          <CarouselDots count={plans.length} active={active} className="-mt-2 sm:hidden" />
          </>
        )}
      </Container>
    </section>
  );
}
