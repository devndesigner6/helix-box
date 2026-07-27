import React, { useState } from 'react';
import { Laptop, Smartphone, Mail, X, Check, ShieldCheck, Zap } from 'lucide-react';

export const MessGridSection = () => {
  const [viewMode, setViewMode] = useState('mess'); // 'mess' or 'clean'

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      
      {/* Toggle Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-cabinet font-black text-2xl sm:text-3xl text-[#232323]">
          {viewMode === 'mess' ? (
            <span>Your remote terminal access is a <span className="text-[#fa6838]">mess</span></span>
          ) : (
            <span>Clean it up with <span className="text-[#0b4fff]">Helix Box</span></span>
          )}
        </h2>

        <div className="flex items-center gap-2 p-1 rounded-full bg-[#e5e4d5] border border-[#c3c2b2]">
          <button
            onClick={() => setViewMode('mess')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
              viewMode === 'mess' ? 'bg-[#fa6838] text-white shadow-sm' : 'text-[#555555] hover:text-[#232323]'
            }`}
          >
            Traditional Mess
          </button>
          <button
            onClick={() => setViewMode('clean')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
              viewMode === 'clean' ? 'bg-[#0b4fff] text-white shadow-sm' : 'text-[#555555] hover:text-[#232323]'
            }`}
          >
            Helix Box Solution
          </button>
        </div>
      </div>

      {viewMode === 'mess' ? (
        /* Dark Matrix Mess Card */
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-2xl min-h-[420px] flex flex-col justify-between animate-fade-in">
          
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-xs text-[#fa6838] font-bold uppercase tracking-wider">PROBLEM DIAGNOSTIC</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800">
              ● 4 Critical Network Failures Detected
            </span>
          </div>

          {/* Tangled Red SVG Line Canvas */}
          <div className="relative my-8 w-full h-[220px] flex items-center justify-center">
            
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                backgroundSize: `24px 24px`
              }}
            />

            <svg className="absolute inset-0 w-full h-full stroke-slate-600" fill="none" strokeWidth="1.5">
              <path d="M 100 70 L 260 140 L 400 50 L 560 170 L 700 80 L 860 150 L 1000 60" />
              <path d="M 260 140 L 560 50 L 860 150" strokeDasharray="4 4" />
              <path d="M 100 170 L 400 50 L 700 170 L 1000 60" stroke="#fa6838" strokeWidth="2.5" />
            </svg>

            <div className="relative z-10 flex items-center justify-between w-full max-w-4xl px-4">
              <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700 shadow-md">
                <Smartphone className="w-5 h-5 text-slate-300" />
                <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                  <X className="w-3 h-3" /> Port Blocked
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700 shadow-md">
                <Laptop className="w-5 h-5 text-slate-300" />
                <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                  <X className="w-3 h-3" /> SSH Auth Failed
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700 shadow-md">
                <Mail className="w-5 h-5 text-slate-300" />
                <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                  <X className="w-3 h-3" /> VPN Disconnected
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 bg-slate-900/90 p-3 rounded-xl border border-slate-700 shadow-md">
                <Smartphone className="w-5 h-5 text-slate-300" />
                <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                  <X className="w-3 h-3" /> Relay Timeout
                </span>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono z-10 border-t border-white/10 pt-4">
            <span>Traditional SSH Setup</span>
            <span className="text-[#fa6838]">High Latency • Broken Connections • Unencrypted</span>
          </div>

        </div>
      ) : (
        /* Clean Light Solution Card */
        <div className="bg-white text-[#232323] rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#c3c2b2] shadow-2xl min-h-[420px] flex flex-col justify-between animate-fade-in">
          
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-xs text-[#0b4fff] font-bold uppercase tracking-wider">HELIX BOX ARCHITECTURE</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
              ✓ All Systems Operational
            </span>
          </div>

          {/* Clean Blue SVG Connection Line Canvas */}
          <div className="relative my-8 w-full h-[220px] flex items-center justify-center">
            
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(#0b4fff 1.5px, transparent 1.5px)`,
                backgroundSize: `24px 24px`
              }}
            />

            <svg className="absolute inset-0 w-full h-full stroke-[#0b4fff]" fill="none" strokeWidth="3">
              <path d="M 120 110 H 980" />
            </svg>

            <div className="relative z-10 flex items-center justify-between w-full max-w-4xl px-4">
              <div className="flex flex-col items-center gap-1 bg-[#f0efe3] p-3.5 rounded-xl border border-[#c3c2b2] shadow-md">
                <Laptop className="w-6 h-6 text-[#0b4fff]" />
                <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Local Workstation
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 bg-[#080331] text-white p-3.5 rounded-xl border border-indigo-900 shadow-xl">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <span className="text-[10px] font-mono text-indigo-200 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Bun E2E Relay
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 bg-[#f0efe3] p-3.5 rounded-xl border border-[#c3c2b2] shadow-md">
                <Smartphone className="w-6 h-6 text-[#0b4fff]" />
                <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Mobile 24fps PTY
                </span>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-[#555555] font-mono z-10 border-t border-[#c3c2b2]/60 pt-4">
            <span>Helix Box Streamlined Pipeline</span>
            <span className="text-emerald-700 font-bold">&lt; 50ms Latency • E2E Encrypted • Sub-Second Finality</span>
          </div>

        </div>
      )}

    </section>
  );
};
