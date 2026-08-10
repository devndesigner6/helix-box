const PHASES = [
  {
    id: 1,
    name: "Mobile Client Core",
    status: "complete",
    lessons: [
      { id: "01", name: "Dev Environment Setup", status: "complete", type: "Build", lang: "Expo" },
      { id: "02", name: "File Explorer & Navigator", status: "complete", type: "Build", lang: "TSX" },
      { id: "03", name: "WebSocket Connection State Manager", status: "complete", type: "Build", lang: "TypeScript" },
      { id: "04", name: "PTY Terminal Renderer", status: "complete", type: "Build", lang: "TSX" },
      { id: "05", name: "Deep Link Routing Screen Handler", status: "complete", type: "Build", lang: "TSX" }
    ]
  },
  {
    id: 2,
    name: "Pairing Protocol",
    status: "complete",
    lessons: [
      { id: "06", name: "Pairing Handshake Protocol", status: "complete", type: "Learn", lang: "JSON" },
      { id: "07", name: "SQLite Session Persistence Layer", status: "complete", type: "Build", lang: "TypeScript" },
      { id: "08", name: "Secure Time-bound Password Generation", status: "complete", type: "Build", lang: "TypeScript" }
    ]
  },
  {
    id: 3,
    name: "Proxy Relay",
    status: "complete",
    lessons: [
      { id: "09", name: "Secure WebSocket Tunnel Gateway", status: "complete", type: "Build", lang: "Bun" },
      { id: "10", name: "Control vs Data Channel Separation", status: "complete", type: "Learn", lang: "WebSockets" },
      { id: "11", name: "Auto-Reconnect & Keepalive Heartbeat Daemon", status: "complete", type: "Build", lang: "Bun" }
    ]
  },
  {
    id: 4,
    name: "Runtime CLI Host",
    status: "complete",
    lessons: [
      { id: "12", name: "CLI Connection Bootstrapper", status: "complete", type: "Build", lang: "Node" },
      { id: "13", name: "Native Rust PTY Spawner Integration", status: "complete", type: "Build", lang: "Rust" },
      { id: "14", name: "I/O Byte Stream Encoding & Packetizer", status: "complete", type: "Build", lang: "TypeScript" }
    ]
  },
  {
    id: 5,
    name: "USDC Micro-Billing (x402)",
    status: "complete",
    lessons: [
      { id: "15", name: "Pera Wallet Connection & SDK Bridging", status: "complete", type: "Build", lang: "React" },
      { id: "16", name: "x402 Protocol Smart-Contract Payments", status: "complete", type: "Build", lang: "Algorand" },
      { id: "17", name: "Auto-Pay Sync Daemon & Account Watcher", status: "complete", type: "Build", lang: "TypeScript" }
    ]
  },
  {
    id: 6,
    name: "Autonomous Cognitive Agent",
    status: "complete",
    lessons: [
      { id: "18", name: "Agent Execution Sandbox & Sandbox Isolation", status: "complete", type: "Build", lang: "Docker" },
      { id: "19", name: "Interactive Terminal Execution Framework", status: "complete", type: "Build", lang: "TypeScript" },
      { id: "20", name: "Auto-Repair Loop & Diagnostics Agent", status: "complete", type: "Learn", lang: "OpenAI" }
    ]
  }
];

const GLOSSARY = [
  {
    term: "x402 Protocol",
    definition: "Algorand micro-payment framework providing pay-as-you-go billing for API executions and session durations.",
    area: "Micro-Payments"
  },
  {
    term: "PTY (Pseudoterminal)",
    definition: "A native interface that emulates a physical terminal, spawned by the HelixBox CLI to run commands on your laptop.",
    area: "CLI Host"
  },
  {
    term: "Relay Proxy",
    definition: "A secure, encrypted WebSocket server that forwards command streams between your mobile app and local CLI without exposing open ports.",
    area: "Proxy Relay"
  },
  {
    term: "Pairing Handshake",
    definition: "A secure pairing protocol that uses time-bound passwords and QR codes to establish trust between the mobile client and local server.",
    area: "Pairing"
  },
  {
    term: "USDC Auto-Pay",
    definition: "A background synchronization task in the HelixBox manager that periodically settles micro-payment fees in Testnet USDC.",
    area: "Micro-Payments"
  },
  {
    term: "Expo Router",
    definition: "A file-based navigation router used in the mobile client to handle deep-link transitions and authentication checks.",
    area: "Mobile Client"
  },
  {
    term: "Hono Web Server",
    definition: "The ultra-fast web framework running the control plane manager for pairing codes and micro-billing statuses.",
    area: "Proxy Relay"
  },
  {
    term: "SQLite Persistence",
    definition: "The database table on the manager server that saves pairing codes across container restarts.",
    area: "Pairing"
  }
];

// Export for Vite if required, but also define globally for browser script tag compatibility.
if (typeof window !== "undefined") {
  window.PHASES = PHASES;
  window.GLOSSARY = GLOSSARY;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PHASES, GLOSSARY };
}
