import { useEffect, useRef, useState } from "react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { navLinks } from "../../data/content";
import { pathToSectionId } from "../../lib/routes";
import { useDarkMode } from "../../lib/theme";

/** Which nav link's section is currently under the header. */
function useActiveHref() {
  const [active, setActive] = useState<string>("/");

  useEffect(() => {
    function update() {
      let current = "/";
      for (const link of navLinks) {
        const id = pathToSectionId[link.href];
        if (!id || id === "home") continue;
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = link.href;
      }
      setActive(current);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return active;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const panelRef = useRef<HTMLDivElement>(null);
  const active = useActiveHref();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  useEffect(() => {
    if (!panelRef.current) return;
    panelRef.current.style.display = open ? "flex" : "none";
  }, [open]);

  const themeButton = (size: string) => (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex ${size} items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-dice-sky hover:text-dice-accent dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white`}
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-[1.1rem] w-[1.1rem]" />
    </button>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || open
            ? "border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-dice-night/85"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <Container className="flex h-[72px] items-center justify-between">
          <a href="/" className="flex items-center" aria-label="Dice WiFi home">
            <Logo className="h-11" />
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex h-11 items-center text-[0.9rem] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:rounded-full after:bg-dice-accent after:transition-all after:duration-300 dark:after:bg-dice-cyan ${
                    isActive
                      ? "text-dice-accent after:w-full dark:text-white"
                      : "text-slate-600 after:w-0 hover:text-dice-navy dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {themeButton("h-10 w-10")}
            <Button href="/plans" size="sm">
              Get Connected
              <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            {themeButton("h-11 w-11")}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full text-dice-navy transition-colors hover:bg-dice-sky dark:text-white dark:hover:bg-white/10"
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
        className="fixed inset-y-0 right-0 z-40 hidden w-[84%] max-w-sm flex-col gap-8 bg-white px-6 pb-10 pt-24 shadow-2xl dark:bg-dice-night lg:hidden"
        style={{ display: "none" }}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-dice-sky dark:hover:bg-white/10 ${
                active === link.href ? "text-dice-accent dark:text-dice-cyan" : "text-dice-navy dark:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button href="/plans" size="lg" className="w-full" onClick={() => setOpen(false)}>
          Get Connected
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </div>

      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-dice-navy/30 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
