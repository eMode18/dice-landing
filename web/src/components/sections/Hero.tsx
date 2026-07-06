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

    // TypeScript doesn't narrow consts across closure boundaries — use typed lets
    let canvas: HTMLCanvasElement = _el;
    let ctx: CanvasRenderingContext2D = _ctx;

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

      // edges
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

      // nodes
      nodes.forEach((n, i) => {
        const pulse = Math.sin(t * 0.0009 + n.phase) * 0.5 + 0.5;
        const isCyan = i % 7 === 0;
        const rgb = isCyan ? "94,200,255" : "0,102,255";
        const alpha = 0.28 + pulse * 0.52;

        // glow halo
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 9);
        g.addColorStop(0, `rgba(${rgb},${alpha * 0.28})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 9, 0, Math.PI * 2);
        ctx.fill();

        // dot
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
      className="pointer-events-none absolute inset-0 h-full w-full"
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
      className="relative isolate overflow-hidden bg-dice-ink pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44"
    >
      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,102,255,0.07) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      {/* Animated network topology */}
      <NetworkCanvas />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-40 -top-20 h-[580px] w-[580px] rounded-full bg-dice-blue/12 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-[480px] w-[480px] rounded-full bg-dice-cyan/7 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-80 rounded-full bg-dice-blue/8 blur-[100px]" />

      {/* Fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-dice-ink to-transparent" />

      <Container className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:gap-20">
        <div className="flex flex-col items-start gap-6 text-left sm:gap-7">
          <h1 className="font-display max-w-xl text-[2.5rem] leading-[1.08] font-semibold text-white perspective-midrange sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem] xl:text-[3.85rem]">
            <span data-hero-line className="block">Your WiFi Hotspot.</span>
            <span data-hero-line className="block text-dice-cyan">
              Plans from KSh 10.
            </span>
          </h1>

          <p
            data-hero-sub
            className="max-w-lg text-base leading-relaxed text-white/65 sm:text-lg"
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
              <Button href="#how-it-works" variant="outline-light" size="lg">
                How It Works
              </Button>
            </span>
          </div>

          <dl className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
            {trustIndicators.map((item) => (
              <div
                data-hero-trust
                key={item.label}
                className="flex items-center gap-2.5 text-sm text-white/70"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/6 text-dice-cyan">
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
