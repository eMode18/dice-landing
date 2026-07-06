import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Animate direct children one-by-one instead of the wrapper as a whole */
  stagger?: boolean;
  /** Stagger gap in seconds */
  staggerAmount?: number;
  /** Vertical travel distance in px */
  distance?: number;
  delay?: number;
  /** Use a scale-in instead of slide-up */
  variant?: "up" | "scale" | "fade";
}

export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = false,
  staggerAmount = 0.12,
  distance = 36,
  delay = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<any>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = stagger ? gsap.utils.toArray(ref.current.children) : ref.current;

      const from =
        variant === "scale"
          ? { opacity: 0, scale: 0.92, y: distance * 0.4 }
          : variant === "fade"
            ? { opacity: 0 }
            : { opacity: 0, y: distance };

      const to =
        variant === "scale"
          ? { opacity: 1, scale: 1, y: 0 }
          : variant === "fade"
            ? { opacity: 1 }
            : { opacity: 1, y: 0 };

      gsap.fromTo(targets, from, {
        ...to,
        duration: 0.9,
        delay,
        ease: "power3.out",
        stagger: stagger ? staggerAmount : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
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
