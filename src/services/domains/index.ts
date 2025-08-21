import { z } from "zod";
import { ContiguityClient } from "@/client/fetch";
import type { WithMetadata } from "@/types/metadata";
import { _domainsList, DomainsListResponse } from "./list";
import { _domainsGet, type DomainsGetParams, DomainsGetResponse } from "./get";
import { _domainsRegister, type DomainsRegisterParams, DomainsRegisterResponse } from "./register";
import { _domainsDelete, type DomainsDeleteParams, DomainsDeleteResponse } from "./delete";

export type DomainsListResponseType = z.infer<typeof DomainsListResponse>;
export type DomainsGetResponseType = z.infer<typeof DomainsGetResponse>;
export type DomainsRegisterResponseType = z.infer<typeof DomainsRegisterResponse>;
export type DomainsDeleteResponseType = z.infer<typeof DomainsDeleteResponse>;

/**
 * Domains service for managing email domains
 */
export class DomainsService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * List all domains owned by the user
     */
    async list(): Promise<WithMetadata<DomainsListResponseType>> {
        return _domainsList.call(this);
    }

    /**
     * Get domain verification status and DNS instructions
     */
    async get(params: DomainsGetParams): Promise<WithMetadata<DomainsGetResponseType>> {
        return _domainsGet.call(this, params);
    }

    /**
     * Register a domain for email sending
     */
    async register(params: DomainsRegisterParams): Promise<WithMetadata<DomainsRegisterResponseType>> {
        return _domainsRegister.call(this, params);
    }

    /**
     * Delete a domain from your account
     */
    async delete(params: DomainsDeleteParams): Promise<WithMetadata<DomainsDeleteResponseType>> {
        return _domainsDelete.call(this, params);
    }
}
