import { TextService } from "@/services/text/index.ts";
import { EmailService } from "@/services/email/index.ts";
import { ContiguitySDKError } from "@/types/error.ts";

/**
 * Main Contiguity API client class
 * 
 * @example
 * ```typescript
 * import { Contiguity } from '@contiguity/javascript';
 * 
 * const contiguity = new Contiguity('your-api-token');
 * 
 * // Send a text message
 * const response = await contiguity.text.send({
 *   to: "+1234567890",
 *   message: "Hello from Contiguity!"
 * });
 * ```
 */
export class Contiguity {
    private readonly token: string;
    public readonly text: TextService;
    public readonly email: EmailService;

    /**
     * Create a new Contiguity client instance
     * 
     * @throws {ContiguitySDKError} When token is not provided or invalid
     */
    constructor(token: string) {
        if (!token || typeof token !== 'string') {
            throw new ContiguitySDKError(
                'Contiguity API token is required and must be a string',
                'invalid_token'
            );
        }

        if (token.trim().length === 0) {
            throw new ContiguitySDKError(
                'Contiguity API token cannot be empty',
                'empty_token'
            );
        }

        if (!token.startsWith('contiguity_sk_')) {
            throw new ContiguitySDKError(
                'Contiguity tokens begin with "contiguity_sk_" – are you sure you entered the correct token?',
                'invalid_token'
            );
        }

        if (token.toUpperCase() === token && !token.startsWith('contiguity_sk_')) {
            throw new ContiguitySDKError(
                'Unfortunately, you cannot use API v1 keys with API v2. Please generate a new token at https://console.contiguity.com/dashboard/tokens',
                'old_token'
            );
        }

        this.token = token.trim();
        this.text = new TextService(this.token);
        this.email = new EmailService(this.token);
    }

    /**
     * Validate that the client is properly configured
     * @returns True if the client is ready to use
     */
    ready(): boolean {
        return !!(this.token && this.text && this.email);
    }
}
