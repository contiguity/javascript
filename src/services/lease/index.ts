import { ContiguityClient } from "@/client/fetch.ts";
import { _leaseAvailable } from "@/services/lease/available.ts";
import { _leaseGet } from "@/services/lease/get.ts";
import { _leaseCreate } from "@/services/lease/create.ts";
import { _leasedNumbers } from "@/services/lease/leased.ts";
import { _leaseDetails } from "@/services/lease/details.ts";
import { _leaseTerminate } from "@/services/lease/terminate.ts";
import { z } from "zod";
import { 
    LeaseAvailableResponse
} from "@/services/lease/available.ts";
import {
    LeaseGetRequest,
    LeaseGetResponse
} from "@/services/lease/get.ts";
import {
    LeaseCreateRequest,
    LeaseCreateResponse
} from "@/services/lease/create.ts";
import {
    LeaseLeasedResponse
} from "@/services/lease/leased.ts";
import {
    LeaseDetailsRequest,
    LeaseDetailsResponse
} from "@/services/lease/details.ts";
import {
    LeaseTerminateRequest,
    LeaseTerminateResponse
} from "@/services/lease/terminate.ts";
import type { WithMetadata } from "@/types/metadata.ts";

export type LeaseAvailableResponseType = z.infer<typeof LeaseAvailableResponse>;
export type LeaseGetParams = z.infer<typeof LeaseGetRequest>;
export type LeaseGetResponseType = z.infer<typeof LeaseGetResponse>;
export type LeaseCreateParams = z.infer<typeof LeaseCreateRequest>;
export type LeaseCreateResponseType = z.infer<typeof LeaseCreateResponse>;
export type LeaseLeasedResponseType = z.infer<typeof LeaseLeasedResponse>;
export type LeaseDetailsParams = z.infer<typeof LeaseDetailsRequest>;
export type LeaseDetailsResponseType = z.infer<typeof LeaseDetailsResponse>;
export type LeaseTerminateParams = z.infer<typeof LeaseTerminateRequest>;
export type LeaseTerminateResponseType = z.infer<typeof LeaseTerminateResponse>;

/**
 * Lease service for managing phone number leases
 */
export class LeaseService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Get all phone numbers available for lease
     */
    async available(): Promise<WithMetadata<LeaseAvailableResponseType>> {
        return _leaseAvailable.call(this);
    }

    /**
     * Get information about a specific number available for lease
     */
    async get(params: LeaseGetParams): Promise<WithMetadata<LeaseGetResponseType>> {
        return _leaseGet.call(this, params);
    }

    /**
     * Lease a specific phone number
     */
    async create(params: LeaseCreateParams): Promise<WithMetadata<LeaseCreateResponseType>> {
        return _leaseCreate.call(this, params);
    }

    /**
     * Get all phone numbers currently leased by the user
     */
    async leased(): Promise<WithMetadata<LeaseLeasedResponseType>> {
        return _leasedNumbers.call(this);
    }

    /**
     * Get information about a specific leased number
     */
    async details(params: LeaseDetailsParams): Promise<WithMetadata<LeaseDetailsResponseType>> {
        return _leaseDetails.call(this, params);
    }

    /**
     * Terminate your lease for a number
     */
    async terminate(params: LeaseTerminateParams): Promise<WithMetadata<LeaseTerminateResponseType>> {
        return _leaseTerminate.call(this, params);
    }
}
