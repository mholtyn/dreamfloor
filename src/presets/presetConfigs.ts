import type { VisualPresetId } from '../types';

export type PresetConfiguration = {
  presetId: VisualPresetId;
  displayName: string;
  posterWebsiteFooter: string;
};

export const presetConfigurations: PresetConfiguration[] = [
  {
    presetId: 'festival_sunset',
    displayName: 'Concrete Night',
    posterWebsiteFooter: 'dreamfloor.io',
  },
  {
    presetId: 'signal_industrial',
    displayName: 'Warehouse Signal',
    posterWebsiteFooter: 'dreamfloor.io',
  },
];

