import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FAQAccordion = () => {
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      q: "What is Helix Box?",
      a: "Helix Box is an AI-powered mobile IDE. It pairs your phone with a CLI running on your own computer through encrypted relays."
    },
    {
      q: "How does the CLI bridge connect my PC to my phone?",
      a: "Run `npx helixbox-cli -n` on your local PC. The Node.js CLI connects to our Bun WebSocket proxy and outputs a QR code and 6-character key. Scan or type the key in the mobile app to pair your devices instantly."
    },
    {
      q: "Do I need to open firewall ports or set up a VPN?",
      a: "No! Helix Box uses zero-trust outbound WebSocket relays via Manager & Proxy servers. Your local machine never exposes open incoming firewall ports to the public internet."
    },
    {
      q: "What is Algorand x402 and how does micro-billing work?",
      a: "x402 is an HTTP 402 Payment Required standard. HelixBox uses it for agent relay access: $0.25 USDC for one hour or $2 USDC for seven days. Pera Wallet approves the payment and access begins only after settlement."
    },
    {
      q: "Where can I download the Android APK?",
      a: "Click the 'Download APK' button in the navigation bar or hero section. It downloads `helix-boxv1.apk` directly from our official GitHub releases."
    },
    {
      q: "Is Helix Box open source?",
      a: "Yes! The Expo/React Native mobile client (`app/`), Node.js CLI (`cli/`), Bun proxy manager (`manager/` & `proxy/`), and Rust PTY binary (`pty/`) are all open-source under the MIT license."
    }
  ];

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto border-t border-[#c3c2b2]/80" id="faq">
      
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">FREQUENTLY ASKED QUESTIONS</span>
        <h2 className="text-4xl sm:text-5xl font-cabinet font-black text-[#232323] mt-2 mb-4">
          Everything you need to know.
        </h2>
        <a href="https://github.com/devndesigner6/helix-box/issues" target="_blank" rel="noreferrer" className="text-xs text-[#555555] underline hover:text-[#0b4fff] transition-colors">
          Have a question not answered here? Ask us on GitHub
        </a>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="auxia-card p-6 cursor-pointer transition-all"
            onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-[#0b4fff]">00{idx + 1}</span>
                <h3 className="font-cabinet font-bold text-lg text-[#232323]">{faq.q}</h3>
              </div>
              {activeFaq === idx ? <Minus className="w-4 h-4 text-[#0b4fff]" /> : <Plus className="w-4 h-4 text-[#888888]" />}
            </div>
            {activeFaq === idx && (
              <p className="mt-4 pl-10 text-sm text-[#555555] leading-relaxed border-t border-[#c3c2b2]/60 pt-4">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>

    </section>
  );
};
