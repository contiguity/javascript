// Contiguity API client with auth, base url, error handling, etc.
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.js";
import { ContiguityAPIError, ContiguityError } from "@/types/error.js";

// year | month | version (monthly) 
const LATEST_API_VERSION = "v2025.8.20";
const BASE_URL = "http://localhost:8080";

/**
 * Contiguity API client with request functionality
 */
export class ContiguityClient {
    constructor(token, options = {}) {
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
     * @param {string} endpoint - API endpoint 
     * @param {RequestInit} options - Fetch options
     * @returns {Promise<any>} Parsed and validated response data
     */
    async request(endpoint, options = {}) {
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
                            error: data.error || `HTTP ${response.status}: ${response.statusText}`,
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
                    status: "validation_error",
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
     * 
     * @param {Object} params - Parse parameters
     * @param {Object} params.response - Raw response from API
     * @param {Object} params.schemas - Zod schemas for validation
     * @param {Object} params.schemas.sdk - Zod schema for the expected data format (e.g., TextResponse)
     * @param {Object} params.schemas.raw - Zod schema for the raw response format (e.g., TextSendResponseRaw)
     * @returns {Object} Normalized response
     */
    parse({ response, schemas: { sdk, raw } }) {
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

        return this.raw
            ? validatedResponse
            : {
                    ...validatedResponse.data,
                    metadata: {
                        id: validatedResponse.id,
                        timestamp: validatedResponse.timestamp,
                        api_version: validatedResponse.api_version,
                        object: validatedResponse.object,
                    },
            }
    }
}
