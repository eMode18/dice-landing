interface DiceMarkProps {
  className?: string;
  /** When true, renders on dark backgrounds (white outline, brighter faces) */
  inverted?: boolean;
}

/**
 * Scalable SVG rendition of the Dice Ltd. cube — an isometric die face
 * matching the brand mark, used wherever a crisp vector icon is needed
 * (nav, footer, badges) instead of the raster logo.
 */
export function DiceMark({ className = "h-9 w-9", inverted = false }: DiceMarkProps) {
  const pip = inverted ? "fill-dice-blue" : "fill-white";
  const top = inverted ? "fill-white" : "fill-[#3385ff]";
  const left = inverted ? "fill-white/85" : "fill-dice-blue";
  const right = inverted ? "fill-white/70" : "fill-dice-dark";
  const stroke = inverted ? "stroke-dice-blue/40" : "stroke-white/70";
  const wifiColor = inverted ? "#0066ff" : "#ffffff";

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      {/* top face — single pip */}
      <path d="M32 4 L58 17 L32 30 L6 17 Z" className={`${top} ${stroke}`} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="32" cy="17" r="3.4" className={pip} />

      {/* left face — wifi signal (matches logo) */}
      <path d="M6 17 L32 30 L32 58 L6 45 Z" className={`${left} ${stroke}`} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="14" cy="43" r="2.2" fill={wifiColor} />
      <path d="M11 39.5 A5.5 5.5 0 0 1 19 37.5" stroke={wifiColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M9 36 A9 9 0 0 1 22 33.5" stroke={wifiColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M7 32.5 A13 13 0 0 1 25 29.5" stroke={wifiColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* right face — five pips */}
      <path d="M32 30 L58 17 L58 45 L32 58 Z" className={`${right} ${stroke}`} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="38.5" cy="33.6" r="3" className={pip} />
      <circle cx="51" cy="26.8" r="3" className={pip} />
      <circle cx="51" cy="40.6" r="3" className={pip} />
      <circle cx="38.5" cy="47.4" r="3" className={pip} />
      <circle cx="44.7" cy="37.2" r="3" className={pip} />
    </svg>
  );
}
