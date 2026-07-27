import React, { useState } from 'react';
import { Smartphone, ArrowUp, Zap, Sparkles, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export const Hero = ({ onOpenDemoModal }) => {
  const [activeBadge, setActiveBadge] = useState('ASK AGENT');
  const [promptState, setPromptState] = useState(0);

  const prompts = [
    "Diagnose build errors in local PTY terminal and initiate zero-trust relay session on phone",
    "Analyze Rust WezTerm cell grid buffer and optimize mobile latency to sub-50ms",
    "Verify Algorand x402 payment header auth and issue sub-second transaction challenge"
  ];

  const handlePromptSubmit = () => {
    setPromptState((prev) => (prev + 1) % prompts.length);
  };

  return (
    <section className="pt-12 pb-20 px-6 sm:px-10 max-w-7xl mx-auto">
      
      {/* 1. Auxia Interactive Pipeline Flow Graphic (Upper Hero) */}
      <div className="relative w-full mb-16 overflow-x-auto no-scrollbar py-4">
        
        {/* Blue SVG Connecting Pipeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#0b4fff] -translate-y-1/2 z-0 hidden md:block" />

        <div className="flex items-center justify-between min-w-[760px] relative z-10 gap-4">
          
          {/* Node Badge 1: ASK AGENT */}
          <div className="relative">
            <button
              onClick={() => setActiveBadge('ASK AGENT')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all border ${
                activeBadge === 'ASK AGENT'
                  ? 'bg-[#ffffff] border-[#0b4fff] text-[#0b4fff] shadow-sm scale-105'
                  : 'bg-[#e5e4d5] border-[#c3c2b2] text-[#555555]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-[#0b4fff] text-[#0b4fff]" />
              <span>ASK AGENT</span>
            </button>

            {/* Floating Interactive Ask Agent Card */}
            {activeBadge === 'ASK AGENT' && (
              <div className="mt-4 w-80 p-5 rounded-2xl bg-white border border-[#c3c2b2] shadow-[0_15px_40px_rgba(0,0,0,0.1)] flex flex-col justify-between min-h-[140px] animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#0b4fff] uppercase">STATE {promptState + 1} OF 3</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                    ✓ ACTIVE SESSION
                  </span>
                </div>

                <p className="text-xs text-[#232323] font-medium leading-relaxed mb-4">
                  "{prompts[promptState]}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#c3c2b2]/50">
                  <span className="text-[10px] font-mono text-[#777777]">Click arrow to cycle prompts</span>
                  <button 
                    onClick={handlePromptSubmit}
                    className="w-8 h-8 rounded-lg bg-[#0b4fff] text-white flex items-center justify-center hover:bg-[#003edb] transition-all transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Node Badge 2: AGENT WORKFLOW */}
          <div className="relative">
            <button
              onClick={() => setActiveBadge('AGENT WORKFLOW')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all border ${
                activeBadge === 'AGENT WORKFLOW'
                  ? 'bg-[#ffffff] border-[#0b4fff] text-[#0b4fff] shadow-sm scale-105'
                  : 'bg-[#e5e4d5] border-[#c3c2b2] text-[#555555]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AGENT WORKFLOW</span>
            </button>

            {activeBadge === 'AGENT WORKFLOW' && (
              <div className="mt-4 w-72 p-4 rounded-2xl bg-white border border-[#c3c2b2] shadow-xl text-xs font-mono">
                <div className="font-bold text-[#0b4fff] mb-2">ACTIVE WORKFLOW STEPS</div>
                <div className="space-y-1.5 text-[11px] text-[#333333]">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> ANALYZE EXISTING LOGS</div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> BUILD RELAY SESSION</div>
                  <div className="flex items-center gap-1.5 text-amber-600"><Clock className="w-3.5 h-3.5" /> ROUTE FOR APPROVAL</div>
                </div>
              </div>
            )}
          </div>

          {/* Node Badge 3: AI DECISIONING */}
          <div className="relative">
            <button
              onClick={() => setActiveBadge('AI DECISIONING')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all border ${
                activeBadge === 'AI DECISIONING'
                  ? 'bg-[#ffffff] border-[#0b4fff] text-[#0b4fff] shadow-sm scale-105'
                  : 'bg-[#e5e4d5] border-[#c3c2b2] text-[#555555]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI DECISIONING</span>
            </button>

            {activeBadge === 'AI DECISIONING' && (
              <div className="mt-4 w-72 p-4 rounded-2xl bg-[#080331] text-white border border-indigo-900 shadow-xl text-xs font-mono">
                <div className="font-bold text-indigo-300 mb-2">ON-CHAIN DECISIONING</div>
                <div className="text-[11px] text-indigo-200">
                  x402 Header Auth: Verified.<br />
                  Settlement: 0.001 ALGO (&lt; 0.8s)
                </div>
              </div>
            )}
          </div>

          {/* Node Badge 4: PERSONALIZED PTY */}
          <div className="relative">
            <button
              onClick={() => setActiveBadge('PERSONALIZED PTY')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all border ${
                activeBadge === 'PERSONALIZED PTY'
                  ? 'bg-[#ffffff] border-[#0b4fff] text-[#0b4fff] shadow-sm scale-105'
                  : 'bg-[#e5e4d5] border-[#c3c2b2] text-[#555555]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>PERSONALIZED PTY</span>
            </button>

            {activeBadge === 'PERSONALIZED PTY' && (
              <div className="mt-4 w-72 p-4 rounded-2xl bg-white border border-[#c3c2b2] shadow-xl text-xs">
                <div className="font-bold text-[#232323] mb-1">Mobile Native Stream</div>
                <div className="text-[10px] text-[#555555] font-mono">24fps WezTerm Cell Buffer • &lt; 45ms Latency</div>
              </div>
            )}
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
          <button
            onClick={onOpenDemoModal}
            className="auxia-btn-primary text-base py-3.5 px-8 flex items-center gap-2.5 shadow-lg"
          >
            <Smartphone className="w-5 h-5 text-white" />
            <span>Request a Demo</span>
          </button>

          <a
            href="#home-marketer"
            className="auxia-btn-secondary text-base py-3.5 px-8 flex items-center gap-2"
          >
            <span>See how it works</span>
          </a>
        </div>
      </div>

    </section>
  );
};
