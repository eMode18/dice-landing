import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { navLinks } from "../../data/content";
import { useDarkMode } from "../../lib/theme";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useGSAP(
    () => {
      if (!panelRef.current || !linksRef.current) return;
      const items = linksRef.current.children;

      if (open) {
        gsap.set(panelRef.current, { display: "flex" });
        gsap.fromTo(
          panelRef.current,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: "power3.out" }
        );
        gsap.fromTo(
          items,
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, delay: 0.15, ease: "power3.out" }
        );
      } else {
        gsap.to(panelRef.current, {
          xPercent: 100,
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => gsap.set(panelRef.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open] }
  );

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-500 ${
        scrolled || open
          ? "border-white/40 bg-white/70 shadow-[0_8px_30px_-12px_rgba(10,61,145,0.25)] dark:border-white/10 dark:bg-dice-ink/70 dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
          : "border-white/20 bg-white/35 dark:border-white/5 dark:bg-dice-ink/40"
      }`}
    >
      <Container className="flex items-center justify-between py-2">
        <a href="#home" className="flex items-center" aria-label="Dice WiFi home">
          <img src="/logo.png" alt="Dice WiFi" className="h-12 w-auto sm:h-14 dark:brightness-0 dark:invert" />
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/60 px-1.5 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-dice-blue/8 hover:text-dice-blue dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-dice-cyan"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white/60 text-dice-ink backdrop-blur-md transition-colors hover:border-dice-blue/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-dice-cyan/40"
          >
            <Icon name={isDark ? "sun" : "moon"} className="h-[1.05rem] w-[1.05rem]" />
          </button>
          <Button href="#plans" size="md">
            Get Connected
            <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white/70 text-dice-ink backdrop-blur-md transition-colors hover:border-dice-blue/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-dice-cyan/40"
          >
            <Icon name={isDark ? "sun" : "moon"} className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white/70 text-dice-ink backdrop-blur-md transition-colors hover:border-dice-blue/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-dice-cyan/40"
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </header>

      {/* Mobile slide-out menu — rendered as a sibling of <header>, since the
          header's scroll/open state toggles backdrop-blur, and a backdrop-filter
          ancestor would become the containing block for this fixed panel
          (collapsing its height to the header's own height). */}
      <div
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-40 hidden w-[84%] max-w-sm flex-col gap-8 bg-white/95 px-8 pb-10 pt-28 shadow-2xl backdrop-blur-2xl dark:bg-dice-ink/95 lg:hidden"
        style={{ display: "none" }}
      >
        <div ref={linksRef} className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-lg font-medium text-dice-ink transition-colors hover:bg-dice-blue/8 hover:text-dice-blue dark:text-white dark:hover:bg-white/10 dark:hover:text-dice-cyan"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button href="#plans" size="lg" className="w-full" onClick={() => setOpen(false)}>
          Get Connected
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </div>

      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-dice-ink/30 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
