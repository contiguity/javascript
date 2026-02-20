import type { ResponseMetadata } from "../types/responses.js";

export interface RawApiResponse {
    id: string;
    timestamp: number;
    api_version: string;
    object: string;
    data: Record<string, unknown>;
}

export function transformResponse(res: RawApiResponse): Record<string, unknown> & { metadata: ResponseMetadata } {
    const metadata: ResponseMetadata = {
        id: res.id,
        timestamp: String(res.timestamp),
        api_version: res.api_version,
        object: res.object,
    };
    return { ...res.data, metadata };
}
