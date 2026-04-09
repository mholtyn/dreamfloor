import type { IncomingMessage, ServerResponse } from "node:http";
import { Redis } from "@upstash/redis";

type NodeApiRequest = IncomingMessage & {
  method?: string;
};
type NodeApiResponse = ServerResponse & {
  status: (statusCode: number) => NodeApiResponse;
  json: (jsonBody: unknown) => NodeApiResponse;
};

const globalCounterKey = "dreamfloor:global_lineup_counter";
const redisRequestTimeoutMilliseconds = 2500;
const redisClient = Redis.fromEnv({
  enableAutoPipelining: false,
  signal: () => AbortSignal.timeout(redisRequestTimeoutMilliseconds),
});

function sendJsonResponse(
  responseObject: NodeApiResponse,
  responseBody: unknown,
  statusCode: number = 200,
): void {
  responseObject.setHeader("cache-control", "no-store");
  responseObject.status(statusCode).json(responseBody);
}

async function withTimeout<ValueType>(
  promise: Promise<ValueType>,
  operationName: string,
): Promise<ValueType> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<ValueType>((_resolve, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${operationName} timed out.`));
        }, redisRequestTimeoutMilliseconds);
      }),
    ]);
  } finally {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  }
}

export default async function handler(
  requestObject: NodeApiRequest,
  responseObject: NodeApiResponse,
): Promise<void> {
  if (requestObject.method === "GET") {
    try {
      const currentCount =
        (await withTimeout(
          redisClient.get<number>(globalCounterKey),
          "lineup-count GET",
        )) ?? 0;
      sendJsonResponse(responseObject, { count: currentCount });
      return;
    } catch {
      sendJsonResponse(responseObject, { count: 0, degraded: true }, 200);
      return;
    }
  }

  if (requestObject.method === "POST") {
    try {
      const nextCount = await withTimeout(
        redisClient.incr(globalCounterKey),
        "lineup-count POST",
      );
      sendJsonResponse(responseObject, { count: nextCount });
      return;
    } catch {
      sendJsonResponse(responseObject, { count: 0, degraded: true }, 200);
      return;
    }
  }

  sendJsonResponse(responseObject, { error: "Method not allowed." }, 405);
}
