/** GET /api/health — liveness check (also used by Vite dev plugin). */
export default async function handler(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
