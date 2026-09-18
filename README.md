<div align="center">
  <a href="https://helix-box.vercel.app/">
    <img src="assets/helixbox.png" alt="Helix Box" width="600">
  </a>
</div><br />
<p align="center"><strong>Build, run, and ship directly from your phone.</strong></p>
<p align="center">HelixBox brings your existing laptop development environment to mobile, including files, terminals, Git, processes, and AI coding agents.</p>

<p align="center">
  <a href="https://helix-box.vercel.app/"><b>Website</b></a>
  &nbsp;•&nbsp;
  <a href="#quick-start"><b>Quick Start</b></a>
  &nbsp;•&nbsp;
  <a href="#x402-agent-sessions"><b>x402 Sessions</b></a>
  &nbsp;•&nbsp;
  <a href="https://github.com/devndesigner6/helix-box/releases/latest"><b>Latest Release</b></a>
</p>
<p align="center">
  <a href="https://helix-box.vercel.app/"><img src="https://img.shields.io/badge/Open_HelixBox-4F46E5?style=for-the-badge" alt="Open HelixBox"></a>
  &nbsp;•&nbsp;
  <a href="https://github.com/devndesigner6/helix-box/releases/latest"><img src="https://img.shields.io/badge/Download_Android-black?style=for-the-badge&logo=android" alt="Download Android release"></a>
  &nbsp;•&nbsp;
  <a href="https://github.com/devndesigner6/helix-box/issues"><img src="https://img.shields.io/badge/Report_Bug-black?style=for-the-badge" alt="Report Bug"></a>
</p>

<p align="center">
  <img src="app/assets/images/onboarding/1/left.png" alt="HelixBox mobile terminal" width="180">
  &nbsp;&nbsp;
  <img src="app/assets/images/onboarding/1/middle.png" alt="HelixBox AI agent" width="180">
  &nbsp;&nbsp;
  <img src="app/assets/images/onboarding/1/right.png" alt="HelixBox mobile editor" width="180">
</p>

## Structure

| Directory | Description |
|-----------|-------------|
| `app/` | Expo/React Native mobile app |
| `cli/` | CLI tool (`helixbox-cli`) |
| `manager/` | Manager server |
| `proxy/` | Proxy server |
| `pty/` | Rust PTY binary uses wezterm internal libs for rendering |

<br />

## Quick Start

1. Start HelixBox in your project directory:

```bash
npx helixbox-cli
```

2. Open the HelixBox mobile app and scan the pairing QR code.
3. Resume your workspace to access its files, terminal, Git state, processes, and available AI agents.

<br /> 

## App

Mobile app for iOS, Android, and web built with Expo. The CLI performs workspace operations while the app provides a mobile control surface for the connected environment.

- File explorer and editor
- Git integration
- Terminal emulator
- Process management
- AI agent sessions with Codex, OpenCode, Claude, and Hermes

### Supported Languages (22)

`en`, `zh`, `ja`, `ko`, `es`, `pt`, `de`, `fr`, `vi`, `ru`, `id`, `pl`, `tr`, `it`, `nl`, `sv`, `uk`, `fi`, `zh-TW`, `tw`, `ms`, `es-MX`

<br />

## CLI

Node.js CLI that securely connects your local workspace to the app over WebSocket. Run it with `npx helixbox-cli`.

- Filesystem operations (read, write, grep, etc.)
- Git commands (status, commit, push, pull, etc.)
- Terminal spawning
- Process management
- Port scanning
- System monitoring (CPU, memory, disk, battery)

```bash
npx helixbox-cli
```

<br />

## x402 Agent Sessions

Workspace pairing, file inspection, logs, Git status, and basic controls remain free. Paid AI agent access is activated as a time-bound session after a confirmed USDC payment on Algorand MainNet.

| Access | Price | Includes |
|--------|-------|----------|
| Agent session | `$0.25 USDC` | One hour of agent access |
| Developer pass | `$2 USDC` | Seven days with fair-use limits |

**Network:** Algorand MainNet<br>
**Settlement asset:** USDC<br>
**MainNet `payTo`:** `AQYWNHO6QWB4AB4SHIVMNZL2QN2ZQIYYO3Z27DJCUOILZ43YGGZUIPAURY`

HelixBox verifies payment settlement before activating access. It never asks for or stores a wallet recovery phrase or private key.

<br />

## Manager and Proxy

Bun-based WebSocket service that connects the CLI and app using session codes. The public manager is deployed at [helixbox-manager.onrender.com](https://helixbox-manager.onrender.com).

- Session management with 10-min TTL
- Dual-channel architecture (control + data)
- QR code pairing

<br />

## PTY

Rust binary for pseudo-terminal management, used by the CLI.

- Real PTY sessions via `wezterm` fork on github.com/sohzm/wezterm
- Screen buffer as cell grid (char + fg + bg per cell)
- 24fps render loop (only sends updates when content changes)
- JSON line protocol over stdin/stdout

<br />

## AI Agent Integration

HelixBox supports Codex, OpenCode, Claude, and Hermes when their CLIs are available in the paired environment. Codex and GPT-5.6 also assisted with several parts of the implementation:
- **Rust PTY Delta Engine**: Codex co-authored the optimized incremental screen buffer diffing logic in the Rust PTY rendering loop, ensuring low-latency communication over standard output.
- **WebSocket Reconnection Logic**: GPT-5.6 helped design the network reconnection state machine in the Bun WebSocket proxy to maintain active connection states during mobile cellular handoffs.
- **Protocol Typings**: Codex generated TypeScript definitions for the control-plane RPC protocol to ensure type safety between the mobile app and the local CLI bridge.

<br />

## 📄 License

MIT: See [LICENSE](LICENSE) for details.

<br />

## Star History

<a href="https://www.star-history.com/#devndesigner6/helix-box&Timeline">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=devndesigner6/helix-box&type=Timeline&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=devndesigner6/helix-box&type=Timeline" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=devndesigner6/helix-box&type=Timeline" />
 </picture>
</a>
