import { z } from "zod"
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.js"

export const TextSendRequest = z.object({
	/** Recipient's phone number. Must be in E.164 format */
	to: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
	/** If you lease a phone number from Contiguity, you can use a specific one by providing it here */
	from: z.string().optional(),
	/** The text message to send */
	message: z.string().min(1, "Message cannot be empty"),
})

export const TextResponse = z.object({
	/** The message's ID. Use it to refer to this message in the future */
	message_id: z.string(),
})

export const TextSendResponseFlattened = ContiguityResponse.extend({
	message_id: z.string(),
})

export const TextSendResponseRaw = ContiguityRawResponse.extend({
	data: TextResponse,
})

/**
 * @typedef {Object} TextSendParams
 * @property {string} to - Phone number in E.164 format (e.g., "+1234567890")
 * @property {string} message - The text message to send
 * @property {string} [from] - If you lease a phone number from Contiguity, you can use a specific one
 */

/**
 * @typedef {Object} TextResponse
 * @property {string} message_id - The message's ID. Use it to refer to this message in the future
 */

/**
 * Sends a text message
 *
 * @param {TextSendParams} params - Message parameters
 * @returns {Promise<Object>} Response containing message_id and other details
 * @throws {ContiguityError} When the API request fails or validation errors occur
 *
 * @example
 * ```javascript
 * const response = await contiguity.send.text({
 *   to: "+1234567890",
 *   message: "Hello from Contiguity!"
 * });
 * console.log(`Message ID: ${response.message_id}`);
 * ```
 */
export async function _text(params) {
	const validatedParams = TextSendRequest.parse(params)
	const response = await this.request("/send/text", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	})

	return this.parse({
		response,
		schemas: {
			sdk: TextResponse,
			raw: TextSendResponseRaw
		}
	})
}
