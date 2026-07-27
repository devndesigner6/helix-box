import React from 'react';
import { Smartphone } from 'lucide-react';

export const Navbar = ({ onOpenDemoModal }) => {
  return (
    <header className="w-full bg-[#f0efe3] border-b border-[#c3c2b2]/60 sticky top-0 z-40 transition-colors">
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        
        {/* Auxia Logo Mark */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#c3c2b2] bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <img src="/helixbox.png" alt="Helix Box Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-cabinet font-black text-2xl tracking-tight text-[#232323]">
            helix<span className="text-[#0b4fff]">box</span>
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444444]">
          <a href="#features" className="hover:text-[#0b4fff] transition-colors">Platform</a>
          <a href="#home-marketer" className="hover:text-[#0b4fff] transition-colors">Storyboard</a>
          <a href="#architecture" className="hover:text-[#0b4fff] transition-colors">Architecture</a>
          <a href="#x402" className="hover:text-[#0b4fff] transition-colors">x402 Protocol</a>
          <a href="#faq" className="hover:text-[#0b4fff] transition-colors">FAQ</a>
        </div>

        {/* Right CTA Button & Lang Switch */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDemoModal}
            className="auxia-btn-primary text-xs sm:text-sm py-2.5 px-6 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-white" />
            <span>Request a Demo</span>
          </button>
          <span className="hidden sm:inline-block text-xs font-mono text-[#777777] border-l border-[#c3c2b2] pl-4">
            v1.0.0
          </span>
        </div>

      </nav>
    </header>
  );
};
