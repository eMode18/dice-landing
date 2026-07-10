import React from "react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";

function LogoDice({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      <img src="/logo.png" alt="" className="h-full w-auto max-w-none dark:brightness-0 dark:invert" />
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32">
      <LogoDice className="animate-float pointer-events-none absolute left-[6%] top-[18%] h-12 w-12 opacity-15 sm:h-16 sm:w-16" />
      <LogoDice className="pointer-events-none absolute bottom-[14%] right-[8%] h-16 w-16 rotate-12 opacity-10 sm:h-24 sm:w-24" style={{ animation: "float 9s ease-in-out infinite" } as React.CSSProperties} />

      <Container className="relative flex flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="font-display max-w-2xl text-[2.1rem] font-semibold leading-[1.12] text-dice-ink dark:text-white sm:text-4xl lg:text-5xl">
            Ready for Better Internet?
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-white/75 sm:text-lg">
            Join thousands of users already enjoying fast and reliable hotspot
            connectivity, anytime, anywhere, on any device.
          </p>
        </Reveal>

        <Reveal delay={0.22} className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button href="/plans" variant="primary" size="lg">
            Get Connected
            <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Us
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
