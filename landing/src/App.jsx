import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LogoMarquee } from './components/LogoMarquee';
import { ModernizedStack } from './components/ModernizedStack';
import { ConnectedNodes } from './components/ConnectedNodes';
import { EnterpriseTrust } from './components/EnterpriseTrust';
import { PricingTiers } from './components/PricingTiers';
import { FAQAccordion } from './components/FAQAccordion';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f0efe3] text-[#232323] font-sans antialiased selection:bg-[#0b4fff] selection:text-white transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <ModernizedStack />
        <ConnectedNodes />
        <EnterpriseTrust />
        <PricingTiers />
        <FAQAccordion />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
