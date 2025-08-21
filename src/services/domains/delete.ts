import { z } from "zod";
import { createResponse } from "@/types/base";

export const DomainsDeleteRequest = z.object({
	/** Domain name to delete */
	domain: z.string().min(1, "Domain cannot be empty"),
});

export const DomainsDeleteResponse = z.object({
	/** Whether the deletion was successful */
	success: z.boolean(),
	/** Success message */
	message: z.string(),
});

// Using the new base response builder
export const DomainsDeleteResponseBuilder = createResponse(DomainsDeleteResponse);

export type DomainsDeleteParams = z.infer<typeof DomainsDeleteRequest>;
export type DomainsDeleteResponse = z.infer<typeof DomainsDeleteResponse>;

/**
 * Deletes a domain from your account
 *
 * @example
 * ```typescript
 * const response = await contiguity.domains.delete({
 *   domain: "example.com"
 * });
 * 
 * if (response.success) {
 *   console.log(`Domain deleted successfully: ${response.message}`);
 * } else {
 *   console.log(`Failed to delete domain: ${response.message}`);
 * }
 * ```
 */
export async function _domainsDelete(this: any, params: DomainsDeleteParams): Promise<any> {
	const validatedParams = DomainsDeleteRequest.parse(params);
	const response = await this.request(`/domains/${encodeURIComponent(validatedParams.domain)}`, {
		method: "DELETE",
	});

	return this.parse({
		response,
		schemas: {
			sdk: DomainsDeleteResponse,
			raw: DomainsDeleteResponseBuilder.raw
		}
	});
}
