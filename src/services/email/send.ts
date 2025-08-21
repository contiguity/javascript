import { z } from "zod";
import { createResponse } from "@/types/base";
import { SingleOrMultipleEmails } from "@/types/common";

export const EmailSendRequest = z.object({
	/** Recipient email address(es). Can be a string or array of up to 10 addresses */
	to: SingleOrMultipleEmails(10, "email"),
	/** Provide either just your sender name (and use Contiguity's email) or provide your sender name and email (has to be verified in the Console) */
	from: z.string().min(1, "From field cannot be empty"),
	/** Subject of the email */
	subject: z.string().min(1, "Subject cannot be empty"),
	/** Email body content */
	body: z.object({
		/** Text content of the email */
		text: z.string().optional(),
		/** HTML content of the email */
		html: z.string().optional()
	}).refine(
		(data) => data.text || data.html,
		"Either text or html content must be provided"
	),
	/** Reply-to email address */
	reply_to: z.string().email("Must be a valid email address").optional(),
	/** Carbon copy email address(es). Can be a string or array of up to 10 addresses */
	cc: SingleOrMultipleEmails(10, "email").optional(),
	/** Blind carbon copy email address(es). Can be a string or array of up to 10 addresses */
	bcc: SingleOrMultipleEmails(10, "email").optional(),
	/** Custom email headers */
	headers: z.array(z.object({
		/** Header name */
		name: z.string().min(1, "Header name cannot be empty"),
		/** Header value */
		value: z.string().min(1, "Header value cannot be empty")
	})).optional()
})

export const EmailResponse = z.object({
	email_id: z.string(),
})

// Using the new base response builder
export const EmailSendResponse = createResponse(EmailResponse)

export type EmailBodyParams = {
	text?: string;
	html?: string;
};

export type EmailHeaderParams = {
	name: string;
	value: string;
};

export type EmailSendParams = z.infer<typeof EmailSendRequest>;
export type EmailSendResponseType = z.infer<typeof EmailResponse>;

/**
 * Sends an email
 *
 * @example
 * ```typescript
 * const response = await contiguity.email.send({
 *   to: "recipient@example.com",
 *   from: "Contiguity <no-reply@contiguity.com>",
 *   subject: "Hello from Contiguity!",
 *   body: {
 *     text: "Hello, world!",
 *     html: "<p>Hello, world!</p>"
 *   }
 * });
 * console.log(`Email ID: ${response.email_id}`);
 * ```
 *
 * @example
 * ```typescript
 * // Send to multiple recipients with CC and BCC
 * const response = await contiguity.email.send({
 *   to: ["user1@example.com", "user2@example.com"],
 *   from: "Your Company <no-reply@yourcompany.com>",
 *   subject: "Newsletter Update",
 *   body: {
 *     html: "<h1>Newsletter</h1><p>Latest updates...</p>"
 *   },
 *   cc: "manager@example.com",
 *   bcc: ["analytics@company.com"],
 *   reply_to: "support@yourcompany.com"
 * });
 * console.log(`Email ID: ${response.email_id}`);
 * ```
 */
export async function _emailSend(this: any, params: EmailSendParams): Promise<any> {
	const validatedParams = EmailSendRequest.parse(params);
	const response = await this.request("/email", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: EmailResponse,
			raw: EmailSendResponse.raw
		}
	});
}
