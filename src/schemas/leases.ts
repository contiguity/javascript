import { z } from "zod";

export const leaseCreateSchema = z
    .object({
        billing_method: z.enum(["monthly", "service_contract"]).optional(),
    })
    .loose();

export type LeaseCreateOptions = z.infer<typeof leaseCreateSchema>;
