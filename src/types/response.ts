import { z } from "zod";

export const ContiguityResponse = z.object({
    metadata: z.object({
        id: z.string(),
        timestamp: z.number(),
        api_version: z.string(),
        object: z.string(),
    }),
    // we run zod.extend with data here.
});