import { useState, type FormEvent } from "react";
import { Container } from "../ui/Container";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { hotspotLocations } from "../../data/content";

/* Kenya's border (Natural Earth 1:110m, public domain), projected
   equirectangularly: x = (lon - 33.8) * 30, y = (5.6 - lat) * 30. */
const KENYA_PATH =
  "M215.8 193.7L233.6 218.5L212.5 230.5L205.1 243.0L193.9 245.2L189.6 266.3L180.0 278.4L174.1 298.4L162.1 308.3L119.0 278.3L117.0 260.9L8.2 199.8L3.1 196.5L2.8 164.7L11.4 152.6L26.2 132.7L37.1 110.8L23.9 76.4L20.4 61.3L6.2 40.5L24.6 22.6L44.9 2.8L60.5 7.9L60.5 24.7L70.8 34.6L91.7 34.6L129.6 60.0L139.1 60.3L146.1 59.5L152.8 63.0L172.8 65.3L181.6 52.8L209.1 40.3L221.2 50.4L241.7 50.4L215.4 84.5Z";
const project = (lat: number, lon: number) => ({ x: (lon - 33.8) * 30, y: (5.6 - lat) * 30 });

type Result = { found: true; town: string } | { found: false; query: string } | null;

function KenyaMap() {
  const pins = hotspotLocations.filter((l) => l.featured);
  return (
    <svg viewBox="-6 -6 256 322" className="h-auto w-full max-w-[170px] lg:max-w-[220px]" role="img" aria-label="Map of Kenya with Dice WiFi hotspots in Nairobi, Mombasa, Kisumu and Eldoret">
      <path d={KENYA_PATH} className="fill-[#d6e4ff] stroke-white dark:fill-white/10 dark:stroke-white/20" strokeWidth={3} strokeLinejoin="round" />
      {pins.map((l) => {
        const { x, y } = project(l.lat, l.lon);
        return (
          <g key={l.town} transform={`translate(${x} ${y}) scale(1.35)`}>
            <circle r={14} className="fill-white dark:fill-dice-night" opacity={0.9} />
            <path
              d="M0 0c-5-6-8-10-8-14a8 8 0 0 1 16 0c0 4-3 8-8 14Z"
              transform="translate(0 4)"
              className="fill-dice-accent dark:fill-dice-cyan"
            />
            <circle cy={-6} r={3} className="fill-white dark:fill-dice-night" />
          </g>
        );
      })}
    </svg>
  );
}

export function Hotspots() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [showAll, setShowAll] = useState(false);

  const listed = showAll ? hotspotLocations : hotspotLocations.filter((l) => l.featured);

  function check(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // "nai" → Nairobi, "Westlands, Nairobi" → Nairobi
    const needle = q.toLowerCase();
    const match = hotspotLocations.find((l) => {
      const town = l.town.toLowerCase();
      return (needle.length >= 3 && town.startsWith(needle)) || needle.includes(town);
    });
    setResult(match ? { found: true, town: match.town } : { found: false, query: q });
  }

  return (
    <section id="hotspots" className="relative scroll-mt-16 py-10 sm:py-14">
      <Container>
        {/* Phones/tablets: copy + search full width, then map and town list side
            by side. xl: three columns. */}
        <Reveal className="grid grid-cols-2 items-center gap-x-4 gap-y-8 rounded-[28px] bg-dice-sky px-5 py-9 sm:gap-x-8 sm:px-10 sm:py-12 xl:grid-cols-[1.35fr_0.8fr_0.7fr] xl:gap-8 xl:px-12 dark:bg-white/4 dark:ring-1 dark:ring-white/10">
          <div className="col-span-2 flex flex-col gap-3 xl:col-span-1">
            <h2 className="text-balance font-display text-[1.9rem] font-semibold leading-[1.15] text-dice-navy dark:text-white sm:text-[2.35rem]">
              Find a hotspot near you
            </h2>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-slate-500 dark:text-slate-400">
              From busy markets to transport hubs and public spaces, Dice WiFi keeps you online.
            </p>

            <form
              onSubmit={check}
              className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:bg-white sm:p-1.5 sm:pl-4 sm:shadow-[0_10px_30px_-18px_rgba(15,31,69,0.35)] sm:focus-within:ring-2 sm:focus-within:ring-dice-accent/40 sm:dark:bg-white/7"
            >
              {/* Phones: the field and the button stack, each full width. */}
              <div className="flex h-12 items-center gap-2 rounded-full bg-white px-4 shadow-[0_10px_30px_-18px_rgba(15,31,69,0.35)] focus-within:ring-2 focus-within:ring-dice-accent/40 dark:bg-white/7 sm:h-11 sm:flex-1 sm:bg-transparent sm:px-0 sm:shadow-none sm:focus-within:ring-0 sm:dark:bg-transparent">
              <Icon name="pin" className="h-[1.1rem] w-[1.1rem] shrink-0 text-dice-accent dark:text-dice-cyan" />
              <label htmlFor="hotspot-search" className="sr-only">Your location</label>
              <input
                id="hotspot-search"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResult(null);
                }}
                placeholder="Your town, e.g. Nairobi"
                autoComplete="address-level2"
                className="h-full min-w-0 flex-1 bg-transparent text-base placeholder:text-sm sm:text-sm text-dice-navy placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
              />
              </div>
              <button
                type="submit"
                className="min-h-11 w-full shrink-0 rounded-full bg-dice-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dice-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dice-accent focus-visible:ring-offset-2 sm:w-auto sm:px-7"
              >
                Check Now
              </button>
            </form>

            <p aria-live="polite" className="min-h-5 pl-1 text-sm sm:pl-4">
              {result?.found && (
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                  Dice WiFi is available in {result.town}.
                </span>
              )}
              {result && !result.found && (
                <span className="text-slate-600 dark:text-slate-300">
                  Not in {result.query} yet — we're expanding fast.
                </span>
              )}
            </p>
          </div>

          <div className="flex justify-center">
            <KenyaMap />
          </div>

          <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-3.5">
              {listed.map((l) => (
                <li key={l.town} className="flex items-center gap-3 text-[0.95rem] font-medium text-dice-navy dark:text-white">
                  <Icon name="pin" className="h-[1.1rem] w-[1.1rem] text-dice-accent dark:text-dice-cyan" />
                  {l.town}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="group inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-dice-accent underline underline-offset-4 hover:text-dice-accent-dark dark:text-dice-cyan"
            >
              {showAll ? "Show fewer locations" : "View all locations"}
              <Icon
                name="arrowRight"
                className={`h-4 w-4 transition-transform duration-300 ${showAll ? "-rotate-90" : "group-hover:translate-x-0.5"}`}
              />
            </button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
