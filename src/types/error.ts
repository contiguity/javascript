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

export interface ContiguityErrorData {
    data: {
        status: number;
        error: string;
    };
}

export class ContiguityError extends Error {
    public readonly status: number;

    constructor(response: ContiguityErrorData) {
        super(response.data.error);
        this.message = response.data.error;
        this.status = response.data.status;
    }

    static fromError(error: any) {
        return new ContiguityError({
            data: {
                error: error.message || "Unknown error",
                status: error.status || 500,
            }
        });
    }

    override toString() {
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
    public readonly status: string;

    constructor(message: string, status: string = 'sdk_error') {
        super(message);
        this.message = message;
        this.status = status;
        this.name = '[Contiguity SDK Error]';
    }

    override toString() {
        return `[Contiguity SDK Error]: ${this.message} (status: ${this.status})`;
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
        };
    }
}

