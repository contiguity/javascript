import { z } from "zod";
import { createResponse } from "@/types/base";
import { E164PhoneNumber, OptionalSenderNumber, MessageContent, AttachmentList, createFallbackSchema } from "@/types/common";

export const iMessageSendRequest = z.object({
	/** Recipient's iMessage address. Must be in E.164 format */
	to: E164PhoneNumber,
	/** Your leased iMessage number. If none is provided, we will use a random iMessage number of yours */
	from: OptionalSenderNumber,
	/** The iMessage to send */
	message: MessageContent,
	/** Should Contiguity fallback to SMS/RCS if the recipient does not have iMessage, or if iMessage fails to send? */
	fallback: createFallbackSchema("imessage", ["imessage_unsupported", "imessage_fails"]),
	/** Attachments to send. Can be a URL to your attachment (e.g. example.com/image.png) or a base64 string. Max 10 attachments, with a cumulative size of 50MB */
	attachments: AttachmentList
})

export const iMessageResponse = z.object({
	/** The message's ID. Use it to refer to this message in the future, when checking the status of the message or finding it in the Console */
	message_id: z.string(),
})

// Using the new base response builder - this replaces the manual Flattened/Raw definitions
export const iMessageSendResponse = createResponse(iMessageResponse)

export type iMessageFallbackParams = {
	when: ("imessage_unsupported" | "imessage_fails")[];
	from?: string;
};

export type iMessageSendParams = z.infer<typeof iMessageSendRequest>;
export type iMessageSendResponse = z.infer<typeof iMessageResponse>;

/**
 * Sends an iMessage
 *
 * @example
 * ```typescript
 * const response = await contiguity.imessage.send({
 *   to: "+1234567890",
 *   message: "Hello from Contiguity!"
 * });
 * console.log(`Message ID: ${response.message_id}`);
 * ```
 *
 * @example
 * ```typescript
 * // Send with fallback to SMS and attachments
 * const response = await contiguity.imessage.send({
 *   to: "+1234567890",
 *   from: "+15555555555",
 *   message: "Check out this image!",
 *   fallback: {
 *     when: ["imessage_unsupported", "imessage_fails"],
 *     from: "+15555555555"
 *   },
 *   attachments: [
 *     "https://example.com/image.png",
 *     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34..."
 *   ]
 * });
 * console.log(`Message ID: ${response.message_id}`);
 * ```
 */
export async function _iMessageSend(this: any, params: iMessageSendParams): Promise<any> {
	const validatedParams = iMessageSendRequest.parse(params);
	const response = await this.request("/send/imessage", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: iMessageResponse,
			raw: iMessageSendResponse.raw
		}
	});
}
