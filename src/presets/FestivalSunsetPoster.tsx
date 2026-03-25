import type { LineupSlot } from '../types';

import './festivalSunsetPoster.css';

type FestivalSunsetPosterProps = {
  lineupSlots: LineupSlot[];
  posterKickerText: string;
  posterVenueTitleText: string;
  posterEventSubtitleText: string;
  posterDisclaimerText: string;
  posterWebsiteFooterText: string;
};

const FESTIVAL_GRAIN_FILTER_ID = 'festival_inline_grain_filter';

export function FestivalSunsetPoster({
  lineupSlots,
  posterKickerText,
  posterVenueTitleText,
  posterEventSubtitleText,
  posterDisclaimerText,
  posterWebsiteFooterText,
}: FestivalSunsetPosterProps) {
  return (
    <article
      className="posterRoot festivalPosterRoot"
      data-preset-id="festival_sunset"
      data-poster-export-root="true"
      aria-label="Poster lineup — Concrete Night"
    >
      <div className="festivalLayer festivalSkywash" aria-hidden="true" />
      <div className="festivalLayer festivalSunDisc" aria-hidden="true" />
      <div className="festivalLayer festivalHillSilhouette" aria-hidden="true" />

      <div className="festivalLayer festivalPaperCard" aria-hidden="true" />

      <div className="festivalLayer festivalPaperCardContent">
        <header className="festivalHeaderBlock">
          <p className="festivalKickerLine">{posterKickerText}</p>
          <h1 className="festivalVenueWordmark">{posterVenueTitleText}</h1>
          <p className="festivalSubtitle">{posterEventSubtitleText}</p>
        </header>

        <ol className="festivalLineupList" aria-label="Lineup">
          {lineupSlots.map((slot, slotIndex) => (
            <li key={`${slot.slotTimeLabel}-${slotIndex}`} className="festivalLineupRow">
              <div className="festivalRowTimeBlock">
                <span className="festivalDayBadge">{slot.dayLabel}</span>
                <span className="festivalClockLabel">{slot.slotTimeLabel}</span>
              </div>
              <div className="festivalRowArtistBlock">
                <span className="festivalArtistName">{slot.selectedArtistName || '—'}</span>
              </div>
            </li>
          ))}
        </ol>

        <footer className="festivalFooterBlock">
          <p className="festivalDisclaimer">{posterDisclaimerText}</p>
          <p className="festivalWebsiteFooter">{posterWebsiteFooterText}</p>
        </footer>
      </div>

      {/* Grain: ciągły, bez kafelków (pełnopowierzchniowy feTurbulence na SVG). */}
      <div className="posterGrainOverlay" aria-hidden="true">
        <svg
          className="posterInlineGrainSvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1080 1920"
          preserveAspectRatio="none"
        >
          <filter
            id={FESTIVAL_GRAIN_FILTER_ID}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
              result="raw_noise"
            />
            <feColorMatrix in="raw_noise" type="saturate" values="0" result="mono_noise" />
            <feComponentTransfer in="mono_noise">
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
          </filter>
          <rect width="1080" height="1920" fill="#ffffff" filter={`url(#${FESTIVAL_GRAIN_FILTER_ID})`} />
        </svg>
      </div>
    </article>
  );
}

