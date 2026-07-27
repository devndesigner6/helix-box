import React, { useState } from 'react';
import { Smartphone, Github, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Platform', href: '#features' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0c14]/90 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20 group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center">
            <img 
              src="/helixbox.png" 
              alt="Helix Box Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Helix<span className="text-indigo-400 font-serif italic">Box</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
              Mobile IDE
            </span>
          </div>
        </a>

        {/* Middle: Clean Pill Nav Links matching Reference Image */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveTab(link.name)}
              className={`transition-colors hover:text-white relative py-1 ${
                activeTab === link.name ? 'text-white font-semibold' : 'text-slate-300'
              }`}
            >
              {link.name}
              {activeTab === link.name && (
                <motion.div
                  layoutId="active-nav-line"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right: Question Link + White Pill CTA Button */}
        <div className="flex items-center gap-5">
          <a 
            href="https://github.com/devndesigner6/helix-box/issues" 
            target="_blank" 
            rel="noreferrer" 
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Have A Question?</span>
          </a>

          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Download APK</span>
          </a>
        </div>

      </nav>
    </header>
  );
};
