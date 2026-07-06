import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Icon } from "../ui/Icon";

/* Auto-demo phases, in playback order */
type Phase =
  | "home"
  | "shade"
  | "wifiOn"
  | "scan"
  | "portal"
  | "package"
  | "phoneNum"
  | "stk"
  | "pin"
  | "connecting"
  | "connected";

const DEMO_MSISDN = "0712345678";

const socialApps = [
  { name: "WhatsApp", color: "#22c55e", dark: false, style: { left: "0%", top: "10%" } },
  { name: "Instagram", color: "#ec4899", dark: false, style: { right: "1%", top: "13%" } },
  { name: "Spotify", color: "#10b981", dark: false, style: { left: "0%", top: "44%" } },
  { name: "X", color: "#0f172a", dark: true, style: { right: "0%", top: "42%" } },
  { name: "YouTube", color: "#ef4444", dark: false, style: { left: "3%", bottom: "22%" } },
  { name: "TikTok", color: "#161623", dark: true, style: { right: "5%", bottom: "18%" } },
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
          <path data-yt-play d="M10.2 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
        </>
      );
    case "TikTok":
      return <path d="M14 4v9.5a3.75 3.75 0 1 1-3-3.674M14 4c.3 2.4 1.8 4.2 4.5 4.5" />;
    case "X":
      return <path d="M5 4l14 16M19 4L5 20" />;
    case "Spotify":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10.2c2.6-.7 5.4-.4 7.8 1M8.4 13c2.1-.5 4.3-.2 6.2.9M8.8 15.6c1.6-.3 3.2-.1 4.6.7" />
        </>
      );
  }
}

function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-6 pt-3.5 text-[10px] font-semibold text-white/85">
      <span>12:46</span>
      {/* Dynamic island */}
      <div className="absolute left-1/2 top-2.5 h-[20px] w-[82px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-px">
          {[3, 5, 7, 9].map((h) => (
            <span key={h} className="w-[2.5px] rounded-sm bg-white/85" style={{ height: h }} />
          ))}
        </span>
        <span className="text-[8.5px] tracking-wide">LTE</span>
        <span className="relative h-[9px] w-[17px] rounded-[3px] border border-white/60">
          <span className="absolute inset-[1.5px] right-[4px] rounded-[1px] bg-white/85" />
          <span className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r-sm bg-white/60" />
        </span>
      </span>
    </div>
  );
}

export function HeroVisual() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("home");
  const [phoneChars, setPhoneChars] = useState(0);
  const [pinChars, setPinChars] = useState(0);
  const [waCount, setWaCount] = useState(0);

  /* ── The automated script: each phase schedules the next ── */
  useEffect(() => {
    const timers: number[] = [];
    const go = (next: Phase, delay: number) =>
      timers.push(window.setTimeout(() => setPhase(next), delay));

    switch (phase) {
      case "home":
        setPhoneChars(0);
        setPinChars(0);
        setWaCount(0);
        go("shade", 1600);
        break;
      case "shade":
        go("wifiOn", 1100);
        break;
      case "wifiOn":
        go("scan", 800);
        break;
      case "scan":
        go("portal", 1800);
        break;
      case "portal":
        go("package", 1300);
        break;
      case "package":
        go("phoneNum", 1000);
        break;
      case "phoneNum":
        DEMO_MSISDN.split("").forEach((_, i) =>
          timers.push(window.setTimeout(() => setPhoneChars(i + 1), 130 * (i + 1)))
        );
        go("stk", 130 * DEMO_MSISDN.length + 800);
        break;
      case "stk":
        go("pin", 1400);
        break;
      case "pin":
        [1, 2, 3, 4].forEach((i) =>
          timers.push(window.setTimeout(() => setPinChars(i), 280 * i))
        );
        go("connecting", 280 * 4 + 700);
        break;
      case "connecting":
        go("connected", 2000);
        break;
      case "connected":
        // WhatsApp chats arriving while online
        [1, 2, 3].forEach((n) =>
          timers.push(window.setTimeout(() => setWaCount(n), 900 + n * 1100))
        );
        go("home", 7500); // loop the demo
        break;
    }
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  /* Mount-only: entrance, signal rings, parallax */
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
          { scale: 1.8, opacity: 0, duration: 3.4, ease: "power1.out", repeat: -1, delay: i * 1.1 }
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

  /* Phase-driven: app chips pop + per-app animations while connected */
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
            y: i % 2 === 0 ? -10 : 9,
            duration: 3 + i * 0.45,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.6 + i * 0.1,
          });
        });

        // Instagram: hearts float up and fade
        gsap.utils.toArray<HTMLElement>("[data-heart]").forEach((el, i) => {
          gsap.to(el, {
            keyframes: [
              { opacity: 1, y: -16, scale: 1, duration: 0.5 },
              { opacity: 0, y: -38, scale: 0.8, duration: 0.7 },
            ],
            repeat: -1,
            repeatDelay: 0.5,
            delay: 0.9 + i * 0.55,
            ease: "power1.out",
          });
        });

        // TikTok: musical notes drift up
        gsap.utils.toArray<HTMLElement>("[data-note]").forEach((el, i) => {
          gsap.to(el, {
            keyframes: [
              { opacity: 1, y: -14, x: i % 2 ? 6 : -6, duration: 0.5 },
              { opacity: 0, y: -32, duration: 0.7 },
            ],
            repeat: -1,
            repeatDelay: 0.7,
            delay: 1.2 + i * 0.6,
            ease: "power1.out",
          });
        });

        // Spotify: equalizer bars bounce
        gsap.utils.toArray<HTMLElement>("[data-eq] span").forEach((el, i) => {
          gsap.fromTo(
            el,
            { scaleY: 0.35 },
            {
              scaleY: 1,
              duration: 0.4 + (i % 3) * 0.12,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 0.9 + i * 0.08,
              transformOrigin: "bottom",
            }
          );
        });

        // YouTube: play button pulse
        gsap.to("[data-yt-play]", {
          scale: 1.25,
          transformOrigin: "center",
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      } else {
        gsap.killTweensOf(chips);
        gsap.to(chips, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
      }
    },
    { scope: sceneRef, dependencies: [phase] }
  );

  /* WhatsApp badge pop each time a "chat" arrives */
  useGSAP(
    () => {
      if (waCount > 0) {
        gsap.fromTo(
          "[data-wa-badge]",
          { scale: 0.3 },
          { scale: 1, duration: 0.35, ease: "back.out(3)" }
        );
      }
    },
    { scope: sceneRef, dependencies: [waCount] }
  );

  const shadeDown = phase === "shade" || phase === "wifiOn" || phase === "scan";
  const wifiActive = phase === "wifiOn" || phase === "scan";
  const onHomeStack = phase === "home" || shadeDown;
  const onPortal =
    phase === "portal" || phase === "package" || phase === "phoneNum" || phase === "stk" || phase === "pin";
  const packagePicked = phase !== "portal" && onPortal;
  const stkOpen = phase === "stk" || phase === "pin";

  return (
    <div className="relative mx-auto w-full max-w-[480px] overflow-hidden sm:max-w-140 lg:mx-0 lg:max-w-none lg:overflow-visible">
      <div
        ref={sceneRef}
        className="relative flex justify-center py-5 sm:py-8 [transform-style:preserve-3d]"
      >
        {/* Signal rings behind phone */}
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

        {/* ── 3D phone — slant matched to reference (clockwise lean, right edge visible) ── */}
        <div
          className="relative w-[300px] sm:w-[350px] xl:w-[385px]"
          style={{
            transform: "rotateX(3deg) rotateY(-24deg) rotateZ(6deg) translateZ(40px)",
          }}
        >
          <div
            className="overflow-hidden rounded-[2.9rem] bg-[#151515]"
            style={{
              padding: "3px",
              boxShadow:
                "10px 8px 0 0 #050505, 12px 10px 0 0 #2a2a2a, 0 55px 110px -20px rgba(0,0,0,0.9), inset 0 0.5px 0 rgba(255,255,255,0.12)",
            }}
          >
            <div className="relative overflow-hidden rounded-[2.7rem] bg-linear-to-b from-[#0d2055] to-[#071b45]">
              <StatusBar />

              {/* Screen stage */}
              <div className="relative flex min-h-[380px] flex-col px-4 pb-7 pt-3 sm:min-h-[430px] sm:px-5">
                {/* ── Home + notification shade ── */}
                {onHomeStack && (
                  <div className="relative flex flex-1 flex-col">
                    {/* Home wallpaper */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
                      <p className="font-display text-4xl font-bold tracking-tight text-white/90 sm:text-5xl">
                        12:46
                      </p>
                      <p className="text-[11px] text-white/50">Mon, 6 July</p>
                      <div className="mt-6 flex flex-col items-center gap-1 text-white/40">
                        <Icon name="chevron" className="h-4 w-4 animate-bounce" />
                        <p className="text-[10px]">Swipe down for Wi-Fi</p>
                      </div>
                    </div>

                    {/* Notification shade */}
                    <div
                      className={`absolute inset-x-0 -top-3 rounded-b-3xl bg-[#0a1735]/95 px-4 pb-4 pt-3 backdrop-blur-md transition-transform duration-500 ease-out ${
                        shadeDown ? "translate-y-0" : "-translate-y-[110%]"
                      }`}
                    >
                      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
                      <div className="grid grid-cols-4 gap-2">
                        {/* WiFi tile */}
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 ${
                              wifiActive ? "bg-dice-blue text-white" : "bg-white/10 text-white/40"
                            }`}
                          >
                            <Icon name="wifi" className="h-5 w-5" />
                          </span>
                          <span className="text-[8.5px] text-white/50">Wi-Fi</span>
                        </div>
                        {(["device", "bolt", "moon"] as const).map((ic, i) => (
                          <div key={ic} className="flex flex-col items-center gap-1.5">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/40">
                              <Icon name={ic} className="h-5 w-5" />
                            </span>
                            <span className="text-[8.5px] text-white/50">
                              {["Data", "Torch", "Night"][i]}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* WiFi scan list */}
                      {phase === "scan" && (
                        <div className="mt-3 rounded-2xl bg-white/6 p-3">
                          <p className="mb-2 text-[9px] uppercase tracking-wider text-white/40">
                            Wi-Fi Networks
                          </p>
                          <div className="flex items-center justify-between rounded-xl bg-dice-blue/20 px-3 py-2.5 ring-1 ring-dice-cyan/40">
                            <div className="flex items-center gap-2.5">
                              <Icon name="wifi" className="h-4 w-4 text-dice-cyan" />
                              <div>
                                <p className="text-[11px] font-semibold text-white">Dice WiFi</p>
                                <p className="text-[8.5px] text-dice-cyan">Sign in required</p>
                              </div>
                            </div>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-dice-cyan" />
                          </div>
                          <div className="mt-1.5 flex items-center gap-2.5 px-3 py-2 opacity-40">
                            <Icon name="wifi" className="h-4 w-4 text-white/50" />
                            <p className="text-[11px] text-white/60">Neighbour_5G</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Captive portal (browser) ── */}
                {onPortal && (
                  <div className="flex flex-1 flex-col">
                    {/* URL bar */}
                    <div className="mb-3 flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-2">
                      <Icon name="lock" className="h-3 w-3 shrink-0 text-emerald-400" />
                      <p className="truncate text-[10px] text-white/60">portal.dicewifi.co.ke</p>
                    </div>

                    <div className="mb-3 flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dice-blue shadow-md shadow-dice-blue/30">
                        <Icon name="wifi" className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold leading-tight text-white">
                          Dice WiFi
                        </p>
                        <p className="text-[9px] text-white/50">Sign in to get online</p>
                      </div>
                    </div>

                    {/* Packages */}
                    <div className="rounded-2xl bg-white/8 p-3">
                      <p className="mb-2 text-[9px] uppercase tracking-wider text-white/40">
                        Choose a Package
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { price: "KSh 10", period: "1 Hour" },
                          { price: "KSh 50", period: "1 Day" },
                          { price: "KSh 200", period: "1 Week" },
                          { price: "KSh 700", period: "Monthly" },
                        ].map((p, i) => (
                          <div
                            key={p.price}
                            className={`rounded-xl p-2.5 transition-all duration-300 ${
                              i === 1 && packagePicked
                                ? "bg-dice-blue ring-1 ring-dice-cyan/50"
                                : "bg-white/8"
                            }`}
                          >
                            <p className="font-display text-xs font-bold text-white sm:text-sm">
                              {p.price}
                            </p>
                            <p
                              className={`mt-0.5 text-[9px] ${
                                i === 1 && packagePicked ? "text-dice-cyan" : "text-white/50"
                              }`}
                            >
                              {p.period}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phone number input */}
                    <div className="mt-3 rounded-2xl bg-white/8 px-3.5 py-2.5">
                      <p className="text-[9px] text-white/40">M-Pesa Phone Number</p>
                      <p className="mt-1 font-mono text-sm font-semibold tracking-[0.15em] text-white">
                        {phoneChars > 0 ? DEMO_MSISDN.slice(0, phoneChars) : (
                          <span className="text-white/25">07XX XXX XXX</span>
                        )}
                        {(phase === "phoneNum" || phase === "package") && (
                          <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-dice-cyan align-middle" />
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      tabIndex={-1}
                      className={`pointer-events-none mt-auto w-full rounded-full py-2.5 text-[11px] font-semibold text-white transition-all duration-300 ${
                        phoneChars === DEMO_MSISDN.length
                          ? "bg-dice-blue shadow-lg shadow-dice-blue/30"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      Pay with M-Pesa
                    </button>

                    {/* STK push modal */}
                    {stkOpen && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-b-[2.7rem] bg-black/55 px-6 backdrop-blur-[2px]">
                        <div className="w-full rounded-2xl bg-[#0f2148] p-4 shadow-2xl ring-1 ring-white/10">
                          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            M-PESA
                          </p>
                          <p className="mt-2 text-center text-[11px] leading-relaxed text-white/80">
                            Pay <span className="font-semibold text-white">KSh 50.00</span> to
                            <br />
                            <span className="font-semibold text-white">DICE WIFI</span>
                          </p>
                          <div className="mt-3 rounded-xl bg-white/8 px-3 py-2.5 text-center">
                            <p className="text-[9px] text-white/40">Enter M-Pesa PIN</p>
                            <p className="mt-1 font-mono text-lg font-bold tracking-[0.5em] text-white">
                              {"∗".repeat(pinChars)}
                              {phase === "pin" && pinChars < 4 && (
                                <span className="ml-px inline-block h-4 w-px animate-pulse bg-emerald-400 align-middle" />
                              )}
                              {pinChars === 0 && phase === "stk" && (
                                <span className="text-white/20">····</span>
                              )}
                            </p>
                          </div>
                          <div className="mt-3 flex justify-between px-2 text-[10px] font-semibold">
                            <span className="text-white/40">Cancel</span>
                            <span className={pinChars === 4 ? "text-emerald-400" : "text-white/40"}>
                              Send
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Connecting via code ── */}
                {phase === "connecting" && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
                      <Icon name="check" className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-white">Payment Received</p>
                      <p className="mt-1.5 text-[10px] text-white/50">Access code</p>
                      <p className="font-mono text-base font-semibold tracking-[0.2em] text-dice-cyan">
                        RG4K5MNAB
                      </p>
                    </div>
                    <div className="w-full max-w-[190px]">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full animate-[connect-fill_1.9s_ease-in-out_forwards] rounded-full bg-linear-to-r from-emerald-400 to-dice-cyan" />
                      </div>
                      <p className="mt-2 text-[10px] text-white/40">Connecting automatically…</p>
                    </div>
                  </div>
                )}

                {/* ── Connected ── */}
                {phase === "connected" && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40">
                      <Icon name="check" className="h-7 w-7 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-white">You're Online!</p>
                      <p className="mt-1 text-[11px] text-white/50">KSh 50 · 1 Day active</p>
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
                  </div>
                )}
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2.5">
                <div className="h-1 w-24 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* ── App chips: pop out only while connected, each with its own life ── */}
        {socialApps.map((app) => (
          <div
            key={app.name}
            data-social
            aria-hidden={phase !== "connected"}
            className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl opacity-0 shadow-[0_18px_40px_-12px_rgba(5,16,38,0.6)] sm:h-14 sm:w-14 ${
              app.dark
                ? "ring-1 ring-slate-300/60 dark:shadow-[0_0_24px_-4px_rgba(94,200,255,0.45)] dark:ring-white/45"
                : ""
            }`}
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

            {/* WhatsApp: unread chat badge */}
            {app.name === "WhatsApp" && waCount > 0 && (
              <span
                data-wa-badge
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md"
              >
                {waCount}
              </span>
            )}

            {/* Instagram: floating hearts */}
            {app.name === "Instagram" && (
              <span className="pointer-events-none absolute inset-x-0 -top-1">
                {[0, 1, 2].map((i) => (
                  <svg
                    key={i}
                    data-heart
                    viewBox="0 0 24 24"
                    fill="#fb7185"
                    className="absolute h-3.5 w-3.5 opacity-0"
                    style={{ left: `${18 + i * 26}%` }}
                  >
                    <path d="M12 21s-7.5-4.9-9.9-9.2C.5 8.9 2.3 5.5 5.6 5.1c1.9-.2 3.7.7 4.7 2.2h3.4c1-1.5 2.8-2.4 4.7-2.2 3.3.4 5.1 3.8 3.5 6.7C19.5 16.1 12 21 12 21Z" />
                  </svg>
                ))}
              </span>
            )}

            {/* TikTok: drifting notes */}
            {app.name === "TikTok" && (
              <span className="pointer-events-none absolute inset-x-0 -top-1">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    data-note
                    className="absolute text-[11px] font-bold text-white opacity-0"
                    style={{ left: `${25 + i * 40}%` }}
                  >
                    ♪
                  </span>
                ))}
              </span>
            )}

            {/* Spotify: equalizer */}
            {app.name === "Spotify" && (
              <span
                data-eq
                className="pointer-events-none absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-[3px]"
              >
                {[8, 12, 9, 13].map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] origin-bottom rounded-full bg-emerald-300"
                    style={{ height: h }}
                  />
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
