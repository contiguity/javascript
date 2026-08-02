import { z } from "zod";

const trackingSchema = z.boolean().nullish().default(false);

export const conversationGetSchema = z
    .object({
        tracking: trackingSchema,
    })
    .loose();

export const conversationHistorySchema = z
    .object({
        to: z.string(),
        from: z.string(),
        limit: z.number().optional(),
        tracking: trackingSchema,
    })
    .loose();

export type ConversationGetParams = z.input<typeof conversationGetSchema>;
export type ConversationHistoryParams = z.input<typeof conversationHistorySchema>;
