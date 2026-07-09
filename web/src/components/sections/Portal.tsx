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

/* Chassis matching the hero mockup exactly (same gradient, shadow
   stack, notch, and status bar treatment) — sized close to the
   hero's own 300px reference now that there are only two phones to
   fit, so the chrome values are used near 1:1 rather than scaled down. */
function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[270px] sm:w-[310px] ${className}`}>
      <div
        className="overflow-hidden"
        style={{
          borderRadius: 52,
          padding: 11,
          background: "linear-gradient(160deg,#3a3d44,#141518 60%)",
          boxShadow:
            "0 45px 80px -26px rgba(0,0,0,0.75), inset 0 0 3px rgba(255,255,255,0.25), 1.5px 1.5px 0 rgba(0,0,0,0.45), 3px 3px 0 rgba(0,0,0,0.35)",
        }}
      >
        <div className="relative overflow-hidden" style={{ borderRadius: 41, background: "#0a1524" }}>
          {/* Notch */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-black"
            style={{ top: 12, width: 100, height: 25, borderRadius: 15, zIndex: 40 }}
          />
          {/* Status bar */}
          <div
            className="relative flex items-center justify-between text-xs font-semibold text-white"
            style={{ height: 42, padding: "0 22px" }}
          >
            <span style={{ paddingTop: 5 }}>9:41</span>
            <span className="flex items-center gap-1.5" style={{ paddingTop: 5 }}>
              <svg width="16" height="11" viewBox="0 0 18 12">
                <rect x="0" y="7" width="3" height="5" rx="1" fill="#fff" />
                <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#fff" />
                <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#fff" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#fff" />
              </svg>
              <Icon name="wifi" className="h-3.5 w-3.5 text-white" />
              <span
                className="relative inline-block border"
                style={{ width: 22, height: 11, borderRadius: 3, borderColor: "rgba(255,255,255,0.6)" }}
              >
                <span className="absolute rounded-[1px] bg-white" style={{ inset: "1.5px", width: "75%" }} />
              </span>
            </span>
          </div>
          {/* Content */}
          <div className="relative px-6 pb-9 pt-2" style={{ background: "linear-gradient(180deg,#0f2036,#0a1524)" }}>
            {children}
          </div>
          {/* Home indicator */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/35"
            style={{ bottom: 9, width: 116, height: 5, zIndex: 45 }}
          />
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
    <section id="connect" ref={rootRef} className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-20">

        {/* Left: text */}
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <SectionHeading
            title="Connect to Dice WiFi"
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

        {/* Right: 2 phone mockups — swipeable carousel on mobile, fan on desktop */}
        <div className="scrollbar-none order-1 -mx-6 flex snap-x snap-mandatory items-start gap-8 overflow-x-auto px-10 pb-4 sm:-mx-8 sm:px-12 lg:order-2 lg:mx-0 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">

          {/* Screen 1 — Plan selection */}
          <div data-phone className="relative z-10 shrink-0 snap-center lg:-rotate-6">
            <div className="absolute -inset-12 -z-10 rounded-full bg-dice-blue/10 blur-3xl" />
            <PhoneFrame>
              <p className="mb-1 text-xs font-medium text-white/50">Welcome to</p>
              <p className="mb-5 font-display text-lg font-bold text-white">Dice WiFi Portal</p>

              <div className="mb-1 rounded-2xl bg-white/8 p-4">
                <p className="mb-3 text-[11px] uppercase tracking-wider text-white/40">Choose a Plan</p>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-dice-blue p-3 ring-1 ring-dice-cyan/50">
                    <p className="font-display text-base font-bold text-white">KSh 10</p>
                    <p className="mt-0.5 text-xs text-dice-cyan">1 Hour</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-3">
                    <p className="font-display text-base font-bold text-white">KSh 50</p>
                    <p className="mt-0.5 text-xs text-white/50">1 Day</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-3">
                    <p className="font-display text-base font-bold text-white">KSh 200</p>
                    <p className="mt-0.5 text-xs text-white/50">1 Week</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-3">
                    <p className="font-display text-base font-bold text-white">KSh 700</p>
                    <p className="mt-0.5 text-xs text-white/50">Monthly</p>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full rounded-full bg-dice-blue py-3 text-sm font-semibold text-white">
                Pay with M-Pesa
              </button>
            </PhoneFrame>
          </div>

          {/* Screen 2 — Active session */}
          <div data-phone className="relative z-20 shrink-0 snap-center lg:-ml-20 lg:mt-16 lg:rotate-6">
            <PhoneFrame>
              <p className="mb-1 text-xs font-medium text-white/50">Wanjiru Kamau</p>

              <div className="mb-5 mt-3 rounded-2xl bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/40">Active Plan</p>
                <p className="mt-1.5 font-display text-xl font-bold leading-tight text-white">Monthly · 30 Days</p>
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <span data-phone-bar className="block h-full w-0 rounded-full bg-linear-to-r from-dice-cyan to-white" />
                </div>
                <p className="mt-1.5 text-xs text-white/50">19 days remaining</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/8 p-3.5">
                  <Icon name="device" className="h-5 w-5 text-dice-cyan" />
                  <p className="mt-2 text-xs text-white/50">Devices</p>
                  <p className="font-display text-base font-bold text-white">3 / 5</p>
                </div>
                <div className="rounded-xl bg-white/8 p-3.5">
                  <Icon name="bolt" className="h-5 w-5 text-dice-cyan" />
                  <p className="mt-2 text-xs text-white/50">Speed</p>
                  <p className="font-display text-base font-bold text-white">15 Mbps</p>
                </div>
              </div>

              <button className="mt-4 w-full rounded-full bg-dice-blue py-3 text-sm font-semibold text-white">
                Renew Subscription
              </button>
            </PhoneFrame>
          </div>

        </div>
      </Container>
    </section>
  );
}
