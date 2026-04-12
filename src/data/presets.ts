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
    posterRootClassName: "rounded-none shadow-2xl",
    posterInnerClassName: "",
    titleBlockClassName: "",
    titleClassName:
      "font-prime text-[3.2rem] font-black uppercase leading-[0.92] tracking-tight",
    subtitleClassName:
      "mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.35em]",
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
      "text-4xl font-light uppercase leading-none tracking-[0.35em]",
    subtitleClassName:
      "mt-3 text-xs font-normal normal-case tracking-wide opacity-70",
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
      "font-industrial text-[3.8rem] font-bold uppercase leading-[0.88] tracking-[0.08em]",
    subtitleClassName:
      "mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-red-400/70",
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
    textColor: "#0a0a0a",
    titleColor: "#0a0a0a",
    subtitleColor: "#0a0a0a",
    accentColor: "#0a0a0a",
    secondaryTextColor: "#0a0a0a",
    posterRootClassName: "rounded-none shadow-xl",
    posterInnerClassName: "items-center text-center",
    titleBlockClassName: "",
    titleClassName:
      "text-[2.6rem] font-bold uppercase leading-none tracking-tight",
    subtitleClassName:
      "mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em]",
    lineupListClassName: "mt-5 w-full",
    overlayKind: "sunset-blobs",
    titleLayoutKind: "sunset-badge-stack",
    lineupRhythmKind: "sunset-inline-clean",
    showLineupNumbers: false,
    pretitleLabel: "Open air",
  },
  {
    presetId: "gradient",
    displayName: "Gradient",
    background: "linear-gradient(160deg, #1e293b, #334155 50%, #0f172a)",
    textColor: "#e2e8f0",
    titleColor: "#ffffff",
    subtitleColor: "#94a3b8",
    accentColor: "#a3e635",
    secondaryTextColor: "#94a3b8",
    posterRootClassName: "rounded-none",
    posterInnerClassName: "",
    titleBlockClassName: "hidden",
    titleClassName: "",
    subtitleClassName: "",
    lineupListClassName: "",
    overlayKind: "gradient-diagonal",
    titleLayoutKind: "gradient-diagonal-title",
    lineupRhythmKind: "gradient-diagonal-list",
    showLineupNumbers: false,
    pretitleLabel: "No requests",
  },
];

export function getPresetConfigById(presetId: string): PresetConfig {
  return (
    PRESET_CONFIGS.find((preset) => preset.presetId === presetId) ??
    PRESET_CONFIGS[0]
  );
}
