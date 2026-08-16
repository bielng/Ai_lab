import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Translator from "./components/Translator";
import TrustBar from "./components/TrustBar";
import PreserveSection from "./components/PreserveSection";
import WorkSection from "./components/WorkSection";
import LanguagesBand from "./components/LanguagesBand";
import AudienceSection from "./components/AudienceSection";
import ContributeCTA from "./components/ContributeCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <Translator />
        <TrustBar />
        <PreserveSection />
        <WorkSection />
        <LanguagesBand />
        <AudienceSection />
        <ContributeCTA />
      </main>
      <Footer />
    </div>
  );
}
