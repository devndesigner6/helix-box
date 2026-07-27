import React from 'react';
import { ShieldCheck, Lock, Code2, CheckCircle2 } from 'lucide-react';

export const EnterpriseTrust = () => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-[#c3c2b2]/80">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">SECURITY & COMPLIANCE</span>
        <h2 className="text-4xl sm:text-5xl font-cabinet font-black text-[#232323] mt-2 mb-4">
          Built for developer trust.
        </h2>
        <p className="text-[#555555] text-base leading-relaxed">
          Zero-trust security architecture ensuring your workstation credentials and code stay entirely private.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="auxia-card p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#0b4fff]/10 border border-[#0b4fff]/30 flex items-center justify-center text-[#0b4fff] mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-cabinet font-bold text-xl text-[#232323] mb-2">TLS 1.3 E2E Encryption</h3>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              All terminal streams are encrypted using TLS 1.3 with ephemeral 6-character session nonces generated per pairing attempt.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-[#555555] border-t border-[#c3c2b2]/60 pt-4">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Ephemeral Session Nonces</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zero Plaintext Log Retention</li>
          </ul>
        </div>

        <div className="auxia-card p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#0b4fff]/10 border border-[#0b4fff]/30 flex items-center justify-center text-[#0b4fff] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-cabinet font-bold text-xl text-[#232323] mb-2">Zero Open Firewall Ports</h3>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              Uses outbound WebSocket connections via proxy relays. You never need to open incoming router ports or expose SSH daemons to the web.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-[#555555] border-t border-[#c3c2b2]/60 pt-4">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Outbound Tunnel Relay</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Works Behind NAT & Corporate VPN</li>
          </ul>
        </div>

        <div className="auxia-card p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#0b4fff]/10 border border-[#0b4fff]/30 flex items-center justify-center text-[#0b4fff] mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-cabinet font-bold text-xl text-[#232323] mb-2">100% Open Source Software</h3>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              The Expo React Native app, Node CLI gateway, Rust PTY engine, and Bun proxy manager are 100% open-source under the MIT license.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-[#555555] border-t border-[#c3c2b2]/60 pt-4">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> MIT Licensed Codebase</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Fully Auditable Architecture</li>
          </ul>
        </div>

      </div>

    </section>
  );
};
