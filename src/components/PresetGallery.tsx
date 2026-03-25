import type { VisualPresetId } from '../types';
import { presetConfigurations } from '../presets/presetConfigs';
import './presetGallery.css';

type PresetGalleryProps = {
  visualPresetId: VisualPresetId;
  onChangeVisualPresetId: (nextPresetId: VisualPresetId) => void;
};

export function PresetGallery({ visualPresetId, onChangeVisualPresetId }: PresetGalleryProps) {
  return (
    <div className="presetGallery" aria-label="Preset selection">
      {presetConfigurations.map((preset) => {
        const isActive = preset.presetId === visualPresetId;
        return (
          <button
            key={preset.presetId}
            type="button"
            className={`presetCard ${isActive ? 'presetCardActive' : ''}`}
            onClick={() => onChangeVisualPresetId(preset.presetId)}
            aria-pressed={isActive}
          >
            <div className={`presetCardThumb presetCardThumb--${preset.presetId}`} aria-hidden="true" />
            <div className="presetCardText">
              <div className="presetCardName">{preset.displayName}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

