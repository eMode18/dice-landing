import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { Plans } from "./components/sections/Plans";
import { WhyChooseUs } from "./components/sections/WhyChooseUs";
import { Reliability } from "./components/sections/Reliability";
import { HowItWorks } from "./components/sections/HowItWorks";

import { Portal } from "./components/sections/Portal";
import { FAQ } from "./components/sections/FAQ";
import { FinalCTA } from "./components/sections/FinalCTA";
import { Footer } from "./components/sections/Footer";

function App() {
  return (
    <div className="relative min-h-screen font-body">
      {/* Single shared glow, anchored to the top of the page only — scrolls
          away naturally so it never repeats or seams against lower sections. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[1100px] dark:block">
        <div className="absolute left-1/2 top-[-120px] h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(31,107,255,0.28),transparent_65%)] blur-[6px]" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <Plans />
        <WhyChooseUs />
        <Reliability />
        <HowItWorks />
        <Portal />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
