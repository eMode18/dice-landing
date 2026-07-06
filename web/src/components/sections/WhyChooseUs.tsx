import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { features } from "../../data/content";

export function WhyChooseUs() {
  return (
    <section id="features" className="relative bg-dice-mist py-20 dark:bg-dice-ink sm:py-28 lg:py-32">
      <Container className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
        <SectionHeading
          title="Why Thousands Trust Dice Ltd."
          subtitle="We obsess over the details that make getting online effortless: speed, simplicity, and security."
          align="left"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-7">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.07} className="h-full">
              <article className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(10,61,145,0.3)] transition-all duration-400 hover:-translate-y-2 hover:border-dice-blue/25 hover:shadow-[0_30px_70px_-26px_rgba(0,102,255,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.5)] dark:hover:border-dice-cyan/25 sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-dice-blue/10 to-dice-cyan/10 text-dice-blue transition-all duration-400 group-hover:scale-110 group-hover:from-dice-blue group-hover:to-dice-dark group-hover:text-white dark:from-dice-blue/20 dark:to-dice-cyan/20 dark:text-dice-cyan">
                  <Icon name={feature.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-semibold text-dice-ink dark:text-white sm:text-xl">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[0.95rem]">{feature.description}</p>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-dice-blue/5 blur-2xl transition-opacity duration-400 group-hover:opacity-0" />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
