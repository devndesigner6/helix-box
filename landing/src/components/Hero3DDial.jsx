import React from 'react';

export default function Hero3DDial() {
  return (
    <div className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Ambient Radial Soft Glow */}
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-br from-indigo-400/30 via-purple-300/20 to-transparent blur-3xl opacity-80" />

      {/* Main 3D Metallic Ring Mechanism (Positioned off-center right like in reference image) */}
      <div className="absolute top-1/2 right-[-25%] sm:right-[-15%] md:right-[-10%] -translate-y-1/2 w-[440px] h-[440px] sm:w-[600px] sm:h-[600px] md:w-[720px] md:h-[720px] rounded-full flex items-center justify-center transform rotate-[-15deg]">
        
        {/* Outer Bevel Shadow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-slate-300/30 to-indigo-900/40 p-[2px] shadow-[0_30px_90px_rgba(0,0,0,0.35),inset_0_2px_15px_rgba(255,255,255,0.6)]">
          <div className="w-full h-full rounded-full bg-slate-900/40 backdrop-blur-md" />
        </div>

        {/* Outer White Beveled Arc Ring */}
        <div className="absolute inset-[12px] rounded-full border-[18px] sm:border-[28px] border-white/90 shadow-[0_15px_40px_rgba(255,255,255,0.4),inset_0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center">
          
          {/* Radial Ticks / Notch Markers inside Outer Arc */}
          <div className="absolute inset-0 rounded-full opacity-35 bg-[repeating-conic-gradient(from_0deg,#3b82f6_0deg_1deg,transparent_1deg_6deg)]" />

          {/* Secondary Concentric Ring with Radial Notches */}
          <div className="w-[82%] h-[82%] rounded-full border-[2px] border-indigo-200/50 flex items-center justify-center relative shadow-[inset_0_0_30px_rgba(99,102,241,0.2)]">
            
            {/* Concentric Circle Lines */}
            <div className="w-[92%] h-[92%] rounded-full border border-white/30" />
            <div className="w-[84%] h-[84%] rounded-full border border-indigo-300/40" />

            {/* Inner Glowing Purple/Lavender Sphere Core */}
            <div className="absolute w-[72%] h-[72%] rounded-full bg-gradient-to-br from-[#c0c6f5] via-[#a5b4fc] to-[#6366f1] shadow-[inset_0_10px_25px_rgba(255,255,255,0.7),0_20px_50px_rgba(99,102,241,0.4)] flex items-center justify-center overflow-hidden">
              {/* Internal Curved Specular Highlight Arc */}
              <div className="absolute -top-[20%] -left-[20%] w-[90%] h-[90%] rounded-full bg-gradient-to-br from-white/70 via-white/20 to-transparent blur-md" />
              
              {/* Inner Fine Notches */}
              <div className="w-[88%] h-[88%] rounded-full border border-white/40 opacity-40 bg-[repeating-conic-gradient(from_0deg,#ffffff_0deg_0.5deg,transparent_0.5deg_4deg)]" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
