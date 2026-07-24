import React from 'react';

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-[#A8F1F7] to-slate-200 bg-[length:200%_100%] animate-shiny-text inline-block ${
        disabled ? '' : 'animate-shiny-text'
      } ${className}`}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
