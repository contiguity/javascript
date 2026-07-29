import { z } from "zod";

export interface AvailableLeaseNumber {
    id: string;
    status: string;
    number: {
        e164: string;
        formatted: string;
    };
    location: {
        country: string;
        region: string;
        city: string;
    };
    carrier: string;
    capabilities: {
        intl_sms: boolean;
        channels: string[];
    };
    health: {
        reputation: number;
        previous_owners: number;
    };
    data: {
        requirements?: string[];
        e911_capable?: boolean;
        [key: string]: unknown;
    };
    created_at: string | number;
    pricing: {
        currency: string;
        upfront_fee: number;
        monthly_rate: number;
    };
}

export interface LeaseAvailableResponse {
    available: number;
    numbers: AvailableLeaseNumber[];
}

export const leaseCreateSchema = z
    .object({
        billing_method: z.enum(["monthly", "service_contract"]).optional(),
    })
    .loose();

export type LeaseCreateOptions = z.infer<typeof leaseCreateSchema>;
