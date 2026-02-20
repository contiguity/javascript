import { z } from "zod";

export const conversationHistorySchema = z
  .object({
    to: z.string(),
    from: z.string(),
    limit: z.number().optional(),
  })
  .loose();

export type ConversationHistoryParams = z.infer<typeof conversationHistorySchema>;
