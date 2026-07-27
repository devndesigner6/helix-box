import React, { useState } from 'react';
import { Lock, Terminal, Coins, Folder, CheckCircle2, ArrowRight } from 'lucide-react';

export const FeatureTabsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "01",
      title: "Agent Studio & Diagnostics",
      subtitle: "AI Terminal Code Assistant",
      description: "Interactive LLM assistant trained to analyze stdout/stderr stack traces, write custom shell commands, and fix build failures directly over stdin/stdout.",
      icon: Terminal,
      badge: "OpenAI Codex",
      metrics: [
        { label: "Completion Speed", value: "< 1.2s" },
        { label: "Model", value: "GPT-4o Mini" },
        { label: "Cost", value: "$0.01 / prompt" }
      ],
      code: `// Agent Studio Stack Trace Analyzer
const diagnosis = await aiAssistant.analyzeTrace({
  stderr: errorBuffer,
  context: "Rust build --release"
});
console.log("Fix suggestion:", diagnosis.suggestedCommand);`
    },
    {
      id: "02",
      title: "Encrypted Proxy Tunnel",
      subtitle: "Zero-Trust E2E WebSockets",
      description: "Connect your local workstation to your smartphone securely with 6-character QR nonces without open firewall ports or VPN setup.",
      icon: Lock,
      badge: "TLS 1.3 Encryption",
      metrics: [
        { label: "Relay Engine", value: "Bun WebSocket" },
        { label: "Authentication", value: "6-Char Nonce / QR" },
        { label: "Firewall Status", value: "0 Open Ports" }
      ],
      code: `// Bun Proxy Session Relay
const ws = new WebSocket("wss://helixbox-proxy.onrender.com");
ws.send(JSON.stringify({ type: "PAIR", nonce: "atte6" }));`
    },
    {
      id: "03",
      title: "Algorand x402 Micropayments",
      subtitle: "Sub-Second Micro-Billing",
      description: "Native HTTP 402 payment required protocol integration. Pay fractional pennies ($0.01 per AI prompt, $0.25 per Docker container) settled on Algorand in under 1 second.",
      icon: Coins,
      badge: "MainNet Settled",
      metrics: [
        { label: "Payment Protocol", value: "HTTP 402 x402" },
        { label: "Finality Time", value: "< 0.8 Seconds" },
        { label: "Transaction Fee", value: "0.001 ALGO" }
      ],
      code: `// Algorand x402 Header Verification
if (req.headers["x-algorand-txid"]) {
  const verified = fontchain.verifyTx(req.headers["x-algorand-txid"]);
  if (verified) return next();
}`
    },
    {
      id: "04",
      title: "Mobile Code Explorer",
      subtitle: "Directory Tree & Syntax Highlight",
      description: "Browse repository directory trees, edit source files with syntax highlighting, search files via ripgrep, and execute 1-tap git status/commit/push on mobile.",
      icon: Folder,
      badge: "Expo Native",
      metrics: [
        { label: "File Search", value: "ripgrep CLI" },
        { label: "Git Operations", value: "Status / Commit / Push" },
        { label: "Editor Engine", value: "Monaco Engine" }
      ],
      code: `// Execute Remote Git Status Command
const status = await executeRemoteCommand("git status --short");
renderFileTree(parseGitStatus(status));`
    }
  ];

  const current = tabs[activeTab];
  const IconComponent = current.icon;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c3c2b2]/60">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">THREE LAYERS, ONE PLATFORM</span>
        <h2 className="text-4xl sm:text-5xl font-cabinet font-black text-[#232323] mt-2 mb-4">
          Deep-dive into platform capabilities.
        </h2>
        <p className="text-[#555555] text-base leading-relaxed">
          Select a capability pillar to inspect real-time architectural performance and code snippets.
        </p>
      </div>

      {/* Auxia Split Tab System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Step Triggers */}
        <div className="lg:col-span-5 space-y-3">
          {tabs.map((tab, idx) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-white border-[#0b4fff] shadow-[0_10px_30px_rgba(11,79,255,0.12)] translate-x-1'
                    : 'bg-white/60 border-[#c3c2b2]/60 hover:bg-white hover:border-[#c3c2b2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#0b4fff]' : 'text-[#888888]'}`}>
                      {tab.id}
                    </span>
                    <h3 className={`font-cabinet font-bold text-lg ${isActive ? 'text-[#232323]' : 'text-[#555555]'}`}>
                      {tab.title}
                    </h3>
                  </div>
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#0b4fff]' : 'text-[#888888]'}`} />
                </div>
                {isActive && (
                  <p className="mt-2 text-xs text-[#666666] leading-relaxed pl-7">
                    {tab.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Active Feature Display Box */}
        <div className="lg:col-span-7 auxia-card p-8 flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b4fff]/10 border border-[#0b4fff]/30 flex items-center justify-center text-[#0b4fff]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cabinet font-bold text-2xl text-[#232323]">{current.title}</h3>
                  <span className="text-xs font-mono text-[#0b4fff]">{current.subtitle}</span>
                </div>
              </div>
              <span className="auxia-badge">{current.badge}</span>
            </div>

            <p className="text-sm text-[#555555] leading-relaxed mb-6">
              {current.description}
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-[#f0efe3] border border-[#c3c2b2]/60">
              {current.metrics.map((m, mIdx) => (
                <div key={mIdx}>
                  <div className="text-[10px] font-mono text-[#777777] uppercase">{m.label}</div>
                  <div className="font-cabinet font-bold text-sm text-[#232323] mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Code Snippet Box (Departure Mono Font) */}
            <div className="rounded-xl overflow-hidden bg-[#080331] text-[#a5b4fc] p-4 text-xs font-departure overflow-x-auto shadow-inner">
              <pre><code>{current.code}</code></pre>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[#c3c2b2]/60 mt-6 text-xs text-[#555555]">
            <span>100% Open Source Architecture</span>
            <a href="https://github.com/devndesigner6/helix-box" target="_blank" rel="noreferrer" className="text-[#0b4fff] font-semibold hover:underline flex items-center gap-1">
              <span>View Source Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
