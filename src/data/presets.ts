import type { PresetConfig } from "@/types";

export const PRESET_CONFIGS: PresetConfig[] = [
  {
    presetId: "prime",
    displayName: "Prime",
    background: "#b8b5b0",
    textColor: "#1a1a1a",
    titleColor: "#1a1a1a",
    subtitleColor: "#5b21b6",
    accentColor: "#5b21b6",
    secondaryTextColor: "#52525b",
    posterRootClassName: "rounded-lg shadow-2xl",
    posterInnerClassName: "",
    titleBlockClassName: "",
    titleClassName:
      "font-prime text-[1.9rem] font-black uppercase leading-[0.92] tracking-tight sm:text-[2.65rem] lg:text-[3.2rem]",
    subtitleClassName:
      "mt-3 text-[0.5rem] font-semibold uppercase tracking-[0.35em] sm:text-[0.58rem]",
    lineupListClassName: "mt-4 font-prime-lineup",
    overlayKind: "prime-flyer-slab",
    titleLayoutKind: "slab-band-prime",
    lineupRhythmKind: "prime-arrow-list",
    showLineupNumbers: false,
    pretitleLabel: "Nachtprogramm",
  },
  {
    presetId: "minimal",
    displayName: "Minimal",
    background: "#FFFFFF",
    textColor: "#000000",
    titleColor: "#000000",
    subtitleColor: "#333333",
    accentColor: "#333333",
    secondaryTextColor: "#666666",
    posterRootClassName: "rounded-none border-2 border-black shadow-none",
    posterInnerClassName: "justify-between",
    titleBlockClassName: "border-b-2 border-black pb-4",
    titleClassName:
      "text-2xl font-light uppercase leading-none tracking-[0.35em] sm:text-3xl lg:text-4xl",
    subtitleClassName:
      "mt-3 text-[0.55rem] font-normal normal-case tracking-wide opacity-70 sm:text-xs",
    lineupListClassName: "pt-2",
    overlayKind: "minimal-editorial",
    titleLayoutKind: "minimal-swiss-clean",
    lineupRhythmKind: "minimal-hairline",
    showLineupNumbers: true,
    pretitleLabel: "Editorial",
  },
  {
    presetId: "industrial",
    displayName: "Industrial",
    background: "#080808",
    textColor: "#e4e4e7",
    titleColor: "#ef4444",
    subtitleColor: "#a1a1aa",
    accentColor: "#dc2626",
    secondaryTextColor: "#d4d4d8",
    posterRootClassName:
      "rounded-none border-2 border-neutral-800 shadow-[inset_0_0_120px_rgba(220,38,38,0.08)]",
    posterInnerClassName: "items-center text-center",
    titleBlockClassName: "",
    titleClassName:
      "font-industrial text-[2.2rem] font-bold uppercase leading-[0.88] tracking-[0.08em] sm:text-[3.2rem] lg:text-[3.8rem]",
    subtitleClassName:
      "mt-3 text-[0.5rem] font-semibold uppercase tracking-[0.25em] text-red-400/70 sm:text-[0.6rem]",
    lineupListClassName: "mt-6 w-full",
    overlayKind: "industrial-rough",
    titleLayoutKind: "stacked-brutal-default",
    lineupRhythmKind: "default-underline",
    showLineupNumbers: false,
    pretitleLabel: "Warehouse ritual",
  },
  {
    presetId: "sunset",
    displayName: "Sunset",
    background:
      "linear-gradient(180deg, #7dd3fc 0%, #fde047 38%, #fb923c 72%, #f97316 100%)",
    textColor: "#1e293b",
    titleColor: "#0f172a",
    subtitleColor: "#9a3412",
    accentColor: "#ea580c",
    secondaryTextColor: "#78350f",
    posterRootClassName: "rounded-[1.75rem] shadow-xl",
    posterInnerClassName: "",
    titleBlockClassName: "relative z-[2]",
    titleClassName:
      "text-[1.35rem] font-black uppercase leading-none tracking-tight text-slate-900 sm:text-[1.85rem] lg:text-[2.2rem]",
    subtitleClassName:
      "mt-3 max-w-[12rem] text-[0.55rem] font-bold uppercase leading-snug tracking-wide text-amber-950 sm:text-[0.65rem]",
    lineupListClassName: "mt-5",
    overlayKind: "sunset-blobs",
    titleLayoutKind: "sunset-badge-stack",
    lineupRhythmKind: "default-underline",
    showLineupNumbers: true,
    pretitleLabel: "Open air",
  },
  {
    presetId: "gradient",
    displayName: "Gradient",
    background: "linear-gradient(135deg, #667EEA, #764BA2 50%, #F093FB)",
    textColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    subtitleColor: "#F0F0F0",
    accentColor: "#FFE66D",
    secondaryTextColor: "#F0F0F0",
    posterRootClassName: "rounded-2xl",
    posterInnerClassName: "",
    titleBlockClassName: "",
    titleClassName:
      "text-[1.7rem] font-black uppercase leading-none tracking-tight sm:text-[2.5rem] lg:text-[3rem]",
    subtitleClassName:
      "mt-2 text-[0.55rem] font-semibold uppercase tracking-[0.22em] opacity-90 sm:text-[0.72rem]",
    lineupListClassName: "",
    overlayKind: "gradient-soft-vignette",
    titleLayoutKind: "gradient-airy-stack",
    lineupRhythmKind: "default-underline",
    showLineupNumbers: true,
    pretitleLabel: "Dream session",
  },
];

export function getPresetConfigById(presetId: string): PresetConfig {
  return (
    PRESET_CONFIGS.find((preset) => preset.presetId === presetId) ??
    PRESET_CONFIGS[0]
  );
}
