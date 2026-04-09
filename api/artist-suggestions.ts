import type { IncomingMessage, ServerResponse } from "node:http";
import { Redis } from "@upstash/redis";

type NodeApiRequest = IncomingMessage & {
    method?: string;
};
type NodeApiResponse = ServerResponse & {
    status: (statusCode: number) => NodeApiResponse;
    json: (jsonBody: unknown) => NodeApiResponse;
};

const suggestionHashKeyPrefix = "dreamfloor:artist_suggestion:";
const suggestionSortedSetKey = "dreamfloor:artist_suggestion_by_count";
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

async function readJsonRequestBody(requestObject: NodeApiRequest): Promise<unknown> {
    const requestBodyChunks: Buffer[] = [];
    for await (const requestBodyChunk of requestObject) {
        requestBodyChunks.push(
            Buffer.isBuffer(requestBodyChunk)
                ? requestBodyChunk
                : Buffer.from(requestBodyChunk),
        );
    }
    const requestBodyText = Buffer.concat(requestBodyChunks).toString("utf-8");
    return JSON.parse(requestBodyText);
}

export default async function handler(
    requestObject: NodeApiRequest,
    responseObject: NodeApiResponse,
): Promise<void> {
    if (requestObject.method !== "POST") {
        sendJsonResponse(
            responseObject,
            { error: "Method not allowed."},
            405,
        );
        return;
    }

    let parsedBody: unknown;
    try {
        parsedBody = await readJsonRequestBody(requestObject);
    } catch {
        sendJsonResponse(responseObject, { error: "Invalid JSON body"}, 400);
        return;
    }

    let artistNameFromBody: unknown = undefined;
    if (typeof parsedBody === "object" && parsedBody !== null) {
        const parsedBodyObject = parsedBody as { artistName?: unknown };
        artistNameFromBody = parsedBodyObject.artistName;
    }

    const validatedArtistName = validateArtistName(artistNameFromBody);

    if (validatedArtistName === null) {
        sendJsonResponse(
            responseObject,
            { error: "Invalid artistName"}, 400,
        );
        return;
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
        sendJsonResponse(responseObject, {
            ok: false,
            degraded: true,
            normalizedArtistName: normalizedArtistName,
            count: 0,
        });
        return;
    }

    sendJsonResponse(responseObject, {
        ok: true,
        normalizedArtistName: normalizedArtistName,
        count: Number(nextSuggestionCount),
    });
}
