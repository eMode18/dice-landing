import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { footerLinks, supportEmail } from "../../data/content";
import { useSiteData } from "../../context/useSiteData";

/* Filled brand glyphs — kept local rather than in ui/icons, whose list
   doubles as the admin plan-icon picker. */
const socials = [
  {
    label: "Facebook",
    path: "M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z",
  },
  {
    label: "X",
    path: "M17.5 3.5h2.9l-6.3 7.2 7.4 9.8h-5.8l-4.5-5.9-5.2 5.9H3.1l6.7-7.7L2.7 3.5h5.9l4.1 5.4 4.8-5.4Zm-1 15.3h1.6L7.5 5.1H5.8l10.7 13.7Z",
  },
  {
    label: "Instagram",
    path: "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.3c0-1.5-.4-2.8-1.5-3.8S17.2 3 15.7 3H8.3C6.8 3 5.5 3.4 4.5 4.5S3 6.8 3 8.3v7.4c0 1.5.4 2.8 1.5 3.8S6.8 21 8.3 21h7.4c1.5 0 2.8-.4 3.8-1.5s1.5-2.3 1.5-3.8V8.3Zm-1.9 9.2a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.4.4s-4.2.1-5.4-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.5s-.1-4.2.4-5.4a3 3 0 0 1 1.7-1.7c1.2-.5 4-.4 5.4-.4s4.2-.1 5.4.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.4s.1 4.3-.4 5.5Z",
  },
  {
    label: "YouTube",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  },
] as const;

const legal = ["Privacy Policy", "Terms of Service"];

export function Footer() {
  const { contact } = useSiteData();

  return (
    <footer id="footer-contact" className="relative mt-10 scroll-mt-16 bg-dice-footer text-white">
      <Container>
        {/* Phones: brand on top, Quick Links beside Follow Us, Support (long email)
            full width last. lg: four columns in source order. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 pb-10 pt-12 sm:pb-12 sm:pt-14 lg:grid-cols-[1.4fr_0.9fr_1.3fr_auto] lg:gap-12">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <a href="/" className="w-fit" aria-label="Dice WiFi home">
              <Logo tone="dark" className="h-12" />
            </a>
            <p className="text-sm text-white/65">Fast. Affordable. Everywhere.</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold">Quick Links</h3>
            <ul className="-my-2 flex flex-col">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="flex min-h-11 w-full items-center text-sm text-white/65 transition-colors hover:text-white lg:min-h-9">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-last col-span-2 flex flex-col gap-4 sm:order-none sm:col-span-1">
            <h3 className="font-display text-sm font-semibold">Support</h3>
            <ul className="-my-2 flex flex-col text-sm text-white/65">
              {contact?.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="flex min-h-11 items-center gap-3 transition-colors hover:text-white lg:min-h-9">
                    <Icon name="call" className="h-4 w-4 shrink-0 text-white" />
                    {contact.phone}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${supportEmail}`} className="flex min-h-11 items-center gap-3 transition-colors hover:text-white lg:min-h-9">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-white" />
                  {supportEmail}
                </a>
              </li>
              <li className="flex min-h-11 items-center gap-3 lg:min-h-9">
                <Icon name="pin" className="h-4 w-4 shrink-0 text-white" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold">Follow Us</h3>
            {/* 2×2 on phones (half-width column), one row from sm. */}
            <div className="grid w-fit grid-cols-2 gap-2.5 sm:flex">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dice-footer transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-1 border-t border-white/10 py-5 text-xs text-white/55 sm:flex-row sm:gap-3">
          <p>&copy; {new Date().getFullYear()} Dice WiFi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {legal.map((item) => (
              <a key={item} href="#" className="inline-flex min-h-11 items-center transition-colors hover:text-white">
                {item}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
