import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { footerLinks } from "../../data/content";

const socials = [
  { label: "X / Twitter", icon: "spark" },
  { label: "Instagram", icon: "layers" },
  { label: "LinkedIn", icon: "user" },
  { label: "Facebook", icon: "wave" },
] as const;

const legal = ["Privacy Policy", "Terms of Service"];

export function Footer() {
  return (
    <footer
      id="footer-contact"
      className="relative border-t border-slate-200/70 pt-20 dark:border-white/10 sm:pt-24"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 pb-16 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Column 1 — Company info */}
          <div className="flex flex-col gap-5">
            <a href="#home" className="flex items-center">
              <img
                src="/logo.png"
                alt="Dice WiFi"
                className="h-12 w-auto dark:brightness-0 dark:invert sm:h-14"
              />
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-white/60">
              Premium WiFi hotspot subscriptions delivering fast, reliable, and secure internet
              for students, businesses, remote workers, and everyday users.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/80 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-dice-blue/50 hover:text-dice-blue dark:border-white/15 dark:text-white/70 dark:hover:border-dice-cyan/50 dark:hover:text-dice-cyan"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-dice-ink dark:text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-dice-blue dark:text-white/60 dark:hover:text-dice-cyan"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-dice-ink dark:text-white">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-dice-blue dark:text-white/60 dark:hover:text-dice-cyan"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-dice-ink dark:text-white">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm text-slate-600 dark:text-white/60">
              <li className="flex items-start gap-3">
                <Icon name="headset" className="mt-0.5 h-4 w-4 shrink-0 text-dice-blue dark:text-dice-cyan" />
                <span>+254 700 123 456</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 py-7 text-xs text-slate-500 dark:border-white/10 dark:text-white/50 sm:flex-row sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Dice WiFi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {legal.map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors hover:text-dice-blue dark:hover:text-dice-cyan"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
