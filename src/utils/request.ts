import { z } from "zod";

/**
 * Standard request function factory - reduces duplication across services
 */
export function createRequestFunction<TRequest extends z.ZodTypeAny, TResponse extends z.ZodTypeAny, TRawResponse extends z.ZodTypeAny>(
    requestSchema: TRequest,
    responseSchema: TResponse,
    rawResponseSchema: TRawResponse,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
    return async function(this: any, params?: z.infer<TRequest>): Promise<any> {
        let validatedParams;
        let url = endpoint;
        let body: string | undefined;
        
        if (params !== undefined) {
            validatedParams = requestSchema.parse(params);
            
            // Handle path parameters (for endpoints with {param})
            if (endpoint.includes('{') && endpoint.includes('}')) {
                // Extract path parameter name (e.g., "{number}" -> "number")
                const pathParamMatch = endpoint.match(/\{(\w+)\}/);
                if (pathParamMatch && pathParamMatch[1] && validatedParams && typeof validatedParams === 'object') {
                    const pathParam = pathParamMatch[1];
                    const pathValue = (validatedParams as any)[pathParam];
                    if (pathValue) {
                        url = endpoint.replace(`{${pathParam}}`, encodeURIComponent(pathValue));
                        // Remove path param from body
                        const bodyParams = { ...validatedParams };
                        delete (bodyParams as any)[pathParam];
                        
                        // Only set body if there are remaining params and not GET/DELETE
                        if (Object.keys(bodyParams).length > 0 && method !== 'GET' && method !== 'DELETE') {
                            body = JSON.stringify(bodyParams);
                        }
                    }
                }
            } else if (method !== 'GET' && method !== 'DELETE') {
                // For non-path-param endpoints, use all params as body
                body = JSON.stringify(validatedParams);
            }
        }

        const response = await this.request(url, {
            method,
            ...(body && { body })
        });

        return this.parse({
            response,
            schemas: {
                sdk: responseSchema,
                raw: rawResponseSchema
            }
        });
    };
}
