import { z } from "zod";
import { ContiguityResponse } from "@/types/response";

/**
 * Base response builder that automatically creates typed responses with metadata
 * This creates flattened responses where the data is combined with metadata
 */
export class BaseResponseBuilder<T extends z.ZodObject<any>> {
    constructor(public readonly schema: T) {}

    get response() {
        return this.schema;
    }

    get flattened() {
        return ContiguityResponse.extend(this.schema.shape);
    }
}

export function createResponse<T extends z.ZodObject<any>>(schema: T) {
    return new BaseResponseBuilder(schema);
}

export type BaseResponse<T extends BaseResponseBuilder<any>> = z.infer<T['response']>;
export type FlattenedResponse<T extends BaseResponseBuilder<any>> = z.infer<T['flattened']>;
