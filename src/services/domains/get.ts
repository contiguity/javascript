import { z } from "zod";
import { createResponse } from "@/types/base";

// DNS Record schemas based on OpenAPI spec
export const DNSRecord = z.object({
	/** Record name */
	name: z.string(),
	/** Record value */
	value: z.string(),
	/** Record purpose */
	purpose: z.string(),
});

export const DNSRecords = z.object({
	/** MX records */
	MX: z.array(DNSRecord).optional(),
	/** TXT records */
	TXT: z.array(DNSRecord).optional(),
	/** CNAME records */
	CNAME: z.array(DNSRecord).optional(),
});

export const DomainVerifications = z.object({
	/** DKIM configuration status */
	dkim: z.string(),
	/** Mail-from domain verification status */
	mail_from: z.string(),
	/** Domain verification status */
	domain: z.string(),
});

export const DomainsGetRequest = z.object({
	/** Domain name to get information about */
	domain: z.string().min(1, "Domain cannot be empty"),
});

export const DomainsGetResponse = z.object({
	/** The domain name */
	domain: z.string(),
	/** Domain verification status */
	status: z.string(),
	/** Domain ID */
	id: z.string(),
	/** Domain creation timestamp */
	created_at: z.number(),
	/** DNS records grouped by type */
	records: z.array(DNSRecords),
	/** AWS region */
	region: z.string(),
	/** Whether sending is allowed using this domain */
	sending_allowed: z.boolean(),
	/** Verification status details */
	verifications: DomainVerifications,
});

// Using the new base response builder - this replaces the manual Flattened/Raw definitions
export const DomainsGetResponseBuilder = createResponse(DomainsGetResponse);

export type DomainsGetParams = z.infer<typeof DomainsGetRequest>;
export type DomainsGetResponse = z.infer<typeof DomainsGetResponse>;
export type DNSRecord = z.infer<typeof DNSRecord>;
export type DomainVerifications = z.infer<typeof DomainVerifications>;

/**
 * Gets domain verification status and DNS instructions
 *
 * @example
 * ```typescript
 * const response = await contiguity.domains.get({
 *   domain: "example.com"
 * });
 * 
 * console.log(`Domain: ${response.domain}`);
 * console.log(`Status: ${response.status}`);
 * console.log(`Sending allowed: ${response.sending_allowed}`);
 * console.log(`DKIM status: ${response.verifications.dkim}`);
 * ```
 *
 * @example
 * ```typescript
 * // Check DNS records
 * const response = await contiguity.domains.get({
 *   domain: "example.com"
 * });
 * 
 * response.records.forEach(recordGroup => {
 *   if (recordGroup.TXT) {
 *     recordGroup.TXT.forEach(record => {
 *       console.log(`TXT Record: ${record.name} -> ${record.value} (${record.purpose})`);
 *     });
 *   }
 * });
 * ```
 */
export async function _domainsGet(this: any, params: DomainsGetParams): Promise<any> {
	const validatedParams = DomainsGetRequest.parse(params);
	const response = await this.request(`/domains/${encodeURIComponent(validatedParams.domain)}`, {
		method: "GET",
	});

	return this.parse({
		response,
		schemas: {
			sdk: DomainsGetResponse,
			raw: DomainsGetResponseBuilder.raw
		}
	});
}
