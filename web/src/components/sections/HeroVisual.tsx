import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Icon } from "../ui/Icon";

type Phase = "idle" | "connecting" | "connected";

const demoPlans = [
  { price: "KSh 10", period: "1 Hour" },
  { price: "KSh 50", period: "1 Day" },
  { price: "KSh 200", period: "1 Week" },
  { price: "KSh 700", period: "Monthly" },
] as const;

/* App chips that pop out once the connection is active — same
   choreography as a Lottie pop (back.out overshoot + idle float) */
const socialApps = [
  { name: "WhatsApp", color: "#22c55e", style: { left: "0%", top: "12%" } },
  { name: "Instagram", color: "#ec4899", style: { right: "1%", top: "18%" } },
  { name: "YouTube", color: "#ef4444", style: { left: "4%", bottom: "26%" } },
  { name: "TikTok", color: "#0f172a", style: { right: "5%", bottom: "38%" } },
  { name: "Spotify", color: "#10b981", style: { right: "0%", top: "44%" } },
] as const;

function SocialGlyph({ name }: { name: (typeof socialApps)[number]["name"] }) {
  switch (name) {
    case "WhatsApp":
      return (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      );
    case "Instagram":
      return (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="17" cy="7" r="0.6" fill="currentColor" />
        </>
      );
    case "YouTube":
      return (
        <>
          <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
          <path d="M10.2 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
        </>
      );
    case "TikTok":
      return (
        <path d="M14 4v9.5a3.75 3.75 0 1 1-3-3.674M14 4c.3 2.4 1.8 4.2 4.5 4.5" />
      );
    case "Spotify":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10.2c2.6-.7 5.4-.4 7.8 1M8.4 13c2.1-.5 4.3-.2 6.2.9M8.8 15.6c1.6-.3 3.2-.1 4.6.7" />
        </>
      );
  }
}

export function HeroVisual() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [planIdx, setPlanIdx] = useState(1);

  useEffect(() => {
    if (phase !== "connecting") return;
    const t = setTimeout(() => setPhase("connected"), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  /* Mount-only: entrance, signal rings, parallax tilt */
  useGSAP(
    () => {
      if (!sceneRef.current) return;
      const scene = sceneRef.current;

      gsap.set(scene, { transformPerspective: 1000, rotateX: 0, rotateY: 0 });

      gsap.fromTo(
        scene,
        { opacity: 0, scale: 0.92, y: 36 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.35 }
      );

      gsap.utils.toArray<HTMLElement>("[data-ring]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0.7, opacity: 0.45 },
          {
            scale: 1.8,
            opacity: 0,
            duration: 3.4,
            ease: "power1.out",
            repeat: -1,
            delay: i * 1.1,
          }
        );
      });

      const onMove = (e: MouseEvent) => {
        const rect = scene.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(scene, {
          rotateY: px * 4,
          rotateX: -py * 4,
          duration: 0.6,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      };
      const onLeave = () =>
        gsap.to(scene, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });

      if (window.matchMedia("(min-width: 1024px) and (hover: hover)").matches) {
        scene.addEventListener("mousemove", onMove);
        scene.addEventListener("mouseleave", onLeave);
      }
      return () => {
        scene.removeEventListener("mousemove", onMove);
        scene.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: sceneRef }
  );

  /* Phase-driven: app chips pop on connect, M-Pesa progress bar */
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const chips = gsap.utils.toArray<HTMLElement>("[data-social]");

      if (phase === "connected") {
        if (reduced) {
          gsap.set(chips, { scale: 1, opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          chips,
          { scale: 0, opacity: 0, y: 14 },
          { scale: 1, opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: "back.out(2.2)" }
        );
        chips.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -12 : 10,
            duration: 3 + i * 0.45,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.6 + i * 0.1,
          });
        });
      } else {
        gsap.killTweensOf(chips);
        gsap.to(chips, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
      }

      if (phase === "connecting") {
        gsap.fromTo(
          "[data-connect-bar]",
          { width: "6%" },
          { width: "100%", duration: 1.7, ease: "power1.inOut" }
        );
      }
    },
    { scope: sceneRef, dependencies: [phase] }
  );

  return (
    <div className="relative mx-auto w-full max-w-[480px] overflow-hidden sm:max-w-140 lg:mx-0 lg:max-w-none lg:overflow-visible">
      <div
        ref={sceneRef}
        className="relative flex justify-center py-8 sm:py-12 [transform-style:preserve-3d]"
      >
        {/* Signal rings behind phone — stronger when connected */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 sm:h-72 sm:w-72">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-ring
              className={`absolute inset-0 rounded-full border transition-colors duration-500 ${
                phase === "connected" ? "border-dice-cyan/70" : "border-dice-cyan/35"
              }`}
            />
          ))}
        </div>

        {/* Glow behind phone */}
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-700 ${
            phase === "connected" ? "opacity-100" : "opacity-60"
          } bg-[radial-gradient(closest-side,rgba(94,200,255,0.35),transparent_70%)]`}
        />

        {/* ── 3D phone mockup (interactive demo) ── */}
        <div
          className="relative w-[300px] sm:w-[350px] xl:w-[385px]"
          style={{
            transform: "rotateX(7deg) rotateY(-18deg) rotateZ(-2deg) translateZ(40px)",
          }}
        >
          <div
            className="overflow-hidden rounded-[3rem] bg-[#111]"
            style={{
              padding: "4px",
              boxShadow:
                "13px 10px 0 0 #060606, 0 55px 110px -20px rgba(0,0,0,0.9), inset 0 0.5px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div className="overflow-hidden rounded-[2.75rem] bg-linear-to-b from-[#0d2055] to-[#071b45]">
              {/* Dynamic island */}
              <div className="flex justify-center pb-1 pt-[22px]">
                <div className="h-[22px] w-[90px] rounded-full bg-black" />
              </div>

              {/* Screen content — swaps with connection phase */}
              <div className="flex min-h-[300px] flex-col px-5 pb-8 pt-4 sm:min-h-[330px] sm:px-6">
                {phase === "idle" && (
                  <>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-dice-blue shadow-lg shadow-dice-blue/30">
                        <Icon name="wifi" className="h-[18px] w-[18px] text-white" />
                      </div>
                      <div>
                        <p className="font-display text-base font-bold leading-tight text-white">
                          Dice WiFi
                        </p>
                        <p className="text-[10px] text-white/50">Select a plan to get online</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/8 p-3.5">
                      <p className="mb-3 text-[10px] uppercase tracking-wider text-white/40">
                        Choose a Plan
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {demoPlans.map((p, i) => (
                          <button
                            key={p.price}
                            type="button"
                            onClick={() => setPlanIdx(i)}
                            className={`rounded-xl p-2.5 text-left transition-colors duration-200 ${
                              i === planIdx
                                ? "bg-dice-blue ring-1 ring-dice-cyan/50"
                                : "bg-white/8 hover:bg-white/12"
                            }`}
                          >
                            <p className="font-display text-sm font-bold text-white">{p.price}</p>
                            <p
                              className={`mt-0.5 text-[10px] ${
                                i === planIdx ? "text-dice-cyan" : "text-white/50"
                              }`}
                            >
                              {p.period}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPhase("connecting")}
                      className="mt-auto w-full rounded-full bg-dice-blue py-3 text-xs font-semibold text-white shadow-lg shadow-dice-blue/30 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Pay with M-Pesa
                    </button>
                  </>
                )}

                {phase === "connecting" && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
                      <Icon name="card" className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-white">
                        M-Pesa Request Sent
                      </p>
                      <p className="mt-1 text-[11px] text-white/50">
                        {demoPlans[planIdx].price} · {demoPlans[planIdx].period}
                      </p>
                    </div>
                    <div className="w-full max-w-[200px]">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <span
                          data-connect-bar
                          className="block h-full rounded-full bg-linear-to-r from-emerald-400 to-dice-cyan"
                        />
                      </div>
                      <p className="mt-2.5 text-[10px] text-white/40">
                        Confirming payment &amp; connecting…
                      </p>
                    </div>
                  </div>
                )}

                {phase === "connected" && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40">
                      <Icon name="check" className="h-7 w-7 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-white">You're Online!</p>
                      <p className="mt-1 text-[11px] text-white/50">
                        {demoPlans[planIdx].price} · {demoPlans[planIdx].period} active
                      </p>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-white/8 p-3 text-left">
                        <Icon name="bolt" className="h-4 w-4 text-dice-cyan" />
                        <p className="mt-1.5 text-[10px] text-white/50">Speed</p>
                        <p className="font-display text-sm font-bold text-white">15 Mbps</p>
                      </div>
                      <div className="rounded-xl bg-white/8 p-3 text-left">
                        <Icon name="wifi" className="h-4 w-4 text-emerald-400" />
                        <p className="mt-1.5 text-[10px] text-white/50">Status</p>
                        <p className="font-display text-sm font-bold text-emerald-400">Connected</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhase("idle")}
                      className="mt-1 w-full rounded-full border border-white/20 py-2.5 text-xs font-semibold text-white/70 transition-colors duration-200 hover:bg-white/10"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* App chips — pop out only while the connection is active */}
        {socialApps.map((app) => (
          <div
            key={app.name}
            data-social
            aria-hidden={phase !== "connected"}
            className="absolute flex h-12 w-12 items-center justify-center rounded-2xl opacity-0 shadow-[0_18px_40px_-12px_rgba(5,16,38,0.6)] sm:h-14 sm:w-14"
            style={{ ...app.style, backgroundColor: app.color, transform: "translateZ(85px)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 sm:h-7 sm:w-7"
            >
              <SocialGlyph name={app.name} />
            </svg>
          </div>
        ))}

        {/* Hotspot status chip — always visible, label follows state */}
        <div
          className="glass absolute left-[1%] top-[2%] flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_20px_50px_-18px_rgba(5,16,38,0.4)] sm:left-[3%]"
          style={{ transform: "translateZ(90px)" }}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${
              phase === "connected"
                ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-300"
                : "bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/15 dark:text-dice-cyan"
            }`}
          >
            <Icon name="wifi" className="h-5 w-5" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-dice-ink dark:text-white sm:text-sm">
              Dice Hotspot
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-300 sm:text-xs">
              {phase === "connected" ? "Connected · 15 Mbps" : "In range · Tap to join"}
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div
          className="glass absolute right-[3%] top-[2%] hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-dice-ink shadow-[0_16px_40px_-16px_rgba(5,16,38,0.4)] dark:text-white sm:flex"
          style={{ transform: "translateZ(100px)" }}
        >
          <Icon name="lock" className="h-4 w-4 text-dice-blue" />
          Secure Connection
        </div>
      </div>
    </div>
  );
}
