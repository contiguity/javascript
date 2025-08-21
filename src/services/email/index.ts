import { ContiguityClient } from "@/client/fetch.ts";
import { _emailSend } from "@/services/email/send.ts";
import { z } from "zod";
import { EmailSendRequest, EmailResponse } from "@/services/email/send.ts";

export type EmailSendParams = z.infer<typeof EmailSendRequest>;
export type EmailSendResponse = z.infer<typeof EmailResponse>;

/**
 * Email service for sending emails
 */
export class EmailService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Send an email
     */
    async send(params: EmailSendParams): Promise<EmailSendResponse & { metadata: { id: string; timestamp: number; api_version: string; object: string; } }> {
        return _emailSend.call(this, params);
    }
}
