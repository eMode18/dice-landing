export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Plans", href: "/plans" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Hotspots", href: "/hotspots" },
  { label: "FAQ", href: "/faq" },
] as const;

export const heroFeatures = [
  { title: "Fast & Reliable", description: "Stable connections where it matters.", icon: "bolt" },
  { title: "Wide Coverage", description: "Hotspots in towns, markets and public spaces.", icon: "pin" },
  { title: "Secure Access", description: "Safe and encrypted browsing.", icon: "shieldCheck" },
] as const;

// Plans are no longer static — they're served by the backend (server/) and
// fetched at runtime via SiteDataContext, so admins can edit them.

export const steps = [
  {
    title: "Find a hotspot",
    description: "Look for Dice WiFi hotspots in your area.",
    icon: "wifi",
  },
  {
    title: "Choose a plan",
    description: "Pick the plan that suits your needs and pay via M-Pesa.",
    icon: "phone",
  },
  {
    title: "Get connected",
    description: "Enter your details and you're online!",
    icon: "check",
  },
] as const;

/** Towns with Dice hotspots. `featured` towns are listed (and pinned on the
    map) by default; the rest appear under "View all locations". Coordinates
    are only used to place map pins. */
export const hotspotLocations = [
  { town: "Nairobi", lat: -1.29, lon: 36.82, featured: true },
  { town: "Mombasa", lat: -4.04, lon: 39.67, featured: true },
  { town: "Kisumu", lat: -0.09, lon: 34.76, featured: true },
  { town: "Eldoret", lat: 0.51, lon: 35.27, featured: true },
  { town: "Nakuru", lat: -0.3, lon: 36.07, featured: false },
  { town: "Thika", lat: -1.03, lon: 37.07, featured: false },
  { town: "Machakos", lat: -1.52, lon: 37.26, featured: false },
  { town: "Nyeri", lat: -0.42, lon: 36.95, featured: false },
] as const;

// Placeholder testimonials from the design mockup — replace with real reviews.
export const testimonials = [
  {
    quote: "Dice WiFi is a lifesaver! Fast, reliable and easy to use. I can work from anywhere now.",
    name: "Aisha Wanjiku",
    role: "Student, Nairobi",
  },
  {
    quote: "Perfect for business. The connection is always stable and the speeds are great.",
    name: "Brian Otieno",
    role: "Small Business Owner, Kisumu",
  },
  {
    quote: "Affordable plans and great coverage. I use it every day at the matatu stage.",
    name: "Mercy Njeri",
    role: "Entrepreneur, Mombasa",
  },
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
    { label: "Home", href: "/" },
    { label: "Hotspots", href: "/hotspots" },
    { label: "Plans", href: "/plans" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;

// Placeholder support email from the design mockup — confirm before launch.
export const supportEmail = "hello@dicewifi.co.ke";
