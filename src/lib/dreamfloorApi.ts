type ArtistSuggestionResponse = {
    ok: true,
    normalizedArtistName: string,
    count: number,
};

type LineupCountResponse = {
    count: number;
};

export async function fetchLineupCount(): Promise<number> {
    const response = await fetch("/api/lineup-count", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch lineup count. Status: ${response.status}`);
    }

    const parsedBody = (await response.json()) as LineupCountResponse;

    return parsedBody.count;
}

export async function incrementLineupCount(): Promise<number> {
    const response = await fetch("/api/lineup-count", {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error(`Failed to increment lineup count. Status: ${response.status}`);
    }

    const parsedBody = (await response.json()) as LineupCountResponse;

    return parsedBody.count;
}

export async function suggestArtist(artistName: string): Promise<number> {
    const response = await fetch("/api/artist-suggestions", {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8"},
        body: JSON.stringify({ artistName }),
    });

    if (!response.ok) {
        throw new Error(`Failed to send artist suggestion. Status ${response.status}`);
    }

    const parsedBody = (await response.json()) as ArtistSuggestionResponse;

    return parsedBody.count;
}
