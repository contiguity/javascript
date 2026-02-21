import { transformResponse, type RawApiResponse } from "./response.js";
import { ContiguityError } from "./errors.js";

const BASE_URLS = {
    send: "https://api.contiguity.com/send",
    otp: "https://api.contiguity.com/otp",
    domains: "https://api.contiguity.com/domains",
    numbers: "https://api.contiguity.com/numbers",
    conversations: "https://api.contiguity.com/conversations",
    voice: "https://api.contiguity.com/voice",
} as const;

export type ApiBase = keyof typeof BASE_URLS;

export interface RequestConfig {
    token: string;
    base: ApiBase;
    debug?: boolean;
}

export async function request<T = Record<string, unknown>>(
    config: RequestConfig,
    path: string,
    options: {
        method?: "GET" | "POST" | "DELETE";
        body?: Record<string, unknown>;
    } = {}
): Promise<T & { metadata: { id: string; timestamp: string; api_version: string; object: string } }> {
    const { token, base, debug } = config;
    const url = `${BASE_URLS[base]}${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
    };
    if (debug) {
        console.debug("[Contiguity]", options.method ?? "GET", url, options.body ?? "");
    }
    const res = await fetch(url, {
        method: options.method ?? "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const json = (await res.json()) as RawApiResponse & {
        data?: { error?: string; status?: number };
        message?: string;
        status?: number;
    };
    if (!res.ok) {
        // Default API shape: data: { error, status }. Occasional: { message, status } at top level.
        const errMsg =
            json.data?.error ??
            json.message ??
            json.object ??
            "Unknown error";
        const status = json.data?.status ?? json.status ?? res.status;
        throw new ContiguityError(errMsg, status);
    }
    return transformResponse(json as RawApiResponse) as T & {
        metadata: { id: string; timestamp: string; api_version: string; object: string };
    };
}
