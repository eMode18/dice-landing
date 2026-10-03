import { useEffect, useState, type RefObject } from "react";

/** Visual position (left-to-right, so CSS `order` is respected) of the child
    of a horizontal scroll-snap row that sits closest to the row's centre —
    drives the dot indicators under phone carousels.
    `count` re-runs the measurement when the number of children changes. */
export function useSnapIndex(ref: RefObject<HTMLElement | null>, count: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    function measure() {
      frame = 0;
      if (!el) return;
      const centre = el.scrollLeft + el.clientWidth / 2;
      const lefts = Array.from(el.children, (child) => (child as HTMLElement).offsetLeft).sort((a, b) => a - b);
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child) => {
        const c = child as HTMLElement;
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centre);
        if (dist < bestDist) {
          bestDist = dist;
          best = lefts.indexOf(c.offsetLeft);
        }
      });
      setIndex(best);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, count]);

  return index;
}
