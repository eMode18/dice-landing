import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dice-blue whitespace-nowrap disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-dice-blue text-white shadow-[0_8px_30px_-8px_rgba(0,102,255,0.65)] hover:shadow-[0_12px_40px_-6px_rgba(0,102,255,0.8)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-dice-dark border border-slate-200 shadow-sm hover:border-dice-blue/40 hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm sm:text-[0.95rem]",
  lg: "px-7 sm:px-8 py-3.5 sm:py-4 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">{children}</span>
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      <span>{children}</span>
    </button>
  );
}
