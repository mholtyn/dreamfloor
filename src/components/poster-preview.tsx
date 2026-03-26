import type { LineupSlot, PresetId } from "@/types";
import { getPresetConfigById } from "@/data/presets";
import { computeSlotTimeRange } from "@/utils/time";

type PosterPreviewProps = {
  presetId: PresetId;
  lineupSlots: LineupSlot[];
};

export function PosterPreview({ presetId, lineupSlots }: PosterPreviewProps) {
  const presetConfig = getPresetConfigById(presetId);
  const hasAnyArtist = lineupSlots.some(
    (slot) => slot.artistName.trim().length > 0,
  );

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Live Preview</h2>
      <div
        id="poster-preview"
        className="relative mx-auto aspect-3/4 w-full max-w-[280px] overflow-hidden rounded-lg shadow-2xl sm:max-w-[384px] lg:max-w-[448px]"
        style={{
          background: presetConfig.background,
          color: presetConfig.textColor,
        }}
      >
        <div className="flex h-full flex-col justify-between p-5 sm:p-7 lg:p-9">
          {/* Header */}
          <div>
            <p
              className="text-[0.55rem] font-semibold tracking-[0.25em] uppercase opacity-80 sm:text-[0.7rem]"
              style={{ color: presetConfig.textColor }}
            >
              Fictional Event
            </p>
            <h1
              className="mt-2 text-3xl font-black leading-none tracking-tight uppercase sm:text-[2.8rem] lg:text-5xl"
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
              className="mt-2 text-[0.65rem] font-semibold tracking-widest uppercase sm:text-xs"
              style={{ color: presetConfig.subtitleColor }}
            >
              Techno Experience
            </p>
          </div>

          {/* Lineup */}
          <div className="mt-4 flex-1">
            {hasAnyArtist ? (
              <ul className="space-y-2 sm:space-y-3">
                {lineupSlots.map((slot, slotIndex) => {
                  const displayName =
                    slot.artistName.trim() || "TBA";
                  const { startTimeLabel, endTimeLabel } =
                    computeSlotTimeRange(slotIndex, lineupSlots);
                  const slotNumber = String(slotIndex + 1).padStart(2, "0");

                  return (
                    <li
                      key={slotIndex}
                      className="border-b pb-1.5 sm:pb-2"
                      style={{
                        borderBottomColor: `${presetConfig.textColor}1F`,
                      }}
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[0.6rem] font-bold sm:text-xs"
                          style={{ color: presetConfig.accentColor }}
                        >
                          {slotNumber}
                        </span>
                        <span className="text-[0.7rem] font-bold tracking-wide uppercase sm:text-sm lg:text-base">
                          {displayName}
                        </span>
                      </div>
                      <p
                        className="mt-0.5 pl-5 text-[0.6rem] font-semibold sm:pl-6 sm:text-xs"
                        style={{ color: presetConfig.secondaryTextColor }}
                      >
                        {startTimeLabel} - {endTimeLabel}
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

          {/* Footer */}
          <div
            className="mt-4 border-t pt-2"
            style={{ borderTopColor: `${presetConfig.textColor}33` }}
          >
            <p className="text-[0.55rem] tracking-widest uppercase opacity-60 sm:text-[0.7rem]">
              Created with Dreamfloor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
