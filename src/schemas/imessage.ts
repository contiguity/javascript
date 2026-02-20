import { z } from "zod";

export const imessageSendSchema = z
    .object({
        to: z.string(),
        message: z.string(),
        from: z.string().optional(),
        fallback: z
            .object({
                when: z.array(z.enum(["imessage_unsupported", "imessage_fails"])),
                from: z.string().optional(),
            })
            .optional(),
        attachments: z.array(z.string()).optional(),
    })
    .loose();

export const imessageTypingSchema = z
    .object({
        to: z.string(),
        action: z.enum(["start", "stop"]),
        from: z.string().optional(),
    })
    .loose();

export const imessageReactSchema = z
    .object({
        to: z.string(),
        from: z.string(),
        tapback: z.enum(["love", "like", "dislike", "laugh", "emphasize", "question"]),
        message: z.string(),
    })
    .loose();

export const imessageReadSchema = z
    .object({
        to: z.string(),
        from: z.string(),
    })
    .loose();

export type ImessageSendParams = z.infer<typeof imessageSendSchema>;
export type ImessageTypingParams = z.infer<typeof imessageTypingSchema>;
export type ImessageReactParams = z.infer<typeof imessageReactSchema>;
export type ImessageReadParams = z.infer<typeof imessageReadSchema>;
