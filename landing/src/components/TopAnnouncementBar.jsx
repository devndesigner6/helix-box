import React from 'react';
import { ArrowRight, X } from 'lucide-react';

export const TopAnnouncementBar = ({ onDismiss }) => {
  return (
    <div className="bg-[#0b4fff] text-white text-xs font-semibold py-2.5 px-4 flex items-center justify-between z-50 relative">
      <div className="flex-1 text-center flex items-center justify-center gap-2">
        <span>Helix Box Crosses 1,000+ Terminal Sessions Streamed</span>
        <a href="#features" className="underline font-bold flex items-center gap-1 hover:opacity-90">
          <span>See live stats</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-white/80 hover:text-white p-1">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
