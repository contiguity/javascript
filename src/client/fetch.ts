// Contiguity API client with auth, base url, error handling, etc.
import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
import { ContiguityAPIError, ContiguityError } from "@/types/error";

// year | month | version (monthly) 
const LATEST_API_VERSION = "v2025.8.20";
const BASE_URL = "http://localhost:8080";

export interface ContiguityClientOptions {
    raw?: boolean;
    debug?: boolean;
}

/**
 * Contiguity API client with request functionality
 */
export class ContiguityClient {
    protected readonly token: string;
    protected readonly raw: boolean;

    constructor(token: string, options: ContiguityClientOptions = {}) {
        if (!token || typeof token !== 'string') {
            throw new Error('API token is required and must be a string');
        }
        
        if (token.trim().length === 0) {
            throw new Error('API token cannot be empty');
        }

        this.token = token.trim();
        this.raw = options.raw || false; // If true, return raw API responses
    }

    /**
     * Make an authenticated request to the Contiguity API
     */
    async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        const url = `${BASE_URL}${endpoint}`;
        
        const defaultHeaders = {
            "Authorization": `Bearer ${this.token}`,
            "Content-Type": "application/json",
            "User-Agent": "@contiguity/javascript",
            "X-Contiguity-API-Version": LATEST_API_VERSION,
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Validate error response with Zod
                const errorResult = ContiguityAPIError.safeParse(data);
                if (errorResult.success) {
                    throw new ContiguityError(errorResult.data);
                } else {
                    // Fallback error handling
                    throw new ContiguityError({
                        data: {
                            status: response.status,
                            error: (data as any)?.error || `HTTP ${response.status}: ${response.statusText}`,
                        }
                    });
                }
            }

                    // Validate successful response with Zod using raw response schema
        const result = ContiguityRawResponse.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
                                throw new ContiguityError({
                        data: {
                            status: 500,
                            error: "Invalid response format from API",
                        }
                    });
        }
        } catch (error) {
            if (error instanceof ContiguityError) {
                throw error;
            }
            
            // Network or other errors
            throw ContiguityError.fromError(error);
        }
    }

    /**
     * Parse and normalize API responses to either raw or flattened format
     * This method handles the complex logic of parsing different response formats
     * from the Contiguity API and normalizing them consistently.
     */
    parse<T extends z.ZodTypeAny, R extends z.ZodTypeAny>({
        response,
        schemas: { sdk, raw }
    }: {
        response: any;
        schemas: { sdk: T; raw: R; };
    }): any {
        // Handle different response formats:
        // 1. Already wrapped in response format (response.object === "response")
        // 2. Direct data that needs wrapping
        // 3. Fallback to raw parsing
        const validatedResponse =
            response.object === "response"
                ? raw.parse(response)
                : sdk.safeParse(response).success
                ? {
                        id: response.id || "unknown",
                        timestamp: response.timestamp || Date.now(),
                        api_version: response.api_version || "unknown",
                        object: response.object || "unknown",
                        data: sdk.parse(response),
                }
                : raw.parse(response)

        if (this.raw) {
            return validatedResponse;
        }

        // For flattened responses, we need to handle both formats
        const rawData = raw.parse(validatedResponse) as any;
        return {
            ...rawData.data,
            metadata: {
                id: rawData.id,
                timestamp: rawData.timestamp,
                api_version: rawData.api_version,
                object: rawData.object,
            },
        };
    }
}
