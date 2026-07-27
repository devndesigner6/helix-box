import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import Hero3DDial from './components/Hero3DDial';
import CardStack from '../components/kokonutui/card-stack';
import ShimmerButton from '../components/magicui/shimmer-button';
import { LiquidGlassCard } from '../components/kokonutui/liquid-glass-card';
import BentoGrid from '../components/kokonutui/bento-grid';
import BlurText from './components/reactbits/BlurText';
import ShinyText from './components/reactbits/ShinyText';
import { TerminalShowcase } from './components/TerminalShowcase';
import { 
  Sparkles, 
  Smartphone, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Lock, 
  Coins, 
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  Twitter,
  Instagram,
  Play,
  Code2,
  Cpu,
  Globe2,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('Most Popular');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx helixbox-cli -n');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const marqueeRow1 = [
    "AI-Powered Mobile Workstation",
    "Code Remotely",
    "Run Anywhere",
    "Rust PTY WezTerm Engine",
    "Zero-Trust WebSocket Relays",
    "Algorand x402 Micropayments",
    "24fps Cell Grid Buffer",
    "Open Source Ecosystem"
  ];

  const marqueeRow2 = [
    "Full Git Integration",
    "Integrated Code Explorer",
    "Process Management",
    "System Diagnostics",
    "Ephemeral Nonce Auth",
    "QR Code Pairing",
    "Sub-Second Finality",
    "MIT Licensed"
  ];

  const categories = [
    "Most Popular", 
    "Mobile Terminal", 
    "CLI Gateway", 
    "Rust PTY Engine", 
    "Cloud Sandboxes", 
    "Security", 
    "Open Source"
  ];

  const useCases = [
    {
      category: "Mobile Terminal",
      title: "Rust-Powered PTY Terminal",
      description: "Real PTY sessions via WezTerm cell grid with 24fps incremental diff rendering and sub-second input latency on mobile.",
      time: "Sub-Second"
    },
    {
      category: "CLI Gateway",
      title: "Local Machine Bridge",
      description: "Node.js CLI bridges your local environment to the mobile app via WebSocket. Spawns processes, monitors system resources, and executes git commands.",
      time: "Zero SSH"
    },
    {
      category: "File Operations",
      title: "Mobile Code Explorer & Editor",
      description: "Browse repository directory trees, edit source code with syntax highlighting, search files via ripgrep, and commit changes on mobile.",
      time: "Full IDE"
    },
    {
      category: "Micro-Billing",
      title: "Algorand x402 Protocol",
      description: "HTTP 402 payment required integration. Pay pennies for AI prompts and ephemeral container sandboxes settled on Algorand in under 1 second.",
      time: "< 1s Settlement"
    },
    {
      category: "Security",
      title: "Zero-Trust Encrypted Relays",
      description: "Bun-based WebSocket relay server connects CLI and app securely with 6-character QR nonces without open firewall ports or VPN setup.",
      time: "TLS 1.3"
    },
    {
      category: "Developer Tools",
      title: "Git & Process Management",
      description: "Full git status, diff, commit, push, pull, background process management, and port scanning directly on your mobile device.",
      time: "Full Git"
    },
    {
      category: "AI Integration",
      title: "AI Terminal Assistant",
      description: "Interactive AI assistant trained to analyze terminal stack traces, write shell scripts, and debug build errors over stdin/stdout.",
      time: "Codex / LLM"
    },
    {
      category: "Open Source",
      title: "100% Open Source Software",
      description: "Entire mobile app (Expo/React Native), CLI bridge, Rust PTY engine, and Bun proxy manager are MIT licensed.",
      time: "MIT License"
    }
  ];

  const pricingTiers = [
    {
      name: "Helix Box Core",
      price: "$0.00",
      period: "100% Free & Open Source",
      description: "Remotely connect your mobile device to your local PC without SSH configuration.",
      features: [
        "Local Machine CLI Pairing",
        "Rust WezTerm PTY Engine",
        "Mobile File Explorer & Editor",
        "Full Git Integration",
        "System Resource Monitoring",
        "Zero Port Forwarding"
      ],
      popular: false,
      cta: "Download APK"
    },
    {
      name: "x402 AI Assist",
      price: "$0.01",
      period: "per prompt completion",
      description: "Pay-per-request AI terminal code assistant settled natively on Algorand.",
      features: [
        "LLM Terminal Code Assistant",
        "Automatic Stack Trace Analysis",
        "Terminal Command Generation",
        "Sub-Second Algorand Settlement",
        "Priority Relay Bandwidth",
        "Multi-Tab Session Control",
        "Custom Shell Shortcuts",
        "Instant MainNet Verification"
      ],
      popular: true,
      cta: "Enable AI Assist"
    },
    {
      name: "Cloud Sandbox",
      price: "$0.25",
      period: "per container instance",
      description: "On-demand cloud Docker containers for running untrusted code and integration tests.",
      features: [
        "Isolated Docker Cloud Instance",
        "Full Root Terminal Access",
        "Unlimited Bandwidth",
        "Ephemeral Storage Workspace",
        "Algorand x402 Header Auth",
        "Sub-Second Sandbox Provisioning",
        "Secure TLS Encryption",
        "Direct CLI Stream",
        "Lifetime Open Source Access"
      ],
      popular: false,
      cta: "Spawn Sandbox"
    }
  ];

  const faqs = [
    {
      q: "What is Helix Box?",
      a: "Helix Box is an AI-powered mobile IDE and cloud development platform. It lets you code on your phone and run workloads on your local machine or in secure cloud sandboxes without dealing with complex SSH configuration."
    },
    {
      q: "How does the CLI bridge connect my PC to my phone?",
      a: "Run `npx helixbox-cli -n` on your local PC. The Node.js CLI connects to our Bun WebSocket proxy and outputs a QR code and 6-character key. Scan or type the key in the mobile app to pair your devices instantly."
    },
    {
      q: "Do I need to open firewall ports or set up a VPN?",
      a: "No! Helix Box uses zero-trust outbound WebSocket relays via Manager & Proxy servers. Your local machine never exposes open incoming firewall ports to the public internet."
    },
    {
      q: "What is Algorand x402 and how does micro-billing work?",
      a: "x402 is an HTTP 402 Payment Required standard. Instead of paying a $20/month subscription, Helix Box endpoints return payment challenges for $0.01 AI prompts or $0.25 Docker sandboxes settled on Algorand in under 1 second."
    },
    {
      q: "Where can I download the Android APK?",
      a: "Click the 'Download APK' button in the navigation bar or hero section. It downloads `helix-boxv1.apk` directly from our official GitHub releases."
    },
    {
      q: "Is Helix Box open source?",
      a: "Yes! The Expo/React Native mobile client (`app/`), Node.js CLI (`cli/`), Bun proxy manager (`manager/` & `proxy/`), and Rust PTY binary (`pty/`) are all open-source under the MIT license."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pt-6 pb-12 px-3 sm:px-6">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container Container with Rounded Frame matching Reference Design */}
      <div className="max-w-7xl mx-auto mt-20 rounded-[32px] sm:rounded-[44px] bg-gradient-to-br from-[#1b2033] via-[#262e47] to-[#414a70] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.5)] overflow-hidden relative">
        
        {/* Subtle Vertical Pinstripe Ribbed Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 12px)`
          }}
        />

        {/* ========================================================
            HERO SECTION — Recreated matching Reference Image Design
            ======================================================== */}
        <section className="relative z-10 pt-12 pb-16 sm:pt-20 sm:pb-24 px-6 sm:px-12 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px] lg:min-h-[660px]">
          
          {/* Left Column: Headline, Pill, Subtitle, CTA Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Glass Pill Badge matching reference design `((•)) Beta version is live` */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium text-slate-200 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>((•)) Beta version is live — <strong>OpenAI Build Week Winner</strong></span>
            </div>

            {/* Dual-Line Typography matching reference image (`Code Remotely. Run Anywhere.`) */}
            <h1 className="mb-6 tracking-tight">
              <span className="block font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05]">
                Code Remotely.
              </span>
              <span className="block font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05]">
                Run <span className="font-serif italic font-normal text-indigo-200">Anywhere.</span>
              </span>
            </h1>

            {/* Subtitle Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-10 font-normal">
              Say goodbye to desktop limits. Our AI-driven mobile IDE streams native PTY sessions so your engineering team can build, debug, and ship from anywhere.
            </p>

            {/* Dual Action Buttons matching reference image */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
              >
                <span>See it in action</span>
                <ChevronRight className="w-4 h-4 text-slate-900" />
              </a>

              <button
                onClick={copyCommand}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full backdrop-blur-md transition-all flex items-center gap-2.5"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Demo CLI</span>
                {copied && <Check className="w-4 h-4 text-emerald-400 ml-1" />}
              </button>
            </div>

          </div>

          {/* Right Column: 3D Metallic Ring Dial Graphic */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <Hero3DDial />
          </div>

        </section>

      </div>

      {/* Marquee Banner */}
      <div className="max-w-7xl mx-auto my-12 overflow-hidden py-4 border-y border-white/10 space-y-3">
        <div className="flex w-[200%] animate-marquee gap-4">
          {marqueeRow1.concat(marqueeRow1).map((item, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800 shrink-0"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex w-[200%] animate-marquee gap-4" style={{ animationDirection: 'reverse' }}>
          {marqueeRow2.concat(marqueeRow2).map((item, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800 shrink-0"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 1: Interactive Terminal Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center" id="architecture">
        <div className="max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase">INSTANT PAIRING GATEWAY</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-2 mb-4">Zero SSH Hassle. Instant Control.</h2>
          <p className="text-slate-400 text-base leading-relaxed">Run one terminal command on your PC. Scan the ephemeral QR code in the Helix Box mobile app for secure E2E encrypted sessions.</p>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden p-3 bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <TerminalShowcase />
          </div>
        </div>
      </section>

      {/* SECTION 2: Official KokonutUI Card Stack Specs */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <CardStack />
      </section>

      {/* SECTION 3: Official KokonutUI Bento Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800" id="features">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase">WORKSTATION POWER</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-2 mb-4">Mobile IDE Architecture</h2>
          <p className="text-slate-400 text-base">Combining zero-trust proxy relays, Rust PTY terminal rendering, and Algorand micro-billing.</p>
        </div>

        <BentoGrid />
      </section>

      {/* SECTION 4: Platform Pillars (Liquid Glass Cards) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <LiquidGlassCard className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white mb-2">Zero-Trust Relays</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">No open incoming ports or VPN setup required. Sessions pair securely over encrypted WebSocket proxy relays.</p>
            <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> TLS 1.3 End-to-End Encryption</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Ephemeral 6-Character Nonce Auth</li>
            </ul>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white mb-2">Rust PTY Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">Real PTY sessions via WezTerm cell grid with 24fps incremental diff rendering and sub-second input latency on mobile.</p>
            <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tab Session Execution</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Live Stdout/Stderr Stream</li>
            </ul>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white mb-2">Algorand x402 Protocol</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">HTTP 402 payment protocol integration. Pay pennies for AI prompts and ephemeral container sandboxes settled in &lt;1s.</p>
            <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> $0.01 per AI Code Completion</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Sub-Second MainNet Settlement</li>
            </ul>
          </LiquidGlassCard>
        </div>
      </section>

      {/* SECTION 5: How It Works */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase">STREAMLINED ONBOARDING</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-2 mb-4">How it works</h2>
          <p className="text-slate-400 text-base">Three simple steps to pair your mobile phone with your local workstation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div>
              <div className="font-mono text-sm font-bold text-indigo-400 mb-3">01 Pair Devices</div>
              <h3 className="text-xl font-bold font-heading text-white mb-3">Launch CLI Bridge</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Run `npx helixbox-cli -n` on your PC. Generates an ephemeral QR code and 6-character session key.</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Automated QR Code Generation</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Ephemeral 6-Char Nonce Auth</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Zero Firewall Setup Required</li>
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div>
              <div className="font-mono text-sm font-bold text-indigo-400 mb-3">02 Stream Terminal</div>
              <h3 className="text-xl font-bold font-heading text-white mb-3">Mobile PTY Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Scan QR code in the mobile app. Instant PTY terminal emulator & live stdout stream on mobile.</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Rust 24fps WezTerm Rendering</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tab Session Control</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Integrated File Explorer & Editor</li>
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div>
              <div className="font-mono text-sm font-bold text-indigo-400 mb-3">03 Execute Workloads</div>
              <h3 className="text-xl font-bold font-heading text-white mb-3">x402 Micro-Billing</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Pay pennies for AI prompt assistance and ephemeral container sandboxes settled natively on Algorand.</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> HTTP 402 Payment Header</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Sub-Second MainNet Finality</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Fractional Cent Transaction Fees</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12 flex justify-center">
          <ShimmerButton 
            onClick={() => window.location.href = "https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"}
            shimmerColor="#818cf8"
            background="rgba(15, 23, 42, 0.95)"
          >
            <Smartphone className="w-4 h-4 text-indigo-300" />
            <span>Ready to build? Download Helix Box APK</span>
          </ShimmerButton>
        </div>
      </section>

      {/* SECTION 6: Use Cases Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase">USE CASES</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-2 mb-4">Elevate your developer workflow</h2>
          <p className="text-slate-400 text-base">Discover how Helix Box transforms remote execution across all software domains.</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === cat
                  ? 'bg-indigo-500 text-white font-bold shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-indigo-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {uc.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{uc.time}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {uc.description}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore detail</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Pricing */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800" id="pricing">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase">ENHANCEMENT PLANS</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-2 mb-4">Algorand x402 Micro-Billing</h2>
          <p className="text-slate-400 text-base">Select your micropayment tier. No monthly subscriptions — pay per request on Algorand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, idx) => (
            <LiquidGlassCard key={idx} className={`p-8 flex flex-col justify-between relative ${tier.popular ? 'border-indigo-500/80 shadow-2xl' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-extrabold font-heading text-white">{tier.price}</span>
                  <span className="text-xs text-slate-400">{tier.period}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ShimmerButton 
                onClick={() => window.location.href = "https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"}
                shimmerColor="#818cf8"
                background="rgba(15, 23, 42, 0.95)"
                className="w-full text-center"
              >
                {tier.cta}
              </ShimmerButton>
            </LiquidGlassCard>
          ))}
        </div>
      </section>

      {/* SECTION 8: FAQ Accordion */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-800" id="faq">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase">FAQ</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white mt-2 mb-4">Frequently asked questions</h2>
          <a href="https://github.com/devndesigner6/helix-box/issues" target="_blank" rel="noreferrer" className="text-xs text-slate-400 underline hover:text-indigo-400 transition-colors">Can't find what you're looking for? Ask on GitHub</a>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 cursor-pointer transition-colors hover:border-indigo-500/40"
              onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-indigo-400">00{idx + 1}</span>
                  <h3 className="font-heading font-bold text-base text-white">{faq.q}</h3>
                </div>
                {activeFaq === idx ? <Minus className="w-4 h-4 text-indigo-400" /> : <Plus className="w-4 h-4 text-slate-400" />}
              </div>
              {activeFaq === idx && (
                <p className="mt-4 pl-10 text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: Footer */}
      <footer className="border-t border-slate-800 py-16 px-6 bg-[#090a0e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img src="/helixbox.png" alt="Helix Box Logo" className="w-8 h-8 object-cover rounded-lg" />
              <span className="font-heading font-black text-2xl text-white">
                Helix<span className="text-indigo-400 font-serif italic">Box</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              AI-powered mobile IDE and cloud development platform. Code on your phone, run on your machine or in secure cloud sandboxes.
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-sm mb-6">
              <div className="text-xs font-bold text-white mb-2">Subscribe to releases</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your developer email"
                  className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white w-full focus:outline-none focus:border-indigo-500"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 text-xs rounded-xl transition-all shrink-0">
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">100% Open Source Software under MIT License</p>
            </form>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm text-white mb-4">Architecture</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#architecture" className="hover:text-indigo-400 transition-colors">Rust PTY Engine</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Zero-Trust Relays</a></li>
              <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Algorand x402 Protocol</a></li>
              <li><a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">GitHub Releases</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm text-white mb-4">Helix-Crew Team</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span>Hemanth Peddada</span></li>
              <li><span>Hemanth Bandi</span></li>
              <li><span>Asif</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Helix Box. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms</a>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacy</a>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
