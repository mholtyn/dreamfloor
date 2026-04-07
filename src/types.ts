export type PresetId =
  | "neon"
  | "minimal"
  | "dark-rave"
  | "retro"
  | "gradient"
  | "industrial"
  | "prime"
  | "minimal-grid"
  | "sunset"
  | "pulse";

export type LineupSlot = {
  artistName: string;
  /** `0` = all-night-long (reserved; MVP UI does not expose it). */
  durationMinutes: number;
};

/** Drives decorative layers inside the poster (not only palette). */
export type PosterOverlayKind =
  | "none"
  | "industrial-rough"
  | "prime-flyer-slab"
  | "swiss-frame"
  | "sunset-blobs"
  | "pulse-film-grain"
  | "neon-pulse-dots"
  | "retro-horizontal-bars"
  | "dark-rave-spotlight"
  | "gradient-soft-vignette"
  | "minimal-editorial";

/** Drives title block structure and typography rhythm. */
export type PosterTitleLayoutKind =
  | "stacked-brutal-default"
  | "single-line-stamp-industrial"
  | "slab-band-prime"
  | "swiss-left-rule"
  | "sunset-badge-stack"
  | "pulse-neon-stack"
  | "neon-classic-split-lines"
  | "retro-poster-stack"
  | "dark-rave-stencil-stack"
  | "gradient-airy-stack"
  | "minimal-swiss-clean";

/** How lineup rows are separated and aligned per identity. */
export type PosterLineupRhythmKind =
  | "default-underline"
  | "industrial-left-rail"
  | "swiss-thick-top-rule"
  | "sunset-pill-rows"
  | "pulse-loose-blocks"
  | "retro-heavy-underline"
  | "minimal-hairline";

export type PresetConfig = {
  presetId: PresetId;
  displayName: string;
  background: string;
  textColor: string;
  titleColor: string;
  subtitleColor: string;
  accentColor: string;
  secondaryTextColor: string;
  posterRootClassName: string;
  posterInnerClassName: string;
  titleBlockClassName: string;
  titleClassName: string;
  subtitleClassName: string;
  lineupListClassName: string;
  overlayKind: PosterOverlayKind;
  titleLayoutKind: PosterTitleLayoutKind;
  lineupRhythmKind: PosterLineupRhythmKind;
  showLineupNumbers: boolean;
  /** Short label above the title (empty string = hidden). */
  pretitleLabel: string;
};
