import { z } from "zod";
import { E164PhoneNumber } from "@/types/common";

export const OTPSendRequest = z.object({
	/** Recipient's phone number. Must be in E.164 format */
	to: E164PhoneNumber,
	/** Language of the OTP message */
	language: z.string().min(1, "Language cannot be empty"),
	/** Your app's name (customizes message to 'Your [name] code is...') */
	name: z.string().min(1, "App name cannot be empty"),
})

export const OTPSendResponse = z.object({
	/** The OTP's ID. Use it to refer to this verification in the future, such as when verifying the OTP or resending it. */
	otp_id: z.string(),
})

export type OTPSendParams = z.infer<typeof OTPSendRequest>;
export type OTPSendResponse = z.infer<typeof OTPSendResponse>;

/**
 * Sends a new OTP to the specified phone number
 *
 * @example
 * ```typescript
 * const response = await contiguity.otp.send({
 *   to: "+1234567890",
 *   language: "en",
 *   name: "My App"
 * });
 * console.log(`OTP ID: ${response.otp_id}`);
 * ```
 */
export async function _otpSend(this: any, params: OTPSendParams): Promise<any> {
	const validatedParams = OTPSendRequest.parse(params);
	const response = await this.request("/otp/new", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schema: OTPSendResponse
	});
}
