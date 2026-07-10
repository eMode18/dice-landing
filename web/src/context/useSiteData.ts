import { useContext } from "react";
import { SiteDataContext, type SiteDataValue } from "./site-data-context";

export function useSiteData(): SiteDataValue {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within a SiteDataProvider");
  return ctx;
}
