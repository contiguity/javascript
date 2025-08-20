import { z } from "zod";

export const ContiguityAPIError = z.object({
    id: z.string(),
    timestamp: z.number(),
    api_version: z.string(),
    object: z.string(),
    data: z.object({
        status: z.number(),
        error: z.string(),
    }),
});

export class ContiguityError extends Error {
    constructor(response) {
        super(response.data.error);
        this.message = response.data.error;
        this.status = response.data.status;
    }

    static fromError(error) {
        return new ContiguityError({
            message: error.message || "Unknown error",
            status: error.status || "unknown_error",
        });
    }

    toString() {
        return `[Contiguity Error]: ${this.message} (status: ${this.status})`;
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
        };
    }
}

export class ContiguitySDKError extends Error {
    constructor(message, status = 'sdk_error') {
        super(message);
        this.message = message;
        this.status = status;
        this.name = '[Contiguity SDK Error]';
        
        // Hide the ContiguitySDKError constructor from stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ContiguitySDKError);
        }
    }

    toString() {
        return `[Contiguity SDK Error]: ${this.message} (status: ${this.status})`;
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
        };
    }
}

