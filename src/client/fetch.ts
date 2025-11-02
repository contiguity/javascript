// Contiguity API client with auth, base url, error handling, etc.
import { z } from "zod";
import { ContiguityAPIError, ContiguityError } from "@/types/error";

// year | month | version (monthly) 
const LATEST_API_VERSION = "v2025.8.20";
const BASE_URL = "https://api.contiguity.com" // "http://localhost:8080";

export interface ContiguityClientOptions {
    debug?: boolean;
}

/**
 * Contiguity API client with request functionality
 */
export class ContiguityClient {
    protected readonly token: string;

    constructor(token: string, options: ContiguityClientOptions = {}) {
        if (!token || typeof token !== 'string') {
            throw new Error('API token is required and must be a string');
        }
        
        if (token.trim().length === 0) {
            throw new Error('API token cannot be empty');
        }

        this.token = token.trim();
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

            return data;
        } catch (error) {
            if (error instanceof ContiguityError) {
                throw error;
            }
            
            // Network or other errors
            throw ContiguityError.fromError(error);
        }
    }

    /**
     * Parse and normalize API responses to flattened format with metadata
     * This method handles different response formats from the Contiguity API
     * and normalizes them to a consistent flattened format.
     */
    parse<T extends z.ZodType>({
        response,
        schema
    }: {
        response: any;
        schema: T;
    }): any {
        // Parse the response data (schema validates response.data, not the full response)
        const responseData = schema.parse(response.data || response);
        
        // Return flattened response with metadata
        return {
            ...(typeof responseData === 'object' && responseData !== null ? responseData : {}),
            metadata: {
                id: response.id || "unknown",
                timestamp: response.timestamp || Date.now(),
                api_version: response.api_version || "unknown",
                object: response.object || "unknown",
            },
        };
    }
}
