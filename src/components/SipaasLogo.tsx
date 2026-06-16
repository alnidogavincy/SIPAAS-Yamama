import React from 'react';

interface SipaasLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  textColor?: string;
  subtextColor?: string;
}

export default function SipaasLogo({
  className = '',
  size = 48,
  withText = false,
  textColor = 'text-amber-300',
  subtextColor = 'text-emerald-300'
}: SipaasLogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`} id="sipaas-logo-container">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
        id="sipaas-logo-svg"
      >
        <defs>
          {/* Real metallic gold color gradient */}
          <linearGradient id="gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CA9E3C" />
            <stop offset="20%" stopColor="#FFF3A8" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="60%" stopColor="#FFF9D0" />
            <stop offset="80%" stopColor="#B28F30" />
            <stop offset="100%" stopColor="#FFE58F" />
          </linearGradient>

          {/* Subtly darker gold contrast for outlines and shadows */}
          <linearGradient id="gold-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B38627" />
            <stop offset="50%" stopColor="#8C6410" />
            <stop offset="100%" stopColor="#5E4307" />
          </linearGradient>

          {/* Drop shadow filter to give that premium embossed look */}
          <filter id="logo-emboss" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter="url(#logo-emboss)">
          {/* =========================================================================
              1. GRADUATION CAP (TOP PIECE)
              ========================================================================= */}
          {/* Main Rhombus/Diamond Board */}
          <path
            d="M 100 25 L 175 52 L 100 79 L 25 52 Z"
            fill="url(#gold-grad)"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Under-cap support / chevron shadow */}
          <path
            d="M 68 63 L 68 76 L 100 90 L 132 76 L 132 63 L 100 74 Z"
            fill="url(#gold-grad)"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Tassel String & Tassel Bulb */}
          <path
            d="M 100 52 C 122 55 144 60 148 64 L 148 88"
            stroke="url(#gold-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tassel Cap & Fringe */}
          <path
            d="M 144 88 H 152 L 148 100 Z"
            fill="url(#gold-grad)"
            stroke="url(#gold-dark-grad)"
            strokeWidth="0.5"
          />

          {/* =========================================================================
              2. OPEN BOOK (BOTTOM LAYERED STEPPED PAGES)
              ========================================================================= */}
          {/* Central spine separator */}
          <rect
            x="98.5"
            y="98"
            width="3"
            height="62"
            rx="1.5"
            fill="url(#gold-grad)"
          />

          {/* LAYER 1: Innermost Page */}
          <path
            d="M 96 100 C 76 96 58 100 48 104 V 140 C 58 136 76 132 96 136 Z"
            fill="url(#gold-grad)"
            opacity="0.9"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1"
          />
          <path
            d="M 104 100 C 124 96 142 100 152 104 V 140 C 142 136 124 132 104 136 Z"
            fill="url(#gold-grad)"
            opacity="0.9"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1"
          />

          {/* LAYER 2: Middle Page */}
          <path
            d="M 96 108 C 72 104 52 108 42 112 V 148 C 52 144 72 140 96 144 Z"
            fill="url(#gold-grad)"
            opacity="0.8"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1"
          />
          <path
            d="M 104 108 C 128 104 148 108 158 112 V 148 C 148 144 128 140 104 144 Z"
            fill="url(#gold-grad)"
            opacity="0.8"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1"
          />

          {/* LAYER 3: Outermost Page */}
          <path
            d="M 96 116 C 68 112 46 116 36 120 V 156 C 46 152 68 148 96 152 Z"
            fill="url(#gold-grad)"
            opacity="0.75"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1"
          />
          <path
            d="M 104 116 C 132 112 154 116 164 120 V 156 C 154 152 132 148 104 152 Z"
            fill="url(#gold-grad)"
            opacity="0.75"
            stroke="url(#gold-dark-grad)"
            strokeWidth="1"
          />

          {/* Outer thick cover base outline */}
          <path
            d="M 30 118 V 162 C 45 158 70 156 96 160 V 157.5"
            stroke="url(#gold-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 170 118 V 162 C 155 158 130 156 104 160 V 157.5"
            stroke="url(#gold-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>

      {withText && (
        <div className="flex flex-col select-none leading-none">
          <span className={`font-serif tracking-widest font-bold text-xl block ${textColor}`}>
            SIPAAS
          </span>
          <span className={`text-[9px] tracking-widest block font-mono mt-0.5 text-opacity-80 ${subtextColor}`}>
            PP YAMAMA
          </span>
        </div>
      )}
    </div>
  );
}
