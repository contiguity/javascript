import { z } from "zod";

/**
 * Common validation schemas used across multiple services
 */

// Phone number validation - used in text, iMessage, WhatsApp, and lease services
export const E164PhoneNumber = z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format");

// Message validation - used across messaging services
export const MessageContent = z.string().min(1, "Message cannot be empty");

// Optional sender number - used across messaging services
export const OptionalSenderNumber = z.string().optional();

// Attachment validation - used in iMessage and WhatsApp
export const AttachmentList = z
    .array(z.string().min(1, "Attachment cannot be empty"))
    .max(10, "Maximum 10 attachments allowed")
    .optional();

// Email validation patterns - used in email service
export const SingleOrMultipleEmails = (maxCount: number = 10, fieldName: string = "email") => 
    z.union([
        z.email(`Must be a valid ${fieldName} address`),
        z.array(z.email(`Must be a valid ${fieldName} address`))
            .max(maxCount, `Maximum ${maxCount} ${fieldName} addresses allowed`)
    ]);

// Typing action validation - used in iMessage and WhatsApp typing
export const TypingAction = z.enum(["start", "stop"]).describe("Action must be either 'start' or 'stop'");

// Common status enums
export const NumberStatus = z.enum(["available", "g-available", "leased", "unavailable"]);

export const LeaseStatus = z.enum(["active", "expired", "terminated"]);

export const BillingMethod = z.enum(["monthly", "service_contract", "goodwill"]);

export const Currency = z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]);

export const Carrier = z.enum([
    "T-Mobile",
    "AT&T",
    "Verizon",
    "Contiguity",
    "International Partner"
]);

export const MessageChannel = z.enum([
    "sms",
    "mms",
    "rcs",
    "imessage",
    "whatsapp"
]);

export const createFallbackSchema = <T extends string>(
    serviceType: T,
    fallbackConditions: readonly [T, ...T[]]
) => z.object({
    /** When to fallback to SMS/RCS */
    when: z.array(z.enum(fallbackConditions)).min(1, "At least one fallback condition must be specified"),
    /** Fallback sender number */
    from: OptionalSenderNumber
}).optional();

// Common request function type
export type RequestFunction<TParams, TResponse> = (
    this: any,
    params: TParams
) => Promise<TResponse>;
