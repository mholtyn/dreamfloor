export type PresetId = "neon" | "minimal" | "dark-rave" | "retro" | "gradient";

export type LineupSlot = {
  artistName: string;
  durationMinutes: number;
};

export type PresetConfig = {
  presetId: PresetId;
  displayName: string;
  background: string;
  textColor: string;
  titleColor: string;
  subtitleColor: string;
  accentColor: string;
  secondaryTextColor: string;
};
