import { ContiguityClient } from "@/client/fetch.ts";
import { _emailSend } from "@/services/email/send.ts";
import { z } from "zod";
import { EmailSendRequest, EmailResponse } from "@/services/email/send.ts";
import type { WithMetadata } from "@/types/metadata.ts";

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
    async send(params: EmailSendParams): Promise<WithMetadata<EmailSendResponse>> {
        return _emailSend.call(this, params);
    }
}
