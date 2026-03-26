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
import type { LineupSlot } from "@/types";

const MINIMUM_SLOT_COUNT = 1;
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
  { value: 0, label: "All night long" },
] as const;

type LineupBuilderProps = {
  lineupSlots: LineupSlot[];
  onSlotsChange: (nextSlots: LineupSlot[]) => void;
};

export function LineupBuilder({ lineupSlots, onSlotsChange }: LineupBuilderProps) {
  const hasAllNightLongSlot = lineupSlots.some(
    (lineupSlot) => lineupSlot.durationMinutes === 0,
  );
  const hasReachedMaximumSlots = lineupSlots.length >= MAXIMUM_SLOT_COUNT;
  const isAddSlotDisabled = hasReachedMaximumSlots || hasAllNightLongSlot;

  function handleAddSlot() {
    if (isAddSlotDisabled) return;
    onSlotsChange([
      ...lineupSlots,
      { artistName: "", durationMinutes: DEFAULT_DURATION_MINUTES },
    ]);
  }

  function handleRemoveSlot(removeIndex: number) {
    onSlotsChange(
      lineupSlots.filter((_, slotIndex) => slotIndex !== removeIndex),
    );
  }

  function handleArtistNameChange(slotIndex: number, nextArtistName: string) {
    onSlotsChange(
      lineupSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex ? { ...slot, artistName: nextArtistName } : slot,
      ),
    );
  }

  function handleDurationChange(slotIndex: number, nextDuration: number) {
    if (nextDuration === 0) {
      const selectedSlot = lineupSlots[slotIndex];
      const onlyAllNightLongSlot: LineupSlot = {
        artistName: selectedSlot.artistName,
        durationMinutes: 0,
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

  function handleSuggestArtist(artistName: string) {
    toast.message(`Suggestion captured: ${artistName}`, {
      description: "UI-only for MVP. API integration will come next.",
    });
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
              <div className="absolute -left-2 top-3 flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold sm:size-7 sm:text-sm">
                {slotIndex + 1}
              </div>

              <div className="ml-4 space-y-3 sm:ml-5">
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
                      value={slot.durationMinutes}
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

                  {lineupSlots.length > MINIMUM_SLOT_COUNT && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveSlot(slotIndex)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove slot {slotIndex + 1}</span>
                    </Button>
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

