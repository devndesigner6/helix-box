import React, { useState } from 'react';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LogoMarquee } from './components/LogoMarquee';
import { MessGridSection } from './components/MessGridSection';
import { ModernizedStackSection } from './components/ModernizedStackSection';
import { FeatureTabsSection } from './components/FeatureTabsSection';
import { EnterpriseTrustSection } from './components/EnterpriseTrustSection';
import { PricingTiers } from './components/PricingTiers';
import { FAQAccordion } from './components/FAQAccordion';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

export default function App() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-[#f0efe3] text-[#232323] font-sans antialiased selection:bg-[#0b4fff] selection:text-white transition-colors duration-300">
      {showBanner && <TopAnnouncementBar onDismiss={() => setShowBanner(false)} />}
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <MessGridSection />
        <ModernizedStackSection />
        <FeatureTabsSection />
        <EnterpriseTrustSection />
        <PricingTiers />
        <FAQAccordion />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
