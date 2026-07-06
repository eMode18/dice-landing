import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Icon } from "../ui/Icon";

export function HeroVisual() {
  const sceneRef = useRef<HTMLDivElement>(null);

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

      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : 12,
          x: i % 3 === 0 ? 6 : -5,
          duration: 3.4 + i * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.25,
        });
      });

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
          rotateY: px * 5,
          rotateX: -py * 5,
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

  return (
    <div className="relative mx-auto w-full max-w-[480px] overflow-hidden sm:max-w-140 lg:mx-0 lg:max-w-none lg:overflow-visible">
      <div
        ref={sceneRef}
        className="relative flex justify-center py-6 sm:py-10 [transform-style:preserve-3d]"
      >
        {/* Signal rings behind phone */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 sm:h-64 sm:w-64">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-ring
              className="absolute inset-0 rounded-full border border-dice-cyan/40"
            />
          ))}
        </div>

        {/* Glow behind phone */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(94,200,255,0.3),transparent_70%)] blur-2xl" />

        {/* ── 3D phone mockup ── */}
        <div
          className="relative w-[290px] sm:w-[345px]"
          style={{
            transform: "rotateX(8deg) rotateY(-22deg) rotateZ(-3deg) translateZ(40px)",
          }}
        >
          {/* Chassis with visible right/bottom edge via box-shadow */}
          <div
            className="overflow-hidden rounded-[3rem] bg-[#111]"
            style={{
              padding: "4px",
              boxShadow:
                "13px 10px 0 0 #060606, 0 55px 110px -20px rgba(0,0,0,0.9), inset 0 0.5px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Screen */}
            <div className="overflow-hidden rounded-[2.75rem] bg-linear-to-b from-[#0d2055] to-[#071b45]">

              {/* Dynamic island */}
              <div className="flex justify-center pb-1 pt-[22px]">
                <div className="h-[22px] w-[90px] rounded-full bg-black" />
              </div>

              {/* Captive portal content */}
              <div className="px-5 pb-8 pt-4">
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

                <button className="mt-4 w-full rounded-full bg-dice-blue py-2.5 text-xs font-semibold text-white shadow-lg shadow-dice-blue/30">
                  Pay with M-Pesa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating chip: connected hotspot */}
        <div
          data-float
          className="glass absolute left-[1%] top-[10%] flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_20px_50px_-18px_rgba(5,16,38,0.4)] sm:left-[3%] sm:top-[12%]"
          style={{ transform: "translateZ(90px)" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dice-blue/10 text-dice-blue dark:bg-dice-cyan/15 dark:text-dice-cyan sm:h-10 sm:w-10">
            <Icon name="wifi" className="h-5 w-5" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-dice-ink dark:text-white sm:text-sm">
              Dice Hotspot
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-300 sm:text-xs">
              Connected · 15 Mbps
            </p>
          </div>
        </div>

        {/* Floating chip: M-Pesa confirmed */}
        <div
          data-float
          className="glass absolute bottom-[8%] right-[1%] flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_20px_50px_-18px_rgba(5,16,38,0.4)] sm:bottom-[10%] sm:right-[3%]"
          style={{ transform: "translateZ(70px)" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/15 dark:text-emerald-300 sm:h-10 sm:w-10">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-dice-ink dark:text-white sm:text-sm">
              M-Pesa Payment
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-300 sm:text-xs">
              Confirmed · KSh 50
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div
          data-float
          className="glass absolute right-[3%] top-[5%] hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-dice-ink shadow-[0_16px_40px_-16px_rgba(5,16,38,0.4)] dark:text-white sm:flex"
          style={{ transform: "translateZ(100px)" }}
        >
          <Icon name="lock" className="h-4 w-4 text-dice-blue" />
          Secure Connection
        </div>
      </div>
    </div>
  );
}
