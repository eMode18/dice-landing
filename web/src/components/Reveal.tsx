import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Animate direct children one-by-one instead of the wrapper as a whole */
  stagger?: boolean;
  delay?: number;
}

export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = stagger ? gsap.utils.toArray(ref.current.children) : ref.current;
      const mm = gsap.matchMedia();

      // Reduced motion: content stays at its natural, fully-visible resting
      // state — never gated behind a scroll-triggered animation that might
      // not fire (or that the user doesn't want to see).
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay,
            ease: "power3.out",
            stagger: stagger ? 0.08 : 0,
            scrollTrigger: {
              // Starts well before the element is actually visible (120% =
              // one full viewport-height below the fold) so the reveal has
              // already finished by the time it scrolls into view, even on
              // a fast flick-scroll — instead of racing the animation.
              trigger: ref.current,
              start: "top 120%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: ref }
  );

  const Component = Tag as ElementType;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
