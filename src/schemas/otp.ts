import { z } from "zod";

export const otpSendSchema = z.object({ to: z.string(), language: z.string(), name: z.string().optional() }).loose();
/** @deprecated Use otpSendSchema instead. */
export const otpNewSchema = otpSendSchema;
export const otpVerifySchema = z.object({ otp_id: z.string(), otp: z.string() }).loose();
export const otpResendSchema = z.object({ otp_id: z.string() }).loose();
export const otpReverseServiceSchema = z.enum(["sms", "imessage"]);
export const otpReverseInitiateSchema = z
    .object({
        number: z.string(),
        factor: z.string().max(16).optional(),
        to: z.string().optional(),
        service: otpReverseServiceSchema.optional(),
        language: z.string().optional(),
        success_url: z.string().url().optional(),
    })
    .loose();

export type OtpReverseService = z.infer<typeof otpReverseServiceSchema>;
export type OtpSendParams = z.infer<typeof otpSendSchema>;
/** @deprecated Use OtpSendParams instead. */
export type OtpNewParams = OtpSendParams;
export type OtpVerifyParams = z.infer<typeof otpVerifySchema>;
export type OtpResendParams = z.infer<typeof otpResendSchema>;
export type OtpReverseInitiateParams = z.infer<typeof otpReverseInitiateSchema>;

export interface OtpReverseInitiateResponse {
    otp_id: string;
    number: string;
    factor: string;
    to: string;
    service: OtpReverseService;
    expires_at: string;
    ui: {
        text: string;
        qr_code: string;
    };
    success_url: string | null;
}

export interface OtpReverseVerifyResponse {
    otp_id: string;
    status: "pending" | "verified" | "cancelled" | "expired";
    expires_at: string;
}

export interface OtpReverseCancelResponse {
    otp_id: string;
    status: "cancelled";
}
