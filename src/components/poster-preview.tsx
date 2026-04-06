import type { LineupSlot, PresetId } from "@/types";
import { getPresetConfigById } from "@/data/presets";
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

/** Two-artist lineups: a bit larger than compact, paired with split-column layout below. */
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

export function PosterPreview({ presetId, lineupSlots }: PosterPreviewProps) {
  const presetConfig = getPresetConfigById(presetId);
  const hasAnyArtist = lineupSlots.some((slot) => slot.artistName.trim().length > 0);
  const slotCount = lineupSlots.length;
  const isFewSlots = slotCount <= 2;
  const isDuoLineup = slotCount === 2;
  const lineupTypographyClasses = getLineupTypographyClasses(slotCount);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Live Preview</h2>
      <div
        id="poster-preview"
        className="relative mx-auto aspect-3/4 w-full max-w-[280px] overflow-hidden rounded-lg shadow-2xl sm:max-w-[384px] lg:mx-0 lg:max-w-[448px]"
        style={{
          background: presetConfig.background,
          color: presetConfig.textColor,
        }}
      >
        <div className="flex h-full min-h-0 flex-col p-5 sm:p-7 lg:p-9">
          <div className="shrink-0">
            <h1
              className="text-3xl font-black leading-none tracking-tight uppercase sm:text-[2.8rem] lg:text-5xl"
              style={{
                color: presetConfig.titleColor,
                textShadow:
                  presetId === "neon"
                    ? `0 0 20px ${presetConfig.titleColor}`
                    : undefined,
              }}
            >
              Dream
              <br />
              Floor
            </h1>
            <p
              className="mt-1 text-[0.55rem] font-semibold tracking-[0.18em] uppercase opacity-80 sm:text-[0.7rem]"
              style={{ color: presetConfig.subtitleColor }}
            >
              Presented by Dreamfloor.app
            </p>
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            {hasAnyArtist ? (
              <ul
                className={
                  isDuoLineup
                    ? "flex min-h-0 flex-1 flex-col justify-between gap-0 py-3 sm:py-5"
                    : isFewSlots
                      ? "flex min-h-0 flex-1 flex-col justify-center gap-6 sm:gap-8"
                      : "flex min-h-0 flex-1 flex-col"
                }
              >
                {lineupSlots.map((slot, slotIndex) => {
                  const displayName = slot.artistName.trim() || "TBA";
                  const { startTimeLabel, endTimeLabel } = computeSlotTimeRange(
                    slotIndex,
                    lineupSlots,
                  );
                  const slotNumber = String(slotIndex + 1).padStart(2, "0");
                  const isAllNightLongSlot =
                    slot.durationMinutes === ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL;

                  return (
                    <li
                      key={slotIndex}
                      className={
                        isDuoLineup
                          ? "flex min-h-0 flex-1 flex-col justify-center border-b pb-1.5 last:border-b-0 last:pb-0 sm:pb-2"
                          : isFewSlots
                            ? "flex flex-col justify-center border-b pb-1.5 last:border-b-0 last:pb-0 sm:pb-2"
                            : "flex min-h-0 flex-1 flex-col justify-center border-b pb-1.5 last:border-b-0 last:pb-0 sm:pb-2"
                      }
                      style={{
                        borderBottomColor: `${presetConfig.textColor}1F`,
                      }}
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          className={lineupTypographyClasses.rowNumber}
                          style={{ color: presetConfig.accentColor }}
                        >
                          {slotNumber}
                        </span>
                        <span className={lineupTypographyClasses.artistName}>
                          {displayName}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 pl-5 sm:pl-6 ${lineupTypographyClasses.timeRange}`}
                        style={{ color: presetConfig.secondaryTextColor }}
                      >
                        {isAllNightLongSlot
                          ? "All night long"
                          : `${startTimeLabel} - ${endTimeLabel}`}
                      </p>
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
