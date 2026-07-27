import React, { useState } from 'react';
import { Zap, Check, ChevronRight, MessageSquare, Terminal, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const InteractiveStoryboard = () => {
  const [activeStep, setActiveStep] = useState(0);

  const storyboardSteps = [
    {
      id: "01",
      badge: "Spot build errors",
      title: "AI Terminal Stack Trace Analysis",
      description: "Ask your AI assistant to analyze terminal stdout/stderr logs and pinpoint broken build dependencies instantly.",
      leftCard: {
        type: "prompt",
        question: "Can you provide a latency writeup on our terminal relay session and recommend optimizations?",
        status: "Activating agents"
      },
      rightCard: {
        type: "metrics",
        title: "Relay Latency Analysis",
        metrics: [
          { name: "Local PTY Spawn", val: "12ms", pct: 95 },
          { label: "TLS 1.3 Handshake", val: "18ms", pct: 90 },
          { label: "WezTerm Diff Encoding", val: "6ms", pct: 98 },
          { label: "Mobile Render Frame", val: "14ms", pct: 92 }
        ]
      }
    },
    {
      id: "02",
      badge: "Build playbooks & workflows",
      title: "Automated Fix Generation",
      description: "Generates custom shell scripts, git checkout commands, and environment fixes tailored to your local environment.",
      leftCard: {
        type: "playbook",
        title: "Playbook: Terminal-Buffer-Optimization",
        tasks: [
          { text: "Enable WezTerm 24fps cell diffing", done: true },
          { text: "Set Ephemeral Nonce TTL to 300s", done: true },
          { text: "Route traffic through Bun WebSocket relay", done: true },
          { text: "Require x402 payment header auth", done: false }
        ]
      },
      rightCard: {
        type: "recommendation",
        title: "RECOMMENDED NEXT STEPS",
        items: [
          "1. Deploy Rust PTY v0.1.124 binary to workstation",
          "2. Issue Algorand x402 payment challenge for AI prompt completions",
          "3. Notify dev team on #dev-approvals channel"
        ]
      }
    },
    {
      id: "03",
      badge: "Automate manual approvals",
      title: "Slack & CLI Approval Integration",
      description: "Routing automated authorization requests directly to team Slack channels or mobile push notifications.",
      leftCard: {
        type: "slack",
        channel: "#dev-approvals",
        author: "Priya Nair (Lead Ops)",
        actionText: "Approved Rust PTY release v0.1.124 for production relay.",
        status: "APPROVED BY PRIYA NAIR"
      },
      rightCard: {
        type: "status",
        title: "Deployment Routing Status",
        steps: [
          { step: "SFMC Relay Gateway", status: "COMPLETE", icon: CheckCircle2 },
          { step: "Zero-Trust TLS Session", status: "COMPLETE", icon: CheckCircle2 },
          { step: "x402 Header Challenge", status: "COMPLETE", icon: CheckCircle2 },
          { step: "Mobile PTY Sync", status: "PENDING", icon: Clock }
        ]
      }
    },
    {
      id: "04",
      badge: "Deliver 1:1 mobile execution",
      title: "Real-Time Mobile Personalization",
      description: "Every developer receives tailored PTY cell buffers, personalized shell shortcuts, and instant terminal execution on mobile.",
      leftCard: {
        type: "profiles",
        users: [
          { name: "Maya Chen", role: "Frontend Dev", action: "Pushed git commit #eab49", tag: "CONVERTED" },
          { name: "Devin Ross", role: "Backend Dev", action: "Spawned Docker Sandbox #3", tag: "PENDING" },
          { name: "Aisha Khan", role: "DevOps Eng", action: "Executed ripgrep search", tag: "CONVERTED" }
        ]
      },
      rightCard: {
        type: "summary",
        title: "Live Execution Metrics",
        total: "1,240 Sessions",
        latency: "< 45ms Avg",
        uptime: "99.99%"
      }
    }
  ];

  const current = storyboardSteps[activeStep];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#c3c2b2]/60" id="home-marketer">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-[#0b4fff] tracking-widest uppercase">AUTOMATED DEVELOPER WORKFLOW</span>
        <h2 className="text-4xl sm:text-6xl font-cabinet font-black text-[#232323] mt-2 mb-4 tracking-tight">
          Become a 10x Developer.
        </h2>
        <p className="text-[#555555] text-base sm:text-lg leading-relaxed">
          Use the power of AI to handle execution as you focus on engineering strategy and scale.
        </p>
      </div>

      {/* Step Triggers Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {storyboardSteps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border ${
              activeStep === idx
                ? 'bg-[#0b4fff] text-white border-[#0b4fff] shadow-md scale-105'
                : 'bg-white text-[#555555] border-[#c3c2b2] hover:border-[#0b4fff]'
            }`}
          >
            {s.id}. {s.badge}
          </button>
        ))}
      </div>

      {/* Interactive Storyboard Dual Card Display */}
      <div className="auxia-card p-8 sm:p-12 bg-white border border-[#c3c2b2] shadow-xl rounded-3xl min-h-[480px] flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#c3c2b2]/60">
            <div>
              <span className="font-mono text-xs font-bold text-[#0b4fff] uppercase tracking-wider">STEP {current.id}</span>
              <h3 className="font-cabinet font-black text-2xl sm:text-3xl text-[#232323] mt-1">{current.title}</h3>
            </div>
            <span className="auxia-badge">{current.badge}</span>
          </div>

          <p className="text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed mb-8">
            {current.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Interactive Card View */}
            <div className="p-6 rounded-2xl bg-[#f0efe3] border border-[#c3c2b2]">
              {current.leftCard.type === 'prompt' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-[#555555] uppercase">PROMPT QUERY</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#0b4fff] text-white font-bold">
                      {current.leftCard.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#232323] font-medium leading-relaxed mb-4">
                    "{current.leftCard.question}"
                  </p>
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-lg bg-[#0b4fff] text-white flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {current.leftCard.type === 'playbook' && (
                <div>
                  <div className="font-mono text-xs font-bold text-[#0b4fff] mb-3">{current.leftCard.title}</div>
                  <ul className="space-y-2.5">
                    {current.leftCard.tasks.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-2 text-xs text-[#333333]">
                        {t.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className={t.done ? 'line-through text-[#777777]' : 'font-medium'}>{t.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {current.leftCard.type === 'slack' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#0b4fff]">{current.leftCard.channel}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {current.leftCard.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#232323] mb-1">{current.leftCard.author}</div>
                  <p className="text-xs text-[#555555] leading-relaxed mb-3">{current.leftCard.actionText}</p>
                  <button className="auxia-btn-primary text-[10px] py-1.5 px-3">
                    Launch Mobile Sync
                  </button>
                </div>
              )}

              {current.leftCard.type === 'profiles' && (
                <div className="space-y-3">
                  {current.leftCard.users.map((u, uIdx) => (
                    <div key={uIdx} className="p-3 rounded-xl bg-white border border-[#c3c2b2] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#232323]">{u.name} <span className="text-[10px] text-[#777777] font-normal">({u.role})</span></div>
                        <div className="text-[10px] text-[#555555]">{u.action}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        u.tag === 'CONVERTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.tag === 'CONVERTED' ? '✓ CONVERTED' : '● PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Interactive Card View */}
            <div className="p-6 rounded-2xl bg-[#080331] text-white border border-indigo-900 shadow-xl">
              <h4 className="font-cabinet font-bold text-lg text-white mb-4">{current.rightCard.title}</h4>
              
              {current.rightCard.metrics && (
                <div className="space-y-3">
                  {current.rightCard.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-indigo-200">{m.name || m.label}</span>
                        <span className="text-white font-bold">{m.val}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-indigo-950 overflow-hidden">
                        <div className="h-full bg-[#0b4fff] rounded-full" style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {current.rightCard.items && (
                <ul className="space-y-3 text-xs text-indigo-200 font-mono">
                  {current.rightCard.items.map((item, iIdx) => (
                    <li key={iIdx} className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {current.rightCard.steps && (
                <div className="space-y-2.5">
                  {current.rightCard.steps.map((st, stIdx) => {
                    const StIcon = st.icon;
                    return (
                      <div key={stIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/60 text-xs font-mono">
                        <span className="text-indigo-200">{st.step}</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <StIcon className="w-3.5 h-3.5" />
                          <span>{st.status}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {current.rightCard.summary && (
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div>
                    <div className="text-[10px] font-mono text-indigo-300">TOTAL</div>
                    <div className="font-cabinet font-bold text-lg text-white">{current.rightCard.total}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-indigo-300">LATENCY</div>
                    <div className="font-cabinet font-bold text-lg text-white">{current.rightCard.latency}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-indigo-300">UPTIME</div>
                    <div className="font-cabinet font-bold text-lg text-white">{current.rightCard.uptime}</div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#c3c2b2]/60 text-xs text-[#555555]">
          <span>Interactive Storyboard Step {activeStep + 1} of 4</span>
          <button 
            onClick={() => setActiveStep((activeStep + 1) % 4)}
            className="text-[#0b4fff] font-bold hover:underline flex items-center gap-1"
          >
            <span>Next Storyboard Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </section>
  );
};
