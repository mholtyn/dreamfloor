import type { LineupSlot } from '../types';

import './signalIndustrialPoster.css';

type SignalIndustrialPosterProps = {
  lineupSlots: LineupSlot[];
  posterKickerText: string;
  posterVenueTitleText: string;
  posterEventSubtitleText: string;
  posterDisclaimerText: string;
  posterWebsiteFooterText: string;
};

export function SignalIndustrialPoster({
  lineupSlots,
  posterKickerText,
  posterVenueTitleText,
  posterEventSubtitleText,
  posterDisclaimerText,
  posterWebsiteFooterText,
}: SignalIndustrialPosterProps) {
  return (
    <article
      className="posterRoot signalPosterRoot"
      data-preset-id="signal_industrial"
      data-poster-export-root="true"
      aria-label="Poster lineup — Warehouse Signal"
    >
      <div className="signalLayer signalGrid" aria-hidden="true" />
      <div className="signalLayer signalVignette" aria-hidden="true" />
      <div className="signalLayer signalScanBand" aria-hidden="true" />

      <div className="signalCornerMark signalCornerMarkTopLeft" aria-hidden="true" />
      <div className="signalCornerMark signalCornerMarkTopRight" aria-hidden="true" />
      <div className="signalCornerMark signalCornerMarkBottomLeft" aria-hidden="true" />
      <div className="signalCornerMark signalCornerMarkBottomRight" aria-hidden="true" />

      <div className="signalSideRail" aria-hidden="true">
        <span className="signalSideRailText">DREAMFLOOR</span>
      </div>

      <div className="signalContentStack">
        <header className="signalHeaderBlock">
          <p className="signalKickerLine">{posterKickerText}</p>
          <h1 className="signalVenueWordmark">{posterVenueTitleText}</h1>
          <p className="signalEventSubtitle">{posterEventSubtitleText}</p>
        </header>

        <ol className="signalLineupList" aria-label="Lineup">
          {lineupSlots.map((slot, slotIndex) => (
            <li key={`${slot.slotTimeLabel}-${slotIndex}`} className="signalLineupRow">
              <div className="signalRowTimeColumn">
                <span className="signalDayMicro">{slot.dayLabel}</span>
                <span className="signalClock">{slot.slotTimeLabel}</span>
              </div>
              <p className="signalArtistName">{slot.selectedArtistName || '—'}</p>
            </li>
          ))}
        </ol>

        <footer className="signalFooterBlock">
          <p className="signalDisclaimer">{posterDisclaimerText}</p>
          <p className="signalWebsiteFooter">{posterWebsiteFooterText}</p>
        </footer>
      </div>

      {/* Grain: SVG turbulence -> pełna ciągłość bez kafelków. */}
      <div className="signalGrainOverlay" aria-hidden="true">
        <svg
          className="posterInlineGrainSvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1080 1920"
          preserveAspectRatio="none"
        >
          <filter
            id="signal_inline_grain_filter"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.74" numOctaves="4" stitchTiles="stitch" result="raw_noise" />
            <feColorMatrix in="raw_noise" type="saturate" values="0" result="mono_noise" />
          </filter>
          <rect width="1080" height="1920" fill="#ffffff" filter="url(#signal_inline_grain_filter)" />
        </svg>
      </div>
    </article>
  );
}

