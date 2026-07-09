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

const quickActions = [
  { label: "Packages", icon: "layers" },
  { label: "Billing", icon: "card" },
  { label: "Devices", icon: "device" },
  { label: "Support", icon: "headset" },
] as const;

const tabBarItems = [
  { label: "Dashboard", icon: "gauge", active: true },
  { label: "Packages", icon: "layers", active: false },
  { label: "Alerts", icon: "bell", active: false },
  { label: "Profile", icon: "user", active: false },
] as const;

const dashboardPackages = [
  { name: "Starter", price: "KSh 50 / day", active: false },
  { name: "Weekly", price: "KSh 200 / week", active: false },
  { name: "Monthly", price: "KSh 700 / month", active: true },
  { name: "Premium Unlimited", price: "KSh 1,500 / month", active: false },
] as const;

/* App-dashboard chassis: a punch-hole camera and a persistent bottom
   tab bar (instead of the hero mockup's dynamic-island + home-indicator-
   only chrome) give this section's device its own identity as "the
   Dice customer app" rather than a repeat of the hero's captive portal. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[280px] sm:w-[320px]">
      <div
        className="overflow-hidden"
        style={{
          borderRadius: 48,
          padding: 10,
          background: "linear-gradient(160deg,#3a3d44,#141518 60%)",
          boxShadow:
            "0 45px 80px -26px rgba(0,0,0,0.75), inset 0 0 3px rgba(255,255,255,0.25), 1.5px 1.5px 0 rgba(0,0,0,0.45), 3px 3px 0 rgba(0,0,0,0.35)",
        }}
      >
        <div className="relative flex flex-col overflow-hidden" style={{ borderRadius: 38, background: "#0a1524" }}>
          {/* Punch-hole camera */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
            style={{ top: 14, width: 10, height: 10, zIndex: 40 }}
          />
          {/* Status bar */}
          <div
            className="relative flex items-center justify-between text-xs font-semibold text-white"
            style={{ height: 34, padding: "0 20px" }}
          >
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="11" viewBox="0 0 18 12">
                <rect x="0" y="7" width="3" height="5" rx="1" fill="#fff" />
                <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#fff" />
                <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#fff" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#fff" />
              </svg>
              <span
                className="relative inline-block border"
                style={{ width: 22, height: 11, borderRadius: 3, borderColor: "rgba(255,255,255,0.6)" }}
              >
                <span className="absolute rounded-[1px] bg-white" style={{ inset: "1.5px", width: "75%" }} />
              </span>
            </span>
          </div>

          {/* App header banner */}
          <div
            className="flex items-center gap-2 px-5 py-3.5"
            style={{ background: "linear-gradient(120deg,#0066ff,#003d99)" }}
          >
            <Icon name="wifi" className="h-4 w-4 text-white" />
            <span className="font-display text-sm font-bold text-white">Dice WiFi</span>
          </div>

          {/* Screen content */}
          <div className="flex-1 px-5 pb-4 pt-4">{children}</div>

          {/* Bottom tab bar */}
          <div className="flex items-center justify-between border-t border-white/8 px-6 pb-1 pt-2.5">
            {tabBarItems.map((tab) => (
              <div key={tab.label} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <Icon name={tab.icon} className={`h-5 w-5 ${tab.active ? "text-dice-cyan" : "text-white/35"}`} />
                  {tab.label === "Alerts" && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
                <span className={`text-[9px] font-medium ${tab.active ? "text-dice-cyan" : "text-white/35"}`}>
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2 pt-1">
            <div className="h-1 w-24 rounded-full bg-white/25" />
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
        "[data-usage-bar]",
        { width: "0%" },
        {
          width: "38%",
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
            subtitle="Connect to any Dice hotspot and the portal opens automatically in your browser — pick a plan, pay with M-Pesa, or manage everything from your account dashboard."
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

          {/* Screen 1 — Account dashboard */}
          <div data-phone className="relative z-10 shrink-0 snap-center lg:-rotate-6">
            <div className="absolute -inset-12 -z-10 rounded-full bg-dice-blue/10 blur-3xl" />
            <PhoneFrame>
              <p className="mb-3.5 font-display text-lg font-bold text-white">Dashboard</p>

              <div
                className="mb-3 rounded-2xl p-4"
                style={{ background: "linear-gradient(135deg,#0066ff,#0047b3)" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-white/70">Account Status</p>
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/50">Package</p>
                    <p className="font-display text-base font-bold text-white">Monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/50">Validity</p>
                    <p className="font-display text-base font-bold text-white">30 Days</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5 text-[10px] text-white/60">
                  <span>Start · Jul 1</span>
                  <span>Expires · Jul 31</span>
                </div>
              </div>

              <div className="mb-3 rounded-2xl bg-white/8 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-white/70">Data Usage</p>
                  <Icon name="chevron" className="h-3.5 w-3.5 -rotate-90 text-white/40" />
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <span data-usage-bar className="block h-full w-0 rounded-full bg-linear-to-r from-dice-cyan to-white" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/50">
                  <span>Upload · 128 MB</span>
                  <span>Download · 2.4 GB</span>
                </div>
              </div>

              <p className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <div key={action.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/8 py-3">
                    <Icon name={action.icon} className="h-4 w-4 text-dice-cyan" />
                    <span className="text-[10px] font-medium text-white/80">{action.label}</span>
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </div>

          {/* Screen 2 — Packages */}
          <div data-phone className="relative z-20 shrink-0 snap-center lg:-ml-20 lg:mt-16 lg:rotate-6">
            <PhoneFrame>
              <p className="mb-3.5 font-display text-lg font-bold text-white">Packages</p>

              <div className="flex flex-col gap-2.5">
                {dashboardPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`flex items-center justify-between rounded-2xl p-3.5 ${
                      pkg.active ? "ring-1 ring-dice-cyan/50" : "bg-white/8"
                    }`}
                    style={pkg.active ? { background: "linear-gradient(135deg,#0066ff,#0047b3)" } : undefined}
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{pkg.name}</p>
                      <p className={`text-[10px] ${pkg.active ? "text-white/70" : "text-white/50"}`}>{pkg.price}</p>
                    </div>
                    {pkg.active ? (
                      <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-dice-cyan">Switch</span>
                    )}
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </div>

        </div>
      </Container>
    </section>
  );
}
