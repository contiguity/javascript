import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response.ts";

export const LeaseTerminateRequest = z.object({
	/** Phone number in E.164 format to terminate lease for */
	number: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format"),
});

export const LeaseTerminateResponse = z.object({
	/** Terminated lease ID */
	lease_id: z.string(),
	/** Number ID */
	number_id: z.string(),
	/** The lease's new status */
	status: z.enum(["active", "expired", "terminated"]),
	/** Termination timestamp */
	terminated_at: z.number()
});

export const LeaseTerminateResponseRaw = ContiguityRawResponse.extend({
	data: LeaseTerminateResponse,
});

export type LeaseTerminateParams = z.infer<typeof LeaseTerminateRequest>;
export type LeaseTerminateResponseType = z.infer<typeof LeaseTerminateResponse>;

/**
 * Terminates your lease for a number
 *
 * @example
 * ```typescript
 * const response = await contiguity.lease.terminate({
 *   number: "+1234567890"
 * });
 * 
 * console.log(`Lease ${response.lease_id} terminated`);
 * console.log(`Number: ${response.number_id}`);
 * console.log(`Status: ${response.status}`);
 * console.log(`Terminated at: ${new Date(response.terminated_at * 1000)}`);
 * ```
 *
 * @example
 * ```typescript
 * // Terminate lease with confirmation
 * try {
 *   const response = await contiguity.lease.terminate({
 *     number: "+1234567890"
 *   });
 *   
 *   if (response.status === 'terminated') {
 *     console.log('✓ Lease successfully terminated');
 *     console.log(`Termination date: ${new Date(response.terminated_at * 1000).toLocaleDateString()}`);
 *   }
 * } catch (error) {
 *   console.error('Failed to terminate lease:', error.message);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Bulk terminate multiple leases
 * const numbersToTerminate = ["+1234567890", "+0987654321"];
 * 
 * const results = await Promise.allSettled(
 *   numbersToTerminate.map(number => 
 *     contiguity.lease.terminate({ number })
 *   )
 * );
 * 
 * results.forEach((result, index) => {
 *   const number = numbersToTerminate[index];
 *   if (result.status === 'fulfilled') {
 *     console.log(`✓ ${number}: Lease terminated`);
 *   } else {
 *     console.log(`✗ ${number}: Failed to terminate - ${result.reason.message}`);
 *   }
 * });
 * ```
 */
export async function _leaseTerminate(this: any, params: LeaseTerminateParams): Promise<any> {
	const validatedParams = LeaseTerminateRequest.parse(params);
	const response = await this.request(`/numbers/leased/${encodeURIComponent(validatedParams.number)}`, {
		method: "DELETE",
	});

	return this.parse({
		response,
		schemas: {
			sdk: LeaseTerminateResponse,
			raw: LeaseTerminateResponseRaw
		}
	});
}
