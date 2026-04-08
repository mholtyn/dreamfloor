import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArtistAutocomplete } from "@/components/artist-autocomplete";
import { TECHNO_ARTISTS } from "@/data/artists";
import { suggestArtist } from "@/lib/dreamfloorApi";
import { posthog } from "@/lib/posthog";
import type { LineupSlot } from "@/types";
import { ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL } from "@/utils/time";

/** MVP: lineup must stay at least this many slots (no single-artist night without ANL). */
export const MINIMUM_LINEUP_SLOT_COUNT = 2;
const MAXIMUM_SLOT_COUNT = 5;
const DEFAULT_DURATION_MINUTES = 120;

const DURATION_OPTIONS = [
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
  { value: 120, label: "2h" },
  { value: 180, label: "3h" },
  { value: 240, label: "4h" },
  { value: 300, label: "5h" },
  { value: 360, label: "6h" },
  { value: 420, label: "7h" },
  { value: 480, label: "8h" },
  // Post-MVP: append `{ value: ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL, label: "All night long" }` for a visible ANL choice.
] as const;

/** ANL (`0`) is not in the dropdown; we show default minutes until the user picks another duration. */
function durationMinutesForSelectDisplay(durationMinutes: number): number {
  if (durationMinutes === ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL) {
    return DEFAULT_DURATION_MINUTES;
  }
  return durationMinutes;
}

type LineupBuilderProps = {
  lineupSlots: LineupSlot[];
  onSlotsChange: (nextSlots: LineupSlot[]) => void;
};

export function LineupBuilder({ lineupSlots, onSlotsChange }: LineupBuilderProps) {
  const hasAllNightLongSlot = lineupSlots.some(
    (lineupSlot) => lineupSlot.durationMinutes === ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL,
  );
  const hasReachedMaximumSlots = lineupSlots.length >= MAXIMUM_SLOT_COUNT;
  const isAddSlotDisabled = hasReachedMaximumSlots || hasAllNightLongSlot;
  const canRemoveAnySlot = lineupSlots.length > MINIMUM_LINEUP_SLOT_COUNT;

  function handleAddSlot() {
    if (isAddSlotDisabled) return;
    if (lineupSlots.length === 0) {
      onSlotsChange([
        { artistName: "", durationMinutes: DEFAULT_DURATION_MINUTES },
        { artistName: "", durationMinutes: DEFAULT_DURATION_MINUTES },
      ]);
      posthog.capture("artist_slot_added", { slot_count_after: 2 });
      return;
    }
    onSlotsChange([
      ...lineupSlots,
      { artistName: "", durationMinutes: DEFAULT_DURATION_MINUTES },
    ]);
    posthog.capture("artist_slot_added", { slot_count_after: lineupSlots.length + 1 });
  }

  function handleRemoveSlot(removeIndex: number) {
    if (lineupSlots.length <= MINIMUM_LINEUP_SLOT_COUNT) {
      return;
    }
    onSlotsChange(
      lineupSlots.filter((_, slotIndex) => slotIndex !== removeIndex),
    );
    posthog.capture("artist_slot_removed", { slot_count_after: lineupSlots.length - 1 });
  }

  function handleArtistNameChange(slotIndex: number, nextArtistName: string) {
    onSlotsChange(
      lineupSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex ? { ...slot, artistName: nextArtistName } : slot,
      ),
    );
  }

  function handleDurationChange(slotIndex: number, nextDuration: number) {
    // Post-MVP: when ANL is selectable again, this collapses to a single ANL slot (same as before).
    if (nextDuration === ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL) {
      const selectedSlot = lineupSlots[slotIndex];
      const onlyAllNightLongSlot: LineupSlot = {
        artistName: selectedSlot.artistName,
        durationMinutes: ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL,
      };
      onSlotsChange([onlyAllNightLongSlot]);
      return;
    }

    onSlotsChange(
      lineupSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex ? { ...slot, durationMinutes: nextDuration } : slot,
      ),
    );
  }

  async function handleSuggestArtist(artistName: string): Promise<void> {
    try {
      const suggestionCount = await suggestArtist(artistName);
      posthog.capture("artist_suggested", { artist_name: artistName, suggestion_count: suggestionCount });
      toast.success(`Thanks! "${artistName}" suggested (${suggestionCount} total).`);
    } catch (err) {
      posthog.captureException(err);
      toast.error("Failed to send suggestion. Try again.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Lineup</h2>
        {hasReachedMaximumSlots ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSlot}
                    disabled={isAddSlotDisabled}
                  >
                    <Plus className="size-3.5" />
                    Add Artist
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Max artists reached for this poster.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSlot}
            disabled={isAddSlotDisabled}
          >
            <Plus className="size-3.5" />
            Add Artist
          </Button>
        )}
      </div>

      {lineupSlots.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">No artists yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click "Add Artist" to start building your lineup
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lineupSlots.map((slot, slotIndex) => (
            <div
              key={slotIndex}
              className="relative rounded-lg border bg-card p-3 transition-colors hover:border-muted-foreground/30 sm:p-4"
            >
              <span className="absolute right-3 top-2 text-[0.6rem] font-medium tabular-nums text-muted-foreground/40 sm:right-4">
                {String(slotIndex + 1).padStart(2, "0")}
              </span>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Artist Name</Label>
                  <ArtistAutocomplete
                    value={slot.artistName}
                    onChangeArtistName={(nextArtistName) =>
                      handleArtistNameChange(slotIndex, nextArtistName)
                    }
                  />

                  {slot.artistName.trim().length > 0 &&
                    !TECHNO_ARTISTS.some(
                      (artistName) =>
                        artistName.toLowerCase() === slot.artistName.trim().toLowerCase(),
                    ) && (
                      <button
                        type="button"
                        className="mt-1 text-[11px] text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
                        onClick={() => handleSuggestArtist(slot.artistName.trim())}
                      >
                        Can&apos;t find this artist? Suggest to global catalog.
                      </button>
                    )}
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Duration</Label>
                    <select
                      value={durationMinutesForSelectDisplay(slot.durationMinutes)}
                      onChange={(event) =>
                        handleDurationChange(slotIndex, Number(event.target.value))
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {DURATION_OPTIONS.map((durationOption) => (
                        <option key={durationOption.value} value={durationOption.value}>
                          {durationOption.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {canRemoveAnySlot ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveSlot(slotIndex)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove slot {slotIndex + 1}</span>
                    </Button>
                  ) : (
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled
                              className="text-destructive/40"
                              aria-label="Cannot remove: minimum lineup size"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            At least {MINIMUM_LINEUP_SLOT_COUNT} artists are required. Support for
                            All Night Longs will be added soon!
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

