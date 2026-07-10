import { useEffect, useRef } from "react";
import { useSiteData } from "../context/useSiteData";
import { isSectionPath, navigateToPath, scrollToPath } from "../lib/routes";

/** Keeps clean section URLs (/plans, /connect, ...) in sync with the
    single scrolling page: intercepts clicks on internal section links
    (pushState instead of a hash jump), handles back/forward, and
    re-settles the initial scroll position once data that can resize
    sections (plans, portal mockup) has finished loading. */
export function SectionRouter() {
  const { loading } = useSiteData();
  const settledOnce = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (isSectionPath(window.location.pathname)) {
      scrollToPath(window.location.pathname, "instant");
    }
  }, []);

  useEffect(() => {
    if (loading || settledOnce.current) return;
    settledOnce.current = true;
    if (isSectionPath(window.location.pathname)) {
      scrollToPath(window.location.pathname, "instant");
    }
  }, [loading]);

  useEffect(() => {
    function onPopState() {
      scrollToPath(window.location.pathname, "smooth");
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !isSectionPath(href)) return;
      e.preventDefault();
      navigateToPath(href);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
