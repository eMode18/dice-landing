/** Dice WiFi wordmark. The "ice" lettering is navy in the original artwork,
    so dark backgrounds get a variant with white lettering. `tone="auto"`
    follows the site theme; `tone="dark"` is for always-dark surfaces. */
export function Logo({ className = "h-10", tone = "auto" }: { className?: string; tone?: "auto" | "dark" }) {
  const img = (src: string, extra: string) => (
    <img src={src} alt="Dice WiFi" width={640} height={200} className={`w-auto select-none ${className} ${extra}`} draggable={false} />
  );
  if (tone === "dark") return img("/logo-dark.png", "");
  return (
    <>
      {img("/logo.png", "dark:hidden")}
      {img("/logo-dark.png", "hidden dark:block")}
    </>
  );
}
