# Developer instructions

## Prerequisites

- **Node.js** (current LTS)
- **pnpm**

## How to run locally

**Upstash:** [Sign up](https://upstash.com/) → **Create database** (free tier is fine) → copy **REST API** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into **`.env.local`** at the project root (gitignored).

Restart **`pnpm dev`** after changing env. Handlers use `Redis.fromEnv()`; without valid Redis, `/api/lineup-count` and `/api/artist-suggestions` error.

```bash
pnpm install
pnpm dev
```

Dev serves `/api/*` via `vite-plugin-local-api.ts`. **`pnpm preview`** is static-only (no `/api`).

---

## Production (Vercel)

Production lives on **Vercel**. For day-to-day work you almost only need **[the Vercel dashboard](https://vercel.com/dashboard)** → pick this project.

There you see **Deployments** (what’s live, what failed), **Preview** builds for branches/PRs, **Logs**, and the **production URL**. Git is already hooked up: merge/push to the usual branch updates prod without you touching Vercel settings.

Ask to be **invited to the project** (or the team) so you can open that screen. Env vars and Git are already configured - you’re not expected to edit them for normal work.

For local API you still use **`.env.local`** + your own Upstash (see above); that’s separate from what’s stored in Vercel.
