import type { LineupSlot } from '../types';
import { AutocompleteArtistInput } from './AutocompleteArtistInput';
import { computeNextSlotStartTimeLabelFromPreviousSlot } from '../utils/time';

import './lineupEditor.css';

type LineupEditorProps = {
  lineupSlots: LineupSlot[];
  onChangeLineupSlots: (nextLineupSlots: LineupSlot[]) => void;
};

const emptySlotArtistText = '';
const defaultSlotDurationMinutes = 60;
const minSlotCount = 2;

const slotDurationMinutesOptions: number[] = [30, 45, 60, 75, 90, 120, 180];

export function LineupEditor({ lineupSlots, onChangeLineupSlots }: LineupEditorProps) {
  return (
    <div className="lineupEditorRoot" aria-label="Lineup editor">
      {lineupSlots.map((slot, slotIndex) => (
        <div key={`${slot.slotStartTimeLabel}-${slotIndex}`} className="lineupSlotRow">
          <div className="lineupSlotTimeControls">
            <label className="lineupTimeField">
              <span className="lineupTimeLabel">Start</span>
              <input
                className="lineupTimeInput"
                type="time"
                value={slot.slotStartTimeLabel}
                step={300}
                onChange={(event) => {
                  const nextSlotStartTimeLabel = event.target.value;
                  const nextLineupSlots = lineupSlots.map((nextSlot, nextSlotIndex) => {
                    if (nextSlotIndex !== slotIndex) {
                      return nextSlot;
                    }
                    return { ...nextSlot, slotStartTimeLabel: nextSlotStartTimeLabel || slot.slotStartTimeLabel };
                  });
                  onChangeLineupSlots(nextLineupSlots);
                }}
              />
            </label>

            <label className="lineupTimeField">
              <span className="lineupTimeLabel">Duration</span>
              <select
                className="lineupDurationSelect"
                value={slot.slotDurationMinutes}
                onChange={(event) => {
                  const nextSlotDurationMinutes = Number(event.target.value);
                  const nextLineupSlots = lineupSlots.map((nextSlot, nextSlotIndex) => {
                    if (nextSlotIndex !== slotIndex) {
                      return nextSlot;
                    }
                    return { ...nextSlot, slotDurationMinutes: nextSlotDurationMinutes || defaultSlotDurationMinutes };
                  });
                  onChangeLineupSlots(nextLineupSlots);
                }}
              >
                {slotDurationMinutesOptions.map((durationMinutesOption) => (
                  <option key={durationMinutesOption} value={durationMinutesOption}>
                    {durationMinutesOption} min
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="lineupSlotArtistControls">
            <AutocompleteArtistInput
              inputLabel={`Slot ${slotIndex + 1} artist`}
              value={slot.selectedArtistName}
              placeholder="Type artist..."
              onChangeArtistName={(nextArtistName) => {
                const nextLineupSlots = lineupSlots.map((nextSlot, nextSlotIndex) => {
                  if (nextSlotIndex !== slotIndex) {
                    return nextSlot;
                  }
                  return {
                    ...nextSlot,
                    selectedArtistName: nextArtistName || emptySlotArtistText,
                  };
                });
                onChangeLineupSlots(nextLineupSlots);
              }}
            />
          </div>

          {lineupSlots.length > minSlotCount ? (
            <div className="lineupSlotRemoveControls">
              <button
                className="dangerButton"
                type="button"
                onClick={() => {
                  const nextLineupSlots = lineupSlots.filter((_, nextSlotIndex) => nextSlotIndex !== slotIndex);
                  onChangeLineupSlots(nextLineupSlots);
                }}
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
      ))}

      <div className="lineupAddControls">
        <button
          type="button"
          className="secondaryButton"
          onClick={() => {
            const previousSlot = lineupSlots[lineupSlots.length - 1];
            const nextSlotStartTimeLabel = previousSlot
              ? computeNextSlotStartTimeLabelFromPreviousSlot(previousSlot.slotStartTimeLabel, previousSlot.slotDurationMinutes)
              : '23:00';
            const nextLineupSlots = [
              ...lineupSlots,
              {
                slotStartTimeLabel: nextSlotStartTimeLabel,
                slotDurationMinutes: defaultSlotDurationMinutes,
                selectedArtistName: emptySlotArtistText,
              },
            ];
            onChangeLineupSlots(nextLineupSlots);
          }}
        >
          Add slot
        </button>
      </div>

      <div className="lineupHelp">
        Tip: ustaw start i duration dla każdego slotu, a potem wybierz artystów (autocomplete). Exportuj do PNG.
      </div>
    </div>
  );
}

