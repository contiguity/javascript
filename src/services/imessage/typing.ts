import { z } from "zod";
import { createResponse } from "@/types/base";
import { E164PhoneNumber, OptionalSenderNumber, TypingAction } from "@/types/common";

export const iMessageTypingRequest = z.object({
	/** Recipient's iMessage address. Must be in E.164 format */
	to: E164PhoneNumber,
	/** Your leased iMessage number. If none is provided, we will use a random iMessage number of yours */
	from: OptionalSenderNumber,
	/** Whether to start or stop sending typing indicators */
	action: TypingAction
})

export const iMessageTypingResponse = z.object({
	/** Status of the typing indicator */
	status: z.string(),
})

// Using the new base response builder
export const iMessageTypingResponseBuilder = createResponse(iMessageTypingResponse)

export type iMessageTypingParams = z.infer<typeof iMessageTypingRequest>;
export type iMessageTypingResponseType = z.infer<typeof iMessageTypingResponse>;

/**
 * Start or stop sending typing indicators over iMessage
 *
 * @example
 * ```typescript
 * // Start typing indicator
 * const response = await contiguity.imessage.typing({
 *   to: "+1234567890",
 *   action: "start"
 * });
 * console.log(`Typing status: ${response.status}`);
 * ```
 *
 * @example
 * ```typescript
 * // Stop typing indicator with specific sender number
 * const response = await contiguity.imessage.typing({
 *   to: "+1234567890",
 *   from: "+15555555555",
 *   action: "stop"
 * });
 * console.log(`Typing status: ${response.status}`);
 * ```
 */
export async function _iMessageTyping(this: any, params: iMessageTypingParams): Promise<any> {
	const validatedParams = iMessageTypingRequest.parse(params);
	const response = await this.request("/send/imessage/typing", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: iMessageTypingResponse,
			raw: iMessageTypingResponseBuilder.raw
		}
	});
}
