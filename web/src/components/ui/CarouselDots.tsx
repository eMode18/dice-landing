/** Visual-only position indicator under a phone swipe row (hidden from
    assistive tech — the row itself is the accessible, scrollable region). */
export function CarouselDots({ count, active, className = "" }: { count: number; active: number; className?: string }) {
  return (
    <div aria-hidden className={`flex justify-center gap-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          data-dot-active={i === active || undefined}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active ? "w-5 bg-dice-accent dark:bg-dice-cyan" : "w-1.5 bg-slate-300 dark:bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}
