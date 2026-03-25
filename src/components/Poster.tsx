import type { LineupSlot, VisualPresetId } from '../types';
import { FestivalSunsetPoster } from '../presets/FestivalSunsetPoster';
import { SignalIndustrialPoster } from '../presets/SignalIndustrialPoster';

type PosterProps = {
  visualPresetId: VisualPresetId;
  lineupSlots: LineupSlot[];
  posterDisclaimerText: string;
  posterWebsiteFooterText: string;
};

export function Poster({ visualPresetId, lineupSlots, posterDisclaimerText, posterWebsiteFooterText }: PosterProps) {
  const commonVenueTitleText = 'DREAMFLOOR';

  if (visualPresetId === 'festival_sunset') {
    return (
      <FestivalSunsetPoster
        lineupSlots={lineupSlots}
        posterKickerText="FAN LINEUP BUILDER"
        posterVenueTitleText={commonVenueTitleText}
        posterEventSubtitleText="FANTASY WEEKEND — EDITION"
        posterDisclaimerText={posterDisclaimerText}
        posterWebsiteFooterText={posterWebsiteFooterText}
      />
    );
  }

  return (
    <SignalIndustrialPoster
      lineupSlots={lineupSlots}
      posterKickerText="UNDERGROUND SIGNAL // FICTION"
      posterVenueTitleText={commonVenueTitleText}
      posterEventSubtitleText="LINEUP SIMULATION — NO VENUE IMPLIED"
      posterDisclaimerText={posterDisclaimerText}
      posterWebsiteFooterText={posterWebsiteFooterText}
    />
  );
}

