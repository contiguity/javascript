import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";
import { DNSRecords } from "./get.ts";

export const DomainsRegisterRequest = z.object({
	/** Domain name to register */
	domain: z.string().min(1, "Domain cannot be empty"),
	/** AWS region */
	region: z.string().default("us-east-1").optional(),
	/** Custom return path subdomain */
	custom_return_path: z.string().default("contiguity").optional(),
});

export const DomainsRegisterResponse = z.object({
	/** DNS records grouped by type */
	records: z.array(DNSRecords),
	/** Domain verification status */
	status: z.string(),
	/** AWS region (us-east-1 is the default and only currently supported region) */
	region: z.string(),
	/** Domain creation timestamp */
	created_at: z.number(),
});

export const DomainsRegisterResponseFlattened = ContiguityResponse.extend({
	records: z.array(DNSRecords),
	status: z.string(),
	region: z.string(),
	created_at: z.number(),
});

export const DomainsRegisterResponseRaw = ContiguityRawResponse.extend({
	data: DomainsRegisterResponse,
});

export type DomainsRegisterParams = z.infer<typeof DomainsRegisterRequest>;
export type DomainsRegisterResponse = z.infer<typeof DomainsRegisterResponse>;

/**
 * Registers a domain for email sending
 *
 * @example
 * ```typescript
 * const response = await contiguity.domains.register({
 *   domain: "example.com"
 * });
 * 
 * console.log(`Domain registered with status: ${response.status}`);
 * console.log(`Region: ${response.region}`);
 * 
 * // Display DNS records to configure
 * response.records.forEach(recordGroup => {
 *   if (recordGroup.TXT) {
 *     console.log("TXT Records to add:");
 *     recordGroup.TXT.forEach(record => {
 *       console.log(`  ${record.name}: ${record.value} (${record.purpose})`);
 *     });
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Register domain with custom settings
 * const response = await contiguity.domains.register({
 *   domain: "example.com",
 *   region: "us-east-1",
 *   custom_return_path: "mail"
 * });
 * 
 * console.log(`Created at: ${new Date(response.created_at).toISOString()}`);
 * ```
 */
export async function _domainsRegister(this: any, params: DomainsRegisterParams): Promise<any> {
	const validatedParams = DomainsRegisterRequest.parse(params);
	const { domain, ...bodyParams } = validatedParams;
	
	const response = await this.request(`/domains/${encodeURIComponent(domain)}`, {
		method: "POST",
		body: JSON.stringify(bodyParams),
	});

	return this.parse({
		response,
		schemas: {
			sdk: DomainsRegisterResponse,
			raw: DomainsRegisterResponseRaw
		}
	});
}
