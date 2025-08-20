import { SendService } from "@/services/index.js";
import { ContiguitySDKError } from "@/types/error.js";

/**
 * Main Contiguity API client class
 * 
 * @example
 * ```javascript
 * import { Contiguity } from '@contiguity/javascript';
 * 
 * const contiguity = new Contiguity('your-api-token');
 * 
 * // Send a text message
 * const response = await contiguity.send.text({
 *   to: "+1234567890",
 *   message: "Hello from Contiguity!"
 * });
 * ```
 */
export class Contiguity {
    /**
     * Create a new Contiguity client instance
     * 
     * @param {string} token - Your Contiguity API token
     * @throws {ContiguitySDKError} When token is not provided or invalid
     */
    constructor(token) {
        if (!token || typeof token !== 'string') {
            throw new ContiguitySDKError(
                'Contiguity API token is required and must be a string',
                'invalid_token'
            );
        }
        
        if (token.trim().length === 0) {
            throw ContiguitySDKError(
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
        
        /**
         * @private
         * @type {string}
         */
        this.token = token.trim();

        /**
         * Send service for various message types
         * @type {SendService}
         */
        this.send = new SendService(this.token);
    }

    /**
     * Validate that the client is properly configured
     * @returns {boolean} True if the client is ready to use
     */
    ready() {
        return !!(this.token && this.send);
    }
}
