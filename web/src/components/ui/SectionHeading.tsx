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
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <Reveal
      className={`flex flex-col gap-3 ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      <h2 className="max-w-xl text-balance font-display text-[1.9rem] leading-[1.15] font-semibold text-dice-navy dark:text-white sm:text-[2.35rem]">
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-md text-[0.95rem] leading-relaxed text-slate-500 dark:text-slate-400 ${isCenter ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
