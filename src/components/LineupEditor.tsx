import type { LineupSlot } from '../types';
import { AutocompleteArtistInput } from './AutocompleteArtistInput';

import './lineupEditor.css';

type LineupEditorProps = {
  lineupSlots: LineupSlot[];
  onChangeLineupSlots: (nextLineupSlots: LineupSlot[]) => void;
};

const emptySlotArtistText = '';

export function LineupEditor({ lineupSlots, onChangeLineupSlots }: LineupEditorProps) {
  return (
    <div className="lineupEditorRoot" aria-label="Lineup editor">
      {lineupSlots.map((slot, slotIndex) => (
        <div key={`${slot.slotTimeLabel}-${slotIndex}`} className="lineupSlotRow">
          <AutocompleteArtistInput
            inputLabel={`${slot.dayLabel} ${slot.slotTimeLabel}`}
            value={slot.selectedArtistName}
            placeholder={`Type artist...`}
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
      ))}

      <div className="lineupHelp">
        Tip: wybierasz artystów per slot (autocomplete). Zmień preset, a potem eksportuj PNG.
      </div>
    </div>
  );
}

