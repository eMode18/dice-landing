import type { ReactNode } from "react";
import { Reveal } from "../Reveal";

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isLight = tone === "light";

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-5 ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      <Reveal delay={0.08}>
        <h2
          className={`max-w-3xl text-[2rem] leading-[1.12] font-semibold sm:text-4xl lg:text-[2.75rem] xl:text-5xl ${
            isLight ? "text-white" : "text-dice-ink dark:text-white"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
              isLight ? "text-white/75" : "text-slate-600 dark:text-slate-300"
            } ${isCenter ? "mx-auto" : ""}`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
