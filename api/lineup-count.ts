import { Redis } from "@upstash/redis";

const globalCounterKey = "dreamfloor:global_lineup_counter";
const redisRequestTimeoutMilliseconds = 2500;
const redisClient = Redis.fromEnv({
  enableAutoPipelining: false,
  signal: () => AbortSignal.timeout(redisRequestTimeoutMilliseconds),
});

function jsonResponse(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "GET") {
    try {
      const currentCount =
        (await withTimeout(
          redisClient.get<number>(globalCounterKey),
          "lineup-count GET",
        )) ?? 0;
      return jsonResponse({ count: currentCount });
    } catch {
      return jsonResponse({ count: 0, degraded: true }, 200);
    }
  }

  if (req.method === "POST") {
    try {
      const nextCount = await withTimeout(
        redisClient.incr(globalCounterKey),
        "lineup-count POST",
      );
      return jsonResponse({ count: nextCount });
    } catch {
      return jsonResponse({ count: 0, degraded: true }, 200);
    }
  }

  return jsonResponse({ error: "Method not allowed." }, 405);
}
