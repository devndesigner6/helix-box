"use client";

/**
 * @author: @dorianbaffier
 * @description: Bento Grid - Official KokonutUI for Helix Box
 * @version: 1.0.0
 * @website: https://kokonutui.com
 */

import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Mic,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Anthropic from "./anthropic";
import AnthropicDark from "./anthropic-dark";
import DeepSeek from "./deepseek";
import Google from "./gemini";
import MistralAI from "./mistral";
import OpenAI from "./open-ai";
import OpenAIDark from "./open-ai-dark";
import { cn } from "@/lib/utils";

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icons?: boolean;
  href?: string;
  feature?:
    | "chart"
    | "counter"
    | "code"
    | "timeline"
    | "spotlight"
    | "icons"
    | "typing"
    | "metrics";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  code?: string;
  codeLang?: string;
  typingText?: string;
  metrics?: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
  statistic?: {
    value: string;
    label: string;
    start?: number;
    end?: number;
    suffix?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: "main",
    title: "Building Mobile IDE Infrastructure",
    description:
      "We architect and develop enterprise-grade CLI bridges, Rust PTY engines, and zero-trust WebSocket relays.",
    href: "https://github.com/devndesigner6/helix-box",
    feature: "spotlight",
    spotlightItems: [
      "Rust PTY WezTerm Engine",
      "Zero-Trust Bun WebSocket Proxy",
      "Algorand x402 Micropayments",
      "Mobile File Explorer & Code Editor",
      "Full Git Operations Protocol",
    ],
    size: "lg",
    className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    id: "stat1",
    title: "AI Terminal Assistant & Automation",
    description:
      "Interactive LLM code assistant that auto-fixes terminal stack traces and executes shell commands",
    href: "https://github.com/devndesigner6/helix-box",
    feature: "typing",
    typingText:
      "const spawnHelixSession = async () => {\n  const session = new HelixCLI({\n    model: 'codex-llama3',\n    relay: 'wss://helixbox-proxy.onrender.com',\n    payment: 'x402-algorand'\n  });\n\n  // Stream live PTY output\n  await session.connect();\n  return session;\n};",
    size: "md",
    className: "col-span-2 row-span-1 col-start-1 col-end-3",
  },
  {
    id: "partners",
    title: "LLM & Protocol Ecosystem",
    description:
      "Working with leading AI models and Algorand MainNet for instant on-chain micro-billing.",
    icons: true,
    href: "#",
    feature: "icons",
    size: "md",
    className: "col-span-1 row-span-1",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const SpotlightFeature = ({ items }: { items: string[] }) => (
  <ul className="mt-2 space-y-1.5">
    {items.map((item, index) => (
      <motion.li
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
        transition={{ delay: 0.1 * index }}
      >
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-cyan-400" />
        <span className="text-slate-300 text-sm">
          {item}
        </span>
      </motion.li>
    ))}
  </ul>
);

const IconsFeature = () => (
  <div className="mt-4 grid grid-cols-3 gap-4">
    <motion.div className="group flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
      <div className="relative flex h-8 w-8 items-center justify-center">
        <OpenAIDark className="h-7 w-7 text-white" />
      </div>
      <span className="text-center font-medium text-slate-400 text-xs">OpenAI</span>
    </motion.div>
    <motion.div className="group flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
      <div className="relative flex h-8 w-8 items-center justify-center">
        <AnthropicDark className="h-7 w-7 text-white" />
      </div>
      <span className="text-center font-medium text-slate-400 text-xs">Anthropic</span>
    </motion.div>
    <motion.div className="group flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
      <div className="relative flex h-8 w-8 items-center justify-center">
        <Google className="h-7 w-7" />
      </div>
      <span className="text-center font-medium text-slate-400 text-xs">Google</span>
    </motion.div>
  </div>
);

const TypingCodeFeature = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);

          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        },
        Math.random() * 30 + 10
      );

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, []);

  return (
    <div className="relative mt-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="text-slate-400 text-xs font-mono">
          helix-session.ts
        </div>
      </div>
      <div
        className="h-[150px] overflow-y-auto rounded-xl bg-slate-950 p-3 font-mono text-cyan-300 text-xs border border-slate-800"
        ref={terminalRef}
      >
        <pre className="whitespace-pre-wrap">
          {displayedText}
          <span className="animate-pulse text-white">|</span>
        </pre>
      </div>
    </div>
  );
};

const BentoCard = ({ item }: { item: BentoItem }) => {
  return (
    <motion.div
      className="h-full"
      variants={fadeInUp}
      whileHover={{ y: -5 }}
    >
      <a
        aria-label={`${item.title} - ${item.description}`}
        className={`group relative flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 ${item.className}`}
        href={item.href || "#"}
      >
        <div className="relative z-10 flex h-full flex-col gap-3">
          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xl tracking-tight font-heading">
                {item.title}
              </h3>
              <div className="text-cyan-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              {item.description}
            </p>

            {item.feature === "spotlight" && item.spotlightItems && (
              <SpotlightFeature items={item.spotlightItems} />
            )}

            {item.feature === "icons" && <IconsFeature />}

            {item.feature === "typing" && item.typingText && (
              <TypingCodeFeature text={item.typingText} />
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default function BentoGrid() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-6"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView="visible"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div className="md:col-span-1" variants={fadeInUp}>
              <BentoCard item={bentoItems[0]} />
            </motion.div>
            <motion.div className="md:col-span-2" variants={fadeInUp}>
              <BentoCard item={bentoItems[1]} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
