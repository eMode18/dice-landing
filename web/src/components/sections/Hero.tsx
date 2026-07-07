import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { HeroVisual } from "./HeroVisual";
import { trustIndicators } from "../../data/content";

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const _el = canvasRef.current;
    const _ctx = _el?.getContext("2d");
    if (!_el || !_ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas: HTMLCanvasElement = _el;
    const ctx: CanvasRenderingContext2D = _ctx;

    let raf: number;
    let running = true;
    let W = 0;
    let H = 0;

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      r: number; phase: number;
    }
    let nodes: Node[] = [];
    const COUNT = 52;
    const LINK_DIST = 155;

    function resize() {
      const parent = canvas.parentElement;
      W = parent ? parent.offsetWidth : window.innerWidth;
      H = parent ? parent.offsetHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.3 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function tick(t: number) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.globalAlpha = (1 - d / LINK_DIST) * 0.18;
            ctx.strokeStyle = "#2266cc";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      nodes.forEach((n, i) => {
        const pulse = Math.sin(t * 0.0009 + n.phase) * 0.5 + 0.5;
        const isCyan = i % 7 === 0;
        const rgb = isCyan ? "94,200,255" : "0,102,255";
        const alpha = 0.28 + pulse * 0.52;

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 9);
        g.addColorStop(0, `rgba(${rgb},${alpha * 0.28})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 dark:opacity-100"
    />
  );
}

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-line]",
        { opacity: 0, y: 44, rotateX: 35 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.12 }
      )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45"
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          "[data-hero-trust]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.3"
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative isolate overflow-hidden bg-dice-mist pb-14 pt-28 dark:bg-dice-ink sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
    >
      {/* ── LIGHT MODE: clean gradient wash with a single soft accent glow ── */}
      <div className="absolute inset-0 -z-30 bg-linear-to-b from-dice-mist via-white to-white dark:hidden" />
      <div className="pointer-events-none absolute -right-32 -top-32 -z-20 h-105 w-105 rounded-full bg-dice-blue/6 blur-[130px] dark:hidden" />

      {/* ── DARK MODE: dot grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,102,255,0.07) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      {/* ── DARK MODE: animated network topology (opacity-0 in light, so
           ResizeObserver keeps running and there's no re-init on toggle) ── */}
      <NetworkCanvas />

      {/* ── DARK MODE: ambient glows ── */}
      <div className="pointer-events-none absolute -left-40 -top-20 hidden h-[580px] w-[580px] rounded-full bg-dice-blue/12 blur-[140px] dark:block" />
      <div className="pointer-events-none absolute -right-20 top-10 hidden h-[480px] w-[480px] rounded-full bg-dice-cyan/7 blur-[130px] dark:block" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 hidden h-64 w-80 rounded-full bg-dice-blue/8 blur-[100px] dark:block" />

      <Container className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:gap-20">
        <div className="flex flex-col items-start gap-5 text-left sm:gap-7">
          <h1 className="font-display max-w-xl text-[2.4rem] leading-[1.1] font-semibold text-dice-ink perspective-midrange dark:text-white sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem] xl:text-[3.85rem]">
            <span data-hero-line className="block">Your WiFi Hotspot.</span>
            <span data-hero-line className="block text-dice-blue dark:text-dice-cyan">
              Plans from KSh 10.
            </span>
          </h1>

          <p
            data-hero-sub
            className="max-w-lg text-base leading-relaxed text-slate-600 dark:text-white/65 sm:text-lg"
          >
            Connect to any Dice hotspot, choose a plan, pay with M-Pesa, and
            start browsing. Works on any device with no app or setup required.
          </p>

          <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4">
            <span data-hero-cta>
              <Button href="#plans" size="lg">
                View Plans
                <Icon
                  name="arrowRight"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </span>
            <span data-hero-cta>
              <Button
                href="#how-it-works"
                variant="secondary"
                size="lg"
                className="dark:border-white/35 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
              >
                How It Works
              </Button>
            </span>
          </div>

          <dl className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
            {trustIndicators.map((item) => (
              <div
                data-hero-trust
                key={item.label}
                className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-white/75"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dice-blue/20 bg-dice-blue/8 text-dice-blue backdrop-blur-md dark:border-white/15 dark:bg-white/8 dark:text-dice-cyan">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <dt className="font-medium">{item.label}</dt>
                <dd className="sr-only">Available</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
