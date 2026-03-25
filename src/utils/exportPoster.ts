import html2canvas from 'html2canvas';

export async function exportPosterElementToPngBlob(posterElement: HTMLElement) {
  // html2canvas: kluczowe jest, by poczekać na fonty i dać przeglądarce dokończyć layout.
  await document.fonts.ready;
  await new Promise((resolve) => window.setTimeout(resolve, 50));

  const canvas = await html2canvas(posterElement, {
    backgroundColor: null,
    useCORS: false,
    scale: 2,
  });

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create PNG blob'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });

  return pngBlob;
}

