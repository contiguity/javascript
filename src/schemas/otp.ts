import { z } from "zod";

export const otpNewSchema = z.object({ to: z.string(), language: z.string(), name: z.string() }).loose();
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

export type OtpNewParams = z.infer<typeof otpNewSchema>;
export type OtpVerifyParams = z.infer<typeof otpVerifySchema>;
export type OtpResendParams = z.infer<typeof otpResendSchema>;
export type OtpReverseInitiateParams = z.infer<typeof otpReverseInitiateSchema>;
