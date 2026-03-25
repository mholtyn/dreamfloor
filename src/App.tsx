import { useEffect, useMemo, useRef, useState } from 'react';
import type { LineupSlot, VisualPresetId } from './types';
import { PresetGallery } from './components/PresetGallery';
import { LineupEditor } from './components/LineupEditor';
import { Poster } from './components/Poster';
import { exportPosterElementToPngBlob } from './utils/exportPoster';
import './App.css';

const posterDisclaimerText =
  'Fictional fan lineup — not affiliated with any venue or artists. No performances implied.';

const posterWebsiteFooterText = 'dreamfloor.io';

const baseLineupSlots: LineupSlot[] = [
  { slotStartTimeLabel: '23:00', slotDurationMinutes: 90, selectedArtistName: '' },
  { slotStartTimeLabel: '01:00', slotDurationMinutes: 60, selectedArtistName: '' },
  { slotStartTimeLabel: '03:00', slotDurationMinutes: 60, selectedArtistName: '' },
  { slotStartTimeLabel: '05:00', slotDurationMinutes: 60, selectedArtistName: '' },
];

async function fetchGlobalLineupCounter(): Promise<number> {
  const response = await fetch('/api/lineup-count');
  if (!response.ok) {
    return 0;
  }
  const payload = (await response.json()) as { count: number };
  return payload.count ?? 0;
}

async function incrementGlobalLineupCounter(): Promise<number> {
  const response = await fetch('/api/lineup-count', { method: 'POST' });
  if (!response.ok) {
    return 0;
  }
  const payload = (await response.json()) as { count: number };
  return payload.count ?? 0;
}

function downloadBlobAsFile(blob: Blob, fileName: string) {
  const objectUrl = window.URL.createObjectURL(blob);
  const anchorElement = document.createElement('a');
  anchorElement.href = objectUrl;
  anchorElement.download = fileName;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
  window.URL.revokeObjectURL(objectUrl);
}

function buildLineupShareText(lineupSlots: LineupSlot[]) {
  const filledArtists = lineupSlots.map((slot) => slot.selectedArtistName).filter(Boolean);
  if (filledArtists.length === 0) {
    return 'My fantasy techno lineup — generated with Dreamfloor.';
  }
  return `My fantasy techno lineup: ${filledArtists.join(', ')} — generated with Dreamfloor.`;
}

export default function App() {
  const [visualPresetId, setVisualPresetId] = useState<VisualPresetId>('festival_sunset');
  const [lineupSlots, setLineupSlots] = useState<LineupSlot[]>(baseLineupSlots);
  const [globalLineupCounter, setGlobalLineupCounter] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportErrorText, setExportErrorText] = useState<string>('');

  const posterCaptureWrapperRef = useRef<HTMLDivElement | null>(null);

  const isLineupValid = useMemo(() => {
    return lineupSlots.some((slot) => Boolean(slot.selectedArtistName));
  }, [lineupSlots]);

  useEffect(() => {
    fetchGlobalLineupCounter().then((nextCounter) => setGlobalLineupCounter(nextCounter));
  }, []);

  const capturePosterElement = () => {
    const wrapperElement = posterCaptureWrapperRef.current;
    if (!wrapperElement) {
      return null;
    }
    const posterElement = wrapperElement.querySelector('[data-poster-export-root="true"]') as HTMLElement | null;
    return posterElement;
  };

  async function handleExportToPngAndCount() {
    setExportErrorText('');
    if (!isLineupValid) {
      setExportErrorText('Add at least one artist before exporting.');
      return null;
    }

    const posterElement = capturePosterElement();
    if (!posterElement) {
      setExportErrorText('Poster element was not found.');
      return null;
    }

    setIsExporting(true);
    try {
      const pngBlob = await exportPosterElementToPngBlob(posterElement);

      // Global counter: increment after successful export.
      const updatedCounterValue = await incrementGlobalLineupCounter();
      if (updatedCounterValue > 0) {
        setGlobalLineupCounter(updatedCounterValue);
      }

      return pngBlob;
    } catch (error) {
      setExportErrorText(error instanceof Error ? error.message : 'Export failed.');
      return null;
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDownloadPng() {
    const pngBlob = await handleExportToPngAndCount();
    if (!pngBlob) {
      return;
    }
    const fileName = `dreamfloor-lineup-${visualPresetId}.png`;
    downloadBlobAsFile(pngBlob, fileName);
  }

  async function handleSharePng() {
    const pngBlob = await handleExportToPngAndCount();
    if (!pngBlob) {
      return;
    }

    const shareText = buildLineupShareText(lineupSlots);
    const pngFileName = `dreamfloor-lineup-${visualPresetId}.png`;
    const pngFileObject = new File([pngBlob], pngFileName, { type: 'image/png' });

    // Web Share API supports files on some mobile browsers. Fallback is download.
    const canShareFiles =
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      typeof (navigator as any).canShare === 'function' &&
      (navigator as any).canShare({ files: [pngFileObject] });

    if (canShareFiles) {
      try {
        await (navigator as any).share({
          files: [pngFileObject],
          title: 'Dreamfloor lineup',
          text: shareText,
        });
        return;
      } catch {
        // If share fails, fallback to download.
      }
    }

    downloadBlobAsFile(pngBlob, pngFileName);
  }

  return (
    <div className="appRoot">
      <header className="appHeader">
        <div className="appHeaderLeft">
          <div className="brandWord">Dreamfloor</div>
          <div className="brandSub">Techno lineup builder (fictional fan posters)</div>
        </div>

        <div className="appHeaderRight">
          <div className="counterBox" aria-label="Global lineup counter">
            Generated globally: <strong>{globalLineupCounter.toLocaleString()}</strong>
          </div>
        </div>
      </header>

      <main className="appMain">
        <section className="appControls">
          <h2 className="sectionTitle">1) Choose a visual frame</h2>
          <PresetGallery visualPresetId={visualPresetId} onChangeVisualPresetId={setVisualPresetId} />

          <h2 className="sectionTitle">2) Build your lineup</h2>
          <LineupEditor lineupSlots={lineupSlots} onChangeLineupSlots={setLineupSlots} />

          <div className="exportPanel">
            {exportErrorText ? <div className="exportError">{exportErrorText}</div> : null}

            <div className="exportButtons">
              <button
                type="button"
                className="primaryButton"
                disabled={isExporting}
                onClick={handleDownloadPng}
              >
                {isExporting ? 'Exporting...' : 'Download PNG'}
              </button>

              <button type="button" className="secondaryButton" disabled={isExporting} onClick={handleSharePng}>
                {isExporting ? 'Sharing...' : 'Share'}
              </button>
            </div>

            <div className="exportNote">
              Exports are counted globally after successful PNG generation. No login required.
            </div>
          </div>
        </section>

        <section className="appPosterPane" aria-label="Poster preview">
          <div className="posterPreviewScroller">
            <div ref={posterCaptureWrapperRef} className="posterCaptureWrapper">
              <Poster
                visualPresetId={visualPresetId}
                lineupSlots={lineupSlots}
                posterDisclaimerText={posterDisclaimerText}
                posterWebsiteFooterText={posterWebsiteFooterText}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

