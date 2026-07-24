"use client";

/**
 * @author: @dorianbaffier
 * @description: Official KokonutUI Card Stack for Helix Box
 * @version: 1.1.0
 * @website: https://kokonutui.com
 */

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  specs: Specification[];
}

const products: Product[] = [
  {
    id: "pty-engine",
    title: "Rust PTY Engine",
    subtitle: "24fps Cell Grid Buffer",
    description:
      "Real PTY sessions via WezTerm fork. Incremental screen cell updates delivered over stdin/stdout at sub-second latency.",
    image: "/helixbox.png",
    specs: [
      { label: "Rendering", value: "24fps" },
      { label: "Latency", value: "< 50ms" },
      { label: "Terminal", value: "xterm-256" },
      { label: "Engine", value: "Rust" },
    ],
  },
  {
    id: "zero-trust",
    title: "Zero-Trust Relay",
    subtitle: "E2E TLS 1.3 WebSockets",
    description:
      "No open firewall ports or static IP setup. Ephemeral 6-character QR nonces pair PC and phone securely.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Security", value: "TLS 1.3" },
      { label: "Pairing", value: "6-Char Nonce" },
      { label: "Ports", value: "0 Open Ports" },
      { label: "Tunnel", value: "Bun WebSocket" },
    ],
  },
  {
    id: "x402-payments",
    title: "Algorand x402",
    subtitle: "On-Chain Micropayments",
    description:
      "HTTP 402 payment protocol integration. Pay $0.01 per AI prompt or $0.25 per Docker sandbox settled in <1s.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Settlement", value: "< 1s" },
      { label: "Cost", value: "$0.01 / prompt" },
      { label: "Network", value: "Algorand" },
      { label: "Header", value: "x402" },
    ],
  },
  {
    id: "mobile-editor",
    title: "Mobile IDE",
    subtitle: "File Explorer & Git",
    description:
      "Browse repo trees, edit source code with syntax highlighting, search files via ripgrep, and push git commits on mobile.",
    image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Languages", value: "22 Supported" },
      { label: "Git", value: "Full Commands" },
      { label: "Editor", value: "CodeMirror" },
      { label: "Client", value: "Expo / Native" },
    ],
  },
];

const CARD_WIDTH = 320;
const CARD_OVERLAP = 240;

interface CardProps {
  product: Product;
  index: number;
  totalCards: number;
  isExpanded: boolean;
  reducedMotion: boolean;
}

const Card = ({
  product,
  index,
  totalCards,
  isExpanded,
  reducedMotion,
}: CardProps) => {
  const reverseIndex = totalCards - 1 - index;

  const getVariant = () => {
    if (reducedMotion) {
      return {
        x: 0,
        y: isExpanded ? index * 320 : reverseIndex * -8,
        rotate: 0,
        scale: 1,
      };
    }

    if (isExpanded) {
      return {
        x: (index - (totalCards - 1) / 2) * CARD_WIDTH * 0.95,
        y: 0,
        rotate: (index - (totalCards - 1) / 2) * 4,
        scale: 1,
      };
    }

    return {
      x: reverseIndex * 12,
      y: reverseIndex * -6,
      rotate: reverseIndex * -2,
      scale: 1 - reverseIndex * 0.03,
    };
  };

  return (
    <motion.div
      animate={getVariant()}
      className={cn(
        "absolute rounded-3xl p-6 transition-all duration-300",
        "w-[300px] sm:w-[320px] bg-slate-900 border border-cyan-500/30 text-white shadow-2xl"
      )}
      initial={false}
      style={{
        zIndex: isExpanded ? index : reverseIndex,
      }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {product.subtitle}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              0{index + 1}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-white font-heading mb-2 text-left">
            {product.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed mb-6 text-left">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
          {product.specs.map((spec, sIdx) => (
            <div key={sIdx} className="bg-slate-950/60 p-2 rounded-xl text-left">
              <div className="text-[10px] text-slate-500 uppercase">{spec.label}</div>
              <div className="text-xs font-bold text-cyan-300 font-mono">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function CardStack({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="my-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase">KOKONUTUI OFFICIAL CARD STACK</span>
        <h3 className="text-3xl font-black font-heading text-white mt-1">Interactive Specs Stack</h3>
        <p className="text-xs text-slate-400 mt-1">Click to expand & inspect Helix Box specs</p>
      </div>

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative mx-auto cursor-pointer flex items-center justify-center",
          isExpanded ? "min-h-[460px]" : "min-h-[380px]",
          "w-full max-w-[1100px] transition-all duration-300",
          className
        )}
      >
        {products.map((product, index) => (
          <Card
            index={index}
            isExpanded={isExpanded}
            key={product.id}
            product={product}
            reducedMotion={reducedMotion}
            totalCards={products.length}
          />
        ))}
      </div>
    </div>
  );
}
