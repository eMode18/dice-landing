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

      gsap.fromTo(
        targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
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
