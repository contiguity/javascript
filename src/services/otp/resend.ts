import { z } from "zod";
import { createResponse } from "@/types/base";

export const OTPResendRequest = z.object({
	/** The OTP ID you received when sending the OTP */
	otp_id: z.string().min(1, "OTP ID cannot be empty"),
})

export const OTPResendResponse = z.object({
	/** Whether the OTP was resent */
	resent: z.boolean(),
})

// Using the new base response builder
export const OTPResendResponseBuilder = createResponse(OTPResendResponse)

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
			raw: OTPResendResponseBuilder.raw
		}
	});
}
