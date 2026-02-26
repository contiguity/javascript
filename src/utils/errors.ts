export interface ContiguityErrorData {
    agreement_url?: string;
}

export class ContiguityError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
        public readonly code?: string,
        public readonly data?: ContiguityErrorData
    ) {
        super(message);
        this.name = "ContiguityError";
        Object.setPrototypeOf(this, ContiguityError.prototype);
    }
}
