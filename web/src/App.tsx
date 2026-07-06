import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { Stats } from "./components/sections/Stats";
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
    <div className="relative min-h-screen bg-white font-body">
      <Navbar />
      <main>
        <Hero />
        <Stats />
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
