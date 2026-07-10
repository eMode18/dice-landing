export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

export interface Contact {
  phone: string;
}

/** In-memory only — resets whenever the process restarts. */
let plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "KSh 50",
    period: "/ day",
    description: "Perfect for a quick session on the go.",
    features: ["1 Day Access", "1 Device", "Basic Speed"],
    icon: "bolt",
  },
  {
    id: "weekly",
    name: "Weekly",
    price: "KSh 200",
    period: "/ week",
    description: "Great for short stays and visiting projects.",
    features: ["7 Days Access", "2 Devices", "Faster Speeds"],
    icon: "refresh",
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "KSh 700",
    period: "/ month",
    description: "Our most popular plan for everyday life.",
    features: ["30 Days Access", "Multiple Devices", "Unlimited Browsing"],
    icon: "gauge",
  },
  {
    id: "premium",
    name: "Premium Unlimited",
    price: "KSh 1,500",
    period: "/ month",
    description: "Built for power users and growing teams.",
    features: ["Unlimited Devices", "Maximum Speeds", "Priority Support"],
    icon: "layers",
  },
];

let contact: Contact = {
  phone: "+254 700 123 456",
};

export const store = {
  getPlans(): Plan[] {
    return plans;
  },
  setPlans(next: Plan[]): void {
    plans = next;
  },
  getContact(): Contact {
    return contact;
  },
  setContact(next: Contact): void {
    contact = next;
  },
};
