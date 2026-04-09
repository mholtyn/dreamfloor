import { Redis } from "@upstash/redis";

const suggestionHashKeyPrefix = "dreamfloor:artist_suggestion:";
const suggestionSortedSetKey = "dreamfloor:artist_suggestion_by_count";
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
    let timeoutIdentifier: ReturnType<typeof setTimeout> | null = null;

    try {
        return await Promise.race([
            promise,
            new Promise<ValueType>((_resolve, reject) => {
                timeoutIdentifier = setTimeout(() => {
                    reject(new Error(`${operationName} timed out.`));
                }, redisRequestTimeoutMilliseconds);
            }),
        ]);
    } finally {
        if (timeoutIdentifier !== null) {
            clearTimeout(timeoutIdentifier);
        }
    }
}

function normalizeArtistName(artistNameRaw: string): string {
    return artistNameRaw
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
}

function validateArtistName(artistNameRaw: unknown): string | null {
    if (typeof artistNameRaw !== "string") return null;

    const trimmedArtistName = artistNameRaw.trim();
    if (trimmedArtistName.length <= 1) return null;
    if (trimmedArtistName.length > 32) return null;

    return trimmedArtistName;
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return jsonResponse(
            { error: "Method not allowed."},
            405,
        );
    }

    let parsedBody: unknown;
    try {
        parsedBody = await req.json();
    } catch {
        return jsonResponse({ error: "Invalid JSON body"}, 400);
    }

    let artistNameFromBody: unknown = undefined;
    if (typeof parsedBody === "object" && parsedBody !== null) {
        const parsedBodyObject = parsedBody as { artistName?: unknown };
        artistNameFromBody = parsedBodyObject.artistName;
    }

    const validatedArtistName = validateArtistName(artistNameFromBody);

    if (validatedArtistName === null) {
        return jsonResponse(
            { error: "Invalid artistName"}, 400,
        );
    }

    const normalizedArtistName = normalizeArtistName(validatedArtistName);
    const suggestionHashKey = `${suggestionHashKeyPrefix}${normalizedArtistName}`;

    let nextSuggestionCount: number | string;
    try {
        nextSuggestionCount = await withTimeout(
            redisClient.hincrby(suggestionHashKey, "count", 1),
            "artist-suggestions HINCRBY",
        );

        await withTimeout(
            redisClient.hset(suggestionHashKey, {
                latestOriginalName: validatedArtistName,
                normalizedName: normalizedArtistName,
                updatedAtIso: new Date().toISOString(),
            }),
            "artist-suggestions HSET",
        );

        await withTimeout(
            redisClient.zadd(suggestionSortedSetKey, {
                score: Number(nextSuggestionCount),
                member: normalizedArtistName,
            }),
            "artist-suggestions ZADD",
        );
    } catch {
        return jsonResponse({
            ok: false,
            degraded: true,
            normalizedArtistName: normalizedArtistName,
            count: 0,
        });
    }

    return jsonResponse({
        ok: true,
        normalizedArtistName: normalizedArtistName,
        count: Number(nextSuggestionCount),
    });
}
