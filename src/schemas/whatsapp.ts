import { z } from "zod";

export const whatsappSendSchema = z
    .object({
        to: z.string(),
        message: z.string(),
        from: z.string().optional(),
        fallback: z
            .object({
                when: z.array(z.enum(["whatsapp_unsupported", "whatsapp_fails"])),
                from: z.string().optional(),
            })
            .optional(),
        attachments: z.array(z.string()).optional(),
        fast_track: z.boolean().optional(),
    })
    .loose();

export const whatsappTypingSchema = z
    .object({
        to: z.string(),
        action: z.enum(["start", "stop"]),
        from: z.string().optional(),
    })
    .loose();

export const whatsappReactSchema = z
    .object({
        to: z.string(),
        reaction: z.string().nullable().optional(),
        message: z.string().nullable().optional(),
    })
    .loose();

export type WhatsappSendParams = z.infer<typeof whatsappSendSchema>;
export type WhatsappTypingParams = z.infer<typeof whatsappTypingSchema>;
export type WhatsappReactParams = z.infer<typeof whatsappReactSchema>;
