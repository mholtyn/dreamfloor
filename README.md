# Dreamfloor App (v1.0)

**Dreamfloor** to kreator fanowskich techno lineupów: użytkownik wybiera styl (preset), wypełnia sloty artystami i eksportuje plakat jako **PNG** do pobrania / udostępnienia. Projekt ma **zero rejestracji** — a globalny licznik lineupów jest liczony tylko po udanym eksporcie.

## Najważniejsze funkcje

- Wybór wizualnego **presetu** (ramy).
- Edycja lineupów: `dzień + godzina` + **autocomplete** artystów.
- Podgląd plakatu w tej samej strukturze, z której robiony jest eksport.
- Eksport plakatu do **PNG** (z `html2canvas`).
- **Share** (Web Share API z fallbackiem do pobrania pliku).
- Globalny licznik przez `Vercel Functions` + `Upstash Redis`.

## Szybki start

### Lokalnie

Wymagania: Node.js + npm.

1. Przejdź do katalogu aplikacji:
   - `cd dreamfloor-app`
2. Uruchom dev server:
   - `npm run dev`
3. Produkcyjny build:
   - `npm run build`
4. Preview buildu:
   - `npm run preview`

### Upstash (Vercel)

Globalny licznik działa przez Upstash Redis. W ustawieniach środowiska w Vercel ustaw:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Endpointy licznika

Jedyny backendowy endpoint używany przez MVP:

- `GET /api/lineup-count` — odczyt globalnej liczby eksportów
- `POST /api/lineup-count` — atomowy increment po udanym eksporcie

Kod endpointu:
- `api/lineup-count.js`

## Produkcja (Vercel)

1. Utwórz projekt na Vercel wskazując na katalog `dreamfloor-app`.
2. Ustaw:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Dodaj zmienne środowiskowe Upstash (patrz sekcja wyżej).
4. Po wdrożeniu sprawdź w przeglądarce / logach, czy działa:
   - `GET /api/lineup-count`

