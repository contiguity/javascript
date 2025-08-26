import { z } from "zod";
import { ContiguityClient } from "@/client/fetch";
import type { WithMetadata } from "@/types/metadata";
import { _otpSend, type OTPSendParams, OTPSendResponse } from "./send";
import { _otpVerify, type OTPVerifyParams, OTPVerifyResponse } from "./verify";
import { _otpResend, type OTPResendParams, OTPResendResponse } from "./resend";

export type OTPSendResponseType = z.infer<typeof OTPSendResponse>;
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
     * @deprecated Use `send()` instead. This method will be removed in a future version.
     */
    async new(params: OTPSendParams): Promise<WithMetadata<OTPSendResponseType>> {
        return this.send(params);
    }

    /**
     * Send a new OTP to the specified phone number
     */
    async send(params: OTPSendParams): Promise<WithMetadata<OTPSendResponseType>> {
        return _otpSend.call(this, params);
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
