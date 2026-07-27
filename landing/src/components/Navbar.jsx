import React, { useState } from 'react';
import { Smartphone, ArrowUpRight } from 'lucide-react';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Platform');

  const navLinks = [
    { name: 'Platform', href: '#features' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'x402 Micropayments', href: '#x402' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8">
      <nav className="max-w-6xl mx-auto h-16 px-5 sm:px-6 flex items-center justify-between bg-[#f0efe3]/85 backdrop-blur-xl border border-[#c3c2b2]/70 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-[#c3c2b2] bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/helixbox.png" alt="Helix Box Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-cabinet font-black text-xl tracking-tight text-[#232323]">
            Helix<span className="text-[#0b4fff]">Box</span>
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#555555]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveTab(link.name)}
              className={`transition-colors hover:text-[#0b4fff] ${
                activeTab === link.name ? 'text-[#0b4fff] font-bold' : 'text-[#555555]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right CTA Button */}
        <a
          href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
          className="auxia-btn-primary text-xs sm:text-sm py-2 px-5 flex items-center gap-2"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Download APK</span>
        </a>

      </nav>
    </header>
  );
};
