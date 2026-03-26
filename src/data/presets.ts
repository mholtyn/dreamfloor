import type { PresetConfig } from "@/types";

export const PRESET_CONFIGS: PresetConfig[] = [
  {
    presetId: "neon",
    displayName: "Neon",
    background: "linear-gradient(135deg, #0F0326, #1a0540)",
    textColor: "#FFFFFF",
    titleColor: "#FFD700",
    subtitleColor: "#FF10F0",
    accentColor: "#FF10F0",
    secondaryTextColor: "#00F0FF",
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
  },
  {
    presetId: "dark-rave",
    displayName: "Dark Rave",
    background: "#000000",
    textColor: "#FFFFFF",
    titleColor: "#FF0000",
    subtitleColor: "#FF3333",
    accentColor: "#FF0000",
    secondaryTextColor: "#FFFFFF",
  },
  {
    presetId: "retro",
    displayName: "Retro",
    background: "linear-gradient(180deg, #FF6B35, #F7931E)",
    textColor: "#2D1B69",
    titleColor: "#2D1B69",
    subtitleColor: "#FFFFFF",
    accentColor: "#FFE66D",
    secondaryTextColor: "#FFFFFF",
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
  },
];

export function getPresetConfigById(presetId: string): PresetConfig {
  return (
    PRESET_CONFIGS.find((preset) => preset.presetId === presetId) ??
    PRESET_CONFIGS[0]
  );
}
