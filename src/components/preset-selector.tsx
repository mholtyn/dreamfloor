import { Check } from "lucide-react";
import { PRESET_CONFIGS } from "../data/presets";
import { posthog } from "@/lib/posthog";
import type { PresetId } from "@/types";
import { cn } from "@/lib/utils";

type PresetSelectorProps = {
  selectedPresetId: PresetId;
  onSelectPreset: (presetId: PresetId) => void;
};

export function PresetSelector({
  selectedPresetId,
  onSelectPreset,
}: PresetSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Poster Style</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {PRESET_CONFIGS.map((presetConfig) => {
          const isSelected = presetConfig.presetId === selectedPresetId;
          return (
            <button
              key={presetConfig.presetId}
              type="button"
              className={cn(
                "relative rounded-lg border-2 p-1.5 transition-all duration-200 hover:scale-105 sm:p-2",
                isSelected
                  ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
                  : "border-border hover:border-muted-foreground/40",
              )}
              onClick={() => {
                posthog.capture("preset_selected", {
                  preset_id: presetConfig.presetId,
                  preset_name: presetConfig.displayName,
                });
                onSelectPreset(presetConfig.presetId);
              }}
              aria-pressed={isSelected}
            >
              <div
                className="aspect-3/4 rounded-md"
                style={{ background: presetConfig.background }}
              />

              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[0.65rem] font-bold sm:text-xs">
                  {presetConfig.displayName}
                </span>
                <div className="flex gap-0.5">
                  <span
                    className="size-1.5 rounded-full sm:size-2"
                    style={{ backgroundColor: presetConfig.accentColor }}
                  />
                  <span
                    className="size-1.5 rounded-full sm:size-2"
                    style={{ backgroundColor: presetConfig.secondaryTextColor }}
                  />
                  <span
                    className="size-1.5 rounded-full sm:size-2"
                    style={{ backgroundColor: presetConfig.titleColor }}
                  />
                </div>
              </div>

              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-purple-600 text-white sm:size-6">
                  <Check className="size-3 sm:size-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
