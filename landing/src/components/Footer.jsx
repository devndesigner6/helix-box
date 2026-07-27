import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#080331] text-white py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Col 1 & 2: Brand Info & Newsletter */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <img src="/helixbox.png" alt="Helix Box Logo" className="w-8 h-8 object-cover rounded-lg" />
            <span className="font-cabinet font-black text-2xl text-white">
              Helix<span className="text-[#0b4fff]">Box</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed mb-6 font-normal">
            AI-powered mobile IDE and cloud development platform. Code on your phone, run on your workstation or in cloud sandboxes.
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-sm mb-6">
            <div className="text-xs font-mono font-bold text-white mb-2 uppercase">Subscribe to Releases</div>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs text-white placeholder-slate-400 w-full focus:outline-none focus:border-[#0b4fff]"
                required
              />
              <button type="submit" className="auxia-btn-primary px-4 py-2.5 text-xs shrink-0">
                {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">100% Open Source Software under MIT License</p>
          </form>
        </div>

        {/* Col 3: Architecture Links */}
        <div>
          <h4 className="font-cabinet font-bold text-sm text-white uppercase tracking-wider mb-4">Architecture</h4>
          <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
            <li><a href="#architecture" className="hover:text-[#0b4fff] transition-colors">Rust PTY Engine</a></li>
            <li><a href="#features" className="hover:text-[#0b4fff] transition-colors">Zero-Trust Relays</a></li>
            <li><a href="#x402" className="hover:text-[#0b4fff] transition-colors">Algorand x402 Protocol</a></li>
            <li><a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-[#0b4fff] transition-colors">GitHub Releases</a></li>
          </ul>
        </div>

        {/* Col 4: Helix-Crew Team */}
        <div>
          <h4 className="font-cabinet font-bold text-sm text-white uppercase tracking-wider mb-4">Helix-Crew Team</h4>
          <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
            <li><span>Hemanth Peddada</span></li>
            <li><span>Hemanth Bandi</span></li>
            <li><span>Asif</span></li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <p>© 2026 Helix Box. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms</a>
          <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacy</a>
          <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
