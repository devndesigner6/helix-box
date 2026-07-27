import React from 'react';
import { Smartphone, ChevronRight } from 'lucide-react';

export const CallToAction = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#c3c2b2]/60">
      
      <div className="bg-[#0b4fff] text-white rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
        <span className="font-mono text-xs font-bold text-indigo-200 tracking-widest uppercase mb-4 block">GET STARTED TODAY</span>
        <h2 className="text-4xl sm:text-7xl font-cabinet font-black text-white max-w-4xl mx-auto mb-6 tracking-tight leading-[0.95]">
          Build faster with Helix Box.
        </h2>
        <p className="text-base sm:text-lg text-indigo-100 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Download the Android APK or launch the CLI gateway on your workstation in under 60 seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="bg-white hover:bg-slate-100 text-[#0b4fff] font-bold text-base py-3.5 px-8 rounded-full shadow-lg transition-all flex items-center gap-2"
          >
            <Smartphone className="w-5 h-5 text-[#0b4fff]" />
            <span>Request a Demo</span>
          </a>

          <a
            href="https://github.com/devndesigner6/helix-box"
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-700/60 hover:bg-indigo-700 text-white font-medium text-base py-3.5 px-7 rounded-full border border-indigo-400/40 backdrop-blur-md transition-all flex items-center gap-2"
          >
            <span>View GitHub Repository</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

    </section>
  );
};
