import { z } from "zod";

export const textSendSchema = z
    .object({
        to: z.string(),
        message: z.string(),
        from: z.string().optional(),
        attachments: z.array(z.string()).max(3).optional(),
    })
    .loose();

export const textReactSchema = z
  .object({
    message_id: z.string().nullable().optional(),
    to: z.string().nullable().optional(),
    from: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    reaction: z.enum(["love", "thumbsup", "thumbsdown", "haha", "emphasized", "questioned"]),
  })
  .loose();

export type TextSendParams = z.infer<typeof textSendSchema>;
export type TextReactParams = z.infer<typeof textReactSchema>;
