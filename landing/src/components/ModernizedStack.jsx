import React, { useState } from 'react';
import { Lock, Terminal, Coins, Folder, CheckCircle2, ArrowRight } from 'lucide-react';

export const ModernizedStack = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "01",
      title: "Encrypted Proxy Relays",
      subtitle: "Zero-Trust E2E WebSockets",
      description: "Connect your local machine to your mobile phone securely with 6-character QR nonces. Eliminates the need for open firewall ports or static IP addresses.",
      icon: Lock,
      badge: "TLS 1.3 Encryption",
      metrics: [
        { label: "Relay Protocol", value: "Bun WebSocket" },
        { label: "Pairing Method", value: "6-Char Nonce / QR" },
        { label: "Security Level", value: "Zero Open Ports" }
      ],
      code: `// Bun Proxy Relay Initialization
const server = Bun.serve({
  port: 8080,
  websocket: {
    open(ws) {
      ws.subscribe("helix-session-atte6");
    },
    message(ws, msg) {
      ws.publish("helix-session-atte6", msg);
    }
  }
});`
    },
    {
      id: "02",
      title: "Rust PTY Engine",
      subtitle: "24fps WezTerm Cell Grid Buffer",
      description: "Low-overhead Rust PTY binary parses terminal screen buffers into incremental 24fps cell diffs, streaming live stdout/stderr streams to mobile with <50ms latency.",
      icon: Terminal,
      badge: "WezTerm Fork",
      metrics: [
        { label: "Screen Buffer", value: "24fps Cell Grid" },
        { label: "Input Latency", value: "< 50ms" },
        { label: "Memory Usage", value: "4.2 MB RAM" }
      ],
      code: `// Rust PTY Cell Diff Sender
pub fn stream_cell_diff(buffer: &TermBuffer) -> Result<()> {
    let diff = buffer.compute_incremental_diff()?;
    websocket_stream.send_binary(&diff.encode_bincode()?)?;
    Ok(())
}`
    },
    {
      id: "03",
      title: "Algorand x402 Protocol",
      subtitle: "Sub-Second Micro-Billing",
      description: "Native HTTP 402 payment required integration. Pay fractional pennies ($0.01 per AI prompt, $0.25 per cloud Docker sandbox) settled on Algorand in under 1 second.",
      icon: Coins,
      badge: "MainNet Settled",
      metrics: [
        { label: "Payment Std", value: "HTTP 402 x402" },
        { label: "Finality", value: "< 0.8 Seconds" },
        { label: "Tx Fee", value: "0.001 ALGO" }
      ],
      code: `// Algorand x402 Payment Challenge
app.use("/ai/complete", async (req, res, next) => {
  if (!req.headers["x-algorand-txid"]) {
    return res.status(402).json({
      amount: "10000", // 0.01 ALGO
      receiver: "HELIX...X402"
    });
  }
  next();
});`
    },
    {
      id: "04",
      title: "Mobile Code Explorer",
      subtitle: "Directory Tree & Syntax Highlight",
      description: "Browse workspace file structures, edit source files with syntax highlighting, run ripgrep code searches, and stage git commits directly from your mobile device.",
      icon: Folder,
      badge: "Expo Native",
      metrics: [
        { label: "File Search", value: "ripgrep CLI" },
        { label: "Git Operations", value: "Status / Commit / Push" },
        { label: "Syntax Highlighting", value: "Monaco Engine" }
      ],
      code: `// Mobile Git Status Execution
const gitStatus = await executeRemoteCommand('git status --short');
const modifiedFiles = parseGitOutput(gitStatus);
renderFileExplorer(modifiedFiles);`
    }
  ];

  const current = steps[activeStep];
  const IconComponent = current.icon;

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-[#c3c2b2]/80" id="features">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">MODERNIZED MOBILE STACK</span>
        <h2 className="text-4xl sm:text-5xl font-cabinet font-black text-[#232323] mt-2 mb-4">
          Built for speed, security, & scale.
        </h2>
        <p className="text-[#555555] text-base leading-relaxed">
          Four core architectural pillars powers the Helix Box mobile developer experience.
        </p>
      </div>

      {/* Auxia Interactive Split Layout (Left Triggers, Right Detail Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Step Selection List */}
        <div className="lg:col-span-5 space-y-3">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-[#ffffff] border-[#0b4fff] shadow-[0_8px_30px_rgba(11,79,255,0.1)] translate-x-1'
                    : 'bg-[#ffffff]/60 border-[#c3c2b2]/60 hover:bg-[#ffffff] hover:border-[#c3c2b2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#0b4fff]' : 'text-[#888888]'}`}>
                      {step.id}
                    </span>
                    <h3 className={`font-cabinet font-bold text-lg ${isActive ? 'text-[#232323]' : 'text-[#555555]'}`}>
                      {step.title}
                    </h3>
                  </div>
                  <StepIcon className={`w-4 h-4 ${isActive ? 'text-[#0b4fff]' : 'text-[#888888]'}`} />
                </div>
                {isActive && (
                  <p className="mt-2 text-xs text-[#666666] leading-relaxed pl-7">
                    {step.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Dynamic Active Feature Display Card */}
        <div className="lg:col-span-7 auxia-card p-8 flex flex-col justify-between min-h-[440px]">
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
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-[#f0efe3]/80 border border-[#c3c2b2]/60">
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
