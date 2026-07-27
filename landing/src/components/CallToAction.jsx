import React, { useState } from 'react';
import { Smartphone, Copy, Check } from 'lucide-react';

export const CallToAction = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-[#c3c2b2]/80">
      
      <div className="auxia-card-dark p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
        <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase mb-4 block">GET STARTED TODAY</span>
        <h2 className="text-4xl sm:text-6xl font-cabinet font-black text-white max-w-3xl mx-auto mb-6 tracking-tight">
          Ready to code on <span className="font-serif italic font-normal text-indigo-300">your phone?</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Download the Android APK or launch the CLI gateway on your workstation in under 60 seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="auxia-btn-primary py-3.5 px-8 text-sm flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download Android APK</span>
          </a>

          <button
            onClick={copyCommand}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-departure text-sm py-3.5 px-7 rounded-full backdrop-blur-md transition-all flex items-center gap-2"
          >
            <span className="text-indigo-400 font-bold">$</span>
            <span>npx helixbox-cli -n</span>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

    </section>
  );
};
