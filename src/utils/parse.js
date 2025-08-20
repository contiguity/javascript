/**
 * Normalizes API responses to either raw or flattened format
 * This utility handles the complex logic of parsing different response formats
 * from the Contiguity API and normalizing them consistently.
 *
 * @param {Object} response - Raw response from API
 * @param {Object} dataSchema - Zod schema for the expected data format
 * @param {Object} rawResponseSchema - Zod schema for the raw response format
 * @param {boolean} returnRaw - Whether to return raw format or flatten the response
 * @returns {Object} Normalized response
 */
export function parseContiguityResponse(response, dataSchema, rawResponseSchema, returnRaw = false) {
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

	return returnRaw
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
