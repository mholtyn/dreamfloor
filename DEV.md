# Dreamfloor App — Developer Notes (v1.0)

Ten dokument opisuje architekturę frontend+export oraz minimalny backend dla licznika (Vercel + Upstash).

## 1) Architektura (co jest gdzie)

### Frontend (React + Vite)

- Punkt wejścia:
  - `src/main.tsx`
  - `src/App.tsx` (UI: preset picker, editor lineupu, preview, eksport)

- Komponent plakatu:
  - `src/components/Poster.tsx`
  - Presety: `src/presets/*Poster.tsx` + CSS (`*.css`)
    - `FestivalSunsetPoster.tsx`
    - `SignalIndustrialPoster.tsx`

- Dane/konfiguracja:
  - `src/data/artists.ts` — katalog artystów do autocomplete
  - `src/presets/presetConfigs.ts` — lista dostępnych presetów (abstrakcyjne nazwy użytkownika)

- Editor lineupu:
  - `src/components/LineupEditor.tsx` — render slotów i autocomplete
  - `src/components/AutocompleteArtistInput.tsx` — autocomplete na bazie `artists.ts`

- Eksport PNG:
  - `src/utils/exportPoster.ts`
  - używa `html2canvas` i eksportuje element oznaczony atrybutem `data-poster-export-root="true"`

### Backend (licznik globalny)

- Endpointy (Vercel Functions):
  - `api/lineup-count.js`
    - `GET` zwraca `{ count: number }`
    - `POST` wykonuje atomowy `incr` w Upstash i zwraca `{ count: number }`

## 2) Jak działa eksport PNG (ważne „dla backend-first”)

1. Frontend renderuje plakat jako **DOM** (warstwy + tekst).
2. Użytkownik klika:
   - `Download PNG` lub `Share`
3. Kod znajduje element plakatu:
   - w `App.tsx` przez `querySelector('[data-poster-export-root="true"]')`
4. `html2canvas` rasteruje ten element do `canvas`.
5. Z `canvas` tworzy się `Blob` (`image/png`).
6. Po sukcesie eksportu:
   - wykonywany jest `POST /api/lineup-count` (globalny licznik).

Kluczowy powód oznaczania elementu: unikamy eksportu „pół strony” i trzymamy deterministyczny obszar renderu.

## 3) Lokalnie vs produkcyjnie (Vercel + Upstash)

### Lokalnie

- UI działa normalnie: `npm run dev`.
- Endpoint `/api/lineup-count` prawdopodobnie nie zadziała w czystym `npm run dev`, bo lokalny dev server Vite nie uruchamia automatycznie Vercel Functions.

Jeżeli chcesz testować backend lokalnie:
- użyj `vercel dev` (zalecane przy Vercel Functions).

### Produkcja

- Vercel:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - upewnij się, że `api/lineup-count.js` jest obsługiwane jako funkcja na ścieżce `/api/lineup-count`.

- Upstash:
  - Ustaw w Vercel env:
    - `UPSTASH_REDIS_REST_URL`
    - `UPSTASH_REDIS_REST_TOKEN`

## 4) Jak dodać kolejny preset

1. Dodaj komponent:
   - `src/presets/YourNewPresetPoster.tsx`
   - oraz CSS: `src/presets/yourNewPresetPoster.css`
2. Dodaj wpis do `src/presets/presetConfigs.ts`:
   - `presetId`, `displayName`, `posterWebsiteFooter`
3. Rozszerz `src/components/Poster.tsx`:
   - dopasuj `visualPresetId` do nowego komponentu.
4. Nie używaj marek klubów w UI ani w nagłówkach presetów (zgodnie z decyzją produktową).

## 5) Jak zmienić katalog artystów

- Edytuj `src/data/artists.ts`.
- Upewnij się, że:
  - `artistName` jest w formie wyświetlanej
  - ewentualne `aliases` poprawiają dopasowanie w autocomplete

## 6) Typowe problemy

- Eksport wygląda gorzej niż podgląd:
  - zwykle to kwestia fontów (upewnij się, że `document.fonts.ready` się odpala),
  - zbyt skomplikowanych blend/filter na warstwach,
  - problemów CORS przy obrazkach z zewnętrznych domen (w MVP unikamy zewnętrznych assetów do samego plakatu).

