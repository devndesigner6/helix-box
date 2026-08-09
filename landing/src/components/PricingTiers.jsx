import React from 'react';
import { Smartphone, CheckCircle2 } from 'lucide-react';

export const PricingTiers = () => {
  const tiers = [
    {
      name: "Helix Box Core",
      price: "$0.00",
      period: "100% Free & Open Source",
      description: "Remotely connect your mobile device to your local PC without SSH configuration.",
      features: [
        "Local Machine CLI Gateway",
        "Rust WezTerm PTY Engine",
        "Mobile File Explorer & Editor",
        "Full Git Integration",
        "System Resource Monitoring",
        "Zero Port Forwarding"
      ],
      popular: false,
      cta: "Download APK"
    },
    {
      name: "Agent Session",
      price: "$0.25",
      period: "per 1 hour",
      description: "One hour of paid CLI-to-mobile agent relay access, settled with Algorand x402.",
      features: [
        "CLI-to-mobile relay access",
        "Pera Wallet payment",
        "Algorand x402 settlement",
        "Resume during valid access"
      ],
      popular: true,
      cta: "Start Agent Session"
    },
    {
      name: "Weekly Premium",
      price: "$2.00",
      period: "per 7 days",
      description: "Seven days of continuous HelixBox agent relay access.",
      features: [
        "Seven days of agent access",
        "Pera Wallet payment",
        "Algorand x402 settlement",
        "Resume during valid access"
      ],
      popular: false,
      cta: "Choose Weekly Premium"
    }
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-[#c3c2b2]/80" id="x402">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">ENHANCEMENT PLANS</span>
        <h2 className="text-4xl sm:text-5xl font-cabinet font-black text-[#232323] mt-2 mb-4">
          Algorand x402 Micro-Billing
        </h2>
        <p className="text-[#555555] text-base leading-relaxed">
          Select your micropayment tier. No monthly subscriptions — pay per request on Algorand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div 
            key={idx} 
            className={`auxia-card p-8 flex flex-col justify-between relative ${
              tier.popular ? 'border-[#0b4fff] shadow-[0_12px_40px_rgba(11,79,255,0.15)] bg-white' : 'bg-[#ffffff]/80'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0b4fff] text-white font-mono font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
            )}
            <div>
              <h3 className="font-cabinet font-bold text-2xl text-[#232323] mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-cabinet font-black text-[#232323]">{tier.price}</span>
                <span className="text-xs text-[#777777] font-mono">{tier.period}</span>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2.5 text-xs text-[#333333]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
              className={tier.popular ? 'auxia-btn-primary w-full text-center text-xs py-3' : 'auxia-btn-secondary w-full text-center text-xs py-3'}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

    </section>
  );
};
