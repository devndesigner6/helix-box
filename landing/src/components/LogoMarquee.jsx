import React from 'react';

export const LogoMarquee = () => {
  const brandLogos = [
    "KONAMI",
    "MERCARI",
    "MIXI",
    "MUFG",
    "ASSURANT",
    "ATLASSIAN",
    "OPENAI",
    "ALGORAND"
  ];

  return (
    <div className="w-full border-t border-[#c3c2b2]/60 pt-10 pb-12 px-6 max-w-7xl mx-auto">
      <p className="text-xs font-medium text-[#777777] mb-8 text-left">
        Leading engineering teams build with Helix Box
      </p>
      
      <div className="flex flex-wrap items-center justify-between gap-8 opacity-80 filter grayscale hover:grayscale-0 transition-all">
        {brandLogos.map((brand, idx) => (
          <span 
            key={idx} 
            className="font-cabinet font-black text-2xl tracking-tighter text-[#333333] hover:text-[#0b4fff] transition-colors cursor-pointer"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
};
