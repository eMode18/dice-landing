import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { plans } from "../../data/content";

export function Plans() {
  return (
    <section id="plans" className="relative isolate overflow-hidden bg-white py-20 dark:bg-dice-ink sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-linear-to-b from-dice-mist to-white dark:from-dice-ink/40 dark:to-dice-ink" />
      <div className="pointer-events-none absolute -right-40 top-32 -z-10 h-96 w-96 rounded-full bg-dice-blue/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-dice-cyan/10 blur-[120px]" />

      <Container className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
        <SectionHeading
          title="Choose Your Plan"
          subtitle="Flexible internet plans for every lifestyle — pick one in seconds, upgrade or cancel anytime."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-4 xl:gap-6">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.06} className="h-full">
              <article
                className={`group relative flex h-full flex-col gap-7 overflow-hidden rounded-[28px] border px-7 py-9 transition-all duration-400 hover:-translate-y-2 sm:px-8 ${
                  plan.popular
                    ? "border-dice-blue/30 bg-linear-to-b from-dice-dark to-[#062a6b] text-white shadow-[0_36px_90px_-28px_rgba(0,102,255,0.55)]"
                    : "glass border-slate-200/70 text-dice-ink shadow-[0_22px_60px_-30px_rgba(10,61,145,0.35)] hover:border-dice-blue/30 hover:shadow-[0_36px_90px_-28px_rgba(0,102,255,0.3)] dark:text-white dark:shadow-[0_22px_60px_-30px_rgba(0,0,0,0.5)]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    <Icon name="star" className="h-3.5 w-3.5 text-dice-cyan" />
                    Most Popular
                  </span>
                )}

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-xl font-semibold sm:text-2xl">{plan.name}</h3>
                  <p className={`text-sm leading-relaxed ${plan.popular ? "text-white/65" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-end gap-1.5">
                  <span className="font-display text-4xl font-semibold sm:text-5xl">{plan.price}</span>
                  <span className={`pb-1.5 text-sm font-medium ${plan.popular ? "text-white/60" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm sm:text-[0.95rem]">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.popular ? "bg-white/15 text-dice-cyan" : "bg-dice-blue/10 text-dice-blue"
                        }`}
                      >
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      <span className={plan.popular ? "text-white/85" : "text-slate-600 dark:text-slate-300"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 ${
                    plan.popular ? "bg-dice-cyan/30 opacity-70" : "bg-dice-blue/10 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
