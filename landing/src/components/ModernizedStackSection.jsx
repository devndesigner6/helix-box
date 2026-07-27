import React from 'react';
import { Layers, ShieldCheck, Terminal, Coins, ArrowRight } from 'lucide-react';

export const ModernizedStackSection = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="features">
      
      {/* Auxia Modernized Stack Box */}
      <div className="bg-[#e5e4d5] rounded-3xl p-8 sm:p-14 border border-[#c3c2b2] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Title & Subtitle */}
        <div className="lg:col-span-6">
          <h2 className="font-cabinet font-black text-5xl sm:text-7xl text-[#232323] tracking-tight leading-[0.95] mb-6">
            The mobile IDE stack, modernized
          </h2>
          <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
            Helix Box Agent Studio and Zero-Trust Relays replace manual SSH configurations, connect mobile and desktop environments seamlessly, and replace latency with instant command capability.
          </p>
        </div>

        {/* Right Column: Isometric 3D Layer Stack Cards */}
        <div className="lg:col-span-6 flex flex-col gap-4 relative">
          
          <div className="p-6 rounded-2xl bg-[#080331] text-white border border-indigo-900 shadow-xl transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">LAYER 01</span>
              <Terminal className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-cabinet font-bold text-xl text-white">Rust PTY Engine</h3>
            <p className="text-xs text-indigo-200 mt-1">24fps WezTerm cell grid buffer with sub-50ms input latency.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white text-[#232323] border border-[#c3c2b2] shadow-lg transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#0b4fff] uppercase tracking-widest">LAYER 02</span>
              <ShieldCheck className="w-5 h-5 text-[#0b4fff]" />
            </div>
            <h3 className="font-cabinet font-bold text-xl text-[#232323]">Zero-Trust Encrypted Relays</h3>
            <p className="text-xs text-[#555555] mt-1">Bun-powered WebSockets with 6-character ephemeral QR nonces.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white text-[#232323] border border-[#c3c2b2] shadow-lg transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">LAYER 03</span>
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-cabinet font-bold text-xl text-[#232323]">Algorand x402 Micropayments</h3>
            <p className="text-xs text-[#555555] mt-1">Sub-second HTTP 402 payment required challenges on Algorand.</p>
          </div>

        </div>

      </div>

    </section>
  );
};
