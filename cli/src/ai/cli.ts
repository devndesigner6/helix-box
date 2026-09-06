import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import crypto from "node:crypto";
import type {
  AIProvider,
  AiEventEmitter,
  CodexPromptOptions,
  FileAttachment,
  MessageInfo,
  ModelSelector,
  ProviderInfo,
  SessionInfo,
} from "./interface.js";
import type { AiBackend } from "./index.js";

type CliBackend = Extract<AiBackend, "claude" | "hermes">;

interface CliSession {
  id: string;
  title: string;
  created: number;
  updated: number;
  messages: MessageInfo[];
  process?: ChildProcess;
}

const COMMANDS: Record<CliBackend, string> = { claude: "claude", hermes: "hermes" };
const DEBUG = process.env.HELIXBOX_DEBUG_AI === "1";

function commandAvailable(command: string): boolean {
  const result = spawnSync(command, ["--version"], {
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  return !result.error;
}

function now(): number { return Date.now(); }

export class CliAgentProvider implements AIProvider {
  private emitter: AiEventEmitter | null = null;
  private sessions = new Map<string, CliSession>();
  private shuttingDown = false;

  constructor(private readonly backend: CliBackend) {}

  async init(): Promise<void> {
    if (!commandAvailable(COMMANDS[this.backend])) {
      throw new Error(`${COMMANDS[this.backend]} CLI is not installed`);
    }
  }

  async destroy(): Promise<void> {
    this.shuttingDown = true;
    for (const session of this.sessions.values()) session.process?.kill();
    this.sessions.clear();
    this.emitter = null;
  }

  subscribe(emitter: AiEventEmitter): () => void {
    this.emitter = emitter;
    this.shuttingDown = false;
    return () => { this.emitter = null; };
  }

  async createSession(title?: string): Promise<{ session: SessionInfo }> {
    const timestamp = now();
    const session: CliSession = {
      id: `${this.backend}-${crypto.randomUUID()}`,
      title: title?.trim() || `${this.backend === "claude" ? "Claude Code" : "Hermes"} session`,
      created: timestamp,
      updated: timestamp,
      messages: [],
    };
    this.sessions.set(session.id, session);
    return { session: this.toSession(session) };
  }

  async listSessions(): Promise<{ sessions: unknown }> {
    return { sessions: [...this.sessions.values()].map((session) => this.toSession(session)) };
  }

  async getSession(id: string): Promise<{ session: SessionInfo }> {
    return { session: this.toSession(this.requireSession(id)) };
  }

  async deleteSession(id: string): Promise<{ deleted: boolean }> {
    const session = this.requireSession(id);
    session.process?.kill();
    return { deleted: this.sessions.delete(id) };
  }

  async renameSession(id: string, title: string): Promise<{ session: SessionInfo }> {
    const session = this.requireSession(id);
    session.title = title.trim() || session.title;
    session.updated = now();
    return { session: this.toSession(session) };
  }

  async getMessages(sessionId: string): Promise<{ messages: MessageInfo[] }> {
    return { messages: this.requireSession(sessionId).messages };
  }

  async statuses(): Promise<{ statuses: Record<string, unknown> }> {
    const statuses: Record<string, unknown> = {};
    for (const session of this.sessions.values()) {
      statuses[session.id] = { type: session.process ? "busy" : "idle" };
    }
    return { statuses };
  }

  async prompt(
    sessionId: string,
    text: string,
    model?: ModelSelector,
    _agent?: string,
    files: FileAttachment[] = [],
    _codexOptions?: CodexPromptOptions,
  ): Promise<{ ack: true }> {
    const session = this.requireSession(sessionId);
    if (session.process) throw new Error(`Session ${sessionId} is already running`);
    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    const created = now();
    const prompt = files.length > 0
      ? `${text}\n\nAttached files: ${files.map((file) => file.filename || file.url).join(", ")}`
      : text;
    session.messages.push({ id: userId, role: "user", parts: [{ type: "text", text: prompt }], time: { created, updated: created } });
    this.emit("message.updated", { info: { sessionID: session.id, id: userId, role: "user", time: { created, updated: created } } });
    this.emit("message.updated", { info: { sessionID: session.id, id: assistantId, role: "assistant", time: { created, updated: created } } });
    this.emit("session.status", { sessionID: session.id, status: { type: "busy" } });

    const args = this.argsForPrompt(prompt, model);
    const child = spawn(COMMANDS[this.backend], args, {
      cwd: process.cwd(),
      env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    });
    session.process = child;
    session.updated = now();
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr?.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", (error) => this.finishError(session, assistantId, error.message));
    child.on("close", (code) => {
      session.process = undefined;
      if (this.shuttingDown) return;
      const output = this.cleanOutput(stdout || stderr);
      if (code !== 0 && !output) {
        this.finishError(session, assistantId, `${this.backend} exited with code ${code ?? "unknown"}`);
        return;
      }
      const message: MessageInfo = {
        id: assistantId,
        role: "assistant",
        parts: [{ type: "text", text: output || "(No output)" }],
        time: { created, updated: now() },
      };
      session.messages.push(message);
      session.updated = now();
      this.emit("message.part.updated", { sessionID: session.id, messageID: assistantId, part: { id: `${assistantId}-text`, sessionID: session.id, messageID: assistantId, type: "text", text: output || "(No output)" } });
      this.emit("session.status", { sessionID: session.id, status: { type: "idle" } });
    });
    if (DEBUG) console.log(`[ai] started ${this.backend} prompt for ${session.id}`);
    return { ack: true };
  }

  async abort(sessionId: string): Promise<Record<string, never>> {
    const session = this.requireSession(sessionId);
    session.process?.kill();
    session.process = undefined;
    this.emit("session.status", { sessionID: session.id, status: { type: "idle" } });
    return {};
  }

  async agents(): Promise<{ agents: unknown }> {
    return { agents: [{ name: this.backend === "claude" ? "Claude Code" : "Hermes", mode: "default", description: "Installed local CLI agent" }] };
  }

  async providers(): Promise<ProviderInfo> {
    return { providers: [{ id: this.backend, name: this.backend === "claude" ? "Claude Code" : "Hermes", models: {} }], default: {} };
  }

  async setAuth(): Promise<Record<string, never>> {
    throw new Error(`${COMMANDS[this.backend]} authentication is managed by its local CLI`);
  }

  async command(): Promise<{ result: unknown }> { throw new Error(`${COMMANDS[this.backend]} command execution is not supported by HelixBox`); }
  async revert(): Promise<Record<string, never>> { throw new Error(`${COMMANDS[this.backend]} revert is not supported by HelixBox`); }
  async unrevert(): Promise<Record<string, never>> { throw new Error(`${COMMANDS[this.backend]} unrevert is not supported by HelixBox`); }
  async share(): Promise<{ share: Record<string, never> }> { throw new Error(`${COMMANDS[this.backend]} sharing is not supported by HelixBox`); }
  async permissionReply(): Promise<Record<string, never>> { throw new Error(`${COMMANDS[this.backend]} permissions are handled by the CLI`); }

  private argsForPrompt(prompt: string, model?: ModelSelector): string[] {
    if (this.backend === "claude") {
      const args = ["-p", prompt, "--output-format", "json", "--permission-mode", "plan"];
      if (model?.modelID) args.push("--model", model.modelID);
      return args;
    }
    const args = ["chat", "-q", prompt];
    if (model?.modelID) args.push("--model", model.modelID);
    return args;
  }

  private cleanOutput(output: string): string {
    const trimmed = output.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "").trim();
    if (this.backend !== "claude") return trimmed;
    try {
      const parsed = JSON.parse(trimmed) as { result?: unknown; subtype?: string; is_error?: boolean };
      if (parsed.is_error) throw new Error(String(parsed.result || parsed.subtype || "Claude Code failed"));
      return typeof parsed.result === "string" ? parsed.result : trimmed;
    } catch {
      return trimmed;
    }
  }

  private finishError(session: CliSession, assistantId: string, error: string): void {
    session.process = undefined;
    this.emit("prompt_error", { sessionID: session.id, error });
    this.emit("session.status", { sessionID: session.id, status: { type: "idle" } });
    if (DEBUG) console.warn(`[ai] ${this.backend} prompt failed: ${error}`);
    void assistantId;
  }

  private emit(type: string, properties: Record<string, unknown>): void { this.emitter?.({ type, properties }); }
  private requireSession(id: string): CliSession { const session = this.sessions.get(id); if (!session) throw new Error(`Session ${id} not found`); return session; }
  private toSession(session: CliSession): SessionInfo { return { id: session.id, title: session.title, time: { created: session.created, updated: session.updated } }; }
}
