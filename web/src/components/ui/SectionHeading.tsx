import type { ReactNode } from "react";
import { Reveal } from "../Reveal";

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-5 ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      <Reveal delay={0.08}>
        <h2 className="max-w-3xl text-[2rem] leading-[1.12] font-semibold text-dice-ink dark:text-white sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg ${
              isCenter ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
