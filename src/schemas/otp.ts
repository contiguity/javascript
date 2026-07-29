import { z } from "zod";

export const otpSendSchema = z.object({ to: z.string(), language: z.string(), name: z.string().optional() }).loose();
/** @deprecated Use otpSendSchema instead. */
export const otpNewSchema = otpSendSchema;
export const otpVerifySchema = z.object({ otp_id: z.string(), otp: z.string() }).loose();
export const otpResendSchema = z.object({ otp_id: z.string() }).loose();
export const otpReverseInitiateSchema = z
    .object({
        number: z.string(),
        factor: z.string().max(16).optional(),
        to: z.string().optional(),
        language: z.string().optional(),
        success_url: z.string().url().optional(),
    })
    .loose();

export type OtpSendParams = z.infer<typeof otpSendSchema>;
/** @deprecated Use OtpSendParams instead. */
export type OtpNewParams = OtpSendParams;
export type OtpVerifyParams = z.infer<typeof otpVerifySchema>;
export type OtpResendParams = z.infer<typeof otpResendSchema>;
export type OtpReverseInitiateParams = z.infer<typeof otpReverseInitiateSchema>;
