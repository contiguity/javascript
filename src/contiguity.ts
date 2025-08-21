import { TextService } from "@/services/text/index.ts";
import { EmailService } from "@/services/email/index.ts";
import { iMessageService } from "@/services/imessage/index.ts";
import { WhatsAppService } from "@/services/whatsapp/index.ts";
import { LeaseService } from "@/services/lease/index.ts";
import { OTPService } from "@/services/otp/index.ts";
import { DomainsService } from "@/services/domains/index.ts";
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
 * 
 * // Send an iMessage
 * const imessageResponse = await contiguity.imessage.send({
 *   to: "+1234567890",
 *   message: "Hello via iMessage!"
 * });
 * 
 * // Send a WhatsApp message
 * const whatsappResponse = await contiguity.whatsapp.send({
 *   to: "+1234567890",
 *   message: "Hello via WhatsApp!"
 * });
 * 
 * // Lease a phone number
 * const availableNumbers = await contiguity.lease.available();
 * const leaseResponse = await contiguity.lease.create({
 *   number: availableNumbers.numbers[0].id
 * });
 * 
 * // Send and verify OTP
 * const otpResponse = await contiguity.otp.new({
 *   to: "+1234567890",
 *   language: "en",
 *   name: "MyApp"
 * });
 * const verification = await contiguity.otp.verify({
 *   otp_id: otpResponse.otp_id,
 *   otp: "123456"
 * });
 * 
 * // Manage email domains
 * const domainsList = await contiguity.domains.list();
 * const registerResponse = await contiguity.domains.register({
 *   domain: "example.com",
 *   region: "us-east-1"
 * });
 * ```
 */
export class Contiguity {
    private readonly token: string;
    public readonly text: TextService;
    public readonly email: EmailService;
    public readonly imessage: iMessageService;
    public readonly whatsapp: WhatsAppService;
    public readonly lease: LeaseService;
    public readonly otp: OTPService;
    public readonly domains: DomainsService;

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
        // add new services here
        this.text = new TextService(this.token);
        this.email = new EmailService(this.token);
        this.imessage = new iMessageService(this.token);
        this.whatsapp = new WhatsAppService(this.token);
        this.lease = new LeaseService(this.token);
        this.otp = new OTPService(this.token);
        this.domains = new DomainsService(this.token);

    }

    /**
     * Validate that the client is properly configured
     * @returns True if the client is ready to use
     */
    ready(): boolean {
        const products = [this.text, this.email, this.imessage, this.whatsapp, this.lease, this.otp, this.domains];
        return products.every(product => product !== undefined);
    }
}
