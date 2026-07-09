import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { portalFeatures } from "../../data/content";

const featureIcons = ["bolt", "card", "user", "gauge", "refresh"] as const;

const CONTENT_HEIGHT = 470;

/* Plain device chassis — just the chrome every screen shares (status
   bar, notch, home indicator). Dice has no native app, so nothing
   app-specific is baked in here: screen 1 renders a browser (captive
   portal), screen 2 renders someone else's music app. Content sits in
   a fixed-height slot so both phones stand the same height regardless
   of what's inside. */
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
        <div className="relative overflow-hidden" style={{ borderRadius: 38, background: "#0a1524" }}>
          {/* Punch-hole camera */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
            style={{ top: 14, width: 10, height: 10, zIndex: 40 }}
          />
          {/* Status bar */}
          <div
            className="relative flex items-center justify-between text-xs font-semibold text-white"
            style={{ height: 38, padding: "0 20px" }}
          >
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
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

          {/* Screen content — fixed height so both mockups match */}
          <div className="relative overflow-hidden px-5 pb-5 pt-3" style={{ height: CONTENT_HEIGHT }}>
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2.5 pt-1">
            <div className="h-1 w-24 rounded-full bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Portal() {
  return (
    <section id="connect" className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-20">

        {/* Left: text */}
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <SectionHeading
            title="Connect to Dice WiFi"
            subtitle="Connect to any Dice hotspot and the portal opens automatically in your browser — pick a plan, pay with M-Pesa, and start browsing, streaming, or anything else you're online for."
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

        {/* Right: 2 phone mockups — swipeable carousel on mobile, fan on desktop.
            Static (no float/entrance motion) on a fully transparent backdrop. */}
        <div className="scrollbar-none order-1 -mx-6 flex snap-x snap-mandatory items-start gap-8 overflow-x-auto px-10 pb-4 sm:-mx-8 sm:px-12 lg:order-2 lg:mx-0 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">

          {/* Screen 1 — the actual captive portal */}
          <div className="relative z-10 shrink-0 snap-center lg:-rotate-6">
            <PhoneFrame>
              <div className="mb-3 flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-2">
                <Icon name="lock" className="h-3 w-3 shrink-0 text-emerald-400" />
                <p className="truncate text-[11px] text-white/60">portal.dicewifi.co.ke</p>
              </div>

              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dice-blue shadow-md shadow-dice-blue/30">
                  <Icon name="wifi" className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold leading-tight text-white">Dice WiFi</p>
                  <p className="text-[11px] text-white/50">Sign in to get online</p>
                </div>
              </div>

              <p className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Choose a Package</p>
              <div className="mb-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-dice-blue p-3 ring-1 ring-dice-cyan/50">
                  <p className="font-display text-sm font-bold text-white">KSh 10</p>
                  <p className="mt-0.5 text-[10px] text-dice-cyan">1 Hour</p>
                </div>
                <div className="rounded-xl bg-white/8 p-3">
                  <p className="font-display text-sm font-bold text-white">KSh 50</p>
                  <p className="mt-0.5 text-[10px] text-white/50">1 Day</p>
                </div>
                <div className="rounded-xl bg-white/8 p-3">
                  <p className="font-display text-sm font-bold text-white">KSh 200</p>
                  <p className="mt-0.5 text-[10px] text-white/50">1 Week</p>
                </div>
                <div className="rounded-xl bg-white/8 p-3">
                  <p className="font-display text-sm font-bold text-white">KSh 700</p>
                  <p className="mt-0.5 text-[10px] text-white/50">Monthly</p>
                </div>
              </div>

              <p className="mb-1.5 text-[11px] text-white/50">M-Pesa Phone Number</p>
              <div className="mb-4 rounded-xl border border-white/9 bg-white/8 px-3.5 py-3">
                <span className="text-sm tracking-wider text-white/30">07XX XXX XXX</span>
              </div>

              <button className="w-full rounded-full bg-dice-blue py-3 text-sm font-semibold text-white shadow-lg shadow-dice-blue/30">
                Pay with M-Pesa
              </button>
            </PhoneFrame>
          </div>

          {/* Screen 2 — a music app, running on the internet Dice provides */}
          <div className="relative z-20 shrink-0 snap-center lg:-ml-20 lg:mt-16 lg:rotate-6">
            <PhoneFrame>
              <div className="flex h-full flex-col">
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Now Playing
                </p>

                <div
                  className="mx-auto mb-5 flex h-40 w-40 items-center justify-center rounded-2xl"
                  style={{ background: "linear-gradient(135deg,#2ee06a,#0e8a3e)" }}
                >
                  <Icon name="wave" className="h-12 w-12 text-white/90" />
                </div>

                <div className="mb-5 text-center">
                  <p className="font-display text-base font-bold text-white">Metro Nights</p>
                  <p className="mt-0.5 text-[11px] text-white/50">The Late Shift</p>
                </div>

                <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full w-[38%] rounded-full bg-emerald-400" />
                </div>
                <div className="mb-6 flex items-center justify-between text-[10px] text-white/40">
                  <span>1:24</span>
                  <span>3:42</span>
                </div>

                <div className="mb-auto flex items-center justify-center gap-7">
                  <Icon name="refresh" className="h-4 w-4 text-white/40" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="#0a1524">
                      <path d="M0 0 14 8 0 16Z" />
                    </svg>
                  </span>
                  <Icon name="layers" className="h-4 w-4 text-white/40" />
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-2">
                  <Icon name="wifi" className="h-3.5 w-3.5 text-dice-cyan" />
                  <span className="text-[10px] font-medium text-white/70">Streaming via Dice WiFi · 15 Mbps</span>
                </div>
              </div>
            </PhoneFrame>
          </div>

        </div>
      </Container>
    </section>
  );
}
