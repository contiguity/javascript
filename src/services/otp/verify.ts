import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";

export const OTPVerifyRequest = z.object({
	/** The OTP ID you received when sending the OTP */
	otp_id: z.string().min(1, "OTP ID cannot be empty"),
	/** The OTP inputted by the user */
	otp: z.string().min(1, "OTP cannot be empty"),
})

export const OTPVerifyResponse = z.object({
	/** Whether the OTP was verified or not */
	verified: z.boolean(),
})

export const OTPVerifyResponseFlattened = ContiguityResponse.extend({
	verified: z.boolean(),
})

export const OTPVerifyResponseRaw = ContiguityRawResponse.extend({
	data: OTPVerifyResponse,
})

export type OTPVerifyParams = z.infer<typeof OTPVerifyRequest>;
export type OTPVerifyResponse = z.infer<typeof OTPVerifyResponse>;

/**
 * Verifies an OTP code
 *
 * @example
 * ```typescript
 * const response = await contiguity.otp.verify({
 *   otp_id: "otp_1234567890",
 *   otp: "123456"
 * });
 * console.log(`Verified: ${response.verified}`);
 * ```
 */
export async function _otpVerify(this: any, params: OTPVerifyParams): Promise<any> {
	const validatedParams = OTPVerifyRequest.parse(params);
	const response = await this.request("/otp/verify", {
		method: "POST",
		body: JSON.stringify(validatedParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: OTPVerifyResponse,
			raw: OTPVerifyResponseRaw
		}
	});
}
