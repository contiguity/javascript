import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";
import { E164PhoneNumber, OptionalSenderNumber, TypingAction } from "@/types/common.ts";

export const WhatsAppTypingRequest = z.object({
	/** Recipient's WhatsApp number. Must be in E.164 format */
	to: E164PhoneNumber,
	/** Your leased WhatsApp number. If none is provided, we will use a random WhatsApp number of yours */
	from: OptionalSenderNumber,
	/** Whether to start or stop sending typing indicators */
	action: TypingAction
})

export const WhatsAppTypingResponse = z.object({
	/** Status of the typing indicator */
	status: z.string(),
})

export const WhatsAppTypingResponseFlattened = ContiguityResponse.extend({
	status: z.string(),
})

export const WhatsAppTypingResponseRaw = ContiguityRawResponse.extend({
	data: WhatsAppTypingResponse,
})

export type WhatsAppTypingParams = z.infer<typeof WhatsAppTypingRequest>;
export type WhatsAppTypingResponseType = z.infer<typeof WhatsAppTypingResponse>;

/**
 * Start or stop sending typing indicators over WhatsApp
 *
 * @example
 * ```typescript
 * // Start typing indicator
 * const response = await contiguity.whatsapp.typing({
 *   to: "+1234567890",
 *   action: "start"
 * });
 * console.log(`Typing status: ${response.status}`);
 * ```
 *
 * @example
 * ```typescript
 * // Stop typing indicator with specific sender number
 * const response = await contiguity.whatsapp.typing({
 *   to: "+1234567890",
 *   from: "+15555555555",
 *   action: "stop"
 * });
 * console.log(`Typing status: ${response.status}`);
 * ```
 */
export async function _whatsAppTyping(this: any, params: WhatsAppTypingParams): Promise<any> {
	const validatedParams = WhatsAppTypingRequest.parse(params);
	const response = await this.request("/send/whatsapp/typing", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: WhatsAppTypingResponse,
			raw: WhatsAppTypingResponseRaw
		}
	});
}
