import { useEffect, useState } from "react";
import { ExportActions } from "@/components/export-actions";
import { InfoModal } from "@/components/info-modal";
import { LineupBuilder, MINIMUM_LINEUP_SLOT_COUNT } from "@/components/lineup-builder";
import { PosterPreview } from "@/components/poster-preview";
import { PresetSelector } from "@/components/preset-selector";
import { TopBar } from "@/components/top-bar";
import { fetchLineupCount } from "@/lib/dreamfloorApi";
import type { LineupSlot, PresetId } from "@/types";

const INITIAL_PRESET_ID: PresetId = "neon";
const INITIAL_LINEUP_SLOTS: LineupSlot[] = [
  { artistName: "Charlotte de Witte", durationMinutes: 120 },
  { artistName: "Amelie Lens", durationMinutes: 90 },
  { artistName: "Adam Beyer", durationMinutes: 120 },
];

function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>(INITIAL_PRESET_ID);
  const [lineupSlots, setLineupSlots] = useState<LineupSlot[]>(INITIAL_LINEUP_SLOTS);
  const [globalLineupCount, setGlobalLineupCount] = useState<number | null>(null);

  const filledArtistCount = lineupSlots.filter(
    (slot) => slot.artistName.trim().length > 0,
  ).length;
  const isLineupValid = filledArtistCount >= MINIMUM_LINEUP_SLOT_COUNT;

  useEffect(() => {
    async function loadLineupCount(): Promise<void> {
      try {
        const fetchedLineupCount = await fetchLineupCount();
        setGlobalLineupCount(fetchedLineupCount);
      } catch {
        setGlobalLineupCount(null);
      }
    }

    void loadLineupCount();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar
        onInfoClick={() => setIsInfoModalOpen(true)}
        globalLineupCount={globalLineupCount}
      />
      <InfoModal open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen} />

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:grid lg:grid-cols-[minmax(300px,480px)_1fr] lg:items-start lg:gap-8 lg:p-8">
        <div className="order-1 space-y-4 lg:order-2 lg:space-y-6">
          <PresetSelector
            selectedPresetId={selectedPresetId}
            onSelectPreset={setSelectedPresetId}
          />
          <LineupBuilder lineupSlots={lineupSlots} onSlotsChange={setLineupSlots} />
          <ExportActions
            isLineupValid={isLineupValid}
            onLineupCountIncremented={setGlobalLineupCount}
          />
        </div>

        <div className="order-2 mt-6 lg:order-1 lg:mt-0 lg:self-start">
          <div className="lg:sticky lg:top-20">
            <PosterPreview presetId={selectedPresetId} lineupSlots={lineupSlots} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

