import { z } from "zod";

export type NumberStatus = "available" | "g-available" | "leased" | "unavailable";

export interface AvailableLeaseNumber {
    id: string;
    status: NumberStatus;
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

export type LeaseStatus = "active" | "expired" | "terminated";

export interface LeasedNumber extends AvailableLeaseNumber {
    lease_id: string;
    lease_status: LeaseStatus;
}

export interface LeasedResponse {
    leased: number;
    numbers: LeasedNumber[];
}

export interface NumberFilters {
    capabilities?: string[];
    location?: {
        country?: string;
        region?: string;
        city?: string;
    };
}

export interface AvailableFilters extends NumberFilters {
    status?: NumberStatus;
}

export interface AvailableOptions {
    filter?: AvailableFilters;
}

export interface LeaseFilters extends NumberFilters {
    status?: LeaseStatus;
}

export interface LeasedOptions {
    filter?: LeaseFilters;
}

export const leaseCreateSchema = z
    .object({
        billing_method: z.enum(["monthly", "service_contract"]).optional(),
    })
    .loose();

export type LeaseCreateOptions = z.infer<typeof leaseCreateSchema>;
