import { createContext } from "react";
import type { Contact, Plan } from "../lib/api";

export interface SiteDataValue {
  plans: Plan[];
  contact: Contact | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const SiteDataContext = createContext<SiteDataValue | null>(null);
