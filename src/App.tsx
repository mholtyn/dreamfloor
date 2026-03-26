import { useState } from "react";
import type { PresetId, LineupSlot } from "@/types";
import { TopBar } from "@/components/top-bar";
import { InfoModal } from "@/components/info-modal";
import { PresetSelector } from "@/components/preset-selector";
import { PosterPreview } from "@/components/poster-preview";
import { LineupBuilder } from "@/components/lineup-builder";
import { ExportActions } from "@/components/export-actions";

const INITIAL_PRESET_ID: PresetId = "neon";

const INITIAL_LINEUP_SLOTS: LineupSlot[] = [
  { artistName: "Charlotte de Witte", durationMinutes: 120 },
  { artistName: "Amelie Lens", durationMinutes: 90 },
  { artistName: "Adam Beyer", durationMinutes: 120 },
];

function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] =
    useState<PresetId>(INITIAL_PRESET_ID);
  const [lineupSlots, setLineupSlots] =
    useState<LineupSlot[]>(INITIAL_LINEUP_SLOTS);

  const isLineupValid = lineupSlots.some(
    (slot) => slot.artistName.trim().length > 0,
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar onInfoClick={() => setIsInfoModalOpen(true)} />
      <InfoModal open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen} />

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:grid lg:grid-cols-[minmax(300px,480px)_1fr] lg:gap-8 lg:p-8">
        {/* Preview column (left on desktop, below controls on mobile) */}
        <div className="hidden lg:block">
          <div className="sticky top-20 self-start">
            <PosterPreview
              presetId={selectedPresetId}
              lineupSlots={lineupSlots}
            />
          </div>
        </div>

        {/* Controls column (right on desktop, top on mobile) */}
        <div className="space-y-4 lg:space-y-6">
          <PresetSelector
            selectedPresetId={selectedPresetId}
            onSelectPreset={setSelectedPresetId}
          />
          <LineupBuilder
            lineupSlots={lineupSlots}
            onSlotsChange={setLineupSlots}
          />
          <ExportActions isLineupValid={isLineupValid} />
        </div>

        {/* Preview on mobile (below controls) */}
        <div className="mt-6 lg:hidden">
          <PosterPreview
            presetId={selectedPresetId}
            lineupSlots={lineupSlots}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
