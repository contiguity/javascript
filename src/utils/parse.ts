import { z } from "zod";

/**
 * Normalizes API responses to either raw or flattened format
 * This utility handles the complex logic of parsing different response formats
 * from the Contiguity API and normalizing them consistently.
 */
export function parseContiguityResponse<T extends z.ZodTypeAny, R extends z.ZodTypeAny>(
    response: any,
    dataSchema: T,
    rawResponseSchema: R,
    returnRaw: boolean = false
): any {
    // Handle different response formats:
    // 1. Already wrapped in response format (response.object === "response")
    // 2. Direct data that needs wrapping
    // 3. Fallback to raw parsing
    const validatedResponse =
        response.object === "response"
            ? rawResponseSchema.parse(response)
            : dataSchema.safeParse(response).success
                ? {
                    id: response.id || "unknown",
                    timestamp: response.timestamp || Date.now(),
                    api_version: response.api_version || "unknown",
                    object: response.object || "unknown",
                    data: dataSchema.parse(response),
                }
                : rawResponseSchema.parse(response)

    if (returnRaw) {
        return validatedResponse;
    }

    // For flattened responses, we need to handle both formats
    const rawData = rawResponseSchema.parse(validatedResponse) as any;
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
