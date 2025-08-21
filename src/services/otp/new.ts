import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";
import { E164PhoneNumber } from "@/types/common.ts";

export const OTPNewRequest = z.object({
	/** Recipient's phone number. Must be in E.164 format */
	to: E164PhoneNumber,
	/** Language of the OTP message */
	language: z.string().min(1, "Language cannot be empty"),
	/** Your app's name (customizes message to 'Your [name] code is...') */
	name: z.string().min(1, "App name cannot be empty"),
})

export const OTPNewResponse = z.object({
	/** The OTP's ID. Use it to refer to this verification in the future, such as when verifying the OTP or resending it. */
	otp_id: z.string(),
})

export const OTPNewResponseFlattened = ContiguityResponse.extend({
	otp_id: z.string(),
})

export const OTPNewResponseRaw = ContiguityRawResponse.extend({
	data: OTPNewResponse,
})

export type OTPNewParams = z.infer<typeof OTPNewRequest>;
export type OTPNewResponse = z.infer<typeof OTPNewResponse>;

/**
 * Sends a new OTP to the specified phone number
 *
 * @example
 * ```typescript
 * const response = await contiguity.otp.new({
 *   to: "+1234567890",
 *   language: "en",
 *   name: "My App"
 * });
 * console.log(`OTP ID: ${response.otp_id}`);
 * ```
 */
export async function _otpNew(this: any, params: OTPNewParams): Promise<any> {
	const validatedParams = OTPNewRequest.parse(params);
	const response = await this.request("/otp/new", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: OTPNewResponse,
			raw: OTPNewResponseRaw
		}
	});
}
