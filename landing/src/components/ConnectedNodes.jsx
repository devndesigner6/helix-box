import React from 'react';
import { Laptop, ArrowRight, ShieldCheck, Smartphone, Check } from 'lucide-react';

export const ConnectedNodes = () => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-[#c3c2b2]/80" id="architecture">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">E2E PIPELINE FLOW</span>
        <h2 className="text-4xl sm:text-5xl font-cabinet font-black text-[#232323] mt-2 mb-4">
          Connected nodes. Zero open ports.
        </h2>
        <p className="text-[#555555] text-base leading-relaxed">
          How Helix Box bridges your local environment directly to your mobile screen without SSH configuration or port forwarding.
        </p>
      </div>

      {/* Connected Nodes Pipeline Canvas */}
      <div className="auxia-card p-8 sm:p-12 relative overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          
          {/* Node 1: Local PC Terminal */}
          <div className="p-6 rounded-2xl bg-[#f0efe3] border border-[#c3c2b2] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#c3c2b2] flex items-center justify-center text-[#0b4fff] mb-3 shadow-sm">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-cabinet font-bold text-lg text-[#232323]">Local Workstation</h3>
            <p className="text-xs text-[#666666] mt-1 font-mono">npx helixbox-cli -n</p>
            <span className="mt-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active CLI Daemon
            </span>
          </div>

          {/* Node 2: Zero-Trust Bun Relay */}
          <div className="p-6 rounded-2xl bg-[#080331] text-white border border-indigo-900 text-center flex flex-col items-center shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-cabinet font-bold text-lg text-white">Bun Proxy Relay</h3>
            <p className="text-xs text-indigo-200 mt-1 font-mono">TLS 1.3 WebSockets</p>
            <span className="mt-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
              6-Char Nonce Auth
            </span>
          </div>

          {/* Node 3: Mobile PTY Client */}
          <div className="p-6 rounded-2xl bg-[#f0efe3] border border-[#c3c2b2] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#c3c2b2] flex items-center justify-center text-[#0b4fff] mb-3 shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-cabinet font-bold text-lg text-[#232323]">Mobile App</h3>
            <p className="text-xs text-[#666666] mt-1 font-mono">Expo React Native</p>
            <span className="mt-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-300">
              24fps PTY Grid
            </span>
          </div>

        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="auxia-card p-6">
          <div className="font-cabinet font-black text-3xl sm:text-4xl text-[#0b4fff]">&lt; 50ms</div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mt-1">Terminal Input Latency</div>
        </div>

        <div className="auxia-card p-6">
          <div className="font-cabinet font-black text-3xl sm:text-4xl text-[#0b4fff]">24 fps</div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mt-1">WezTerm Cell Grid Buffer</div>
        </div>

        <div className="auxia-card p-6">
          <div className="font-cabinet font-black text-3xl sm:text-4xl text-[#0b4fff]">&lt; 0.8s</div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mt-1">Algorand x402 Settlement</div>
        </div>
      </div>

    </section>
  );
};
