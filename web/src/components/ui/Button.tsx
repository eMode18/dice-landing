import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dice-accent whitespace-nowrap disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-dice-accent text-white shadow-[0_10px_24px_-10px_rgba(31,107,255,0.7)] hover:bg-dice-accent-dark hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-dice-dark border border-slate-200 shadow-sm hover:border-dice-blue/40 hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "bg-white text-dice-accent border border-dice-accent/70 hover:bg-dice-accent hover:text-white hover:border-dice-accent dark:bg-transparent dark:text-white dark:border-white/25 dark:hover:bg-dice-accent dark:hover:border-dice-accent",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm",
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
      <a
        href={href}
        className={classes}
        aria-label={rest["aria-label"]}
        onClick={rest.onClick as unknown as MouseEventHandler<HTMLAnchorElement> | undefined}
      >
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
