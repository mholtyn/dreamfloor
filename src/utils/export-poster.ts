import html2canvas from "html2canvas";

const POSTER_ELEMENT_ID = "poster-preview";
const EXPORT_SCALE = 2;
const EXPORT_FILENAME = "dreamfloor-poster.png";

export async function capturePosterAsBlob(): Promise<Blob | null> {
  const posterElement = document.getElementById(POSTER_ELEMENT_ID);
  if (!posterElement) return null;

  const canvas = await html2canvas(posterElement, {
    scale: EXPORT_SCALE,
    backgroundColor: null,
    useCORS: true,
  });

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/png",
    );
  });
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

export async function sharePosterBlob(blob: Blob): Promise<boolean> {
  if (navigator.share) {
    try {
      const posterFile = new File([blob], EXPORT_FILENAME, { type: "image/png" });
      await navigator.share({
        files: [posterFile],
        title: "Dreamfloor Lineup",
        text: "Check out my fictional techno lineup! Created with dreamfloor.io",
      });
      return true;
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}
