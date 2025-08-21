import { ContiguityClient } from "@/client/fetch.ts";
import { _whatsAppSend } from "@/services/whatsapp/send.ts";
import { _whatsAppTyping } from "@/services/whatsapp/typing.ts";
import { z } from "zod";
import { 
    WhatsAppSendRequest, 
    WhatsAppResponse
} from "@/services/whatsapp/send.ts";
import { WhatsAppTypingRequest, WhatsAppTypingResponse } from "@/services/whatsapp/typing.ts";
import type { WithMetadata } from "@/types/metadata.ts";

export type WhatsAppSendParams = z.infer<typeof WhatsAppSendRequest>;
export type WhatsAppSendResponse = z.infer<typeof WhatsAppResponse>;
export type WhatsAppTypingParams = z.infer<typeof WhatsAppTypingRequest>;
export type WhatsAppTypingResponseType = z.infer<typeof WhatsAppTypingResponse>;

/**
 * WhatsApp service for sending WhatsApp messages and managing typing indicators
 */
export class WhatsAppService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Send a WhatsApp message
     */
    async send(params: WhatsAppSendParams): Promise<WithMetadata<WhatsAppSendResponse>> {
        return _whatsAppSend.call(this, params);
    }

    /**
     * Start or stop sending typing indicators over WhatsApp
     */
    async typing(params: WhatsAppTypingParams): Promise<WithMetadata<WhatsAppTypingResponseType>> {
        return _whatsAppTyping.call(this, params);
    }
}
