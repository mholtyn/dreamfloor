import type { IncomingMessage, ServerResponse } from "node:http";

type NodeApiRequest = IncomingMessage;
type NodeApiResponse = ServerResponse & {
  status: (statusCode: number) => NodeApiResponse;
  json: (jsonBody: unknown) => NodeApiResponse;
};

/** GET /api/health — liveness check (also used by Vite dev plugin). */
export default async function handler(
  _requestObject: NodeApiRequest,
  responseObject: NodeApiResponse,
): Promise<void> {
  responseObject.setHeader("cache-control", "no-store");
  responseObject.status(200).json({ ok: true });
}
