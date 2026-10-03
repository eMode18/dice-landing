import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { Plans } from "./components/sections/Plans";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Hotspots } from "./components/sections/Hotspots";
import { Testimonials } from "./components/sections/Testimonials";
import { FAQ } from "./components/sections/FAQ";
import { Footer } from "./components/sections/Footer";
import { SiteDataProvider } from "./context/SiteDataContext";
import { AdminPage } from "./components/admin/AdminPage";
import { SectionRouter } from "./components/SectionRouter";

function LandingPage() {
  return (
    <SiteDataProvider>
      <SectionRouter />
      <div className="bg-white text-dice-navy dark:bg-dice-night dark:text-white">
        <Navbar />
        <main>
          <Hero />
          <Plans />
          <HowItWorks />
          <Hotspots />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
      </div>
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
