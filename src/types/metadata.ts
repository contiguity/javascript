
export interface ContiguityMetadata {
    id: string;
    timestamp: number;
    api_version: string;
    object: string;
}

export type WithMetadata<T> = T & {
    metadata: ContiguityMetadata;
};
