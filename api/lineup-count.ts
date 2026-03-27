import { Redis } from "@upstash/redis"

const redisClient = Redis.fromEnv();

const globalCounterKey = "dreamfloor:global_lineup_counter";

function jsonResponse(body: unknown, status: number = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
        },
    })
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method === "GET") {
        const currentCount = (await redisClient.get<number>(globalCounterKey) ?? 0)
        return jsonResponse({ count: currentCount});
    }
    
    if (req.method === "POST") {
        const nextCount = await redisClient.incr(globalCounterKey);
        return jsonResponse({ count: nextCount})
    }
    
    return jsonResponse({ error: "Method not allowed."}, 405)
}


