import { Redis } from "@upstash/redis";

const redisClient = Redis.fromEnv({ enableAutoPipelining: false });

const suggestionHashKeyPrefix = "dreamfloor:artist_suggestion:";
const suggestionSortedSetKey = "dreamfloor:artist_suggestion_by_count";

function jsonResponse(body: unknown, status: number = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
        },
    });
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

    const nextSuggestionCount = await redisClient.hincrby(
        suggestionHashKey,
        "count",
        1,
    );

    await redisClient.hset(suggestionHashKey, {
        latestOriginalName: validatedArtistName,
        normalizedName: normalizedArtistName,
        updatedAtIso: new Date().toISOString(),
    });

    await redisClient.zadd(suggestionSortedSetKey, {
        score: Number(nextSuggestionCount),
        member: normalizedArtistName,
    });

    return jsonResponse({
        ok: true,
        normalizedArtistName: normalizedArtistName,
        count: Number(nextSuggestionCount),
    });
}
