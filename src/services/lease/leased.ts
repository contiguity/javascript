import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";
import { 
    NumberCapabilities, 
    NumberHealth, 
    NumberLocation, 
    NumberFormat, 
    NumberData, 
    NumberPricing 
} from "@/services/lease/available";

export const LeasedBillingPeriod = z.object({
	/** Lease start timestamp */
	start: z.number(),
	/** Lease end timestamp. Null if month-to-month with no set cancellation date */
	end: z.number().nullable()
});

export const LeasedBilling = z.object({
	/** Billing method */
	method: z.enum(["monthly", "service_contract", "goodwill"]),
	/** Lease billing period */
	period: LeasedBillingPeriod
});

export const LeasedNumber = z.object({
	/** Phone number in E.164 format */
	id: z.string(),
	/** Number status (leased) */
	status: z.enum(["available", "g-available", "leased", "unavailable"]),
	/** Number formats */
	number: NumberFormat,
	/** Geographic location */
	location: NumberLocation,
	/** Carrier name */
	carrier: z.enum(["T-Mobile", "AT&T", "Verizon", "Twilio", "Contiguity", "International Partner"]),
	/** Number capabilities */
	capabilities: NumberCapabilities,
	/** Number health metrics */
	health: NumberHealth,
	/** Additional data */
	data: NumberData,
	/** Creation timestamp */
	created_at: z.number(),
	/** Pricing information */
	pricing: NumberPricing,
	/** Lease ID */
	lease_id: z.string(),
	/** Lease status */
	lease_status: z.enum(["active", "expired", "terminated"]),
	/** Lease billing information */
	billing: LeasedBilling
});

export const LeaseLeasedResponse = z.object({
	/** Number of leased numbers */
	leased: z.number(),
	/** User's leased numbers */
	numbers: z.array(LeasedNumber)
});

export const LeaseLeasedResponseRaw = ContiguityRawResponse.extend({
	data: LeaseLeasedResponse,
});

export type LeaseLeasedResponseType = z.infer<typeof LeaseLeasedResponse>;
export type LeasedNumberType = z.infer<typeof LeasedNumber>;

/**
 * Gets all phone numbers currently leased by the user
 *
 * @example
 * ```typescript
 * const response = await contiguity.lease.leased();
 * console.log(`You have ${response.leased} leased numbers`);
 * 
 * // List all active leases
 * const activeLeases = response.numbers.filter(
 *   num => num.lease_status === 'active'
 * );
 * console.log(`Active leases: ${activeLeases.length}`);
 * ```
 *
 * @example
 * ```typescript
 * // Find leases by capabilities
 * const response = await contiguity.lease.leased();
 * 
 * const imessageNumbers = response.numbers.filter(
 *   num => num.capabilities.channels.includes('imessage')
 * );
 * 
 * const whatsappNumbers = response.numbers.filter(
 *   num => num.capabilities.channels.includes('whatsapp')
 * );
 * 
 * console.log(`iMessage numbers: ${imessageNumbers.length}`);
 * console.log(`WhatsApp numbers: ${whatsappNumbers.length}`);
 * ```
 *
 * @example
 * ```typescript
 * // Check lease expiration dates
 * const response = await contiguity.lease.leased();
 * 
 * response.numbers.forEach(num => {
 *   console.log(`${num.number.formatted}:`);
 *   console.log(`  Lease ID: ${num.lease_id}`);
 *   console.log(`  Status: ${num.lease_status}`);
 *   
 *   if (num.billing.period.end) {
 *     const endDate = new Date(num.billing.period.end * 1000);
 *     console.log(`  Expires: ${endDate.toLocaleDateString()}`);
 *   } else {
 *     console.log(`  Billing: Month-to-month`);
 *   }
 * });
 * ```
 */
export async function _leasedNumbers(this: any): Promise<any> {
	const response = await this.request("/numbers/leased", {
		method: "GET",
	});

	return this.parse({
		response,
		schemas: {
			sdk: LeaseLeasedResponse,
			raw: LeaseLeasedResponseRaw
		}
	});
}
