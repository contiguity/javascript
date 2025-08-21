import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";

export const OTPResendRequest = z.object({
	/** The OTP ID you received when sending the OTP */
	otp_id: z.string().min(1, "OTP ID cannot be empty"),
})

export const OTPResendResponse = z.object({
	/** Whether the OTP was resent */
	resent: z.boolean(),
})

export const OTPResendResponseFlattened = ContiguityResponse.extend({
	resent: z.boolean(),
})

export const OTPResendResponseRaw = ContiguityRawResponse.extend({
	data: OTPResendResponse,
})

export type OTPResendParams = z.infer<typeof OTPResendRequest>;
export type OTPResendResponse = z.infer<typeof OTPResendResponse>;

/**
 * Resends an OTP to the same phone number
 *
 * @example
 * ```typescript
 * const response = await contiguity.otp.resend({
 *   otp_id: "otp_1234567890"
 * });
 * console.log(`Resent: ${response.resent}`);
 * ```
 */
export async function _otpResend(this: any, params: OTPResendParams): Promise<any> {
	const validatedParams = OTPResendRequest.parse(params);
	const response = await this.request("/otp/resend", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: OTPResendResponse,
			raw: OTPResendResponseRaw
		}
	});
}
