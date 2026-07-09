import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { portalFeatures } from "../../data/content";

const featureIcons = ["bolt", "card", "user", "gauge", "refresh"] as const;

function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[220px] sm:w-[250px] ${className}`}>
      {/* Outer phone chassis */}
      <div className="overflow-hidden rounded-[3.2rem] bg-[#0a1a3f] p-[3px] shadow-[0_50px_100px_-24px_rgba(5,16,38,0.7),0_0_0_1px_rgba(255,255,255,0.1)]">
        {/* Inner screen */}
        <div className="overflow-hidden rounded-[3rem] bg-linear-to-b from-[#0d2055] to-[#071b45]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-5">
            <span className="text-xs font-semibold text-white/70">9:41</span>
            <div className="flex items-center gap-2">
              {/* signal bars */}
              <div className="flex items-end gap-px">
                {[40, 60, 80, 100].map((h, i) => (
                  <span key={i} className="w-[3px] rounded-sm bg-white/60" style={{ height: `${h * 0.1 + 4}px` }} />
                ))}
              </div>
              <Icon name="wifi" className="h-3.5 w-3.5 text-white/60" />
            </div>
          </div>
          {/* Content */}
          <div className="px-5 pb-7 pt-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Portal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-phone]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : 12,
          duration: 4 + i * 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.fromTo(
        "[data-phone-bar]",
        { width: "0%" },
        {
          width: "63%",
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-20">

        {/* Left: text */}
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <SectionHeading
            title="Connect to Dice"
            subtitle="Connect to any Dice hotspot and the portal opens automatically in your browser — pick a plan, pay with M-Pesa, or sign back in instantly with your transaction code."
            align="left"
          />

          <Reveal stagger className="grid grid-cols-1 gap-3 xs:grid-cols-2">
            {portalFeatures.map((feature, i) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-dice-blue/30 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-dice-cyan/30 dark:hover:bg-white/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/15 dark:text-dice-cyan">
                  <Icon name={featureIcons[i]} className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-dice-ink dark:text-white">{feature}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <Button href="#plans" size="lg" className="mt-1 w-full sm:w-auto">
              View Our Plans
              <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Reveal>
        </div>

        {/* Right: 3 phone mockups — swipeable carousel on mobile, fan on desktop */}
        <div className="scrollbar-none order-1 -mx-6 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-10 pb-4 sm:-mx-8 sm:px-12 lg:order-2 lg:mx-0 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">

          {/* Screen 1 — Plan selection */}
          <div data-phone className="relative z-10 shrink-0 snap-center lg:-rotate-6">
            <div className="absolute -inset-12 -z-10 rounded-full bg-dice-blue/10 blur-3xl" />
            <PhoneFrame>
              <p className="mb-1 text-[11px] font-medium text-white/50">Welcome to</p>
              <p className="mb-4 font-display text-base font-bold text-white">Dice WiFi Portal</p>

              <div className="mb-1 rounded-2xl bg-white/8 p-3.5">
                <p className="mb-3 text-[10px] uppercase tracking-wider text-white/40">Choose a Plan</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-dice-blue p-2.5 ring-1 ring-dice-cyan/50">
                    <p className="font-display text-sm font-bold text-white">KSh 10</p>
                    <p className="mt-0.5 text-[10px] text-dice-cyan">1 Hour</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-2.5">
                    <p className="font-display text-sm font-bold text-white">KSh 50</p>
                    <p className="mt-0.5 text-[10px] text-white/50">1 Day</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-2.5">
                    <p className="font-display text-sm font-bold text-white">KSh 200</p>
                    <p className="mt-0.5 text-[10px] text-white/50">1 Week</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-2.5">
                    <p className="font-display text-sm font-bold text-white">KSh 700</p>
                    <p className="mt-0.5 text-[10px] text-white/50">Monthly</p>
                  </div>
                </div>
              </div>

              <button className="mt-3 w-full rounded-full bg-dice-blue py-2.5 text-xs font-semibold text-white">
                Pay with M-Pesa
              </button>
            </PhoneFrame>
          </div>

          {/* Screen 2 — Return user login */}
          <div data-phone className="relative z-20 shrink-0 snap-center lg:-ml-16 lg:mt-10 lg:rotate-2">
            <PhoneFrame>
              <p className="mb-1 text-[11px] font-medium text-white/50">Welcome back</p>
              <p className="mb-4 font-display text-base font-bold text-white">Sign In to Connect</p>

              <div className="mb-3 flex gap-1 rounded-full bg-white/10 p-1">
                <button className="flex-1 rounded-full bg-dice-blue py-2 text-xs font-semibold text-white">
                  M-Pesa Code
                </button>
                <button className="flex-1 rounded-full py-2 text-xs text-white/50">
                  Username
                </button>
              </div>

              <div className="mb-1.5 rounded-2xl bg-white/8 px-4 py-3">
                <p className="text-[10px] text-white/40">Transaction Code</p>
                <p className="mt-1.5 font-mono text-base font-semibold tracking-wider text-white">RG4K5MNAB</p>
              </div>
              <p className="mb-4 text-[10px] text-white/35">From your M-Pesa SMS confirmation</p>

              <button className="w-full rounded-full bg-dice-blue py-2.5 text-xs font-semibold text-white">
                Connect Now
              </button>
            </PhoneFrame>
          </div>

          {/* Screen 3 — Active session */}
          <div data-phone className="relative z-10 shrink-0 snap-center lg:-ml-16 lg:mt-20 lg:rotate-6">
            <PhoneFrame>
              <p className="mb-1 text-[11px] font-medium text-white/50">Wanjiru Kamau</p>

              <div className="mb-4 mt-3 rounded-2xl bg-white/10 p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-white/40">Active Plan</p>
                <p className="mt-1.5 font-display text-lg font-bold leading-tight text-white">Monthly · 30 Days</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                  <span data-phone-bar className="block h-full w-0 rounded-full bg-linear-to-r from-dice-cyan to-white" />
                </div>
                <p className="mt-1.5 text-[10px] text-white/50">19 days remaining</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-white/8 p-3">
                  <Icon name="device" className="h-4 w-4 text-dice-cyan" />
                  <p className="mt-2 text-[10px] text-white/50">Devices</p>
                  <p className="font-display text-sm font-bold text-white">3 / 5</p>
                </div>
                <div className="rounded-xl bg-white/8 p-3">
                  <Icon name="bolt" className="h-4 w-4 text-dice-cyan" />
                  <p className="mt-2 text-[10px] text-white/50">Speed</p>
                  <p className="font-display text-sm font-bold text-white">15 Mbps</p>
                </div>
              </div>

              <button className="mt-3 w-full rounded-full bg-dice-blue py-2.5 text-xs font-semibold text-white">
                Renew Subscription
              </button>
            </PhoneFrame>
          </div>

        </div>
      </Container>
    </section>
  );
}
