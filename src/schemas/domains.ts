import { z } from "zod";

export const domainsRegisterSchema = z
    .object({
        region: z.string().optional(),
        custom_return_path: z.string().optional(),
    })
    .loose();

export type DomainsRegisterOptions = z.infer<typeof domainsRegisterSchema>;
