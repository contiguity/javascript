import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";

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
			raw: TextSendResponseRaw
		}
	});
}
