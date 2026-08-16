import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Translator from "./components/Translator.jsx";
import NaathChat from "./components/NaathChat.jsx";
import TrustBar from "./components/TrustBar.jsx";
import PreserveSection from "./components/PreserveSection.jsx";
import WorkSection from "./components/WorkSection.jsx";
import LanguagesBand from "./components/LanguagesBand.jsx";
import AudienceSection from "./components/AudienceSection.jsx";
import ContributeCTA from "./components/ContributeCTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <Translator />
        <NaathChat />
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
