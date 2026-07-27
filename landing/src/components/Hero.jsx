import React, { useState } from 'react';
import { Smartphone, ArrowUp, Zap, Sparkles, ChevronRight } from 'lucide-react';

export const Hero = () => {
  const [promptText, setPromptText] = useState(
    "Diagnose build errors in local PTY terminal and initiate zero-trust relay session on phone"
  );

  return (
    <section className="pt-12 pb-20 px-6 sm:px-10 max-w-7xl mx-auto">
      
      {/* 1. Auxia Interactive Pipeline Flow Graphic (Upper Hero) */}
      <div className="relative w-full mb-16 overflow-x-auto no-scrollbar py-4">
        
        {/* Blue SVG Connecting Pipeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#0b4fff] -translate-y-1/2 z-0 hidden md:block" />

        <div className="flex items-center justify-between min-w-[760px] relative z-10 gap-4">
          
          {/* Node Badge 1: ASK AGENT with Floating Ask Agent Card */}
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff] border border-[#0b4fff] text-[11px] font-mono font-bold text-[#0b4fff] shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-[#0b4fff]" />
              <span>ASK AGENT</span>
            </div>

            {/* Floating White Ask Agent Prompt Card */}
            <div className="mt-4 w-72 p-4 rounded-2xl bg-white border border-[#c3c2b2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between min-h-[120px]">
              <p className="text-xs text-[#232323] font-medium leading-relaxed mb-3">
                "{promptText}"
              </p>
              <div className="flex justify-end">
                <button 
                  onClick={() => alert("Initiating PTY Diagnostic Agent...")}
                  className="w-7 h-7 rounded-lg bg-[#0b4fff] text-white flex items-center justify-center hover:bg-[#003edb] transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Node Badge 2: AGENT WORKFLOW */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e5e4d5] border border-[#c3c2b2] text-[11px] font-mono font-bold text-[#555555]">
            <Zap className="w-3.5 h-3.5 text-[#777777]" />
            <span>AGENT WORKFLOW</span>
          </div>

          {/* Node Badge 3: AI DECISIONING */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e5e4d5] border border-[#c3c2b2] text-[11px] font-mono font-bold text-[#555555]">
            <Zap className="w-3.5 h-3.5 text-[#777777]" />
            <span>AI DECISIONING</span>
          </div>

          {/* Node Badge 4: PERSONALIZED PTY STREAM */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e5e4d5] border border-[#c3c2b2] text-[11px] font-mono font-bold text-[#555555]">
            <Zap className="w-3.5 h-3.5 text-[#777777]" />
            <span>PERSONALIZED PTY</span>
          </div>

        </div>
      </div>

      {/* 2. Massive Auxia Display Title ("The developer, multiplied") */}
      <div className="max-w-5xl text-left mb-8">
        <h1 className="font-cabinet font-black text-6xl sm:text-8xl md:text-9xl text-[#232323] tracking-[-0.04em] leading-[0.9] mb-4">
          The developer,<br />
          <span className="text-[#232323]">multiplied.</span>
        </h1>

        <p className="text-lg sm:text-2xl text-[#444444] max-w-2xl leading-relaxed font-normal mt-6 mb-10">
          Helix Box is the mobile IDE platform that runs remote PTY terminals across your workstation and delivers 1:1, real-time control.
        </p>

        {/* 3. Action Buttons matching Auxia reference image */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="auxia-btn-primary text-base py-3.5 px-8 flex items-center gap-2.5 shadow-lg"
          >
            <Smartphone className="w-5 h-5 text-white" />
            <span>Request a Demo</span>
          </a>

          <a
            href="#features"
            className="auxia-btn-secondary text-base py-3.5 px-8 flex items-center gap-2"
          >
            <span>See how it works</span>
          </a>
        </div>
      </div>

    </section>
  );
};
