import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
import { E164PhoneNumber, OptionalSenderNumber, MessageContent, AttachmentList, createFallbackSchema } from "@/types/common";

export const WhatsAppSendRequest = z.object({
	/** Recipient's WhatsApp number. Must be in E.164 format */
	to: E164PhoneNumber,
	/** Your leased WhatsApp number. If none is provided, we will use a random WhatsApp number of yours */
	from: OptionalSenderNumber,
	/** The WhatsApp message to send */
	message: MessageContent,
	/** Should Contiguity fallback to SMS/RCS if the recipient does not have WhatsApp, or if WhatsApp fails to send? */
	fallback: createFallbackSchema("whatsapp", ["whatsapp_unsupported", "whatsapp_fails"]),
	/** Attachments to send. Can be a URL to your attachment (e.g. example.com/image.png) or a base64 string. Max 10 attachments, with a cumulative size of 50MB */
	attachments: AttachmentList
})

export const WhatsAppResponse = z.object({
	/** The message's ID. Use it to refer to this message in the future, when checking the status of the message or finding it in the Console */
	message_id: z.string(),
})

export const WhatsAppSendResponseFlattened = ContiguityResponse.extend({
	message_id: z.string(),
})

export const WhatsAppSendResponseRaw = ContiguityRawResponse.extend({
	data: WhatsAppResponse,
})

export type WhatsAppFallbackParams = {
	when: ("whatsapp_unsupported" | "whatsapp_fails")[];
	from?: string;
};

export type WhatsAppSendParams = z.infer<typeof WhatsAppSendRequest>;
export type WhatsAppSendResponse = z.infer<typeof WhatsAppResponse>;

/**
 * Sends a WhatsApp message
 *
 * @example
 * ```typescript
 * const response = await contiguity.whatsapp.send({
 *   to: "+1234567890",
 *   message: "Hello from Contiguity!"
 * });
 * console.log(`Message ID: ${response.message_id}`);
 * ```
 *
 * @example
 * ```typescript
 * // Send with fallback to SMS and attachments
 * const response = await contiguity.whatsapp.send({
 *   to: "+1234567890",
 *   from: "+15555555555",
 *   message: "Check out this image!",
 *   fallback: {
 *     when: ["whatsapp_unsupported", "whatsapp_fails"],
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
export async function _whatsAppSend(this: any, params: WhatsAppSendParams): Promise<any> {
	const validatedParams = WhatsAppSendRequest.parse(params);
	const response = await this.request("/send/whatsapp", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: WhatsAppResponse,
			raw: WhatsAppSendResponseRaw
		}
	});
}
