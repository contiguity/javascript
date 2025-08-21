import { z } from "zod";
import { ContiguityClient } from "@/client/fetch";
import type { WithMetadata } from "@/types/metadata";
import { _otpNew, type OTPNewParams, OTPNewResponse } from "./new";
import { _otpVerify, type OTPVerifyParams, OTPVerifyResponse } from "./verify";
import { _otpResend, type OTPResendParams, OTPResendResponse } from "./resend";

export type OTPNewResponseType = z.infer<typeof OTPNewResponse>;
export type OTPVerifyResponseType = z.infer<typeof OTPVerifyResponse>;
export type OTPResendResponseType = z.infer<typeof OTPResendResponse>;

/**
 * OTP service for sending, verifying, and resending one-time passwords
 */
export class OTPService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Send a new OTP to the specified phone number
     */
    async new(params: OTPNewParams): Promise<WithMetadata<OTPNewResponseType>> {
        return _otpNew.call(this, params);
    }

    /**
     * Verify an OTP code
     */
    async verify(params: OTPVerifyParams): Promise<WithMetadata<OTPVerifyResponseType>> {
        return _otpVerify.call(this, params);
    }

    /**
     * Resend an OTP to the same phone number
     */
    async resend(params: OTPResendParams): Promise<WithMetadata<OTPResendResponseType>> {
        return _otpResend.call(this, params);
    }
}
