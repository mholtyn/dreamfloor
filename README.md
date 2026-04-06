# Dreamfloor

A fan-made **fictional techno lineup poster** builder: pick a preset, build your artist list, live preview, export to PNG. No login.

Stack: **React 19**, **TypeScript**, **Vite 8**, **Tailwind 4**, UI patterns in the shadcn style. Export counter and artist-name suggestions use **Upstash Redis** via handlers in `api/` (in development, `/api/*` is served by a small Vite plugin so you do not run a separate API server).

Local setup, Upstash, and Vercel deploy: **[DEV.md](./DEV.md)**.

## Quick start

Requirements: **Node.js** (LTS) and **pnpm**.

```bash
pnpm install
```

Add Upstash variables to **`.env.local`** (see [DEV.md](./DEV.md)), then:

```bash
pnpm dev
```

## npm scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite dev server + local `/api/*` middleware |
| `pnpm build` | `tsc -b` + static production build → `dist/` |
| `pnpm preview` | Serves `dist/` only (`/api/*` does not run — see DEV.md) |
| `pnpm lint` | ESLint |
