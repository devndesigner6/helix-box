import React from 'react';

export const LogoMarquee = () => {
  const marqueeItems = [
    "Rust WezTerm PTY",
    "Algorand x402 Micropayments",
    "Bun WebSocket Relays",
    "Expo Mobile IDE",
    "Node.js CLI Gateway",
    "Framer Motion Physics",
    "OpenAI Code Assistant",
    "Zero-Trust Encryption"
  ];

  return (
    <div className="w-full overflow-hidden no-scrollbar py-6 border-y border-[#c3c2b2]/80 bg-[#ffffff]/60 my-12">
      <div className="max-w-6xl mx-auto px-6 mb-3 text-center">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#777777]">POWERED BY OPEN SOURCE ARCHITECTURE</span>
      </div>
      <div className="flex w-[200%] animate-marquee gap-4">
        {marqueeItems.concat(marqueeItems).map((item, idx) => (
          <span 
            key={idx} 
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-mono font-medium bg-[#ffffff] text-[#333333] border border-[#c3c2b2] shadow-sm shrink-0 hover:border-[#0b4fff] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0b4fff] mr-2" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
