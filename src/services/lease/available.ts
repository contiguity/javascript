import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";

export const NumberCapabilities = z.object({
	/** International SMS support (generally only T-Mobile numbers support this) */
	intl_sms: z.boolean(),
	/** Supported channels */
	channels: z.array(z.enum(["sms", "mms", "rcs", "imessage", "whatsapp"]))
});

export const NumberHealth = z.object({
	/** Reputation score 0.00-0.99. >0.80 is considered acceptable for all applications. <0.70 should be used for messages you care less about */
	reputation: z.number().min(0).max(1),
	/** Number of previous lessees */
	previous_owners: z.number()
});

export const NumberLocation = z.object({
	/** 2-letter country code */
	country: z.string(),
	/** Region/state */
	region: z.string(),
	/** City */
	city: z.string()
});

export const NumberFormat = z.object({
	/** E.164 format */
	e164: z.string(),
	/** Formatted phone number */
	formatted: z.string()
});

export const NumberData = z.object({
	/** Entitlements required to lease this number */
	requirements: z.array(z.enum(["imessage_entitlement_required", "whatsapp_entitlement_required", "enterprise_plan_required"])),
	/** E911 capability */
	e911_capable: z.boolean()
});

export const NumberPricing = z.object({
	/** Currency */
	currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
	/** One-time fee */
	upfront_fee: z.number(),
	/** Monthly rate */
	monthly_rate: z.number()
});

export const AvailableNumber = z.object({
	/** Phone number in E.164 format */
	id: z.string(),
	/** Number status */
	status: z.enum(["available", "g-available", "leased", "unavailable"]),
	/** Number formats */
	number: NumberFormat,
	/** Geographic location */
	location: NumberLocation,
	/** Carrier name */
	carrier: z.enum(["T-Mobile", "AT&T", "Verizon", "Contiguity", "International Partner"]),
	/** Number capabilities */
	capabilities: NumberCapabilities,
	/** Number health metrics */
	health: NumberHealth,
	/** Additional data */
	data: NumberData,
	/** Date & time of when the number was provisioned */
	created_at: z.number(),
	/** Pricing information */
	pricing: NumberPricing
});

export const LeaseAvailableResponse = z.object({
	/** Count of available numbers */
	available: z.number(),
	/** Available numbers */
	numbers: z.array(AvailableNumber)
});

export const LeaseAvailableResponseRaw = ContiguityRawResponse.extend({
	data: LeaseAvailableResponse,
});

export type LeaseAvailableResponseType = z.infer<typeof LeaseAvailableResponse>;
export type AvailableNumberType = z.infer<typeof AvailableNumber>;

/**
 * Gets all phone numbers available for lease
 *
 * @example
 * ```typescript
 * const response = await contiguity.lease.available();
 * console.log(`${response.available} numbers available`);
 * 
 * // Find numbers with iMessage support
 * const imessageNumbers = response.numbers.filter(
 *   num => num.capabilities.channels.includes('imessage')
 * );
 * console.log(`Found ${imessageNumbers.length} iMessage-capable numbers`);
 * ```
 *
 * @example
 * ```typescript
 * // Find high-reputation numbers in a specific city
 * const response = await contiguity.lease.available();
 * const miamiNumbers = response.numbers.filter(
 *   num => num.location.city === 'Miami' && num.health.reputation > 0.8
 * );
 * console.log(`Found ${miamiNumbers.length} high-reputation Miami numbers`);
 * ```
 */
export async function _leaseAvailable(this: any): Promise<any> {
	const response = await this.request("/numbers/leases", {
		method: "GET",
	});

	return this.parse({
		response,
		schemas: {
			sdk: LeaseAvailableResponse,
			raw: LeaseAvailableResponseRaw
		}
	});
}
