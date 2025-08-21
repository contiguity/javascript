import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";

// Domain object schema based on OpenAPI spec
export const DomainInfo = z.object({
	/** The domain name */
	domain: z.string(),
	/** Domain verification status */
	status: z.string(),
	/** Domain creation timestamp */
	created_at: z.number(),
	/** Domain ID */
	id: z.string(),
	/** AWS region */
	region: z.string(),
	/** Whether sending is allowed */
	sending_allowed: z.boolean(),
});

export const DomainsListResponse = z.object({
	/** List of user's domains */
	domains: z.array(DomainInfo),
});

export const DomainsListResponseFlattened = ContiguityResponse.extend({
	domains: z.array(DomainInfo),
});

export const DomainsListResponseRaw = ContiguityRawResponse.extend({
	data: DomainsListResponse,
});

export type DomainsListResponse = z.infer<typeof DomainsListResponse>;
export type DomainInfo = z.infer<typeof DomainInfo>;

/**
 * Lists all domains owned by the user
 *
 * @example
 * ```typescript
 * const response = await contiguity.domains.list();
 * 
 * console.log(`You have ${response.domains.length} domains:`);
 * response.domains.forEach(domain => {
 *   console.log(`- ${domain.domain}: ${domain.status} (Region: ${domain.region})`);
 * });
 * ```
 */
export async function _domainsList(this: any): Promise<any> {
	const response = await this.request("/domains/", {
		method: "GET",
	});

	return this.parse({
		response,
		schemas: {
			sdk: DomainsListResponse,
			raw: DomainsListResponseRaw
		}
	});
}
