import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
import { E164PhoneNumber, NumberStatus, Carrier } from "@/types/common";
import { 
    NumberCapabilities, 
    NumberHealth, 
    NumberLocation, 
    NumberFormat, 
    NumberData, 
    NumberPricing 
} from "@/services/lease/available";

export const LeaseGetRequest = z.object({
	/** Phone number in E.164 format to get information about */
	number: E164PhoneNumber,
});

export const LeaseGetResponse = z.object({
	/** Phone number in E.164 format */
	id: z.string(),
	/** Number status */
	status: NumberStatus,
	/** Number formats */
	number: NumberFormat,
	/** Geographic location */
	location: NumberLocation,
	/** Carrier name */
	carrier: Carrier,
	/** Number capabilities */
	capabilities: NumberCapabilities,
	/** Number health metrics */
	health: NumberHealth,
	/** Additional data */
	data: NumberData,
	/** Creation timestamp */
	created_at: z.number(),
	/** Pricing information */
	pricing: NumberPricing
});

export const LeaseGetResponseRaw = ContiguityRawResponse.extend({
	data: LeaseGetResponse,
});

export type LeaseGetParams = z.infer<typeof LeaseGetRequest>;
export type LeaseGetResponseType = z.infer<typeof LeaseGetResponse>;

/**
 * Gets information about a specific number available for lease
 *
 * @example
 * ```typescript
 * const response = await contiguity.lease.get({
 *   number: "+1234567890"
 * });
 * 
 * console.log(`Number: ${response.number.formatted}`);
 * console.log(`Location: ${response.location.city}, ${response.location.region}`);
 * console.log(`Reputation: ${response.health.reputation}`);
 * console.log(`Monthly rate: $${response.pricing.monthly_rate}`);
 * ```
 *
 * @example
 * ```typescript
 * // Check if a number supports specific channels
 * const response = await contiguity.lease.get({
 *   number: "+1234567890"
 * });
 * 
 * const supportsImessage = response.capabilities.channels.includes('imessage');
 * const supportsWhatsApp = response.capabilities.channels.includes('whatsapp');
 * 
 * console.log(`iMessage support: ${supportsImessage}`);
 * console.log(`WhatsApp support: ${supportsWhatsApp}`);
 * ```
 */
export async function _leaseGet(this: any, params: LeaseGetParams): Promise<any> {
	const validatedParams = LeaseGetRequest.parse(params);
	const response = await this.request(`/numbers/lease/${encodeURIComponent(validatedParams.number)}`, {
		method: "GET",
	});

	return this.parse({
		response,
		schemas: {
			sdk: LeaseGetResponse,
			raw: LeaseGetResponseRaw
		}
	});
}
