import { z } from "zod";
import { createResponse } from "@/types/base";

export const LeaseCreateRequest = z.object({
	/** Phone number in E.164 format to lease */
	number: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
	/** Billing method (service_contract only works if active) */
	billing_method: z.enum(["monthly", "service_contract"]).default("monthly").optional(),
});

export const LeaseBillingPrice = z.object({
	/** Currency */
	currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
	/** Monthly rate */
	monthly_rate: z.number(),
	/** One-time fee */
	upfront_fee: z.number()
});

export const LeaseBillingPeriod = z.object({
	/** Lease start timestamp */
	start: z.number(),
	/** Always null for month-to-month leases */
	end: z.null()
});

export const LeaseBilling = z.object({
	/** Billing method */
	method: z.enum(["monthly", "service_contract", "goodwill"]),
	/** Pricing information */
	price: LeaseBillingPrice,
	/** Billing period */
	period: LeaseBillingPeriod
});

export const LeaseCreateResponse = z.object({
	/** Lease ID */
	lease_id: z.string(),
	/** Phone number ID */
	number: z.string(),
	/** Lease status */
	status: z.enum(["active", "expired", "terminated"]),
	/** Lease billing information */
	billing: LeaseBilling
});

// Using the new base response builder
export const LeaseCreateResponseBuilder = createResponse(LeaseCreateResponse);

export type LeaseCreateParams = z.infer<typeof LeaseCreateRequest>;
export type LeaseCreateResponseType = z.infer<typeof LeaseCreateResponse>;
export type LeaseBillingType = z.infer<typeof LeaseBilling>;

/**
 * Leases a specific phone number
 *
 * @example
 * ```typescript
 * const response = await contiguity.lease.create({
 *   number: "+1234567890"
 * });
 * 
 * console.log(`Lease ID: ${response.lease_id}`);
 * console.log(`Number: ${response.number}`);
 * console.log(`Status: ${response.status}`);
 * console.log(`Monthly rate: $${response.billing.price.monthly_rate}`);
 * ```
 *
 * @example
 * ```typescript
 * // Lease with specific billing method
 * const response = await contiguity.lease.create({
 *   number: "+1234567890",
 *   billing_method: "service_contract"
 * });
 * 
 * console.log(`Lease created with ${response.billing.method} billing`);
 * console.log(`Lease starts: ${new Date(response.billing.period.start * 1000)}`);
 * ```
 */
export async function _leaseCreate(this: any, params: LeaseCreateParams): Promise<any> {
	const validatedParams = LeaseCreateRequest.parse(params);
	const { number, ...body } = validatedParams;
	
	const response = await this.request(`/numbers/lease/${encodeURIComponent(number)}`, {
		method: "POST",
		body: JSON.stringify(body),
	});

	return this.parse({
		response,
		schemas: {
			sdk: LeaseCreateResponse,
			raw: LeaseCreateResponseBuilder.raw
		}
	});
}
