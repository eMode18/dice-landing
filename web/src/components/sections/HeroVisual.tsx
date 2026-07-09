import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Ported from the "Dice WiFi — Animated Hero" design handoff. One clock
   (`t`, 0–TOTAL ms) drives every visual: lock screen → swipe-down control
   center (Wi-Fi on, scan, pick network) → captive portal → package select
   → M-Pesa payment → success → phone spins and falls flat, notifications
   fill in → phone stands back up, notifications swipe away → loop.

   Values are written straight to the DOM via refs each animation frame
   (not through React state) because dozens of properties interpolate
   continuously every frame — exactly how the original prototype does it,
   just via refs instead of querySelector.
   ───────────────────────────────────────────────────────────────────── */

const ACCENT = "#0066ff";
const GREEN = "#4ade80";
const TOTAL = 27600;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const easeIO = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const outBack = (x: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

type AppKey = "whatsapp" | "instagram" | "spotify" | "x" | "youtube" | "tiktok";
const FLOAT_APP: AppKey = "whatsapp";

interface AppDef {
  key: AppKey;
  label: string;
  bg: string;
  shadow: string;
  size: number;
  radius: number;
  top: string;
  left: string;
  dscale: number;
  floatDur: string;
  floatDelay: string;
  glyph: (size: number) => React.ReactNode;
}

function GlyphWhatsApp(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}
function GlyphInstagram(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.4" fill="#fff" />
    </svg>
  );
}
function GlyphSpotify(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.1" strokeLinecap="round">
      <path d="M5.5 8.7c4.3-1.2 9-.7 12.8 1.4" />
      <path d="M6.3 12.4c3.6-1 7.5-.5 10.6 1.3" />
      <path d="M7 15.8c2.9-.8 5.9-.4 8.3 1" />
    </svg>
  );
}
function GlyphX(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <path d="M18.9 2H22l-7.1 8.1L23.3 22h-6.6l-5.2-6.8L5.6 22H2.5l7.6-8.7L1.1 2h6.7l4.7 6.2L18.9 2zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20z" />
    </svg>
  );
}
function GlyphYouTube(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="3.5" y="6.5" width="17" height="11" rx="3.5" fill="#fff" />
      <path d="M10.2 9.4v5.2l4.3-2.6z" fill="#d10000" />
    </svg>
  );
}
function GlyphTikTok(size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" style={{ filter: "drop-shadow(-1.5px 0 #25f4ee) drop-shadow(1.5px 0 #fe2c55)" }}>
      <path d="M16.6 5.8a4.3 4.3 0 0 1-1-.6 4.3 4.3 0 0 1-1.5-2.6h-2.9v11.6a2.3 2.3 0 0 1-2.3 2.2 2.3 2.3 0 0 1-1.1-4.3 2.3 2.3 0 0 1 1.6-.2V6.7a5.3 5.3 0 0 0-4.6 8.8 5.3 5.3 0 0 0 9.1-3.7V8.3a7.1 7.1 0 0 0 4 1.3V6.7a4.2 4.2 0 0 1-1.8-.9z" />
    </svg>
  );
}

const APPS: AppDef[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    bg: "linear-gradient(150deg,#3ee27a,#12a150)",
    shadow: "2px 2px 0 #0b6b43,4px 4px 0 #0b6b43,6px 6px 0 #0a5f3c,8px 8px 0 #0a5f3c,10px 10px 0 #094f32,14px 22px 30px rgba(0,0,0,0.5)",
    size: 66,
    radius: 33,
    top: "18%",
    left: "36%",
    dscale: 1.0,
    floatDur: "4.6s",
    floatDelay: "-0.2s",
    glyph: GlyphWhatsApp,
  },
  {
    key: "instagram",
    label: "Instagram",
    bg: "linear-gradient(135deg,#feda75,#fa7e1e 25%,#d62976 55%,#962fbf 80%,#4f5bd5)",
    shadow: "2px 2px 0 #7a1e5a,4px 4px 0 #7a1e5a,6px 6px 0 #6a1a50,8px 8px 0 #6a1a50,10px 10px 0 #5a1645,14px 22px 30px rgba(0,0,0,0.5)",
    size: 66,
    radius: 17,
    top: "14%",
    left: "54%",
    dscale: 1.0,
    floatDur: "5.2s",
    floatDelay: "-1.1s",
    glyph: GlyphInstagram,
  },
  {
    key: "spotify",
    label: "Spotify",
    bg: "linear-gradient(150deg,#2ee06a,#1db954)",
    shadow: "2px 2px 0 #0d7a37,4px 4px 0 #0d7a37,6px 6px 0 #0b6c31,8px 8px 0 #0b6c31,10px 10px 0 #095a29,14px 22px 30px rgba(0,0,0,0.5)",
    size: 64,
    radius: 32,
    top: "30%",
    left: "22%",
    dscale: 1.15,
    floatDur: "4.9s",
    floatDelay: "-0.6s",
    glyph: GlyphSpotify,
  },
  {
    key: "x",
    label: "X",
    bg: "linear-gradient(150deg,#2a2a2e,#050505)",
    shadow: "2px 2px 0 #000,4px 4px 0 #000,6px 6px 0 #000,8px 8px 0 #000,10px 10px 0 #000,14px 22px 30px rgba(0,0,0,0.55)",
    size: 60,
    radius: 16,
    top: "22%",
    left: "74%",
    dscale: 1.15,
    floatDur: "5.4s",
    floatDelay: "-1.6s",
    glyph: GlyphX,
  },
  {
    key: "youtube",
    label: "YouTube",
    bg: "linear-gradient(150deg,#ff4d4d,#d10000)",
    shadow: "2px 2px 0 #7a0000,4px 4px 0 #7a0000,6px 6px 0 #6a0000,8px 8px 0 #6a0000,10px 10px 0 #5a0000,14px 22px 30px rgba(0,0,0,0.5)",
    size: 64,
    radius: 16,
    top: "22%",
    left: "10%",
    dscale: 1.3,
    floatDur: "5.0s",
    floatDelay: "-2.2s",
    glyph: GlyphYouTube,
  },
  {
    key: "tiktok",
    label: "TikTok",
    bg: "linear-gradient(150deg,#2a2a2e,#010101)",
    shadow: "2px 2px 0 #000,4px 4px 0 #000,6px 6px 0 #000,8px 8px 0 #000,10px 10px 0 #000,14px 22px 30px rgba(0,0,0,0.55)",
    size: 60,
    radius: 16,
    top: "8%",
    left: "44%",
    dscale: 1.3,
    floatDur: "4.7s",
    floatDelay: "-3.0s",
    glyph: GlyphTikTok,
  },
];

const NOTIF_POOLS: Record<AppKey, string[]> = {
  whatsapp: ["New message", "sent you a photo", "2 new messages", "Voice message (0:14)"],
  instagram: ["liked your photo", "started following you", "mentioned you in their story", "New post from someone you follow"],
  x: ["New post from an account you follow", "Your post is getting attention", "3 people liked your reply"],
  youtube: ["New video from a channel you follow", "A creator you follow is live", "Trending in Kenya today"],
  tiktok: ["Someone commented on your video", "Your video just hit 1,000 views", "You have a new follower"],
  spotify: ["Your Discover Weekly is ready", "New release from an artist you follow", "Made For You: Daily Mix 1"],
};
const NOTIF_TIMES = ["now", "1m ago", "2m ago", "3m ago", "just now"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const PACKAGES = [
  { id: "10", price: "KSh 10", period: "1 Hour" },
  { id: "50", price: "KSh 50", period: "1 Day" },
  { id: "200", price: "KSh 200", period: "1 Week" },
  { id: "700", price: "KSh 700", period: "Monthly" },
] as const;

function WifiGlyph({ stroke = "#9fb0c8", withDot = false }: { stroke?: string; withDot?: boolean }) {
  return (
    <svg width="22" height="16" viewBox="0 0 24 18" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
      <path d="M2 6a15 15 0 0 1 20 0" />
      <path d="M5.5 9.5a10 10 0 0 1 13 0" />
      <path d="M9 13a5 5 0 0 1 6 0" />
      {withDot && <circle cx="12" cy="16" r="0.6" fill={stroke} />}
    </svg>
  );
}

export function HeroVisual() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  const timeRef = useRef<HTMLSpanElement>(null);
  const bigClockRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const bigClock2Ref = useRef<HTMLDivElement>(null);
  const date2Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const ccRef = useRef<HTMLDivElement>(null);
  const ccWifiRef = useRef<HTMLSpanElement>(null);
  const ccLabelRef = useRef<HTMLSpanElement>(null);
  const ccTapRef = useRef<HTMLSpanElement>(null);
  const ccWifiPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const ccWifiDotRef = useRef<SVGCircleElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const ccTap2Ref = useRef<HTMLSpanElement>(null);

  const lockRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const notifsScrRef = useRef<HTMLDivElement>(null);

  const pkgRef = useRef<HTMLDivElement>(null);
  const pkgSubRef = useRef<HTMLDivElement>(null);
  const phoneNumRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const payRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sendRef = useRef<HTMLSpanElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);

  const wifiWrapRef = useRef<HTMLSpanElement>(null);
  const wifiTipRef = useRef<HTMLDivElement>(null);

  const iconRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const notifCardRefs = useRef<Partial<Record<AppKey, HTMLDivElement>>>({});
  const notifMsgRefs = useRef<Partial<Record<AppKey, HTMLDivElement>>>({});
  const notifTimeRefs = useRef<Partial<Record<AppKey, HTMLSpanElement>>>({});

  /* Responsive scale: the stage is authored at a fixed 540x660 design size
     and scaled down as a unit so every internal pixel value stays faithful
     to the source design at any viewport width. */
  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;
    const apply = () => {
      const s = outer.offsetWidth / 540;
      stage.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const q = {
      device: deviceRef.current,
      rings: ringsRef.current,
      lock: lockRef.current,
      portal: portalRef.current,
      modal: modalRef.current,
      success: successRef.current,
      notifs: notifsScrRef.current,
      icon: iconRef.current,
    };

    if (reduced) {
      // Static, finished-looking resting state: no motion.
      if (q.device) q.device.style.transform = "perspective(1500px) rotateX(3deg) rotateY(-13deg)";
      if (q.rings) q.rings.style.transform = "perspective(1500px) rotateX(3deg) rotateY(-13deg)";
      if (q.lock) q.lock.style.opacity = "0";
      if (q.portal) q.portal.style.opacity = "0";
      if (q.modal) q.modal.style.opacity = "0";
      if (q.success) q.success.style.opacity = "1";
      if (q.notifs) q.notifs.style.opacity = "0";
      if (q.icon) q.icon.style.opacity = "0";
      if (checkRef.current) checkRef.current.style.transform = "scale(1)";
      if (wifiWrapRef.current) {
        wifiWrapRef.current.style.width = "16px";
        wifiWrapRef.current.style.marginLeft = "6px";
      }
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dateStr = `${days[now.getDay()]} ${now.getDate()} ${mons[now.getMonth()]}`;
      if (timeRef.current) timeRef.current.textContent = timeStr;
      if (bigClockRef.current) bigClockRef.current.textContent = timeStr;
      if (dateRef.current) dateRef.current.textContent = dateStr;
      return;
    }

    let notifData: Partial<Record<AppKey, { msg: string; time: string }>> = {};
    const genNotifs = () => {
      const out: Partial<Record<AppKey, { msg: string; time: string }>> = {};
      (Object.keys(NOTIF_POOLS) as AppKey[]).forEach((k) => {
        out[k] = { msg: pick(NOTIF_POOLS[k]), time: pick(NOTIF_TIMES) };
      });
      notifData = out;
    };
    genNotifs();

    const visibleApps = APPS.filter((a) => a.key !== FLOAT_APP);

    let lastT = -1;
    let raf = 0;
    const t0 = performance.now();

    const setScr = (el: HTMLDivElement | null, op: number) => {
      if (!el) return;
      el.style.opacity = String(op);
      el.style.pointerEvents = op > 0.5 ? "auto" : "none";
    };

    const update = (t: number) => {
      if (lastT >= 0 && t < lastT) genNotifs();
      lastT = t;

      // live date & time
      const d = new Date();
      const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dateStr = `${days[d.getDay()]} ${d.getDate()} ${mons[d.getMonth()]}`;
      if (timeRef.current) timeRef.current.textContent = timeStr;
      if (bigClockRef.current) bigClockRef.current.textContent = timeStr;
      if (dateRef.current) dateRef.current.textContent = dateStr;
      if (bigClock2Ref.current) bigClock2Ref.current.textContent = timeStr;
      if (date2Ref.current) date2Ref.current.textContent = dateStr;

      // swipe-down hint
      if (hintRef.current) {
        const bp = t < 1400 ? P(t, 700, 1100) : 0;
        hintRef.current.style.transform = `translateY(${Math.sin(bp * Math.PI) * 6}px)`;
        hintRef.current.style.opacity = String(1 - P(t, 1300, 1400));
      }

      // control center swipe
      let ccY: number;
      if (t < 1400) ccY = -100;
      else if (t < 2000) ccY = lerp(-100, 0, easeIO(P(t, 1400, 2000)));
      else if (t < 3700) ccY = 0;
      else if (t < 4100) ccY = lerp(0, -100, easeIO(P(t, 3700, 4100)));
      else ccY = -100;
      if (ccRef.current) ccRef.current.style.transform = `translateY(${ccY}%)`;

      const tapAt = 2100, tapDur = 220;
      const wifiOn = t >= tapAt + tapDur * 0.4;
      if (ccWifiRef.current) ccWifiRef.current.style.background = wifiOn ? ACCENT : "rgba(255,255,255,0.08)";
      ccWifiPathRefs.current.forEach((p) => { if (p) p.style.stroke = wifiOn ? "#fff" : "#9fb0c8"; });
      if (ccWifiDotRef.current) ccWifiDotRef.current.style.fill = wifiOn ? "#fff" : "#9fb0c8";
      if (ccLabelRef.current) {
        ccLabelRef.current.textContent = wifiOn ? "Wi-Fi On" : "Wi-Fi Off";
        ccLabelRef.current.style.color = wifiOn ? "#fff" : "#9fb0c8";
      }
      if (ccTapRef.current) {
        const tp = P(t, tapAt, tapAt + tapDur);
        ccTapRef.current.style.opacity = tp > 0 && tp < 1 ? String(1 - tp) : "0";
        ccTapRef.current.style.transform = `scale(${1 + 0.5 * tp})`;
      }

      const scanOp = Math.min(P(t, 2420, 2620), 1 - P(t, 3020, 3220));
      if (scanRef.current) scanRef.current.style.opacity = String(scanOp);
      const tap2At = 3500, tap2Dur = 150;
      const netOp = Math.min(P(t, 3070, 3220), 1 - P(t, tap2At + tap2Dur, tap2At + tap2Dur + 180));
      if (netRef.current) netRef.current.style.opacity = String(netOp);
      if (ccTap2Ref.current) {
        const tp2 = P(t, tap2At, tap2At + tap2Dur);
        ccTap2Ref.current.style.opacity = tp2 > 0 && tp2 < 1 ? String((1 - tp2) * 0.8) : "0";
      }
      if (netRef.current) {
        netRef.current.style.background = t >= tap2At && t < tap2At + tap2Dur ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)";
      }

      // screen opacities
      let lock: number;
      if (t < 4100) lock = 1;
      else if (t < 4500) lock = 1 - P(t, 4100, 4500);
      else lock = P(t, 25800, 26300);
      const portal = Math.min(P(t, 4100, 4500), 1 - P(t, 13100, 13500));
      const modal = Math.min(P(t, 8950, 9350), 1 - P(t, 12950, 13350));
      const success = Math.min(P(t, 13100, 13500), 1 - P(t, 17700, 18200));
      const notifs = Math.min(P(t, 18200, 18700), 1 - P(t, 25600, 26100));
      setScr(lockRef.current, lock);
      setScr(portalRef.current, portal);
      setScr(modalRef.current, modal);
      setScr(successRef.current, success);
      setScr(notifsScrRef.current, notifs);

      // notification cards: slide in, then swipe right + collapse
      visibleApps.forEach((app, idx) => {
        const card = notifCardRefs.current[app.key];
        if (!card) return;
        const isLast = idx === visibleApps.length - 1;
        const inStart = 18650 + idx * 300;
        const inP = P(t, inStart, inStart + 520);
        const clearStart = 22700 + idx * 460;
        const swipeP = P(t, clearStart, clearStart + 520);
        const collapseP = P(t, clearStart + 260, clearStart + 780);
        const enterOp = clamp(inP * 1.5, 0, 1);
        const exitOp = 1 - swipeP;
        card.style.opacity = String(Math.min(enterOp, exitOp));
        const slideY = lerp(-18, 0, easeIO(inP));
        const swipeX = lerp(0, 360, easeIO(swipeP));
        card.style.transform = `translate(${swipeX}px, ${slideY}px)`;
        const cH = lerp(64, 0, easeIO(collapseP));
        card.style.maxHeight = `${cH}px`;
        const pad = lerp(10, 0, easeIO(collapseP));
        card.style.paddingTop = `${pad}px`;
        card.style.paddingBottom = `${pad}px`;
        card.style.marginBottom = isLast ? "0px" : `${lerp(9, 0, easeIO(collapseP))}px`;
        card.style.borderWidth = `${lerp(1, 0, easeIO(collapseP))}px`;
        const data = notifData[app.key];
        const msgEl = notifMsgRefs.current[app.key];
        const timeEl = notifTimeRefs.current[app.key];
        if (msgEl && data?.msg) msgEl.textContent = data.msg;
        if (timeEl && data?.time) timeEl.textContent = data.time;
      });

      // status bar wifi + tooltip
      const connected = t >= 13100 && t < 26300;
      if (wifiWrapRef.current) {
        wifiWrapRef.current.style.width = connected ? "16px" : "0px";
        wifiWrapRef.current.style.marginLeft = connected ? "6px" : "0px";
      }
      if (wifiTipRef.current) wifiTipRef.current.style.opacity = t >= 13600 && t < 18200 ? "1" : "0";

      // package highlight
      const active = t > 4800 && t < 13100;
      if (pkgRef.current) {
        pkgRef.current.style.background = active ? "linear-gradient(135deg,#2f6bff,#5a94ff)" : "rgba(255,255,255,0.04)";
        pkgRef.current.style.border = active ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)";
        pkgRef.current.style.boxShadow = active ? "0 10px 22px -8px rgba(47,107,255,0.8)" : "none";
      }
      if (pkgSubRef.current) pkgSubRef.current.style.color = active ? "rgba(255,255,255,0.85)" : "#9fb0c8";

      // phone number typing
      const full = "0712345678";
      const typing = t >= 6000 && t < 8300;
      if (phoneNumRef.current) {
        if (t < 6000) {
          phoneNumRef.current.textContent = "07XX XXX XXX";
          phoneNumRef.current.style.color = "#5b6b82";
        } else {
          const n = Math.floor(P(t, 6000, 8200) * full.length);
          phoneNumRef.current.textContent = full.slice(0, n);
          phoneNumRef.current.style.color = "#eaf1ff";
        }
      }
      if (caretRef.current) caretRef.current.style.display = typing ? "inline-block" : "none";

      // pay press
      if (payRef.current) {
        const pp = Math.sin(P(t, 8550, 8950) * Math.PI);
        payRef.current.style.transform = `scale(${1 - 0.05 * pp})`;
      }

      // PIN dots
      const filled = t < 9550 ? 0 : Math.floor(P(t, 9550, 11450) * 4);
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.background = i < filled ? "#fff" : "transparent";
        dot.style.borderColor = i < filled ? "#fff" : "rgba(255,255,255,0.5)";
      });

      // send press + processing
      if (sendRef.current) {
        const sp = Math.sin(P(t, 11700, 12050) * Math.PI);
        sendRef.current.style.transform = `scale(${1 - 0.08 * sp})`;
      }
      const processing = t >= 11950 && t < 13050;
      if (modalBodyRef.current) modalBodyRef.current.style.opacity = processing ? "0" : "1";
      if (processingRef.current) processingRef.current.style.opacity = processing ? "1" : "0";

      // success check pop
      if (checkRef.current) checkRef.current.style.transform = `scale(${outBack(P(t, 13150, 13650))})`;

      // shared pose: idle -> spin -> fall flat -> hold -> stand back up
      const FX = 50, FZ = 40, FSC = 0.82, FTY = -8;
      let ry: number, rx: number, rz: number, ty: number, sc: number;
      if (t < 15400) { ry = -13; rx = 3; rz = 0; ty = 0; sc = 1; }
      else if (t < 16700) { ry = -13 + 360 * easeIO(P(t, 15400, 16700)); rx = 3; rz = 0; ty = 0; sc = 1; }
      else if (t < 18400) {
        const p = easeIO(P(t, 16700, 18400));
        ry = lerp(-13, 0, p); rx = lerp(3, FX, p); rz = lerp(0, FZ, p); ty = lerp(0, FTY, p); sc = lerp(1, FSC, p);
      } else if (t < 21200) { ry = 0; rx = FX; rz = FZ; ty = FTY; sc = FSC; }
      else if (t < 22500) {
        const p = easeIO(P(t, 21200, 22500));
        ry = lerp(0, -13, p); rx = lerp(FX, 3, p); rz = lerp(FZ, 0, p); ty = lerp(FTY, 0, p); sc = lerp(FSC, 1, p);
      } else { ry = -13; rx = 3; rz = 0; ty = 0; sc = 1; }

      const pose = `perspective(1500px) translateY(${ty}px) rotateX(${rx}deg) rotateZ(${rz}deg) rotateY(${ry}deg) scale(${sc})`;
      if (deviceRef.current) {
        deviceRef.current.style.transform = pose;
        const fallen = t >= 17800 && t < 21400;
        deviceRef.current.style.boxShadow = fallen
          ? "0 3px 0 #06070c,0 6px 0 #06070c,0 9px 0 #070811,0 12px 0 #070811,0 15px 0 #080916,0 18px 0 #080916,0 21px 0 #090b1a,0 24px 0 #090b1a, 0 48px 60px -12px rgba(0,0,0,0.7), inset 0 0 3px rgba(255,255,255,0.22)"
          : "0 50px 90px -30px rgba(0,0,0,0.75), inset 0 0 3px rgba(255,255,255,0.25), 1.5px 1.5px 0 rgba(0,0,0,0.45), 3px 3px 0 rgba(0,0,0,0.35), 4.5px 4.5px 0 rgba(0,0,0,0.22)";
      }
      if (ringsRef.current) ringsRef.current.style.transform = pose;

      // floating icon (only floatApp)
      if (iconRef.current) {
        const start = 18700;
        const p = P(t, start, start + 520);
        const s = clamp(outBack(p), 0, 1.12);
        const dsc = (APPS.find((a) => a.key === FLOAT_APP)?.dscale ?? 1) * 0.7;
        const gone = 1 - P(t, 20400, 20900);
        iconRef.current.style.opacity = String(clamp(p * 1.6, 0, 1) * gone);
        iconRef.current.style.transform = `translateY(${lerp(48, 0, easeIO(p))}px) scale(${dsc * (0.12 + 0.88 * s)})`;
      }

      // WhatsApp badge count
      if (badgeRef.current) {
        if (t >= 18700 && t < 20900) {
          badgeRef.current.textContent = String(Math.min(1 + Math.floor((t - 18700) / 650), 9));
          const since = (t - 18700) % 650;
          badgeRef.current.style.transform = since < 170 ? `scale(${1 + 0.32 * (1 - since / 170)})` : "scale(1)";
        } else {
          badgeRef.current.textContent = "1";
          badgeRef.current.style.transform = "scale(1)";
        }
      }

      raf = requestAnimationFrame(loop);
    };

    const loop = (now: number) => {
      const t = (now - t0) % TOTAL;
      update(t);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative mx-auto"
      style={{ aspectRatio: "540 / 660", width: "min(540px, 100%, calc(62vh * 540 / 660))" }}
    >
      <div ref={stageRef} className="absolute left-1/2 top-1/2" style={{ width: 540, height: 660, transformOrigin: "center" }}>
        {/* rings, locked to the phone's orientation */}
        <div
          ref={ringsRef}
          className="pointer-events-none absolute"
          style={{ width: 500, height: 500, left: "50%", top: "50%", marginLeft: -250, marginTop: -250 }}
        >
          <div className="absolute inset-0 animate-[dw-ring_40s_linear_infinite] rounded-full border border-dashed" style={{ borderColor: "rgba(120,170,255,0.18)" }} />
          <div className="absolute animate-[dw-ring_28s_linear_infinite_reverse] rounded-full border" style={{ inset: 60, borderColor: "rgba(120,170,255,0.1)" }} />
        </div>

        {/* floating app icon (only the chosen floatApp) */}
        {APPS.filter((a) => a.key === FLOAT_APP).map((app) => (
          <div
            key={app.key}
            ref={iconRef}
            className="pointer-events-none absolute opacity-0"
            style={{ top: app.top, left: app.left, zIndex: 8, transform: "scale(0.4)" }}
          >
            <div style={{ animation: `dw-float ${app.floatDur} ease-in-out infinite`, animationDelay: app.floatDelay }}>
              <div
                className="relative grid place-items-center"
                style={{
                  width: app.size,
                  height: app.size,
                  borderRadius: app.radius,
                  background: app.bg,
                  boxShadow: app.shadow,
                  transform: "rotateX(14deg) rotateY(-14deg)",
                }}
              >
                {app.glyph(Math.round(app.size * 0.57))}
                {app.key === "whatsapp" && (
                  <span
                    ref={badgeRef}
                    className="absolute -right-1.5 -top-1.5 grid min-w-[22px] place-items-center rounded-full border-2 text-xs font-bold text-white"
                    style={{ height: 22, padding: "0 5px", background: "#ff3b30", borderColor: "#0b6b43", lineHeight: 1 }}
                  >
                    1
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* phone */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{ marginLeft: -150, marginTop: -312, zIndex: 5, animation: "dw-phone 7s ease-in-out infinite" }}
        >
          <div
            ref={deviceRef}
            className="relative overflow-hidden"
            style={{
              width: 300,
              height: 624,
              borderRadius: 52,
              padding: 11,
              boxSizing: "border-box",
              background: "linear-gradient(160deg,#3a3d44,#141518 60%)",
              boxShadow: "0 50px 90px -30px rgba(0,0,0,0.75), inset 0 0 3px rgba(255,255,255,0.25), 1.5px 1.5px 0 rgba(0,0,0,0.45), 3px 3px 0 rgba(0,0,0,0.35), 4.5px 4.5px 0 rgba(0,0,0,0.22)",
              transform: "perspective(1500px) rotateX(3deg) rotateY(-13deg)",
              transformOrigin: "center center",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[41px]" style={{ background: "#0a1524" }}>
              {/* notch */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-black"
                style={{ top: 12, width: 104, height: 26, borderRadius: 16, zIndex: 40 }}
              />
              {/* status bar */}
              <div
                className="absolute inset-x-0 top-0 flex items-center justify-between text-xs font-semibold text-white"
                style={{ height: 44, padding: "0 22px", zIndex: 35 }}
              >
                <span ref={timeRef} style={{ paddingTop: 6 }}>12:15</span>
                <span className="flex items-center" style={{ paddingTop: 6 }}>
                  <svg width="16" height="11" viewBox="0 0 18 12">
                    <rect x="0" y="7" width="3" height="5" rx="1" fill="#fff" />
                    <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#fff" />
                    <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#fff" />
                    <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#fff" />
                  </svg>
                  <span ref={wifiWrapRef} className="inline-flex items-center justify-center overflow-hidden" style={{ width: 0, transition: "width .25s ease, margin .25s ease" }}>
                    <svg width="16" height="12" viewBox="0 0 20 15" style={{ flexShrink: 0 }}>
                      <path d="M10 14.5 0.6 5.1a13 13 0 0 1 18.8 0z" fill="#fff" />
                    </svg>
                  </span>
                  <span className="relative inline-block border" style={{ width: 22, height: 11, marginLeft: 5, borderRadius: 3, borderColor: "rgba(255,255,255,0.6)" }}>
                    <span className="absolute rounded-[1px] bg-white" style={{ inset: "1.5px", width: "75%" }} />
                  </span>
                </span>
              </div>

              {/* LOCK SCREEN */}
              <div
                ref={lockRef}
                className="absolute inset-0 flex flex-col box-border"
                style={{ zIndex: 10, padding: "56px 16px 24px", background: "linear-gradient(180deg,#0f2036,#0a1524)" }}
              >
                <div className="flex flex-1 flex-col items-center justify-center gap-0.5">
                  <div ref={bigClockRef} className="font-bold text-white" style={{ fontSize: 66, letterSpacing: "-0.02em", lineHeight: 1 }}>12:15</div>
                  <div ref={dateRef} className="mt-1.5" style={{ fontSize: 15, color: "#c3cfe2" }}>Tue 7 Jul</div>
                </div>
                <div ref={hintRef} className="flex flex-col items-center gap-2" style={{ color: "#8fa2bd" }}>
                  <svg width="22" height="12" viewBox="0 0 24 14" fill="none" stroke="#8fa2bd" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4l8 6 8-6" />
                  </svg>
                  <span className="text-xs">Swipe down for Wi-Fi</span>
                </div>
              </div>

              {/* CONTROL CENTER */}
              <div
                ref={ccRef}
                className="absolute left-0 right-0 top-0 box-border overflow-hidden"
                style={{
                  zIndex: 22,
                  transform: "translateY(-100%)",
                  padding: "52px 16px 20px",
                  background: "linear-gradient(180deg,rgba(15,32,54,0.98),rgba(10,21,36,0.98))",
                  borderRadius: "0 0 30px 30px",
                  boxShadow: "0 24px 46px -14px rgba(0,0,0,0.55)",
                }}
              >
                <div className="mx-auto mb-4.5 rounded-full bg-white/30" style={{ width: 36, height: 4 }} />
                <div className="mb-4 flex gap-2 rounded-[22px] bg-white/5" style={{ padding: "14px 6px" }}>
                  <div className="relative flex flex-1 flex-col items-center gap-1.5">
                    <span ref={ccWifiRef} className="relative grid place-items-center rounded-full" style={{ width: 44, height: 44, background: "rgba(255,255,255,0.08)", transition: "background .25s ease" }}>
                      <svg width="22" height="16" viewBox="0 0 24 18" fill="none" strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke .25s ease" }}>
                        <path ref={(el) => { ccWifiPathRefs.current[0] = el; }} d="M2 6a15 15 0 0 1 20 0" stroke="#9fb0c8" />
                        <path ref={(el) => { ccWifiPathRefs.current[1] = el; }} d="M5.5 9.5a10 10 0 0 1 13 0" stroke="#9fb0c8" />
                        <path ref={(el) => { ccWifiPathRefs.current[2] = el; }} d="M9 13a5 5 0 0 1 6 0" stroke="#9fb0c8" />
                        <circle ref={ccWifiDotRef} cx="12" cy="16" r="0.6" fill="#9fb0c8" />
                      </svg>
                      <span ref={ccTapRef} className="absolute inset-0 rounded-full border-2 border-white opacity-0" />
                    </span>
                    <span ref={ccLabelRef} className="text-[10px]" style={{ color: "#9fb0c8", transition: "color .25s ease" }}>Wi-Fi Off</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="grid place-items-center rounded-full bg-white/8" style={{ width: 44, height: 44 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9fb0c8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 20V5M8 5 4.5 8.5M8 5l3.5 3.5" />
                        <path d="M16 4v15M16 19l3.5-3.5M16 19l-3.5-3.5" />
                      </svg>
                    </span>
                    <span className="text-[10px]" style={{ color: "#9fb0c8" }}>Data</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="grid place-items-center rounded-full bg-white/8" style={{ width: 44, height: 44 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9fb0c8"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>
                    </span>
                    <span className="text-[10px]" style={{ color: "#9fb0c8" }}>Torch</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="grid place-items-center rounded-full bg-white/8" style={{ width: 44, height: 44 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9fb0c8"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
                    </span>
                    <span className="text-[10px]" style={{ color: "#9fb0c8" }}>Night</span>
                  </div>
                </div>
                <div className="relative" style={{ height: 64 }}>
                  <div ref={scanRef} className="absolute inset-0 flex items-center gap-2.5 opacity-0">
                    <span className="rounded-full border-2 animate-[dw-spin_0.8s_linear_infinite]" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#9fb0c8" }} />
                    <span className="text-xs" style={{ color: "#9fb0c8" }}>Scanning for networks&hellip;</span>
                  </div>
                  <div ref={netRef} className="absolute inset-0 flex items-center gap-2.5 rounded-2xl border opacity-0" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.09)", padding: "0 13px" }}>
                    <WifiGlyph stroke={ACCENT} />
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-white">DICE WIFI</div>
                      <div className="text-[11px]" style={{ color: "#9fb0c8" }}>KSh 20/day</div>
                    </div>
                    <span ref={ccTap2Ref} className="absolute inset-0 rounded-2xl border-2 border-white opacity-0" />
                  </div>
                </div>
              </div>

              {/* PORTAL */}
              <div
                ref={portalRef}
                className="absolute inset-0 flex flex-col box-border opacity-0"
                style={{ zIndex: 12, padding: "50px 14px 30px", background: "linear-gradient(180deg,#0d2137,#0a1524)" }}
              >
                <div className="mb-3.5 flex items-center gap-2 rounded-xl bg-white/6" style={{ padding: "9px 12px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <span className="text-xs" style={{ color: "#cdd8ea" }}>portal.dicewifi.co.ke</span>
                </div>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid shrink-0 place-items-center rounded-xl" style={{ width: 42, height: 42, background: ACCENT }}>
                    <WifiGlyph stroke="#fff" withDot />
                  </span>
                  <div>
                    <div className="text-base font-bold text-white">Dice WiFi</div>
                    <div className="text-xs" style={{ color: "#9fb0c8" }}>Sign in to get online</div>
                  </div>
                </div>
                <div className="mb-2 text-[10px] uppercase" style={{ letterSpacing: "0.14em", color: "#7f92ad" }}>Choose a Package</div>
                <div className="mb-3.5 grid grid-cols-2 gap-2.5">
                  {PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      ref={pkg.id === "50" ? pkgRef : undefined}
                      className="rounded-[13px] border"
                      style={{ padding: "12px 13px", background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                    >
                      <div className="text-[15px] font-bold text-white">{pkg.price}</div>
                      <div ref={pkg.id === "50" ? pkgSubRef : undefined} className="text-[11px]" style={{ color: "#9fb0c8" }}>{pkg.period}</div>
                    </div>
                  ))}
                </div>
                <div className="mb-1.5 text-[11px]" style={{ color: "#9fb0c8" }}>M&ndash;Pesa Phone Number</div>
                <div className="flex items-center rounded-[13px] border" style={{ padding: 14, background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.09)", fontSize: 16, letterSpacing: "0.06em" }}>
                  <span ref={phoneNumRef} style={{ color: "#5b6b82" }}>07XX XXX XXX</span>
                  <span ref={caretRef} className="ml-0.5 animate-[dw-caret_1s_step-end_infinite]" style={{ display: "none", width: 2, height: 18, background: "#5fa8ff" }} />
                </div>
                <div className="flex-1" />
                <div ref={payRef} className="rounded-2xl text-center font-semibold text-white" style={{ padding: 15, background: ACCENT, fontSize: 15, boxShadow: "0 12px 26px -10px rgba(0,102,255,0.8)" }}>
                  Pay with M&ndash;Pesa
                </div>
              </div>

              {/* M-PESA MODAL */}
              <div
                ref={modalRef}
                className="absolute inset-0 flex items-center justify-center box-border opacity-0"
                style={{ zIndex: 20, padding: 18, background: "rgba(4,10,20,0.66)", backdropFilter: "blur(2px)" }}
              >
                <div className="relative w-full overflow-hidden rounded-[20px] border" style={{ background: "linear-gradient(180deg,#132a44,#0e2036)", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)" }}>
                  <div className="text-center text-[13px] font-extrabold" style={{ padding: "18px 16px 8px", letterSpacing: "0.1em", color: GREEN }}>M&ndash;PESA</div>
                  <div ref={modalBodyRef} style={{ padding: "0 18px 18px", transition: "opacity .2s" }}>
                    <div className="mb-4 text-center text-[15px]" style={{ color: "#dbe6f5" }}>
                      Pay <b className="text-white">KSh 50.00</b> to<br /><b className="text-white">DICE WIFI</b>
                    </div>
                    <div className="rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.05)", padding: 16 }}>
                      <div className="mb-3 text-xs" style={{ color: "#9fb0c8" }}>Enter M&ndash;Pesa PIN</div>
                      <div className="flex justify-center gap-3.5">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            ref={(el) => { dotRefs.current[i] = el; }}
                            className="rounded-full border-[1.5px]"
                            style={{ width: 11, height: 11, borderColor: "rgba(255,255,255,0.5)" }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between text-sm font-semibold">
                      <span style={{ color: "#9fb0c8" }}>Cancel</span>
                      <span ref={sendRef} style={{ color: GREEN }}>Send</span>
                    </div>
                  </div>
                  <div
                    ref={processingRef}
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0"
                    style={{ background: "linear-gradient(180deg,#132a44,#0e2036)" }}
                  >
                    <span className="rounded-full border-[3px] animate-[dw-spin_0.9s_linear_infinite]" style={{ width: 38, height: 38, borderColor: "rgba(255,255,255,0.15)", borderTopColor: GREEN }} />
                    <span className="text-[13px]" style={{ color: "#bbccdd" }}>Sending request&hellip;</span>
                  </div>
                </div>
              </div>

              {/* SUCCESS */}
              <div
                ref={successRef}
                className="absolute inset-0 flex flex-col items-center box-border opacity-0"
                style={{ zIndex: 14, padding: "60px 18px 24px", background: "linear-gradient(180deg,#0d2137,#0a1524)" }}
              >
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div
                    ref={checkRef}
                    className="mb-5 grid place-items-center rounded-full border-2"
                    style={{ width: 78, height: 78, background: "radial-gradient(circle at 50% 40%, rgba(74,222,128,0.28), rgba(74,222,128,0.08))", borderColor: GREEN }}
                  >
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 4.5 4.5L19 7" />
                    </svg>
                  </div>
                  <div className="text-center text-2xl font-extrabold text-white">Transaction successful</div>
                  <div className="mt-1.5 text-[13px]" style={{ color: "#9fb0c8" }}>KSh 50 &middot; 1 Day active</div>
                </div>
                <div className="grid w-full grid-cols-2 gap-2.5">
                  <div className="rounded-2xl border" style={{ padding: 14, background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.07)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5fa8ff"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>
                    <div className="mt-2 text-[11px]" style={{ color: "#9fb0c8" }}>Speed</div>
                    <div className="text-[17px] font-bold text-white">15 Mbps</div>
                  </div>
                  <div className="rounded-2xl border" style={{ padding: 14, background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.07)" }}>
                    <WifiGlyph stroke={GREEN} />
                    <div className="mt-2 text-[11px]" style={{ color: "#9fb0c8" }}>Status</div>
                    <div className="text-[17px] font-bold" style={{ color: GREEN }}>Connected</div>
                  </div>
                </div>
              </div>

              {/* NOTIFICATIONS (fallen phone) */}
              <div
                ref={notifsScrRef}
                className="pointer-events-none absolute inset-0 flex flex-col overflow-hidden box-border opacity-0"
                style={{ zIndex: 16, padding: "52px 12px 22px", background: "linear-gradient(180deg,#0f2036,#0a1524)" }}
              >
                <div className="mb-3.5 mt-1.5 text-center">
                  <div ref={bigClock2Ref} className="font-bold text-white" style={{ fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>12:15</div>
                  <div ref={date2Ref} className="mt-1 text-xs" style={{ color: "#c3cfe2" }}>Tue 7 Jul</div>
                </div>
                <div className="flex flex-col">
                  {APPS.filter((a) => a.key !== FLOAT_APP).map((app) => (
                    <div
                      key={app.key}
                      ref={(el) => { if (el) notifCardRefs.current[app.key] = el; }}
                      className="mb-2.5 flex items-center gap-2.5 overflow-hidden rounded-[18px] border box-border opacity-0"
                      style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.08)", padding: "10px 12px" }}
                    >
                      <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[11px]" style={{ background: app.bg }}>
                        {app.glyph(23)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[12.5px] font-bold text-white">{app.label}</span>
                          <span ref={(el) => { if (el) notifTimeRefs.current[app.key] = el; }} className="shrink-0 text-[10px]" style={{ color: "#9fb0c8" }}>now</span>
                        </div>
                        <div
                          ref={(el) => { if (el) notifMsgRefs.current[app.key] = el; }}
                          className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs"
                          style={{ color: "#cdd8ea", lineHeight: 1.35 }}
                        >
                          {NOTIF_POOLS[app.key][0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* wifi tooltip */}
              <div ref={wifiTipRef} className="pointer-events-none absolute opacity-0" style={{ top: 44, right: 24, zIndex: 50, transition: "opacity .35s ease" }}>
                <div className="absolute rounded-sm" style={{ top: -5, right: 20, width: 11, height: 11, background: ACCENT, transform: "rotate(45deg)" }} />
                <div className="relative whitespace-nowrap rounded-[10px] text-xs font-semibold text-white" style={{ background: ACCENT, padding: "7px 13px", boxShadow: "0 10px 22px -6px rgba(0,102,255,0.85)" }}>
                  Connected
                </div>
              </div>

              {/* home indicator */}
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/35" style={{ bottom: 9, width: 120, height: 5, zIndex: 45 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
