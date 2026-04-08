import { toBlob } from "html-to-image";

const POSTER_ELEMENT_ID = "poster-preview";
const EXPORT_SCALE = 2;
const EXPORT_FILENAME = "dreamfloor-poster.png";

export type ShareOutcome =
  | "shared_via_native_dialog"
  | "downloaded_as_fallback"
  | "failed";

function getPosterElementForExport(): HTMLElement | null {
  const posterElement = document.getElementById(POSTER_ELEMENT_ID);
  if (!(posterElement instanceof HTMLElement)) {
    return null;
  }
  const boundingRectangle = posterElement.getBoundingClientRect();
  if (boundingRectangle.width <= 0 || boundingRectangle.height <= 0) {
    return null;
  }
  return posterElement;
}

export async function capturePosterAsBlob(): Promise<Blob | null> {
  const posterElement = getPosterElementForExport();
  if (!posterElement) return null;

  const blob = await toBlob(posterElement, {
    pixelRatio: EXPORT_SCALE,
    cacheBust: true,
    width: posterElement.offsetWidth,
    height: posterElement.offsetHeight,
    style: {
      transform: "none",
    },
  });

  return blob ?? null;
}

export function downloadBlob(blob: Blob): void {
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = EXPORT_FILENAME;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);
}

export async function sharePosterBlob(blob: Blob): Promise<ShareOutcome> {
  if (!navigator.share) {
    downloadBlob(blob);
    return "downloaded_as_fallback";
  }

  try {
    const posterFile = new File([blob], EXPORT_FILENAME, { type: "image/png" });
    await navigator.share({
      files: [posterFile],
      title: "Dreamfloor Lineup",
      text: "Check out my fictional techno lineup! Created with dreamfloor.io",
    });
    return "shared_via_native_dialog";
  } catch {
    downloadBlob(blob);
    return "downloaded_as_fallback";
  }
}

