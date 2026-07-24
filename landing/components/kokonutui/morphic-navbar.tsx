"use client";

import clsx from "clsx";
import { useState } from "react";

interface NavItem {
  name: string;
}

interface MorphicNavbarProps {
  items?: Record<string, NavItem>;
  defaultPath?: string;
  className?: string;
}

const DEFAULT_NAV_ITEMS: Record<string, NavItem> = {
  "#": { name: "Future of Mobile" },
  "#features": { name: "Capabilities" },
  "#x402": { name: "x402 Protocol" },
  "#pricing": { name: "Pricing" },
};

export function MorphicNavbar({
  items = DEFAULT_NAV_ITEMS,
  defaultPath = "#",
  className,
}: MorphicNavbarProps) {
  const [activePath, setActivePath] = useState(defaultPath);

  const isActiveLink = (path: string) => {
    return activePath === path;
  };

  return (
    <nav className={clsx("mx-auto max-w-4xl px-4 py-2", className)}>
      <div className="flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1 flex items-center justify-between overflow-hidden rounded-full shadow-lg">
          {Object.entries(items).map(([path, { name }], index, array) => {
            const isActive = isActiveLink(path);
            const isFirst = index === 0;
            const isLast = index === array.length - 1;

            return (
              <a
                className={clsx(
                  "flex items-center justify-center px-4 py-1.5 text-xs transition-all duration-300 font-semibold cursor-pointer",
                  isActive
                    ? "bg-[#A8F1F7] text-slate-950 rounded-full font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                )}
                href={path}
                key={path}
                onClick={() => setActivePath(path)}
              >
                {name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MorphicNavbar;
