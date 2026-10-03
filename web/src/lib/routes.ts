export const pathToSectionId: Record<string, string> = {
  "/": "home",
  "/plans": "plans",
  "/how-it-works": "how-it-works",
  "/hotspots": "hotspots",
  "/faq": "faq",
  "/contact": "footer-contact",
  // Older URLs whose sections were folded into the redesign.
  "/features": "how-it-works",
  "/connect": "hotspots",
};

export function isSectionPath(path: string): boolean {
  return path in pathToSectionId;
}

export function scrollToPath(path: string, behavior: ScrollBehavior): void {
  const id = pathToSectionId[path];
  if (!id) return;

  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

export function navigateToPath(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState(null, "", path);
  }
  scrollToPath(path, "smooth");
}
