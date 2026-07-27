import React from 'react';
import { Laptop, Smartphone, Mail, X } from 'lucide-react';

export const MessGridSection = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      
      {/* Dark Matrix Card matching Auxia reference image */}
      <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-2xl min-h-[420px] flex flex-col justify-between">
        
        {/* Title */}
        <h2 className="font-cabinet font-black text-3xl sm:text-4xl text-white tracking-tight z-10">
          Your remote terminal access is a <span className="text-[#fa6838]">mess</span>
        </h2>

        {/* Tangled SVG Grid Canvas */}
        <div className="relative my-8 w-full h-[240px] flex items-center justify-center">
          
          {/* Dotted Grid Matrix Background */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: `24px 24px`
            }}
          />

          {/* SVG Broken Connections & Tangled Node Line */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-500/60" fill="none" strokeWidth="1.5">
            <path d="M 120 80 L 280 140 L 420 60 L 580 180 L 720 90 L 880 160 L 1020 70" />
            <path d="M 280 140 L 580 60 L 880 160" strokeDasharray="4 4" />
            <path d="M 120 180 L 420 60 L 720 180 L 1020 70" stroke="#fa6838" strokeWidth="2" />
          </svg>

          {/* Node Markers */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-4xl px-8">
            
            <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <Smartphone className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                <X className="w-3 h-3" /> Port Blocked
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <Laptop className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                <X className="w-3 h-3" /> SSH Auth Failed
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <Mail className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                <X className="w-3 h-3" /> VPN Disconnected
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700">
              <Smartphone className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                <X className="w-3 h-3" /> Relay Timeout
              </span>
            </div>

          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono z-10 border-t border-white/10 pt-4">
          <span>Standard Remote Exec Setup</span>
          <span className="text-[#fa6838]">High Latency • Broken Connections • Unencrypted</span>
        </div>

      </div>

    </section>
  );
};
