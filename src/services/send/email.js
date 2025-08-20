import { z } from "zod"
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.js"

export const EmailSendRequest = z.object({
	/** Recipient email address(es). Can be a string or array of up to 10 addresses */
	to: z.union([
		z.email("Must be a valid email address"),
		z.array(z.email("Must be a valid email address")).max(10, "Maximum 10 email addresses allowed")
	]),
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
	cc: z.union([
		z.string().email("Must be a valid email address"),
		z.array(z.string().email("Must be a valid email address")).max(10, "Maximum 10 email addresses allowed")
	]).optional(),
	/** Blind carbon copy email address(es). Can be a string or array of up to 10 addresses */
	bcc: z.union([
		z.string().email("Must be a valid email address"),
		z.array(z.string().email("Must be a valid email address")).max(10, "Maximum 10 email addresses allowed")
	]).optional(),
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

export const EmailSendResponseRaw = ContiguityRawResponse.extend({
	data: EmailResponse,
})

/**
 * @typedef {Object} EmailBodyParams
 * @property {string} [text] - Text content of the email
 * @property {string} [html] - HTML content of the email
 */

/**
 * @typedef {Object} EmailHeaderParams
 * @property {string} name - Header name
 * @property {string} value - Header value
 */

/**
 * @typedef {Object} EmailSendParams
 * @property {string|string[]} to - Recipient email address(es). Can be a string or array of up to 10 addresses
 * @property {string} from - Provide either just your sender name (and use Contiguity's email) or provide your sender name and email (has to be verified in the Console)
 * @property {string} subject - Subject of the email
 * @property {EmailBodyParams} body - Email body content (must include either text or html)
 * @property {string} [reply_to] - Reply-to email address
 * @property {string|string[]} [cc] - Carbon copy email address(es). Can be a string or array of up to 10 addresses
 * @property {string|string[]} [bcc] - Blind carbon copy email address(es). Can be a string or array of up to 10 addresses
 * @property {EmailHeaderParams[]} [headers] - Custom email headers
 */

/**
 * @typedef {Object} EmailResponse
 * @property {string} email_id - The email's ID. Use it to refer to this email in the future
 */

/**
 * Sends an email
 *
 * @param {EmailSendParams} params - Email parameters
 * @returns {Promise<Object>} Response containing email_id and other details
 * @throws {ContiguityError} When the API request fails or validation errors occur
 *
 * @example
 * ```javascript
 * const response = await contiguity.send.email({
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
 * ```javascript
 * // Send to multiple recipients with CC and BCC
 * const response = await contiguity.send.email({
 *   to: ["user1@example.com", "user2@example.com"],
 *   from: "Your Company <no-reply@yourcompany.com>",
 *   subject: "Newsletter Update",
 *   body: {
 *     html: "<h1>Newsletter</h1><p>Latest updates...</p>"
 *   },
 *   cc: "manager@example.com",
 *   bcc: ["analytics@company.com"],
 *   reply_to: "support@yourcompany.com",
 *   headers: [
 *     { name: "X-Priority", value: "1" },
 *     { name: "X-Category", value: "newsletter" }
 *   ]
 * });
 * console.log(`Email ID: ${response.email_id}`);
 * ```
 */
export async function _email(params) {
	const validatedParams = EmailSendRequest.parse(params)
	const response = await this.request("/email", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	})

	return this.parse({
		response,
		schemas: {
			sdk: EmailResponse,
			raw: EmailSendResponseRaw
		}
	})
}
