import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { steps } from "../../data/content";
import parkImage from "../../assets/park-wifi.webp";

/** Keeps "M-Pesa" from breaking at its hyphen on narrow columns. */
function keepMpesa(text: string) {
  return text.split(/(M-Pesa)/).map((part, i) =>
    part === "M-Pesa" ? <span key={i} className="whitespace-nowrap">{part}</span> : part,
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-16 py-12 sm:py-14 lg:py-16">
      <Container className="grid grid-cols-1 items-center gap-10 sm:gap-12 xl:grid-cols-[1.25fr_1fr] xl:gap-10">
        <div className="flex flex-col gap-8 sm:gap-12">
          <SectionHeading
            title="How it works"
            subtitle="Connecting is quick and easy. Just a few taps and you're online."
          />

          <Reveal
            as="ol"
            stagger
            className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-slate-200 dark:sm:divide-white/10"
          >
            {/* Phones: compact row (icon with its number badge on the corner, text
                beside it). sm+: badge and icon side by side above the text. */}
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4 sm:flex-col sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <div className="relative flex shrink-0 items-center gap-4">
                  <span className="absolute -left-1.5 -top-1.5 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dice-accent font-display text-xs font-semibold text-white ring-2 ring-white dark:ring-dice-night sm:static sm:h-8 sm:w-8 sm:text-sm sm:ring-0">
                    {i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-dice-sky text-dice-accent dark:bg-white/6 dark:text-dice-cyan">
                    <Icon name={step.icon} className="h-[1.35rem] w-[1.35rem]" strokeWidth={2} />
                  </span>
                </div>
                <div className="flex flex-col gap-1 pt-1 sm:gap-1.5 sm:pt-0">
                  <h3 className="font-display text-[1.05rem] font-semibold text-dice-navy dark:text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:max-w-[16rem]">{keepMpesa(step.description)}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>

        {/* The illustration has a soft white halo baked into its edges, so it
            always sits on a light panel — that keeps it seamless in dark mode. */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[420px] xl:max-w-[520px]">
          <div
            aria-hidden
            className="absolute inset-x-[4%] inset-y-[6%] -z-0 rounded-[48%_52%_40%_60%/55%_45%_55%_45%] bg-dice-sky dark:bg-[#dfe9fb]"
          />
          <img
            src={parkImage}
            width={1000}
            height={772}
            loading="lazy"
            alt="Illustration of a young man on a park bench working on a laptop under a WiFi signal"
            className="relative h-auto w-full select-none dark:rounded-[40px]"
            draggable={false}
          />
        </Reveal>
      </Container>
    </section>
  );
}
