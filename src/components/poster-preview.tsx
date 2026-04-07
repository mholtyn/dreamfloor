import { useId } from "react";
import type { LineupSlot, PresetConfig, PresetId } from "@/types";
import { getPresetConfigById } from "../data/presets";
import { cn } from "@/lib/utils";
import {
  ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL,
  computeSlotTimeRange,
} from "@/utils/time";

type PosterPreviewProps = {
  presetId: PresetId;
  lineupSlots: LineupSlot[];
};

const POSTER_LINEUP_TYPOGRAPHY_COMPACT = {
  rowNumber: "text-[0.6rem] font-bold sm:text-xs",
  artistName: "text-[0.7rem] font-bold tracking-wide uppercase sm:text-sm lg:text-base",
  timeRange: "text-[0.6rem] font-semibold sm:text-xs",
} as const;

const POSTER_LINEUP_TYPOGRAPHY_MEDIUM = {
  rowNumber: "text-[0.65rem] font-bold sm:text-xs lg:text-sm",
  artistName:
    "text-[0.85rem] font-bold tracking-wide uppercase sm:text-base lg:text-lg",
  timeRange: "text-[0.65rem] font-semibold sm:text-xs lg:text-xs",
} as const;

const POSTER_LINEUP_TYPOGRAPHY_DUO = {
  rowNumber: "text-[0.68rem] font-bold sm:text-sm lg:text-base",
  artistName:
    "text-[0.95rem] font-bold tracking-wide uppercase sm:text-lg lg:text-[1.35rem]",
  timeRange: "text-[0.68rem] font-semibold sm:text-xs lg:text-sm",
} as const;

function getLineupTypographyClasses(slotCount: number) {
  if (slotCount === 2) {
    return POSTER_LINEUP_TYPOGRAPHY_DUO;
  }
  if (slotCount === 1) {
    return POSTER_LINEUP_TYPOGRAPHY_COMPACT;
  }
  if (slotCount === 3) {
    return POSTER_LINEUP_TYPOGRAPHY_MEDIUM;
  }
  return POSTER_LINEUP_TYPOGRAPHY_COMPACT;
}

function getTitleTextShadow(presetConfig: PresetConfig): string | undefined {
  switch (presetConfig.presetId) {
    case "neon":
      return `0 0 22px ${presetConfig.titleColor}`;
    case "pulse":
      return `0 0 20px ${presetConfig.titleColor}, 0 0 10px ${presetConfig.subtitleColor}`;
    case "industrial":
      return `0 0 12px ${presetConfig.accentColor}88, 0 0 28px ${presetConfig.accentColor}44`;
    case "dark-rave":
      return `0 0 12px ${presetConfig.titleColor}, 0 0 2px #fff`;
    default:
      return undefined;
  }
}

function PosterDecorativeOverlay({ presetConfig }: { presetConfig: PresetConfig }) {
  const grainFilterDomId = useId().replace(/:/g, "");
  const accent = presetConfig.accentColor;

  switch (presetConfig.overlayKind) {
    case "none":
      return null;
    case "industrial-rough":
      return (
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Grain */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.3] mix-blend-multiply" aria-hidden>
            <title>Industrial grain</title>
            <filter id={grainFilterDomId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="5" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${grainFilterDomId})`} />
          </svg>
          {/* Barbed wire — left edge */}
          <svg className="absolute left-1 top-0 h-full w-6" viewBox="0 0 24 500" preserveAspectRatio="none" aria-hidden>
            <title>Barbed wire</title>
            {/* Strand A — slight organic wave */}
            <path
              d="M11 0 C13 12,9 18,10 30 C11 42,14 48,12 60 C10 72,13 78,11 90 C9 102,12 108,10 120 C8 132,13 138,11 150 C13 162,9 168,10 180 C11 192,14 198,12 210 C10 222,13 228,11 240 C9 252,12 258,10 270 C12 282,9 288,11 300 C13 312,10 318,12 330 C10 342,13 348,11 360 C9 372,12 378,10 390 C11 402,14 408,12 420 C10 432,13 438,11 450 C13 462,9 470,10 480 C11 490,12 496,11 500"
              fill="none"
              stroke={accent}
              strokeWidth="1.2"
              opacity="0.6"
            />
            {/* Strand B — intertwined, opposite phase */}
            <path
              d="M13 0 C11 10,15 20,13 30 C11 40,9 50,12 60 C14 70,10 80,13 90 C15 100,11 110,13 120 C11 130,15 140,13 150 C11 160,9 170,12 180 C14 190,10 200,13 210 C15 220,11 230,13 240 C11 250,14 260,12 270 C10 280,14 290,12 300 C14 310,10 320,12 330 C14 340,11 350,13 360 C15 370,10 380,12 390 C14 400,10 410,12 420 C14 430,11 440,13 450 C11 460,14 470,12 480 C14 490,11 496,13 500"
              fill="none"
              stroke={accent}
              strokeWidth="1.0"
              opacity="0.45"
            />
            {/* Barbs — irregular angles and spacing */}
            <line x1="10" y1="22" x2="3" y2="17" stroke={accent} strokeWidth="0.8" opacity="0.7" />
            <line x1="10" y1="22" x2="18" y2="19" stroke={accent} strokeWidth="0.8" opacity="0.7" />
            <line x1="12" y1="55" x2="5" y2="60" stroke={accent} strokeWidth="0.8" opacity="0.55" />
            <line x1="12" y1="55" x2="19" y2="51" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="11" y1="95" x2="4" y2="90" stroke={accent} strokeWidth="0.9" opacity="0.65" />
            <line x1="11" y1="95" x2="20" y2="98" stroke={accent} strokeWidth="0.7" opacity="0.5" />
            <line x1="10" y1="130" x2="2" y2="134" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="10" y1="130" x2="17" y2="125" stroke={accent} strokeWidth="0.9" opacity="0.7" />
            <line x1="12" y1="168" x2="5" y2="163" stroke={accent} strokeWidth="0.8" opacity="0.55" />
            <line x1="12" y1="168" x2="21" y2="172" stroke={accent} strokeWidth="0.7" opacity="0.5" />
            <line x1="11" y1="205" x2="3" y2="210" stroke={accent} strokeWidth="0.9" opacity="0.65" />
            <line x1="11" y1="205" x2="18" y2="200" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="10" y1="248" x2="4" y2="243" stroke={accent} strokeWidth="0.8" opacity="0.7" />
            <line x1="10" y1="248" x2="19" y2="252" stroke={accent} strokeWidth="0.7" opacity="0.55" />
            <line x1="12" y1="285" x2="6" y2="290" stroke={accent} strokeWidth="0.9" opacity="0.6" />
            <line x1="12" y1="285" x2="20" y2="281" stroke={accent} strokeWidth="0.8" opacity="0.65" />
            <line x1="11" y1="325" x2="3" y2="320" stroke={accent} strokeWidth="0.8" opacity="0.55" />
            <line x1="11" y1="325" x2="18" y2="329" stroke={accent} strokeWidth="0.7" opacity="0.5" />
            <line x1="10" y1="365" x2="4" y2="370" stroke={accent} strokeWidth="0.9" opacity="0.7" />
            <line x1="10" y1="365" x2="19" y2="361" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="12" y1="408" x2="5" y2="403" stroke={accent} strokeWidth="0.8" opacity="0.55" />
            <line x1="12" y1="408" x2="21" y2="412" stroke={accent} strokeWidth="0.7" opacity="0.5" />
            <line x1="11" y1="452" x2="3" y2="448" stroke={accent} strokeWidth="0.9" opacity="0.65" />
            <line x1="11" y1="452" x2="17" y2="456" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="10" y1="488" x2="4" y2="492" stroke={accent} strokeWidth="0.8" opacity="0.55" />
            <line x1="10" y1="488" x2="20" y2="484" stroke={accent} strokeWidth="0.7" opacity="0.5" />
          </svg>
          {/* Barbed wire — right edge (mirrored but not identical) */}
          <svg className="absolute right-1 top-0 h-full w-6" viewBox="0 0 24 500" preserveAspectRatio="none" aria-hidden>
            <title>Barbed wire</title>
            <path
              d="M12 0 C10 14,14 22,12 35 C10 48,14 54,12 68 C10 82,13 86,11 100 C9 114,14 120,12 135 C14 148,10 155,12 168 C10 182,14 188,12 202 C10 216,13 220,11 235 C9 248,13 256,11 268 C13 282,10 290,12 302 C10 316,14 322,12 335 C14 348,10 355,12 368 C10 382,13 388,11 402 C13 416,10 422,12 435 C14 448,11 455,13 468 C11 480,13 490,12 500"
              fill="none"
              stroke={accent}
              strokeWidth="1.2"
              opacity="0.6"
            />
            <path
              d="M14 0 C12 12,16 24,14 35 C12 46,10 56,13 68 C15 80,11 88,13 100 C11 112,15 122,13 135 C15 146,10 158,12 168 C14 178,10 190,13 202 C15 214,11 224,13 235 C11 246,14 258,12 268 C14 280,10 292,12 302 C14 312,11 324,13 335 C15 346,10 358,12 368 C14 378,11 390,13 402 C11 414,14 424,12 435 C10 446,14 458,12 468 C14 478,12 492,13 500"
              fill="none"
              stroke={accent}
              strokeWidth="1.0"
              opacity="0.45"
            />
            <line x1="12" y1="28" x2="5" y2="24" stroke={accent} strokeWidth="0.8" opacity="0.65" />
            <line x1="12" y1="28" x2="20" y2="32" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="13" y1="72" x2="6" y2="76" stroke={accent} strokeWidth="0.9" opacity="0.7" />
            <line x1="13" y1="72" x2="21" y2="68" stroke={accent} strokeWidth="0.7" opacity="0.55" />
            <line x1="11" y1="110" x2="3" y2="106" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="11" y1="110" x2="18" y2="114" stroke={accent} strokeWidth="0.8" opacity="0.65" />
            <line x1="12" y1="152" x2="4" y2="157" stroke={accent} strokeWidth="0.9" opacity="0.55" />
            <line x1="12" y1="152" x2="20" y2="148" stroke={accent} strokeWidth="0.7" opacity="0.7" />
            <line x1="13" y1="192" x2="6" y2="188" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="13" y1="192" x2="22" y2="196" stroke={accent} strokeWidth="0.8" opacity="0.5" />
            <line x1="11" y1="230" x2="3" y2="234" stroke={accent} strokeWidth="0.9" opacity="0.65" />
            <line x1="11" y1="230" x2="19" y2="226" stroke={accent} strokeWidth="0.7" opacity="0.55" />
            <line x1="12" y1="275" x2="5" y2="271" stroke={accent} strokeWidth="0.8" opacity="0.7" />
            <line x1="12" y1="275" x2="21" y2="279" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="13" y1="318" x2="4" y2="322" stroke={accent} strokeWidth="0.9" opacity="0.55" />
            <line x1="13" y1="318" x2="19" y2="314" stroke={accent} strokeWidth="0.7" opacity="0.65" />
            <line x1="11" y1="358" x2="3" y2="354" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="11" y1="358" x2="20" y2="362" stroke={accent} strokeWidth="0.8" opacity="0.5" />
            <line x1="12" y1="398" x2="5" y2="402" stroke={accent} strokeWidth="0.9" opacity="0.7" />
            <line x1="12" y1="398" x2="18" y2="394" stroke={accent} strokeWidth="0.7" opacity="0.55" />
            <line x1="13" y1="442" x2="6" y2="438" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <line x1="13" y1="442" x2="22" y2="446" stroke={accent} strokeWidth="0.8" opacity="0.65" />
            <line x1="11" y1="480" x2="4" y2="484" stroke={accent} strokeWidth="0.9" opacity="0.55" />
            <line x1="11" y1="480" x2="19" y2="476" stroke={accent} strokeWidth="0.7" opacity="0.5" />
          </svg>
          {/* Red glow from center */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(ellipse 70% 45% at 50% 40%, ${accent}28, transparent 65%)`,
            }}
          />
          {/* Dark vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </div>
      );
    case "prime-flyer-slab": {
      const primeGrainId = `prime-grain-${grainFilterDomId}`;
      return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Complex organic blob cluster — right side */}
          <svg
            className="absolute -right-[10%] top-[5%] h-[80%] w-[70%] opacity-[0.14]"
            viewBox="0 0 250 350"
            aria-hidden
          >
            <title>Decorative shapes</title>
            <defs>
              <linearGradient id="prime-blob-a" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="60%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="prime-blob-b" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#312e81" stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id="prime-blob-c" cx="0.4" cy="0.35" r="0.65">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3" />
              </radialGradient>
              <linearGradient id="prime-blob-d" x1="0.2" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Main large blob */}
            <path
              d="M130 15 C170 8,210 45,215 90 C220 135,240 160,225 205 C210 250,185 280,145 295 C105 310,65 290,45 255 C25 220,8 185,15 145 C22 105,35 75,60 50 C85 25,100 22,130 15Z"
              fill="url(#prime-blob-a)"
            />
            {/* Overlapping secondary blob — offset, different shape */}
            <path
              d="M160 55 C195 48,225 80,228 120 C231 160,220 200,195 225 C170 250,135 245,115 220 C95 195,85 160,95 125 C105 90,130 62,160 55Z"
              fill="url(#prime-blob-b)"
              opacity="0.6"
            />
            {/* Small accent blob — top */}
            <path
              d="M90 5 C110 -2,130 15,125 35 C120 55,100 62,82 52 C64 42,70 12,90 5Z"
              fill="url(#prime-blob-c)"
              opacity="0.5"
            />
            {/* Mid-left tendril blob — adds asymmetry */}
            <path
              d="M30 120 C15 135,5 165,18 195 C31 225,55 218,60 192 C65 166,50 140,30 120Z"
              fill="url(#prime-blob-d)"
              opacity="0.45"
            />
            {/* Bottom-right organic smear */}
            <path
              d="M175 260 C205 255,235 275,232 305 C229 335,200 345,180 330 C160 315,148 280,175 260Z"
              fill="url(#prime-blob-c)"
              opacity="0.35"
            />
            {/* Floating dot-blobs */}
            <ellipse cx="55" cy="200" rx="18" ry="22" fill="#7c3aed" opacity="0.3" />
            <ellipse cx="200" cy="310" rx="12" ry="15" fill="#4f46e5" opacity="0.25" />
            <circle cx="38" cy="80" r="8" fill="#8b5cf6" opacity="0.3" />
            <circle cx="210" cy="42" r="6" fill="#6d28d9" opacity="0.2" />
            <ellipse cx="145" cy="330" rx="10" ry="7" fill="#a78bfa" opacity="0.2" />
          </svg>
          {/* Secondary small blob cluster — bottom-left corner */}
          <svg
            className="absolute -bottom-[5%] -left-[8%] h-[30%] w-[35%] opacity-[0.08]"
            viewBox="0 0 120 120"
            aria-hidden
          >
            <title>Secondary blobs</title>
            <path
              d="M60 10 C85 5,110 30,105 58 C100 86,80 110,55 108 C30 106,8 82,12 55 C16 28,35 15,60 10Z"
              fill="url(#prime-blob-b)"
            />
            <circle cx="90" cy="25" r="14" fill="#8b5cf6" opacity="0.5" />
            <ellipse cx="30" cy="95" rx="16" ry="12" fill="#6d28d9" opacity="0.4" />
          </svg>
          {/* Flowing accent lines — complex, overlapping, varied stroke */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden>
            <title>Accent lines</title>
            {/* Long sweeping curve — top left to mid right */}
            <path
              d="M-10 30 C30 18,65 55,110 38 C155 21,185 52,230 40 C275 28,295 55,310 48"
              fill="none"
              stroke="#5b21b6"
              strokeWidth="1.4"
              opacity="0.35"
            />
            {/* Parallel echo of first line — slightly offset */}
            <path
              d="M-5 42 C35 32,70 62,115 48 C160 34,188 58,235 50"
              fill="none"
              stroke="#5b21b6"
              strokeWidth="0.7"
              opacity="0.2"
            />
            {/* Bottom flowing curve */}
            <path
              d="M-15 385 C25 372,60 398,110 385 C160 370,200 393,250 382 C280 376,300 388,315 383"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.2"
              opacity="0.28"
            />
            {/* Left-side diagonal sweep — extends beyond poster edges */}
            <path
              d="M45 -30 C30 20,38 70,22 120 C6 170,25 220,12 275 C-1 330,20 380,10 430"
              fill="none"
              stroke="#6d28d9"
              strokeWidth="1.1"
              opacity="0.28"
            />
            {/* Short left-side accent — starts beyond poster */}
            <path
              d="M-40 148 C-20 138,5 152,28 140 C52 128,78 142,92 135"
              fill="none"
              stroke="#5b21b6"
              strokeWidth="0.8"
              opacity="0.18"
            />
            {/* Loose scribble near bottom-left — starts beyond poster */}
            <path
              d="M-35 315 C-10 302,20 318,48 305 C75 292,108 312,125 302"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="0.7"
              opacity="0.15"
            />
          </svg>
          {/* Grain overlay */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.09] mix-blend-overlay" aria-hidden>
            <title>Grain</title>
            <filter id={primeGrainId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${primeGrainId})`} />
          </svg>
        </div>
      );
    }
    case "swiss-frame":
      return (
        <div className="pointer-events-none absolute inset-2 z-0 border border-white/12" aria-hidden />
      );
    case "sunset-blobs":
      return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[18%] left-1/2 size-28 -translate-x-1/2 rounded-full border-2 border-amber-100/85 bg-yellow-200/55 shadow-[0_0_60px_rgba(253,224,71,0.55)]" />
          <div className="absolute top-[26%] left-1/2 h-8 w-44 -translate-x-1/2 rounded-full border border-amber-100/70 bg-yellow-100/35" />
          <div className="absolute right-0 bottom-[33%] left-0 h-px bg-amber-50/70" />
        </div>
      );
    case "pulse-film-grain":
      return (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.18] mix-blend-overlay">
          <svg className="h-full w-full" aria-hidden>
            <title>Grain</title>
            <filter id={grainFilterDomId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="4"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${grainFilterDomId})`} />
          </svg>
        </div>
      );
    case "neon-pulse-dots":
      return (
        <div className="pointer-events-none absolute inset-0 z-0">
          <span
            className="absolute top-4 right-5 size-2 animate-pulse rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 14px ${accent}` }}
          />
          <span
            className="absolute bottom-6 left-4 size-1.5 animate-pulse rounded-full"
            style={{
              backgroundColor: presetConfig.secondaryTextColor,
              animationDelay: "0.4s",
              boxShadow: `0 0 10px ${presetConfig.secondaryTextColor}`,
            }}
          />
        </div>
      );
    case "retro-horizontal-bars":
      return (
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between">
          <div className="h-2 w-full" style={{ backgroundColor: presetConfig.titleColor }} />
          <div className="h-2 w-full bg-white/90" />
        </div>
      );
    case "dark-rave-spotlight":
      return (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 28%, rgba(255,0,0,0.22), transparent 65%)",
          }}
        />
      );
    case "gradient-soft-vignette":
      return (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(15,23,42,0.35) 100%)",
          }}
        />
      );
    case "gradient-diagonal":
      return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Pretitle — top-right corner */}
          <p
            className="absolute top-8 right-5 text-[0.85rem] font-black uppercase tracking-[0.3em] text-white/50 sm:top-11 sm:right-7 sm:text-[1.1rem]"
          >
            {presetConfig.pretitleLabel}
          </p>
          {/* Subtitle — top-left corner */}
          <p
            className="absolute top-5 left-5 text-[0.42rem] font-medium uppercase tracking-[0.25em] text-white/55 sm:top-7 sm:left-7 sm:text-[0.48rem]"
          >
            presented by dreamfloor.app
          </p>
          {/* Centered DREAMFLOOR title */}
          <div className="absolute inset-x-0 top-14 flex justify-center sm:top-18">
            <h2 className="text-[1.8rem] font-black uppercase leading-none tracking-tight text-white sm:text-[2.4rem] lg:text-[2.9rem]">
              Dreamfloor
            </h2>
          </div>
          {/* Soft mesh blobs */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.18]" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden>
            <title>Mesh</title>
            <defs>
              <radialGradient id="grad-mesh-a" cx="0.2" cy="0.25" r="0.45">
                <stop offset="0%" stopColor="#a3e635" stopOpacity="0.35" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-mesh-b" cx="0.8" cy="0.7" r="0.4">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.5" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-mesh-c" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="70" cy="100" rx="90" ry="80" fill="url(#grad-mesh-a)" />
            <ellipse cx="230" cy="280" rx="80" ry="70" fill="url(#grad-mesh-b)" />
            <ellipse cx="150" cy="200" rx="100" ry="90" fill="url(#grad-mesh-c)" />
          </svg>
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 35%, rgba(15,23,42,0.3) 100%)",
            }}
          />
        </div>
      );
    case "minimal-editorial":
      return (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 6px)`,
          }}
        />
      );
    default:
      return null;
  }
}

function renderTitleHeading(
  presetConfig: PresetConfig,
  titleTextShadow: string | undefined,
) {
  const colorStyle = { color: presetConfig.titleColor, textShadow: titleTextShadow };

  if (presetConfig.titleLayoutKind === "single-line-stamp-industrial") {
    return (
      <h1 className={cn(presetConfig.titleClassName)} style={colorStyle}>
        Dreamfloor
      </h1>
    );
  }

  return (
    <h1 className={cn(presetConfig.titleClassName)} style={colorStyle}>
      Dream
      <br />
      Floor
    </h1>
  );
}

function getLineupItemClassNames(
  presetConfig: PresetConfig,
  isDuoLineup: boolean,
  isFewSlots: boolean,
): string {
  const flexBasis = isDuoLineup
    ? "flex min-h-0 flex-1 flex-col justify-center last:pb-0 sm:pb-2"
    : isFewSlots
      ? "flex flex-col justify-center last:pb-0 sm:pb-2"
      : "flex min-h-0 flex-1 flex-col justify-center last:pb-0 sm:pb-2";

  switch (presetConfig.lineupRhythmKind) {
    case "industrial-left-rail":
      return cn(flexBasis, "mb-3 border-b-0 border-l-2 py-1 pl-3 last:mb-0");
    case "swiss-thick-top-rule":
      return cn(flexBasis, "border-t-2 border-white/80 pt-2 first:border-t-0 first:pt-0");
    case "sunset-pill-rows":
      return cn(
        flexBasis,
        "mb-2 rounded-xl bg-white/35 px-2 py-2 shadow-sm ring-1 ring-orange-900/10 last:mb-0",
      );
    case "pulse-loose-blocks":
      return cn(
        flexBasis,
        "mb-3 rounded-lg border border-white/10 bg-white/5 px-2 py-2 last:mb-0",
      );
    case "retro-heavy-underline":
      return cn(flexBasis, "border-b-4 border-current pb-2 last:border-b-0");
    case "minimal-hairline":
      return cn(flexBasis, "border-b border-black/20 pb-2 last:border-b-0");
    case "prime-arrow-list":
      return cn(flexBasis, "mb-2.5 last:mb-0");
    case "gradient-diagonal-list":
      return cn(flexBasis, "min-h-0 flex-1 mb-1.5 last:mb-0");
    case "default-underline":
    default:
      return cn(
        flexBasis,
        "border-b pb-1.5 last:border-b-0",
        isDuoLineup ? "min-h-0 flex-1" : "",
      );
  }
}

function getLineupItemBorderColor(presetConfig: PresetConfig): string {
  if (presetConfig.lineupRhythmKind === "industrial-left-rail") {
    return presetConfig.accentColor;
  }
  if (
    presetConfig.lineupRhythmKind === "default-underline" ||
    presetConfig.lineupRhythmKind === "retro-heavy-underline"
  ) {
    return `${presetConfig.textColor}1F`;
  }
  if (presetConfig.lineupRhythmKind === "minimal-hairline") {
    return "rgba(0,0,0,0.12)";
  }
  return "transparent";
}

export function PosterPreview({ presetId, lineupSlots }: PosterPreviewProps) {
  const presetConfig = getPresetConfigById(presetId);
  const hasAnyArtist = lineupSlots.some((slot) => slot.artistName.trim().length > 0);
  const slotCount = lineupSlots.length;
  const isFewSlots = slotCount <= 2;
  const isDuoLineup = slotCount === 2;
  const lineupTypographyClasses = getLineupTypographyClasses(slotCount);
  const titleTextShadow = getTitleTextShadow(presetConfig);

  const lineupListLayout = isDuoLineup
    ? "flex min-h-0 flex-1 flex-col justify-between gap-0 py-3 sm:py-5"
    : isFewSlots
      ? "flex min-h-0 flex-1 flex-col justify-center gap-6 sm:gap-8"
      : "flex min-h-0 flex-1 flex-col";

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Live Preview</h2>
      <div
        id="poster-preview"
        className={cn(
          "relative mx-auto aspect-3/4 w-full max-w-[280px] overflow-hidden rounded-lg shadow-2xl sm:max-w-[384px] lg:mx-0 lg:max-w-[448px]",
          presetConfig.posterRootClassName,
        )}
        style={{
          background: presetConfig.background,
          color: presetConfig.textColor,
        }}
      >
        <PosterDecorativeOverlay presetConfig={presetConfig} />
        <div
          className={cn(
            "relative z-1 flex h-full min-h-0 flex-col p-5 sm:p-7 lg:p-9",
            presetConfig.posterInnerClassName,
          )}
        >
          <div className={cn("shrink-0", presetConfig.titleBlockClassName)}>
            {presetConfig.presetId === "prime" ? (
              <div className="text-right">
                <p
                  className="text-[0.5rem] font-semibold uppercase tracking-[0.35em] opacity-60 sm:text-[0.58rem]"
                  style={{ color: presetConfig.accentColor }}
                >
                  {presetConfig.pretitleLabel}
                </p>
                <div className="mt-2">
                  {renderTitleHeading(presetConfig, titleTextShadow)}
                </div>
                <p
                  className="mt-2 text-[0.42rem] font-medium uppercase tracking-[0.3em] sm:text-[0.5rem]"
                  style={{ color: presetConfig.secondaryTextColor }}
                >
                  presented by dreamfloor.app
                </p>
              </div>
            ) : (
              <>
                {presetConfig.pretitleLabel ? (
                  <p
                    className="mb-2 text-[0.5rem] font-semibold uppercase tracking-[0.28em] opacity-70 sm:text-[0.58rem]"
                    style={{ color: presetConfig.subtitleColor }}
                  >
                    {presetConfig.pretitleLabel}
                  </p>
                ) : null}
                {renderTitleHeading(presetConfig, titleTextShadow)}
                <p
                  className={cn(presetConfig.subtitleClassName)}
                  style={{ color: presetConfig.subtitleColor }}
                >
                  Presented by Dreamfloor.app
                </p>
              </>
            )}
          </div>

          <div className={cn(
            "mt-4 flex min-h-0 flex-col",
            presetConfig.overlayKind === "gradient-diagonal" ? "mt-24 flex-1 sm:mt-32 lg:mt-36" : "flex-1",
          )}>
            {hasAnyArtist ? (
              <ul className={cn(lineupListLayout, presetConfig.lineupListClassName)}>
                {lineupSlots.map((slot, slotIndex) => {
                  const displayName = slot.artistName.trim() || "TBA";
                  const { startTimeLabel, endTimeLabel } = computeSlotTimeRange(
                    slotIndex,
                    lineupSlots,
                  );
                  const slotNumber = String(slotIndex + 1).padStart(2, "0");
                  const isAllNightLongSlot =
                    slot.durationMinutes === ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL;
                  const borderColor = getLineupItemBorderColor(presetConfig);

                  return (
                    <li
                      key={slotIndex}
                      className={getLineupItemClassNames(
                        presetConfig,
                        isDuoLineup,
                        isFewSlots,
                      )}
                      style={{
                        borderBottomColor:
                          presetConfig.lineupRhythmKind === "default-underline"
                            ? borderColor
                            : undefined,
                        borderLeftColor:
                          presetConfig.lineupRhythmKind === "industrial-left-rail"
                            ? borderColor
                            : undefined,
                        borderTopColor:
                          presetConfig.lineupRhythmKind === "swiss-thick-top-rule"
                            ? "rgba(255,255,255,0.85)"
                            : undefined,
                      }}
                    >
                      {presetConfig.lineupRhythmKind === "gradient-diagonal-list" ? (
                        <div className={cn(
                          "flex flex-col",
                          slotIndex % 2 === 0 ? "items-start" : "items-end",
                        )}>
                          <span
                            className="font-extrabold uppercase tracking-wider"
                            style={{
                              color: presetConfig.textColor,
                              transform: slotIndex % 2 === 0 ? "skewX(-4deg)" : "skewX(4deg)",
                              display: "inline-block",
                              fontSize: `${Math.max(1.6 - 2 * 0.25, 1.6 - slotIndex * 0.25)}rem`,
                            }}
                          >
                            {displayName}
                          </span>
                          <span
                            className="font-sans text-[0.5rem] font-medium uppercase tabular-nums tracking-widest opacity-50 sm:text-[0.6rem]"
                            style={{ color: presetConfig.secondaryTextColor }}
                          >
                            {isAllNightLongSlot
                              ? "ALL NIGHT"
                              : `${startTimeLabel}–${endTimeLabel}`}
                          </span>
                        </div>
                      ) : presetConfig.lineupRhythmKind === "prime-arrow-list" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-[1rem] font-bold uppercase tracking-wide sm:text-[1.2rem] lg:text-xl">
                            {displayName}
                          </span>
                          <span
                            className="flex-1 border-b border-dotted opacity-35"
                            style={{ borderColor: presetConfig.textColor }}
                          />
                          <span
                            className="shrink-0 font-sans text-[0.6rem] font-semibold tabular-nums tracking-wider sm:text-[0.72rem]"
                            style={{ color: presetConfig.textColor, opacity: 0.7 }}
                          >
                            {isAllNightLongSlot
                              ? "ALL NIGHT"
                              : `${startTimeLabel}–${endTimeLabel}`}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className={cn(
                            "flex items-baseline gap-2",
                            !presetConfig.showLineupNumbers && "justify-center",
                          )}>
                            {presetConfig.showLineupNumbers && (
                              <span
                                className={lineupTypographyClasses.rowNumber}
                                style={{ color: presetConfig.accentColor }}
                              >
                                {slotNumber}
                              </span>
                            )}
                            <span className={lineupTypographyClasses.artistName}>
                              {displayName}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "mt-0.5",
                              presetConfig.showLineupNumbers ? "pl-5 sm:pl-6" : "text-center",
                              lineupTypographyClasses.timeRange,
                            )}
                            style={{ color: presetConfig.secondaryTextColor }}
                          >
                            {isAllNightLongSlot
                              ? "All night long"
                              : `${startTimeLabel} - ${endTimeLabel}`}
                          </p>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="pt-6 text-center text-xs opacity-50">
                Add artists to see your lineup
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
