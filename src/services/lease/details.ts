import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
import { LeasedNumber } from "@/services/lease/leased";

export const LeaseDetailsRequest = z.object({
	/** Phone number in E.164 format to get lease details for */
	number: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
});

export const LeaseDetailsResponse = LeasedNumber;

export const LeaseDetailsResponseRaw = ContiguityRawResponse.extend({
	data: LeaseDetailsResponse,
});

export type LeaseDetailsParams = z.infer<typeof LeaseDetailsRequest>;
export type LeaseDetailsResponseType = z.infer<typeof LeaseDetailsResponse>;

/**
 * Gets information about a specific leased number
 *
 * @example
 * ```typescript
 * const response = await contiguity.lease.details({
 *   number: "+1234567890"
 * });
 * 
 * console.log(`Number: ${response.number.formatted}`);
 * console.log(`Lease ID: ${response.lease_id}`);
 * console.log(`Status: ${response.lease_status}`);
 * console.log(`Billing method: ${response.billing.method}`);
 * ```
 *
 * @example
 * ```typescript
 * // Check lease billing details
 * const response = await contiguity.lease.details({
 *   number: "+1234567890"
 * });
 * 
 * const startDate = new Date(response.billing.period.start * 1000);
 * console.log(`Lease started: ${startDate.toLocaleDateString()}`);
 * 
 * if (response.billing.period.end) {
 *   const endDate = new Date(response.billing.period.end * 1000);
 *   console.log(`Lease ends: ${endDate.toLocaleDateString()}`);
 * } else {
 *   console.log(`Month-to-month billing`);
 * }
 * 
 * console.log(`Monthly rate: $${response.pricing.monthly_rate}`);
 * ```
 *
 * @example
 * ```typescript
 * // Check number capabilities and health
 * const response = await contiguity.lease.details({
 *   number: "+1234567890"
 * });
 * 
 * console.log(`Supported channels: ${response.capabilities.channels.join(', ')}`);
 * console.log(`Reputation score: ${response.health.reputation}`);
 * console.log(`Previous owners: ${response.health.previous_owners}`);
 * console.log(`International SMS: ${response.capabilities.intl_sms ? 'Yes' : 'No'}`);
 * ```
 */
export async function _leaseDetails(this: any, params: LeaseDetailsParams): Promise<any> {
	const validatedParams = LeaseDetailsRequest.parse(params);
	const response = await this.request(`/numbers/leased/${encodeURIComponent(validatedParams.number)}`, {
		method: "GET",
	});

	return this.parse({
		response,
		schemas: {
			sdk: LeaseDetailsResponse,
			raw: LeaseDetailsResponseRaw
		}
	});
}
