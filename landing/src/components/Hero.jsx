import React, { useState } from 'react';
import { Smartphone, Play, Copy, Check, Terminal, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { TerminalShowcase } from './TerminalShowcase';

export const Hero = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-36 pb-20 px-6 max-w-6xl mx-auto text-center">
      
      {/* Announcement Pill Badge */}
      <div className="inline-flex items-center gap-2 mb-8">
        <span className="auxia-badge flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0b4fff] animate-pulse" />
          <span>v1.0 Release — <strong className="text-[#0b4fff]">OpenAI Build Week Winner</strong></span>
        </span>
      </div>

      {/* Main Auxia Split Headline (Cabinet Grotesk + Instrument Serif Italic) */}
      <h1 className="mb-8 max-w-4xl mx-auto text-[#232323] tracking-tight">
        <span className="block font-cabinet font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-2">
          Remote terminal,
        </span>
        <span className="block font-cabinet font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
          instant <span className="font-serif italic font-normal text-[#0b4fff]">command.</span>
        </span>
      </h1>

      {/* Subtitle Copy */}
      <p className="text-base sm:text-xl text-[#555555] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
        Say goodbye to desktop constraints. Stream native PTY terminals, execute git workflows, and trigger AI prompt completions directly on your mobile phone.
      </p>

      {/* Dual CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <a
          href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
          className="auxia-btn-primary text-sm sm:text-base py-3.5 px-8 flex items-center gap-2.5"
        >
          <Smartphone className="w-4 h-4 text-white" />
          <span>Download Android APK</span>
        </a>

        <button
          onClick={copyCommand}
          className="auxia-btn-secondary text-sm sm:text-base py-3.5 px-7 flex items-center gap-2.5 font-departure"
        >
          <span className="text-[#0b4fff] font-bold">$</span>
          <span>npx helixbox-cli -n</span>
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Auxia Interactive Product Mockup Window Frame */}
      <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden p-3 bg-[#ffffff] border border-[#c3c2b2] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <div className="rounded-2xl overflow-hidden border border-[#e5e4d5]">
          <TerminalShowcase />
        </div>
      </div>

    </section>
  );
};
