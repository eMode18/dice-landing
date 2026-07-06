import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { features } from "../../data/content";

export function WhyChooseUs() {
  return (
    <section id="features" className="relative bg-dice-mist py-20 dark:bg-dice-ink sm:py-28 lg:py-32">
      <Container className="flex flex-col gap-14 sm:gap-18 lg:gap-22">
        <SectionHeading
          eyebrow="Why Dice"
          title="Why Thousands Trust Dice Ltd."
          subtitle="We obsess over the details that make getting online effortless: speed, simplicity, and security."
          align="left"
        />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12 lg:gap-16">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <article className="group relative flex flex-col gap-7 border-t-2 border-slate-300/70 pt-8 transition-colors duration-300 hover:border-dice-blue dark:border-white/15 dark:hover:border-dice-cyan">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-dice-blue text-white shadow-[0_8px_24px_-8px_rgba(0,102,255,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_14px_36px_-8px_rgba(0,102,255,0.65)]">
                  <Icon name={feature.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-display text-xl font-semibold text-dice-ink dark:text-white sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[0.95rem]">
                    {feature.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
