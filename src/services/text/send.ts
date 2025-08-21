import { z } from "zod";
import { createResponse } from "@/types/base";
import { E164PhoneNumber, OptionalSenderNumber, MessageContent } from "@/types/common";

export const TextSendRequest = z.object({
	/** Recipient's phone number. Must be in E.164 format */
	to: E164PhoneNumber,
	/** If you lease a phone number from Contiguity, you can use a specific one by providing it here */
	from: OptionalSenderNumber,
	/** The text message to send */
	message: MessageContent,
})

export const TextResponse = z.object({
	/** The message's ID. Use it to refer to this message in the future */
	message_id: z.string(),
})

// Using the new base response builder - this replaces the manual Flattened/Raw definitions
export const TextSendResponse = createResponse(TextResponse)

export type TextSendParams = z.infer<typeof TextSendRequest>;
export type TextSendResponse = z.infer<typeof TextResponse>;

/**
 * Sends a text message
 *
 * @example
 * ```typescript
 * const response = await contiguity.text.send({
 *   to: "+1234567890",
 *   message: "Hello from Contiguity!"
 * });
 * console.log(`Message ID: ${response.message_id}`);
 * ```
 */
export async function _textSend(this: any, params: TextSendParams): Promise<any> {
	const validatedParams = TextSendRequest.parse(params);
	const response = await this.request("/send/text", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: TextResponse,
			raw: TextSendResponse.raw
		}
	});
}
