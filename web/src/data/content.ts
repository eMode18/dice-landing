import type { IconName } from "../components/ui/Icon";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Plans", href: "#plans" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const;

export const trustIndicators = [
  { label: "Instant Activation", icon: "bolt" },
  { label: "Secure Connections", icon: "shield" },
] as const;

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: IconName;
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Starter",
    price: "KSh 50",
    period: "/ day",
    description: "Perfect for a quick session on the go.",
    features: ["1 Day Access", "1 Device", "Basic Speed"],
    icon: "bolt",
  },
  {
    name: "Weekly",
    price: "KSh 200",
    period: "/ week",
    description: "Great for short stays and visiting projects.",
    features: ["7 Days Access", "2 Devices", "Faster Speeds"],
    icon: "refresh",
    popular: true,
  },
  {
    name: "Monthly",
    price: "KSh 700",
    period: "/ month",
    description: "Our most popular plan for everyday life.",
    features: ["30 Days Access", "Multiple Devices", "Unlimited Browsing"],
    icon: "gauge",
  },
  {
    name: "Premium Unlimited",
    price: "KSh 1,500",
    period: "/ month",
    description: "Built for power users and growing teams.",
    features: ["Unlimited Devices", "Maximum Speeds", "Priority Support"],
    icon: "layers",
  },
];

export const features = [
  {
    title: "Lightning Fast Speeds",
    description: "Experience smooth browsing, streaming, gaming, and remote work.",
    icon: "bolt",
  },
  {
    title: "Instant Access",
    description: "Connect and start browsing within seconds without complicated setup.",
    icon: "spark",
  },
  {
    title: "Secure Connections",
    description: "Your internet sessions are protected using modern security standards.",
    icon: "shield",
  },
] as const;

export const reliability = [
  {
    title: "Reliable Speeds",
    description: "Optimized network performance throughout the day, every day.",
    icon: "gauge",
  },
  {
    title: "Instant Activation",
    description: "Purchase a plan and start browsing immediately — no waiting around.",
    icon: "bolt",
  },
  {
    title: "Stable Connections",
    description: "Engineered to keep you online when it matters most.",
    icon: "wave",
  },
] as const;

export const steps = [
  {
    title: "Connect to Dice WiFi",
    description: "Find a Dice hotspot nearby and join the network from your device.",
  },
  {
    title: "Open the Login Portal",
    description: "Your browser automatically redirects to the Dice access portal.",
  },
  {
    title: "Choose Your Plan",
    description: "Pick the subscription that matches how you want to get online.",
  },
  {
    title: "Start Browsing",
    description: "You're connected — enjoy fast, secure internet in seconds.",
  },
] as const;

export const portalFeatures = [
  "Plans from KSh 10",
  "Pay via M-Pesa",
  "Login with Code",
  "Monitor Your Session",
  "Renew Anytime",
] as const;

export const faqs = [
  {
    question: "How do I connect to a Dice hotspot?",
    answer:
      "Search for available WiFi networks on your device, select a Dice hotspot near you, and your browser will automatically open the Dice access portal where you can choose a plan and get online in seconds.",
  },
  {
    question: "How quickly is my plan activated?",
    answer:
      "Activation is instant. The moment your payment is confirmed in the portal, your device is granted access and you can start browsing immediately — no waiting, no setup calls.",
  },
  {
    question: "Can I connect multiple devices?",
    answer:
      "Yes. Depending on your plan you can connect anywhere from one device on Starter up to unlimited simultaneous devices on Premium Unlimited — perfect for teams, families, and households.",
  },
  {
    question: "How do I renew my subscription?",
    answer:
      "Open the Dice customer portal from any browser, go to your active plan, and tap Renew. You can also enable auto-renew so you're never caught without a connection.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Dice accepts M-Pesa, major debit and credit cards, and digital wallets. All transactions are encrypted and processed through PCI-compliant payment partners.",
  },
  {
    question: "Is my connection secure?",
    answer:
      "Absolutely. Every Dice session is protected with modern encryption standards and continuously monitored network security, so your browsing stays private on every hotspot.",
  },
] as const;

export const footerLinks = {
  quickLinks: [
    { label: "Home", href: "#home" },
    { label: "Plans", href: "#plans" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  support: [
    { label: "Help Center", href: "#faq" },
    { label: "Contact Support", href: "#footer-contact" },
    { label: "Service Status", href: "#" },
    { label: "Become a Partner", href: "#" },
  ],
} as const;
