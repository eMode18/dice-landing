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
import { SiteDataProvider } from "./context/SiteDataContext";
import { AdminPage } from "./components/admin/AdminPage";
import { SectionRouter } from "./components/SectionRouter";

function LandingPage() {
  return (
    <SiteDataProvider>
      <SectionRouter />
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
    </SiteDataProvider>
  );
}

function App() {
  const isAdmin = window.location.pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen font-body">
      {isAdmin ? <AdminPage /> : <LandingPage />}
    </div>
  );
}

export default App;
