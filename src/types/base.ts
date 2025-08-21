import { z } from "zod";
import { ContiguityResponse, ContiguityRawResponse } from "@/types/response";

/**
 * Base response builder that automatically creates flattened and raw response types
 * This eliminates the need to manually define *ResponseFlattened and *ResponseRaw for each service
 */
export class BaseResponseBuilder<T extends z.ZodObject<any>> {
    constructor(public readonly schema: T) {}

    get response() {
        return this.schema;
    }

    get flattened() {
        return ContiguityResponse.extend(this.schema.shape);
    }

    get raw() {
        return ContiguityRawResponse.extend({
            data: this.schema,
        });
    }

    get all() {
        return {
            response: this.response,
            flattened: this.flattened,
            raw: this.raw,
        };
    }
}

export function createResponse<T extends z.ZodObject<any>>(schema: T) {
    return new BaseResponseBuilder(schema);
}

export type BaseResponse<T extends BaseResponseBuilder<any>> = z.infer<T['response']>;
export type FlattenedResponse<T extends BaseResponseBuilder<any>> = z.infer<T['flattened']>;
export type RawResponse<T extends BaseResponseBuilder<any>> = z.infer<T['raw']>;
