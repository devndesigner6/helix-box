"use client";

/**
 * @author: @dorianbaffier
 * @description: Official KokonutUI Particle Button
 * @version: 1.0.0
 * @website: https://kokonutui.com
 */

import { Smartphone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { type RefObject, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onSuccess?: () => void;
  successDuration?: number;
  href?: string;
}

function SuccessParticles({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(12)].map((_, i) => (
        <motion.div
          animate={{
            scale: [0, 1.5, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 60 + 20)],
            y: [0, -Math.random() * 60 - 20],
          }}
          className="fixed h-2 w-2 rounded-full bg-[#A8F1F7] shadow-[0_0_10px_#A8F1F7] z-50 pointer-events-none"
          initial={{
            scale: 0,
            x: 0,
            y: 0,
          }}
          key={i}
          style={{ left: centerX, top: centerY }}
          transition={{
            duration: 0.7,
            delay: i * 0.04,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

export default function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  className,
  href,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowParticles(true);
    if (onClick) onClick(e);
    if (onSuccess) onSuccess();

    if (href) {
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }

    setTimeout(() => {
      setShowParticles(false);
    }, successDuration);
  };

  return (
    <>
      {showParticles && (
        <SuccessParticles
          buttonRef={buttonRef as RefObject<HTMLButtonElement>}
        />
      )}
      <button
        className={cn(
          "agenta-primary-btn flex items-center gap-3 text-base font-bold shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95",
          showParticles && "scale-95",
          className
        )}
        onClick={handleClick}
        ref={buttonRef}
        {...props}
      >
        <Smartphone className="w-5 h-5 text-slate-900" />
        <span>{children}</span>
      </button>
    </>
  );
}
