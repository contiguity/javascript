export class ContiguityError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
        public readonly code?: string
    ) {
        super(message);
        this.name = "ContiguityError";
        Object.setPrototypeOf(this, ContiguityError.prototype);
    }
}
