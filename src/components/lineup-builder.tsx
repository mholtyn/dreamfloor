import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArtistAutocomplete } from "@/components/artist-autocomplete";
import type { LineupSlot } from "@/types";

const MINIMUM_SLOT_COUNT = 1;
const DEFAULT_DURATION_MINUTES = 120;

const DURATION_OPTIONS = [
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
  { value: 120, label: "2h" },
  { value: 180, label: "3h" },
  { value: 240, label: "4h" },
  { value: 300, label: "5h" },
  { value: 360, label: "6h" },
] as const;

type LineupBuilderProps = {
  lineupSlots: LineupSlot[];
  onSlotsChange: (nextSlots: LineupSlot[]) => void;
};

export function LineupBuilder({
  lineupSlots,
  onSlotsChange,
}: LineupBuilderProps) {
  function handleAddSlot() {
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
        currentIndex === slotIndex
          ? { ...slot, artistName: nextArtistName }
          : slot,
      ),
    );
  }

  function handleDurationChange(slotIndex: number, nextDuration: number) {
    onSlotsChange(
      lineupSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex
          ? { ...slot, durationMinutes: nextDuration }
          : slot,
      ),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Lineup</h2>
        <Button variant="outline" size="sm" onClick={handleAddSlot}>
          <Plus className="size-3.5" />
          Add Artist
        </Button>
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
              {/* Slot number badge */}
              <div className="absolute -left-2 top-3 flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold sm:size-7 sm:text-sm">
                {slotIndex + 1}
              </div>

              <div className="ml-4 space-y-3 sm:ml-5">
                {/* Artist name */}
                <div>
                  <Label className="text-xs">Artist Name</Label>
                  <ArtistAutocomplete
                    value={slot.artistName}
                    onChangeArtistName={(nextName) =>
                      handleArtistNameChange(slotIndex, nextName)
                    }
                  />
                </div>

                {/* Duration + delete row */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Duration</Label>
                    <select
                      value={slot.durationMinutes}
                      onChange={(event) =>
                        handleDurationChange(
                          slotIndex,
                          Number(event.target.value),
                        )
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
